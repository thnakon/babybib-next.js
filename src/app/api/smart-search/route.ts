import { NextResponse } from 'next/server';

// helper to clean and extract DOI from URL
function extractDOI(input: string) {
  const doiRegex = /10.\d{4,9}\/[-._;()/:A-Z0-9]+/i;
  const match = input.match(doiRegex);
  return match ? match[0] : null;
}

// helper to clean and extract ISBN
function extractISBN(input: string) {
  const isbnRegex = /(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[0-9- ]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[0-9- ]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]/i;
  const match = input.match(isbnRegex);
  return match ? match[0].replace(/[- ]/g, '') : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const results: any[] = [];
  const doi = extractDOI(query);
  const isbn = extractISBN(query);

  try {
    // 1. Crossref API (Prioritize DOI)
    if (doi) {
      const crossrefRes = await fetch(`https://api.crossref.org/works/${doi}`, {
        headers: { 'User-Agent': 'BabyBib/1.0 (mailto:support@babybib.com)' }
      });
      if (crossrefRes.ok) {
        const data = await crossrefRes.json();
        const item = data.message;
        results.push({
          id: `crossref-${item.DOI}`,
          title: item.title?.[0] || 'Unknown Title',
          authors: item.author?.map((a: any) => ({
            firstName: a.given || '',
            lastName: a.family || '',
            condition: 'general'
          })) || [],
          year: item.issued?.['date-parts']?.[0]?.[0] || '',
          source: item['container-title']?.[0] || item.publisher || '',
          url: item.URL || `https://doi.org/${item.DOI}`,
          type: item.type?.includes('article') ? 'article' : 'book',
          sourceApi: 'Crossref (DOI)'
        });
      }
    }

    // 4. URL Metadata Extraction (If it's a URL and not already found via DOI)
    if (query.startsWith('http') && !doi) {
      try {
        const urlRes = await fetch(query, { 
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'th,en-US;q=0.9,en;q=0.8'
          } 
        });
        if (urlRes.ok) {
          const html = await urlRes.text();
          
          // Enhanced Title Extraction
          const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["']/i)?.[1] ||
                         html.match(/<meta[^>]*name=["']og:title["'][^>]*content=["'](.*?)["']/i)?.[1] ||
                         html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1];
          
          // Enhanced Author Extraction
          const author = html.match(/<meta[^>]*name=["']author["'][^>]*content=["'](.*?)["']/i)?.[1] ||
                        html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["'](.*?)["']/i)?.[1] ||
                        html.match(/<meta[^>]*name=["']twitter:creator["'][^>]*content=["'](.*?)["']/i)?.[1];
          
          // Enhanced Site Name Extraction
          const siteName = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["'](.*?)["']/i)?.[1] || 
                          new URL(query).hostname.replace('www.', '');

          if (ogTitle || html.length > 0) {
            results.unshift({
              id: `url-${Date.now()}`,
              title: ogTitle ? ogTitle.trim() : (new URL(query).pathname.length > 1 ? new URL(query).pathname : query),
              authors: author ? [{ firstName: author.trim(), lastName: '', condition: 'general' }] : [],
              year: new Date().getFullYear().toString(),
              source: siteName,
              url: query,
              type: 'website',
              sourceApi: 'Web Metadata'
            });
          }
        }
      } catch (e) { console.error('URL Metadata Error', e); }
    }

    // 2. Google Books API (ISBN or Keyword - only if not a direct URL or if we want more results)
    if (!query.startsWith('http') || results.length === 0) {
      const googleQuery = isbn ? `isbn:${isbn}` : query;
      const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(googleQuery)}&maxResults=5`);
      if (googleRes.ok) {
        const data = await googleRes.json();
        if (data.items) {
          data.items.forEach((item: any) => {
            const info = item.volumeInfo;
            // Avoid duplicates
            if (!results.some(r => r.title.toLowerCase() === info.title.toLowerCase())) {
              results.push({
                id: `google-${item.id}`,
                title: info.title,
                authors: info.authors?.map((name: string) => {
                  const parts = name.split(' ');
                  return {
                    firstName: parts.slice(0, -1).join(' ') || parts[0],
                    lastName: parts.slice(-1).join(' '),
                    condition: 'general'
                  };
                }) || [],
                year: info.publishedDate?.split('-')[0] || '',
                source: info.publisher || 'Google Books',
                url: info.infoLink,
                type: 'book',
                sourceApi: info.language === 'th' ? 'Thai National Bib.' : 'Google Books'
              });
            }
          });
        }
      }
    }

    // 3. Open Library (Fallback for ISBN)
    if (isbn && results.length < 3) {
      try {
        const olRes = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        if (olRes.ok) {
          const data = await olRes.json();
          const bookKey = `ISBN:${isbn}`;
          if (data[bookKey]) {
            const info = data[bookKey];
            if (!results.some(r => r.title.toLowerCase() === info.title.toLowerCase())) {
              results.push({
                id: `ol-${isbn}`,
                title: info.title,
                authors: info.authors?.map((a: any) => {
                    const parts = a.name.split(' ');
                    return { firstName: parts.slice(0, -1).join(' ') || parts[0], lastName: parts.slice(-1).join(' '), condition: 'general' };
                }) || [],
                year: info.publish_date || '',
                source: info.publishers?.[0]?.name || 'Open Library',
                url: info.url,
                type: 'book',
                sourceApi: 'Open Library'
              });
            }
          }
        }
      } catch (e) { console.error('OL Error', e); }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Smart search error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
