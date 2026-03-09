"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { 
  BookOpen, Triangle, Pencil, Copy, ChevronDown, Check,
  ArrowLeft, ArrowRight, RotateCw, SlidersHorizontal, AlignLeft, Plus,
  FileText, Globe, Smartphone, Bot, ShoppingCart, LayoutDashboard, Briefcase, Library,
  Heart, ShieldCheck, Search, HelpCircle, Book, Download, FileJson, FileCode, FileSpreadsheet,
  List, LayoutList, Settings2, Info, Trash2, Quote, GripVertical, Sparkles, Archive, MoreVertical, 
  Type, ChevronRight, X, FilePlus, FileUp, Eye, Palette, Hash, Scale, Gavel, Mic2, Tv, Film, Music, Award, Mail, MessageSquare, Map as MapIcon, Languages, Newspaper, Video, ClipboardList, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from 'swr';
import { toast } from "sonner";
import { 
  exportToBibTeX, 
  exportToRIS, 
  exportToWord, 
  exportToPDF 
} from "@/lib/export-utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GeneratePage() {
  const { language } = useLanguage();
  const [style, setStyle] = React.useState("APA - 7th Edition");
  const [isStyleOpen, setIsStyleOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("Bibliography");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const [isProjectsExpanded, setIsProjectsExpanded] = React.useState(false);
  const [isAddTooltipVisible, setIsAddTooltipVisible] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newProject, setNewProject] = React.useState({
    name: "",
    description: "",
    color: "#407bc4",
    icon: "BookOpen"
  });
  const [isCreatingProject, setIsCreatingProject] = React.useState(false);
  const [activeProjectId, setActiveProjectId] = React.useState<number | null>(null);
  const [projectMenuIdx, setProjectMenuIdx] = React.useState<number | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [importRefFiles, setImportRefFiles] = React.useState({
    ris: null as string | null,
    bib: null as string | null,
    backup: null as string | null
  });
  const [importRefFilesData, setImportRefFilesData] = React.useState({
    ris: null as File | null,
    bib: null as File | null,
    backup: null as File | null
  });
  const [isAddCitationModalOpen, setIsAddCitationModalOpen] = React.useState(false);
  const [newCitationData, setNewCitationData] = React.useState<any>({
    authors: [{ firstName: "", middleName: "", lastName: "", prefix: "", condition: "general" }],
    year: "",
    title: "",
    source: "",
    url: ""
  });
  const [citationStep, setCitationStep] = React.useState(0); // 0 = selection, 1 = form, 2 = more
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [resourceSearch, setResourceSearch] = React.useState("");
  const [copiedBib, setCopiedBib] = React.useState(false);
  const [copiedInText, setCopiedInText] = React.useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = React.useState(false);
  const [isArchivedProjectsModalOpen, setIsArchivedProjectsModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<any>(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = React.useState(false);

  const [searchReferencesQuery, setSearchReferencesQuery] = React.useState("");
  
  const [settings, setSettings] = React.useState({
    hangingIndent: true,
    doubleSpaced: false,
    font: 'Times New Roman',
    textSize: '12pt',
    sortBy: 'Citation style' as string,
    showUrls: true,
    showAnnotations: false
  });
  const [highlightedId, setHighlightedId] = React.useState<number | null>(null);
  const [editingCitationId, setEditingCitationId] = React.useState<number | null>(null);

  // Smart Search State
  const [mainSearchQuery, setMainSearchQuery] = React.useState("");
  const [isMainSearchDropdownOpen, setIsMainSearchDropdownOpen] = React.useState(false);
  const [isMainSearching, setIsMainSearching] = React.useState(false);
  const [mainSearchResults, setMainSearchResults] = React.useState<any[]>([]);
  const paperRef = React.useRef<HTMLDivElement>(null);

  const mockSearchResults = [
    { id: '1', title: 'The Design of Everyday Things', authors: [{ firstName: 'Donald', middleName: 'A.', lastName: 'Norman' }], year: '2013', source: 'Basic Books', type: 'book' },
    { id: '2', title: 'Sapiens: A Brief History of Humankind', authors: [{ firstName: 'Yuval', middleName: 'Noah', lastName: 'Harari' }], year: '2015', source: 'Harper', type: 'book' },
    { id: '3', title: 'A Brief History of Time', authors: [{ firstName: 'Stephen', middleName: '', lastName: 'Hawking' }], year: '1988', source: 'Bantam Books', type: 'book' },
    { id: '4', title: 'The Elements of Typographic Style', authors: [{ firstName: 'Robert', middleName: '', lastName: 'Bringhurst' }], year: '1992', source: 'Hartley & Marks', type: 'book' },
    { id: '5', title: 'Historical Analysis of Design Patterns', authors: [{ firstName: 'Jane', middleName: '', lastName: 'Doe' }], year: '2020', source: 'Journal of Software Engineering', type: 'article' },
  ];

  const handleMainSearch = (query: string) => {
    setMainSearchQuery(query);
    if (query.trim().length > 2) {
      setIsMainSearching(true);
      setIsMainSearchDropdownOpen(true);
      // Simulate API call
      setTimeout(() => {
        const results = mockSearchResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.authors.some(a => a.lastName.toLowerCase().includes(query.toLowerCase()))
        );
        setMainSearchResults(results);
        setIsMainSearching(false);
      }, 600);
    } else {
      setMainSearchResults([]);
      setIsMainSearchDropdownOpen(false);
    }
  };

  const handleSelectSearchResult = async (item: any) => {
    if (!activeProjectId) {
      toast.error(language === 'TH' ? 'กรุณาเลือกหรือสร้างโปรเจกต์ก่อน' : 'Please select or create a project first');
      return;
    }
    
    try {
      const res = await fetch('/api/citations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: activeProjectId,
          type: item.type,
          authors: item.authors,
          year: item.year?.toString() || "",
          title: item.title,
          source: item.source,
          url: item.url || ""
        })
      });
      
      if (res.ok) {
        const newCitation = await res.json();
        mutateCitations();
        setHighlightedId(newCitation.id);
        setTimeout(() => setHighlightedId(null), 3000);
        toast.success(language === 'TH' ? 'เพิ่มรายการบรรณานุกรมสำเร็จ' : 'Citation added successfully');
      } else {
        throw new Error("Failed to save citation");
      }
    } catch (error) {
      console.error(error);
      toast.error(language === 'TH' ? 'เกิดข้อผิดพลาดในการบันทึก' : 'Error saving citation');
    }
    
    setIsMainSearchDropdownOpen(false);
    setMainSearchQuery("");
  };

  const parseRIS = (text: string) => {
    const entries: any[] = [];
    const chunks = text.split(/\n\s*\n|\r\n\s*\r\n/);
    
    chunks.forEach(chunk => {
      if (!chunk.includes('TY  -')) return;
      const entry: any = { authors: [], type: 'book' };
      const lines = chunk.split(/\r?\n/);
      
      lines.forEach(line => {
        const tag = line.substring(0, 2);
        const val = line.substring(6).trim();
        if (tag === 'TI') entry.title = val;
        else if (tag === 'PY') entry.year = val;
        else if (tag === 'PB') entry.source = val;
        else if (tag === 'UR') entry.url = val;
        else if (tag === 'AU') {
          const parts = val.split(', ');
          entry.authors.push({ 
            lastName: parts[0] || '', 
            firstName: parts[1] || '', 
            condition: 'general' 
          });
        }
      });
      if (entry.title) entries.push(entry);
    });
    return entries;
  };

  const parseBibTeX = (text: string) => {
    // Basic manual parser to avoid dependency issues if needed, or use the installed one
    // Let's use a robust manual one for common BibTeX format
    const entries: any[] = [];
    const regex = /@\w+\s*\{[^,]+,\s*([^@]+)\}/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const content = match[1];
      const entry: any = { authors: [], type: 'book' };
      
      const fields = ['title', 'author', 'year', 'publisher', 'url'];
      fields.forEach(field => {
        const fRegex = new RegExp(`${field}\\s*=\\s*\{?([^,}\n]+)\}?`, 'i');
        const fMatch = fRegex.exec(content);
        if (fMatch) {
          const val = fMatch[1].trim().replace(/^\{|\}$/g, '');
          if (field === 'title') entry.title = val;
          else if (field === 'year') entry.year = val;
          else if (field === 'publisher') entry.source = val;
          else if (field === 'url') entry.url = val;
          else if (field === 'author') {
            const authors = val.split(' and ');
            authors.forEach(a => {
              const parts = a.split(', ');
              entry.authors.push({ 
                lastName: parts[0] || '', 
                firstName: parts[1] || '', 
                condition: 'general' 
              });
            });
          }
        }
      });
      if (entry.title) entries.push(entry);
    }
    return entries;
  };

  const handleImport = async () => {
    if (!activeProjectId) {
      toast.error(language === 'TH' ? 'กรุณาเลือกโปรเจกต์ก่อน' : 'Please select a project first');
      return;
    }

    const loaders = [];
    if (importRefFilesData.ris) loaders.push({ file: importRefFilesData.ris, parser: parseRIS, type: 'RIS' });
    if (importRefFilesData.bib) loaders.push({ file: importRefFilesData.bib, parser: parseBibTeX, type: 'BibTeX' });

    if (loaders.length === 0) {
      toast.error(language === 'TH' ? 'กรุณาเลือกไฟล์ที่ต้องการนำเข้า' : 'Please select a file to import');
      return;
    }

    toast.loading(language === 'TH' ? 'กำลังนำเข้าข้อมูล...' : 'Importing data...');

    try {
      let totalImported = 0;
      for (const loader of loaders) {
        const text = await loader.file.text();
        const entries = loader.parser(text);
        
        for (const entry of entries) {
          await fetch('/api/citations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId: activeProjectId,
              ...entry
            })
          });
          totalImported++;
        }
      }
      
      mutateCitations();
      setIsImportModalOpen(false);
      setImportRefFiles({ ris: null, bib: null, backup: null });
      setImportRefFilesData({ ris: null, bib: null, backup: null });
      toast.dismiss();
      toast.success(language === 'TH' ? `นำเข้าสำเร็จ ${totalImported} รายการ` : `Imported ${totalImported} items successfully`);
    } catch (err) {
      toast.dismiss();
      toast.error(language === 'TH' ? 'เกิดข้อผิดพลาดในการนำเข้า' : 'Error during import');
    }
  };

  const resourceLabels: Record<string, { TH: string, EN: string }> = {
    book: { TH: 'หนังสือ', EN: 'Book' },
    article: { TH: 'วารสาร', EN: 'Journal' },
    website: { TH: 'เว็บไซต์', EN: 'Website' },
    report: { TH: 'รายงาน', EN: 'Report' },
    news: { TH: 'ข่าวสาร', EN: 'News' },
    artwork: { TH: 'งานศิลปะ', EN: 'Artwork' },
    blog: { TH: 'บล็อกโพสต์', EN: 'Blog Post' },
    chapter: { TH: 'บทในหนังสือ', EN: 'Book Chapter' },
    review: { TH: 'บทวิจารณ์หนังสือ', EN: 'Book Review' },
    conference: { TH: 'เอกสารการประชุม', EN: 'Conference Paper' },
    'db-article': { TH: 'บทความฐานข้อมูล', EN: 'Database Article' },
    dictionary: { TH: 'พจนานุกรม', EN: 'Dictionary Entry' },
    ebook: { TH: 'อีบุ๊ก', EN: 'E-book' },
    encyclopedia: { TH: 'สารานุกรม', EN: 'Encyclopedia Entry' },
    film: { TH: 'ภาพยนตร์', EN: 'Film/Movie' },
    image: { TH: 'รูปภาพ', EN: 'Image' },
    interview: { TH: 'บทสัมภาษณ์', EN: 'Interview' },
    journal: { TH: 'บทความวารสาร', EN: 'Journal Article' },
    'legal-bill': { TH: 'ร่างกฎหมาย', EN: 'Legal Bill' },
    'legal-case': { TH: 'คดีความ', EN: 'Legal Case' },
    legislation: { TH: 'กฎหมาย', EN: 'Legislation' },
    magazine: { TH: 'บทความนิตยสาร', EN: 'Magazine Article' },
    map: { TH: 'แผนที่', EN: 'Map' },
    'news-article': { TH: 'บทความข่าว', EN: 'News Article' },
    patent: { TH: 'สิทธิบัตร', EN: 'Patent' },
    personal: { TH: 'การสื่อสารส่วนตัว', EN: 'Personal Communication' },
    regulation: { TH: 'ระเบียบข้อบังคับ', EN: 'Regulation' },
    song: { TH: 'เพลง', EN: 'Song' },
    speech: { TH: 'สุนทรพจน์', EN: 'Speech' },
    standard: { TH: 'มาตรฐาน', EN: 'Standard' },
    thesis: { TH: 'วิทยานิพนธ์', EN: 'Thesis/Dissertation' },
    broadcast: { TH: 'รายการทีวี/วิทยุ', EN: 'TV/Radio Broadcast' },
    video: { TH: 'วิดีโอ', EN: 'Video' },
    paste: { TH: 'เขียน/วางบรรณานุกรม', EN: 'Write/paste citation' },
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return <Book className="h-4 w-4" />;
      case 'article': case 'journal': case 'db-article': return <FileText className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      case 'report': return <ClipboardList className="h-4 w-4" />;
      case 'news': case 'news-article': case 'magazine': return <Newspaper className="h-4 w-4" />;
      case 'artwork': case 'image': return <Palette className="h-4 w-4" />;
      case 'blog': return <MessageSquare className="h-4 w-4" />;
      case 'chapter': return <BookOpen className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'conference': return <Mic2 className="h-4 w-4" />;
      case 'dictionary': case 'encyclopedia': return <Languages className="h-4 w-4" />;
      case 'ebook': return <Smartphone className="h-4 w-4" />;
      case 'film': return <Film className="h-4 w-4" />;
      case 'interview': case 'speech': return <Mic2 className="h-4 w-4" />;
      case 'legal-bill': case 'legal-case': return <Gavel className="h-4 w-4" />;
      case 'legislation': return <Scale className="h-4 w-4" />;
      case 'map': return <MapIcon className="h-4 w-4" />;
      case 'patent': return <Award className="h-4 w-4" />;
      case 'personal': return <Mail className="h-4 w-4" />;
      case 'regulation': return <ShieldCheck className="h-4 w-4" />;
      case 'song': return <Music className="h-4 w-4" />;
      case 'standard': return <Check className="h-4 w-4" />;
      case 'thesis': return <Library className="h-4 w-4" />;
      case 'broadcast': return <Tv className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResourceBadgeStyle = (type: string) => {
    switch (type) {
      case 'book': return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/30";
      case 'article': case 'journal': case 'db-article': return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30";
      case 'website': return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800/30";
      case 'video': case 'film': case 'broadcast': return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30";
      case 'news': case 'news-article': case 'magazine': return "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-100 dark:border-orange-800/30";
      case 'report': case 'thesis': return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/50";
      case 'artwork': case 'image': case 'palette': return "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 border-pink-100 dark:border-pink-800/30";
      case 'legal-bill': case 'legal-case': case 'legislation': return "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 border-sky-100 dark:border-sky-800/30";
      case 'map': return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30";
      default: return "bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800";
    }
  };

  const handleSaveManualCitation = async () => {
    if (!activeProjectId) {
      toast.error(language === 'TH' ? 'กรุณาเลือกหรือสร้างโปรเจกต์ก่อน' : 'Please select or create a project first');
      return;
    }
    
    // basic validation
    if (!newCitationData.title || newCitationData.authors.every((a: any) => !a.lastName && !a.firstName)) {
      toast.error(language === 'TH' ? 'กรุณากรอกข้อมูลที่จำเป็น' : 'Please fill in required fields');
      return;
    }

    try {
      const url = editingCitationId ? `/api/citations/${editingCitationId}` : '/api/citations';
      const method = editingCitationId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: activeProjectId,
          type: selectedType || 'book',
          authors: newCitationData.authors,
          year: newCitationData.year,
          title: newCitationData.title,
          source: newCitationData.source,
          url: newCitationData.url
        })
      });

      if (res.ok) {
        const savedCitation = await res.json();
        mutateCitations();
        setHighlightedId(savedCitation.id);
        setTimeout(() => setHighlightedId(null), 3000);
        setIsAddCitationModalOpen(false);
        setEditingCitationId(null);
        toast.success(editingCitationId 
          ? (language === 'TH' ? 'แก้ไขรายการสำเร็จ' : 'Citation updated successfully') 
          : (language === 'TH' ? 'เพิ่มรายการบรรณานุกรมสำเร็จ' : 'Citation added successfully')
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error(language === 'TH' ? 'เกิดข้อผิดพลาดในการบันทึก' : 'Error saving citation');
    }
  };
  
  const { data: citations = [], mutate: mutateCitations } = useSWR(activeProjectId ? `/api/citations?projectId=${activeProjectId}&isDeleted=false` : null, fetcher);
  const { data: deletedCitations = [], mutate: mutateDeletedCitations } = useSWR(activeProjectId ? `/api/citations?projectId=${activeProjectId}&isDeleted=true` : null, fetcher);

  const getFormattedCitation = (c: any, style: string) => {
    let content;
    let html;
    let plainText;
    let inText;
    
    const formatAuthor = (a: any, isAPA: boolean) => {
      if (a.condition === 'none') return '';
      if (a.condition === 'org') return a.firstName;
      
      const prefix = a.prefix ? a.prefix + ' ' : '';
      if (isAPA) {
        if (!a.lastName) return `${prefix}${a.firstName}`;
        return `${prefix}${a.lastName}, ${a.firstName?.charAt(0) || ''}.`;
      } else {
        if (!a.lastName) return `${prefix}${a.firstName}`;
        return `${prefix}${a.lastName}, ${a.firstName}`;
      }
    };

    const authorsList = c.authors?.map((a: any) => formatAuthor(a, style.includes('APA'))).filter(Boolean) || [];
    const numAuthors = authorsList.length;
    const authorLast = c.authors?.[0]?.condition === 'org' ? c.authors[0].firstName : (c.authors?.[0]?.lastName || 'Unknown');

    if (style.includes('APA')) {
      const authorsStr = authorsList.join(' & ') || 'Unknown';
      const dateStr = c.year ? `(${c.year}).` : '(n.d.).';
      const titleStr = c.title ? `${c.title}.` : '';
      const sourceStr = c.source ? ` ${c.source}.` : '';
      content = <>{authorsStr} {dateStr} <i>{titleStr}</i>{sourceStr}</>;
      html = `${authorsStr} ${dateStr} <i>${titleStr}</i>${sourceStr}`;
      plainText = `${authorsStr} ${dateStr} ${titleStr}${sourceStr}`;
      inText = `(${authorLast}${numAuthors > 1 ? ' et al.' : ''}, ${c.year || 'n.d.'})`;
    } else if (style.includes('MLA')) {
      const authorsStr = authorsList.map((a: string, i: number) => i === 0 ? a : a.split(', ').reverse().join(' ')).join(', and ') || 'Unknown';
      const titleStr = c.title ? ` <i>${c.title}</i>.` : '';
      const sourceStr = c.source ? ` ${c.source},` : '';
      const dateStr = c.year ? ` ${c.year}.` : '';
      content = <>{authorsStr}.<span dangerouslySetInnerHTML={{ __html: titleStr }} />{sourceStr}{dateStr}</>;
      html = `${authorsStr}.${titleStr}${sourceStr}${dateStr}`;
      plainText = `${authorsStr}. ${c.title || ''}.${sourceStr}${dateStr}`;
      inText = `(${authorLast})`;
    } else if (style.includes('Chicago')) {
      const authorsStr = authorsList.map((a: string, i: number) => i === 0 ? a : a.split(', ').reverse().join(' ')).join(', and ') || 'Unknown';
      const titleStr = c.title ? ` <i>${c.title}</i>.` : '';
      const sourceStr = c.source ? ` ${c.source},` : '';
      const dateStr = c.year ? ` ${c.year}.` : '';
      content = <>{authorsStr}.<span dangerouslySetInnerHTML={{ __html: titleStr }} />{sourceStr}{dateStr}</>;
      html = `${authorsStr}.${titleStr}${sourceStr}${dateStr}`;
      plainText = `${authorsStr}. ${c.title || ''}.${sourceStr}${dateStr}`;
      inText = `(${authorLast} ${c.year || 'n.d.'})`;
    } else {
      const authorsStr = authorsList.map((a: string) => a.split(', ').reverse().join(' ')).join(', ') || 'Unknown';
      content = <>{authorsStr}. "{c.title}". <i>{c.source}</i> ({c.year}).</>;
      html = `${authorsStr}. "${c.title}". <i>${c.source}</i> (${c.year}).`;
      plainText = `${authorsStr}. "${c.title}". ${c.source} (${c.year}).`;
      inText = `[${c.id}]`;
    }

    return {
      authorText: authorLast,
      titleText: c.title || 'Untitled',
      year: c.year ? parseInt(c.year) : 0,
      dateAdded: new Date(c.createdAt).getTime(),
      inText,
      content,
      html,
      plainText
    };
  };

  const cleanForSort = (str: string) => {
    return str.replace(/^(A|An|The)\s+/i, '').trim();
  };

  const comparePhonetic = (a: string, b: string) => {
    const isThaiA = /[\u0E00-\u0E7F]/.test(a);
    const isThaiB = /[\u0E00-\u0E7F]/.test(b);
    if (isThaiA && !isThaiB) return -1;
    if (!isThaiA && isThaiB) return 1;
    return a.localeCompare(b, 'th-TH');
  };

  const processedCitations = React.useMemo(() => {
    let result = citations.map((c: any) => ({
      id: c.id,
      original: c,
      ...getFormattedCitation(c, style)
    }));
    
    // Filter by search query
    if (searchReferencesQuery) {
      const q = searchReferencesQuery.toLowerCase();
      result = result.filter((c: any) => 
        c.authorText.toLowerCase().includes(q) || 
        c.titleText.toLowerCase().includes(q) || 
        c.year.toString().includes(q)
      );
    }
    
    // Process Sorting
    const sortBy = settings.sortBy;
    if (sortBy === 'Author (A-Z)') {
      result.sort((a: any, b: any) => comparePhonetic(cleanForSort(a.authorText), cleanForSort(b.authorText)));
    } else if (sortBy === 'Author (Z-A)') {
      result.sort((a: any, b: any) => comparePhonetic(cleanForSort(b.authorText), cleanForSort(a.authorText)));
    } else if (sortBy === 'Title (A-Z)') {
      result.sort((a: any, b: any) => comparePhonetic(cleanForSort(a.titleText), cleanForSort(b.titleText)));
    } else if (sortBy === 'Title (Z-A)') {
      result.sort((a: any, b: any) => comparePhonetic(cleanForSort(b.titleText), cleanForSort(a.titleText)));
    } else if (sortBy === 'Publication date (newest-oldest)') {
      result.sort((a: any, b: any) => b.year - a.year);
    } else if (sortBy === 'Publication date (oldest-newest)') {
      result.sort((a: any, b: any) => a.year - b.year);
    } else if (sortBy === 'Date added (newest-oldest)') {
      result.sort((a: any, b: any) => b.dateAdded - a.dateAdded);
    } else if (sortBy === 'Date added (oldest-newest)') {
      result.sort((a: any, b: any) => a.dateAdded - b.dateAdded);
    } else if (sortBy === 'Citation style') {
      result.sort((a: any, b: any) => a.id - b.id);
    }
  
    return result;
  }, [citations, style, searchReferencesQuery, settings.sortBy]);

  // Drag and Drop State
  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  const handleSort = () => {
    // Disabled sort dragging for now, as order needs to sync with backend optionally
  };

  // Toast handling removed in favor of sonner


  const deleteCitation = async (id: number) => {
    try {
      const res = await fetch(`/api/citations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
      });
      if (res.ok) {
        mutateCitations();
        mutateDeletedCitations();
        toast.success(language === 'TH' ? 'ย้ายไปที่ถังขยะเรียบร้อย' : 'Citation moved to trash');
      }
    } catch (e) { console.error(e) }
  };

  const restoreCitation = async (id: number) => {
    try {
      const res = await fetch(`/api/citations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: false })
      });
      if (res.ok) {
        mutateCitations();
        mutateDeletedCitations();
        toast.success(language === 'TH' ? 'กู้คืนรายการบรรณานุกรมสำเร็จ' : 'Citation restored successfully');
      }
    } catch (e) { console.error(e) }
  };
  
  const permanentlyDeleteCitation = async (id: number) => {
    try {
      const res = await fetch(`/api/citations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutateDeletedCitations();
        toast.warning(language === 'TH' ? 'ลบรายการถาวรแล้ว' : 'Citation permanently deleted');
      }
    } catch (e) { console.error(e) }
  };

  const [inTextCopiedId, setInTextCopiedId] = React.useState<number | null>(null);

  const handleEditCitation = (citation: any) => {
    // citation here is the processed one, but we need the raw fields for the form
    const raw = citation.original;
    setNewCitationData({
      authors: raw.authors?.map((a: any) => ({
        firstName: a.firstName || '',
        middleName: a.middleName || '',
        lastName: a.lastName || '',
        prefix: a.prefix || '',
        condition: a.condition || 'general'
      })) || [{ firstName: '', middleName: '', lastName: '', prefix: '', condition: 'general' }],
      year: raw.year || '',
      title: raw.title || '',
      source: raw.source || '',
      url: raw.url || ''
    });
    setSelectedType(raw.type || 'book'); 
    setEditingCitationId(raw.id);
    setCitationStep(1);
    setIsAddCitationModalOpen(true);
  };


  const copyRichText = async (html: string, plainText: string) => {
    try {
      const typeHtml = "text/html";
      const typePlain = "text/plain";
      // Wrap in a div to ensure formatting is preserved better by some apps
      const wrappedHtml = `<div style="font-family: serif;">${html}</div>`;
      const blobHtml = new Blob([wrappedHtml], { type: typeHtml });
      const blobPlain = new Blob([plainText], { type: typePlain });
      const data = [new ClipboardItem({ [typeHtml]: blobHtml, [typePlain]: blobPlain })];
      await navigator.clipboard.write(data);
      return true;
    } catch (err) {
      console.error('Clipboard error:', err);
      try {
        await navigator.clipboard.writeText(plainText);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  const handleCopy = async () => {
    if (processedCitations.length === 0) return;
    
    // Header for "References"
    const headerPlain = language === 'TH' ? 'รายการอ้างอิง' : 'References';
    const headerHtml = `<h2 style="font-family: serif; font-size: 1.5em; text-align: center; margin-bottom: 1em;">${headerPlain}</h2>`;
    
    // Combine all citations
    const allCitationsHtml = processedCitations.map((c: any) => 
      `<div style="margin-bottom: 0.8em; ${settings.hangingIndent ? 'padding-left: 2em; text-indent: -2em;' : ''} line-height: ${settings.doubleSpaced ? '2.0' : '1.5'}; font-family: serif;">${c.html}</div>`
    ).join('');
    
    const allCitationsPlain = headerPlain + '\n\n' + processedCitations.map((c: any) => c.plainText).join('\n');
    
    const success = await copyRichText(headerHtml + allCitationsHtml, allCitationsPlain);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(language === 'TH' ? 'คัดลอกบรรณานุกรมทั้งหมดแล้ว (พร้อมรูปแบบ)' : 'Copied all bibliographies (with formatting)');
    }
  };

  const handleItemCopy = async (id: number) => {
    const citation = processedCitations.find((c: any) => c.id === id);
    if (!citation) return;
    
    const success = await copyRichText(citation.html, citation.plainText);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success(language === 'TH' ? 'คัดลอกบรรณานุกรมแล้ว (พร้อมรูปแบบ)' : 'Copied bibliography (with formatting)');
    }
  };

  const handleCopyInTextCitation = async (id: number, text: string) => {
    // In-text citations are usually not italicized in most styles, but we can wrap them in rich text anyway
    const success = await copyRichText(`<span>${text}</span>`, text);
    if (success) {
      setInTextCopiedId(id);
      setTimeout(() => setInTextCopiedId(null), 2000);
      toast.success(language === 'TH' ? 'คัดลอก In-text citation แล้ว' : 'Copied in-text citation');
    }
  };

  const styles = ["APA - 7th Edition", "MLA - 9th Edition", "Harvard", "Chicago", "AMA", "CSE"];
  
  const views = [
    { id: "Plain list", icon: <List className="h-4 w-4" />, label: "Plain list" },
    { id: "Bibliography", icon: <FileText className="h-4 w-4" />, label: "Bibliography" },
    { id: "Bibliography and in-text citations", icon: <LayoutList className="h-4 w-4" />, label: "Bibliography and in-text citations" },
  ];

  const handleExport = async (format: string) => {
    if (processedCitations.length === 0) {
      toast.error(language === 'TH' ? 'ไม่มีรายการให้ออก' : 'No citations to export');
      return;
    }

    try {
      if (format.includes('Word')) {
        await exportToWord(processedCitations, settings, language);
      } else if (format.includes('PDF')) {
        await exportToPDF('citation-paper', 'bibliography.pdf');
      } else if (format.includes('BibTeX')) {
        exportToBibTeX(processedCitations);
      } else if (format.includes('RIS')) {
        exportToRIS(processedCitations);
      }
      toast.success(language === 'TH' ? `ออกไฟล์ ${format} สำเร็จ` : `Exported ${format} successfully`);
    } catch (err) {
      console.error(err);
      toast.error(language === 'TH' ? 'เกิดข้อผิดพลาดในการออกไฟล์' : 'Error exporting file');
    }
  };

  const exportFormats = [
    { id: 'word', name: "Word (.docx)", icon: <FileText className="h-3 w-3" /> },
    { id: 'pdf', name: "PDF (.pdf)", icon: <FileSpreadsheet className="h-3 w-3" /> },
    { id: 'bibtex', name: "BibTeX (.bib)", icon: <FileCode className="h-3 w-3" /> },
    { id: 'ris', name: "RIS (.ris)", icon: <FileJson className="h-3 w-3" /> },
  ];

  const FONT_OPTIONS = ['Times New Roman', 'Arial', 'Helvetica', 'Sarabun'];
  const TEXT_SIZE_OPTIONS = ['10pt', '11pt', '12pt', '14pt'];
  const SORT_OPTIONS = [
    'Citation style',
    'Author (A-Z)',
    'Author (Z-A)',
    'Title (A-Z)',
    'Title (Z-A)',
    'Publication date (newest-oldest)',
    'Publication date (oldest-newest)',
    'Date added (newest-oldest)',
    'Date added (oldest-newest)'
  ];

  const RECOMMENDED_OPTIONS = ['Sarabun', '12pt', 'Author (A-Z)'];



  const [settingsDropdown, setSettingsDropdown] = React.useState<string | null>(null);


  const handleSortSettings = (sortBy: string) => {
    setSettings(prev => ({ ...prev, sortBy }));
    setSettingsDropdown(null);
  };

  const handleFontChange = (font: string) => {
    setSettings(prev => ({ ...prev, font }));
    setSettingsDropdown(null);
  };

  const handleTextSizeChange = (textSize: string) => {
    setSettings(prev => ({ ...prev, textSize }));
    setSettingsDropdown(null);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  const { data: fetchedProjects = [], mutate: mutateProjects } = useSWR('/api/projects?isArchived=false', fetcher);
  const { data: archivedProjects = [], mutate: mutateArchivedProjects } = useSWR('/api/projects?isArchived=true', fetcher);
  
  const iconComponents: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen />,
    Globe: <Globe />,
    FileText: <FileText />,
    Library: <Library />,
    Archive: <Archive />,
    Book: <Book />,
    Pencil: <Pencil />,
    Quote: <Quote />,
    Sparkles: <Sparkles />,
    Bot: <Bot />,
    Search: <Search />,
    Settings2: <Settings2 />,
    Briefcase: <Briefcase />,
    LayoutDashboard: <LayoutDashboard />,
    ShoppingCart: <ShoppingCart />,
    Smartphone: <Smartphone />,
    Heart: <Heart />,
    ShieldCheck: <ShieldCheck />,
    Info: <Info />,
    HelpCircle: <HelpCircle />,
  };

  const projects = fetchedProjects.map((p: any) => ({
    id: p.id,
    name: p.name,
    icon: iconComponents[p.icon] ? React.cloneElement(iconComponents[p.icon] as React.ReactElement<any>, { className: "h-3 w-3 shrink-0" }) : <BookOpen className="h-3 w-3 shrink-0" />,
    color: p.color,
    active: activeProjectId === p.id || (activeProjectId === null && fetchedProjects.length > 0 && fetchedProjects[0].id === p.id),
  }));

  React.useEffect(() => {
    if (activeProjectId === null && fetchedProjects.length > 0) {
      setActiveProjectId(fetchedProjects[0].id);
    }
  }, [fetchedProjects, activeProjectId]);

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    setIsCreatingProject(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        const createdProject = await res.json();
        setActiveProjectId(createdProject.id);
        mutateProjects();
        setIsCreateModalOpen(false);
        setNewProject({ name: "", description: "", color: "#407bc4", icon: "BookOpen" });
        toast.success(language === 'TH' ? 'สร้างโปรเจกต์สำเร็จ' : 'Project created successfully');
      }
    } catch (e) {
      console.error(e);
      toast.error(language === 'TH' ? 'เกิดข้อผิดพลาด' : 'An error occurred');
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleArchiveProject = async (id: number, isArchived: boolean = true) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived })
      });
      if (res.ok) {
        if (isArchived && activeProjectId === id) {
          setActiveProjectId(null);
        }
        mutateProjects();
        mutateArchivedProjects();
        toast.success(isArchived 
          ? (language === 'TH' ? 'เก็บโปรเจกต์ลงคลังแล้ว' : 'Project archived')
          : (language === 'TH' ? 'กู้คืนโปรเจกต์สำเร็จ' : 'Project restored')
        );
      }
    } catch (e) { console.error(e) }
  };

  const handleDuplicateProject = async (id: number) => {
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        mutateProjects();
        toast.success(language === 'TH' ? 'ทำสำเนาโปรเจกต์สำเร็จ' : 'Project duplicated');
      }
    } catch (e) { console.error(e) }
  };

  const handleEditProjectClick = (p: any) => {
    const raw = fetchedProjects.find((pf: any) => pf.id === p.id) || archivedProjects.find((pf: any) => pf.id === p.id);
    setEditingProject(raw);
    setNewProject({
      name: raw.name,
      description: raw.description || "",
      color: raw.color || "#407bc4",
      icon: raw.icon || "BookOpen"
    });
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        mutateProjects();
        mutateArchivedProjects();
        setIsEditProjectModalOpen(false);
        setEditingProject(null);
        toast.success(language === 'TH' ? 'แก้ไขโปรเจกต์สำเร็จ' : 'Project updated');
      }
    } catch (e) { console.error(e) }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutateProjects();
        mutateArchivedProjects();
        toast.success(language === 'TH' ? 'ลบโปรเจกต์สำเร็จ' : 'Project deleted');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-black dark:text-white transition-colors duration-300">
      {/* 
        Navbar 
        - Increased size
      */}
      <nav className="sticky top-0 z-50 flex w-full h-16 items-center justify-between px-6 sm:px-8 lg:px-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority sizes="40px" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#407bc4]">Baby</span>
              <span className="text-[#f58e58]">bib</span>
            </span>
          </Link>
          {/* Nav Links */}
          <div className="hidden lg:flex items-center ml-4">
            <NavLinks />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageDropdown />
          <ThemeToggle />
          <button className="hidden sm:flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#407bc4] px-4 text-sm font-medium text-white transition-all hover:bg-[#32629e] active:scale-95 shadow-sm">
            {translations[language].nav.signIn} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>

      {/* Main Container - 3 Column Layout */}
      <div className="mx-auto flex w-full max-w-screen-2xl items-start">
        
        {/* Left Sidebar */}
        <aside className="hidden top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-transparent py-6 pr-6 md:sticky md:block lg:py-8 md:w-[240px] lg:w-[280px] pl-6 sm:pl-8 lg:pl-12">
          <div className="flex flex-col gap-6">

            <div className="relative group mx-auto">
              <button 
                onMouseEnter={() => setIsAddTooltipVisible(true)}
                onMouseLeave={() => setIsAddTooltipVisible(false)}
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-8 w-32 items-center justify-center gap-1.5 rounded-md bg-[#f58e58] text-xs font-medium text-white hover:bg-[#e67e43] active:scale-95 transition-all shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> Add new
              </button>
              
              <AnimatePresence>
                {isAddTooltipVisible && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded whitespace-nowrap z-50 pointer-events-none"
                  >
                    Create a new project
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-bottom-4 border-b-zinc-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#407bc4]/10 dark:bg-[#407bc4]/20">
                  <BookOpen className="h-3 w-3 text-[#407bc4] dark:text-[#6ba1e6]" />
                </div>
                <span className="text-sm font-semibold">Project</span>
              </div>
              <ul className="flex flex-col gap-1 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-1">
                {(isProjectsExpanded ? projects : projects.slice(0, 5)).map((project: any, idx: number) => (
                  <li 
                    key={project.id}
                    onClick={() => setActiveProjectId(project.id)}
                    className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm transition-all cursor-pointer group/item ${
                      project.active 
                        ? "bg-[#407bc4]/5 font-semibold dark:bg-[#407bc4]/10" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-[#407bc4] dark:hover:text-[#6ba1e6]"
                    }`}
                    style={project.active ? { color: project.color } : {}}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {project.icon}
                      <span className="truncate">{project.name}</span>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectMenuIdx(projectMenuIdx === idx ? null : idx);
                        }}
                        className={`opacity-0 group-hover/item:opacity-100 p-0.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${
                          project.active || projectMenuIdx === idx ? "opacity-100 text-[#407bc4]" : "text-zinc-400"
                        }`}
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      <AnimatePresence>
                        {projectMenuIdx === idx && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setProjectMenuIdx(null)} />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-1 w-44 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl z-50 py-2 px-1.5 overflow-hidden"
                            >
                              {[
                                { id: 'edit', label: language === 'TH' ? 'Edit' : 'Edit', icon: <Pencil className="h-4 w-4" /> },
                                { id: 'duplicate', label: language === 'TH' ? 'Duplicate' : 'Duplicate', icon: <Copy className="h-4 w-4" /> },
                                { id: 'archive', label: language === 'TH' ? 'Archive' : 'Archive', icon: <Archive className="h-4 w-4" /> },
                                { id: 'delete', label: language === 'TH' ? 'Delete' : 'Delete', icon: <Trash2 className="h-4 w-4" />, color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProjectMenuIdx(null);
                                    if (option.id === 'archive') {
                                      handleArchiveProject(project.id);
                                    } else if (option.id === 'delete') {
                                      handleDeleteProject(project.id);
                                    } else if (option.id === 'duplicate') {
                                      handleDuplicateProject(project.id);
                                    } else if (option.id === 'edit') {
                                      handleEditProjectClick(project);
                                    }
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold rounded-xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${option.color || 'text-zinc-700 dark:text-zinc-300'}`}
                                >
                                  <span className={`${option.color ? 'text-red-500' : 'text-zinc-500'} shrink-0`}>
                                    {option.icon}
                                  </span>
                                  {option.label}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                ))}
              </ul>
              
              {projects.length > 5 && (
                <button 
                  onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                  className="flex items-center gap-2 ml-6 text-[10px] font-bold text-zinc-400 hover:text-[#407bc4] transition-colors uppercase tracking-wider group"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isProjectsExpanded ? 'rotate-180' : ''}`} />
                  {isProjectsExpanded 
                    ? (language === 'TH' ? 'แสดงน้อยลง' : 'Show less') 
                    : (language === 'TH' ? 'แสดงเพิ่มเติม' : 'Show more')}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#f58e58]/10 dark:bg-[#f58e58]/20">
                  <Triangle className="h-3 w-3 text-[#f58e58] dark:text-[#f58e58]" />
                </div>
                <span className="text-sm font-semibold text-zinc-500">Latest bibliography</span>
              </div>
              <ul className="flex flex-col gap-2 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-2">
                {processedCitations.slice(0, 5).map((citation: any) => (
                  <li key={citation.id} className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                    <span className="truncate">{citation.authorText} ({citation.year}). {citation.titleText}...</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-zinc-500 w-full">
              <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/50 rounded-full p-1 border border-zinc-100 dark:border-zinc-800 shadow-xs">
                <div 
                  onClick={() => setIsArchivedProjectsModalOpen(true)}
                  className="flex items-center overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-white dark:hover:bg-zinc-800 rounded-full px-2 py-1 group/archived w-8 hover:w-28"
                >
                  <Archive className="h-3.5 w-3.5 shrink-0" />
                  <span className="ml-2 opacity-0 group-hover/archived:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {language === 'TH' ? 'คลังโปรเจกต์' : 'Archived'}
                  </span>
                </div>
                
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
                
                {/* Delete Button */}
                <div 
                  onClick={() => setIsDeletedModalOpen(true)}
                  className="flex items-center overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-white dark:hover:bg-zinc-800 rounded-full px-2 py-1 group/deleted w-8 hover:w-24"
                >
                  <Trash2 className="h-3.5 w-3.5 shrink-0 group-hover/deleted:text-red-500" />
                  <span className="ml-2 opacity-0 group-hover/deleted:opacity-100 transition-opacity duration-200 whitespace-nowrap group-hover/deleted:text-red-500">Deleted</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 pt-4 mt-auto mx-auto pb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Made by <span className="font-bold"><span className="text-[#407bc4]">Baby</span><span className="text-[#f58e58]">bib</span></span>
              </span>
              <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 font-medium tracking-tight">
                <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-zinc-400 dark:text-zinc-500 decoration-transparent underline-offset-4 hover:underline">Privacy</Link>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-zinc-400 dark:text-zinc-500 decoration-transparent underline-offset-4 hover:underline">Terms</Link>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-zinc-400 dark:text-zinc-500 decoration-transparent underline-offset-4 hover:underline">About</Link>
              </div>
            </div>

          </div>
        </aside>

        {/* Center Content Area */}
        <main className="relative py-6 lg:py-8 w-full min-w-0 px-6 md:px-8 xl:px-12 flex-1">
          <div className="mx-auto w-full min-w-0">
            
            {/* Search Input Section */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <button 
                      onClick={() => {
                        setEditingCitationId(null);
                        setNewCitationData({
                          authors: [{ firstName: "", middleName: "", lastName: "", prefix: "", condition: "general" }],
                          year: "",
                          title: "",
                          source: "",
                          url: ""
                        });
                        setCitationStep(0);
                        setIsAddCitationModalOpen(true);
                      }}
                      className="flex h-9 items-center gap-2 rounded-xl bg-[#407bc4] px-4 text-xs font-bold text-white shadow-md hover:bg-[#32629e] transition-all active:scale-95 group"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                      {language === 'TH' ? 'เพิ่ม รายการบรรณานุกรม' : 'New Citation'}
                    </button>
                  
                  <button 
                      onClick={() => setIsImportModalOpen(true)}
                      className="flex h-9 items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                    >
                      <FileUp className="h-4 w-4" />
                      {language === 'TH' ? 'นำเข้า' : 'Import'}
                    </button>
                </div>
                
                <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group">
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Help</span>
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  {isMainSearching ? (
                    <RotateCw className="h-5 w-5 text-zinc-400 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#407bc4] transition-colors" />
                  )}
                </div>
                <input 
                  type="text" 
                  value={mainSearchQuery}
                  onChange={(e) => handleMainSearch(e.target.value)}
                  onFocus={() => {
                    if (mainSearchResults.length > 0 || isMainSearching) setIsMainSearchDropdownOpen(true);
                  }}
                  onBlur={() => {
                    // Slight delay to allow clicking on results
                    setTimeout(() => setIsMainSearchDropdownOpen(false), 200);
                  }}
                  placeholder={language === 'TH' ? 'ค้นหาด้วย ISBN / DOI / URL / ชื่อเรื่อง ฯลฯ' : 'Search by ISBN / DOI / URL / Title etc.'}
                  className="w-full h-11 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-16 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-[#407bc4]/5 dark:focus:ring-[#407bc4]/10 focus:border-[#407bc4] transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>

                {/* Smart Search Dropdown */}
                <AnimatePresence>
                  {isMainSearchDropdownOpen && mainSearchQuery.trim().length > 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-14 left-0 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      {isMainSearching ? (
                        <div className="p-8 flex flex-col items-center justify-center text-zinc-400">
                          <RotateCw className="h-6 w-6 animate-spin mb-2" />
                          <span className="text-xs">{language === 'TH' ? 'กำลังค้นหา...' : 'Searching...'}</span>
                        </div>
                      ) : mainSearchResults.length > 0 ? (
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                          {mainSearchResults.map((result) => (
                            <div key={result.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors group">
                               <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-zinc-500">{getResourceIcon(result.type)}</span>
                                  </div>
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate">{result.title}</span>
                                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0 ${getResourceBadgeStyle(result.type)}`}>
                                        {language === 'TH' && resourceLabels[result.type] ? resourceLabels[result.type].TH : resourceLabels[result.type]?.EN || result.type}
                                      </span>
                                    </div>
                                    <span className="text-xs text-zinc-500 line-clamp-1">
                                      {result.authors.map((a: any) => `${a.firstName} ${a.lastName}`).join(', ')} ({result.year}) - {result.source}
                                    </span>
                                  </div>
                               </div>
                               <button 
                                 onClick={(e) => {
                                   e.preventDefault();
                                   handleSelectSearchResult(result);
                                 }}
                                 className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#407bc4]/10 text-[#407bc4] hover:bg-[#407bc4] hover:text-white transition-colors"
                               >
                                 <Plus className="h-4 w-4" />
                               </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 flex flex-col items-center justify-center text-zinc-400">
                          <Search className="h-6 w-6 mb-2 opacity-50" />
                          <span className="text-xs">{language === 'TH' ? 'ไม่พบผลลัพธ์' : 'No results found'}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-5 -mt-4">
              <div className="relative">
                <button 
                  onClick={() => setIsStyleOpen(!isStyleOpen)}
                  className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-800"
                >
                  <span className="text-zinc-400">Style:</span> {style}
                  <ChevronDown className={`h-3 w-3 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStyleOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsStyleOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden flex flex-col">
                      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Choose a style format your bibliography and citation. <Link href="#" className="text-[#407bc4] hover:underline">Learn More</Link>
                        </p>
                      </div>
                      <div className="py-1">
                        {styles.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setStyle(s);
                              setIsStyleOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${style === s ? 'text-[#407bc4] font-bold bg-zinc-50 dark:bg-zinc-800/50' : 'text-zinc-600 dark:text-zinc-400'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="px-3 py-2 border-t border-zinc-100 dark:border-zinc-800">
                        <button className="flex items-center justify-between w-full text-[10px] font-bold text-[#407bc4] hover:underline group">
                          <span>More Citation styles</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* View Mode Selector - Centered */}
              <div className="flex-1 flex justify-center items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">view</span>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {views.map((view) => (
                    <div key={view.id} className="relative group">
                      <button
                        onClick={() => setViewMode(view.id)}
                        className={`flex h-7 w-9 items-center justify-center rounded-md transition-all ${
                          viewMode === view.id 
                            ? "bg-white dark:bg-zinc-700 text-[#407bc4] shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        {view.icon}
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                        {view.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-800"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="flex h-8 items-center gap-1 rounded-md bg-[#407bc4] pl-3 pr-2 text-xs font-medium text-white hover:bg-[#32629e] transition-colors shadow-sm"
                  >
                    <Download className="h-3 w-3 mr-1" /> Export <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isExportOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                      <div className="absolute top-full right-0 mt-1 w-40 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-50 py-1 overflow-hidden">
                        {exportFormats.map((format) => (
                          <button
                            key={format.id}
                            onClick={() => {
                              handleExport(format.name);
                              setIsExportOpen(false);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <span className="text-zinc-400">{format.icon}</span>
                            {format.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* References Paper Area */}
            <div className="relative w-full min-h-[600px] bg-white dark:bg-[#1c1c1e] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col pt-12">
              
              {/* Box Toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="relative group/local-search">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/local-search:text-[#407bc4] transition-colors">
                    <Search className="h-3 w-3" />
                  </div>
                  <input
                    type="text"
                    value={searchReferencesQuery}
                    onChange={(e) => setSearchReferencesQuery(e.target.value)}
                    placeholder={language === 'TH' ? 'ค้นหา รายการบรรณานุกรม' : 'Search references'}
                    className="flex h-7 w-48 pl-8 pr-3 items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4]"
                  />
                  {searchReferencesQuery && (
                    <button 
                      onClick={() => setSearchReferencesQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all shadow-sm ${
                      isSettingsOpen 
                        ? "bg-[#407bc4] text-white" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>

                  {isSettingsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 flex flex-col translate-y-0 opacity-100 transition-all">
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30 rounded-t-xl">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <Settings2 className="h-3.5 w-3.5 text-[#407bc4]" /> Bibliography Settings
                          </span>
                        </div>
                        
                        <div className="p-2 flex flex-col gap-1">
                          {[
                            { id: 'hangingIndent', label: 'Hanging Indent', desc: 'Second line indentation' },
                            { id: 'doubleSpaced', label: 'Double Spacing', desc: 'Increase vertical spacing' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleSetting(item.id as keyof typeof settings)}
                              className="flex items-center justify-between w-full p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group text-left"
                            >
                              <div className="flex flex-col">
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-500 transition-colors">
                                  {item.desc}
                                </span>
                              </div>
                              <div className={`h-4 w-7 rounded-full transition-colors relative ${settings[item.id as keyof typeof settings] ? 'bg-[#407bc4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                <div className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white transition-transform ${settings[item.id as keyof typeof settings] ? 'translate-x-3' : 'translate-x-0'}`} />
                              </div>
                            </button>
                          ))}
                          
                          <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1 mx-2" />
                          
                          {[
                            { label: 'Font', value: settings.font, options: FONT_OPTIONS, handler: handleFontChange },
                            { label: 'Text size', value: settings.textSize, options: TEXT_SIZE_OPTIONS, handler: handleTextSizeChange },
                            { label: 'Sort by', value: settings.sortBy, options: SORT_OPTIONS, handler: handleSortSettings },
                          ].map((option) => (
                            <div key={option.label} className="relative">
                              <button
                                onClick={() => setSettingsDropdown(settingsDropdown === option.label ? null : option.label)}
                                className="flex items-center justify-between w-full p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group text-left"
                              >
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                  {option.label}
                                </span>
                                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{option.value}</span>
                                  <ChevronRight className={`h-3 w-3 text-zinc-400 group-hover:text-[#407bc4] transition-transform ${settingsDropdown === option.label ? 'rotate-90' : ''}`} />
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {settingsDropdown === option.label && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-10 right-0 w-48 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-[60] flex flex-col max-h-[160px] overflow-y-auto custom-scrollbar"
                                  >
                                    {option.options.map(opt => (
                                      <button
                                        key={opt}
                                        onClick={() => option.handler(opt)}
                                        className={`flex items-center gap-1.5 text-left px-3 py-2 rounded-md text-[10px] transition-colors ${option.value === opt ? 'bg-zinc-100 dark:bg-zinc-800 text-[#407bc4] font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                      >
                                        <span>{opt}</span>
                                        {RECOMMENDED_OPTIONS.includes(opt) && (
                                          <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400 shrink-0" />
                                        )}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>

                        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800 rounded-b-xl">
                          <div className="flex items-start gap-2">
                            <Info className="h-3 w-3 text-[#407bc4] mt-0.5 shrink-0" />
                            <p className="text-[9px] text-zinc-500 leading-tight">
                              These settings applied to the current bibliography view. Changes are saved automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Paper Content */}
              <div 
                id="citation-paper"
                ref={paperRef}
                className="px-24 py-16 max-w-5xl mx-auto w-full transition-all duration-300 bg-white"
                style={{ 
                  fontFamily: settings.font === 'Sarabun' ? "'Sarabun', sans-serif" : settings.font,
                  fontSize: settings.textSize 
                }}
              >
                <h2 className="text-2xl font-serif text-center mb-12 text-zinc-900 dark:text-zinc-100">References</h2>
                
                {citations.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {processedCitations.map((citation: any, index: number) => (
                      <motion.div 
                        key={citation.id} 
                        initial={highlightedId === citation.id ? { backgroundColor: "rgba(64, 123, 196, 0.15)", scale: 1.02 } : false}
                        animate={highlightedId === citation.id ? { backgroundColor: "rgba(64, 123, 196, 0)", scale: 1 } : { backgroundColor: "rgba(0,0,0,0)", scale: 1 }}
                        transition={{ duration: 2 }}
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="group relative flex items-start gap-4 p-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-default"
                      >
                        {/* Drag Handle */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700">
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {highlightedId === citation.id && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute -left-8 top-1/2 -translate-y-1/2"
                          >
                            <Sparkles className="h-4 w-4 text-[#407bc4] animate-pulse" />
                          </motion.div>
                        )}

                        <div 
                          className={`flex-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 transition-all`}
                        >
                          {viewMode === "Bibliography" && (
                            <div className={`transition-all ${settings.hangingIndent ? 'pl-8 -indent-8' : ''}`} style={{ lineHeight: settings.doubleSpaced ? '2.5' : '1.8' }}>
                              {citation.content}
                            </div>
                          )}
                          
                          {viewMode === "Plain list" && (
                            <div className="flex items-center gap-3" style={{ lineHeight: settings.doubleSpaced ? '2.5' : '1.8' }}>
                              <span className="h-1.5 w-1.5 rounded-full bg-[#407bc4] shrink-0" />
                              {citation.content}
                            </div>
                          )}

                          {viewMode === "Bibliography and in-text citations" && (
                            <div className="flex flex-col gap-3">
                              <div className={`transition-all ${settings.hangingIndent ? 'pl-8 -indent-8' : ''}`} style={{ lineHeight: settings.doubleSpaced ? '2.5' : '1.8' }}>
                                {citation.content}
                              </div>
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50/80 dark:bg-[#407bc4]/10 border border-blue-200/60 dark:border-[#407bc4]/30 rounded-full w-fit group cursor-help transition-all hover:bg-white dark:hover:bg-[#407bc4]/20 shadow-sm border-dashed">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center border border-blue-100 dark:border-[#407bc4]/20 shadow-xs">
                                  <Quote className="h-2.5 w-2.5 text-[#407bc4] fill-[#407bc4]/10" />
                                </div>
                                <span className="text-[12px] font-bold text-[#407bc4] tracking-tight leading-none">
                                  {citation.inText}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover Actions - Positioned at bottom right to avoid overlap */}
                        <div className="absolute bottom-2 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                          <button 
                            onClick={() => handleEditCitation(citation)}
                            className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4] transition-all shadow-sm" title={language === 'TH' ? "แก้ไข" : "Edit"}
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleCopyInTextCitation(citation.id, citation.inText)}
                            className={`h-7 w-7 flex items-center justify-center rounded-full border transition-all shadow-sm ${
                              inTextCopiedId === citation.id
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4]"
                            }`} 
                            title={language === 'TH' ? "คัดลอก In-text citation" : "Copy In-text citation"}
                          >
                            {inTextCopiedId === citation.id ? <Check className="h-3 w-3" /> : <Quote className="h-3 w-3" />}
                          </button>
                          <button 
                            onClick={() => handleItemCopy(citation.id)}
                            className={`h-7 w-7 flex items-center justify-center rounded-full border transition-all shadow-sm ${
                              copiedId === citation.id 
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400" 
                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4]"
                            }`} 
                            title="Copy"
                          >
                            {copiedId === citation.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <button 
                            onClick={() => deleteCitation(citation.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm" title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
                      <Library className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No citations yet</h3>
                    <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                      Search above or use the "Add new" button to start building your bibliography.
                    </p>
                  </div>
                )}
              </div>

              {/* Watermark/Footer on paper */}
              <div className="mt-auto py-8 text-center border-t border-zinc-50 dark:border-zinc-900/50">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-800 font-bold">Generated by Babybib</span>
              </div>
            </div>

          </div>
        </main>

        {/* Right Sidebar (Registration CTA) */}
        <aside className="hidden xl:sticky top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto py-6 xl:block xl:w-[240px] 2xl:w-[280px] pr-6 sm:pr-8 lg:pr-12">
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {language === 'TH' ? 'สมัครสมาชิกฟรี' : 'Join for Free'}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                {language === 'TH' 
                  ? 'สร้างบรรณานุกรมของคุณให้ปลอดภัย และเข้าถึงได้จากทุกที่ทุกเวลา' 
                  : 'Save your bibliographies securely and access them from anywhere, anytime.'}
              </p>
              <button className="w-full py-2.5 px-4 bg-[#f58e58] text-white text-[11px] font-bold rounded-full hover:bg-[#e67e43] transition-all shadow-sm active:scale-95 mb-5 group">
                {language === 'TH' ? 'รับสิทธิพิเศษตอนนี้' : 'Get exclusive access'} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              

            </div>
            
            <div className="p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 opacity-60">
               <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center italic leading-relaxed">
                 {language === 'TH' ? '"เครื่องมือที่ช่วยให้งานวิจัยของคุณง่ายขึ้น"' : '"The tool that makes your research easier"'}
               </p>
            </div>

          </div>
        </aside>

      </div>

      <AnimatePresence>
        {isDeletedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeletedModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-red-50/50 dark:bg-red-900/10">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                  </div>
                  {language === 'TH' ? 'รายการที่เตรียมลบถาวร (Deleted Items)' : 'Deleted Items'}
                  <span className="ml-1 text-[11px] font-bold text-red-600 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">{deletedCitations?.length || 0}</span>
                </h3>
                <button 
                  onClick={() => setIsDeletedModalOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                {(!deletedCitations || deletedCitations.length === 0) ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <Trash2 className="h-10 w-10 text-zinc-200 dark:text-zinc-800 mb-4" />
                    <p className="text-sm font-medium text-zinc-400">
                      {language === 'TH' ? 'ไม่มีรายการบรรณานุกรมในถังขยะ' : 'No deleted citations found'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <AnimatePresence>
                      {deletedCitations?.map((citation: any) => (
                        <motion.div 
                          key={citation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, height: 0 }}
                          className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 relative group flex items-start justify-between gap-4 shadow-sm hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                        >
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-1">
                            {citation.authors?.[0]?.lastName ? `${citation.authors[0].lastName}${citation.authors.length > 1 ? ' et al.' : ''} (${citation.year || 'n.d.'}). ${citation.title}` : citation.title}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-1.5 items-center shrink-0 mt-0.5">
                            <button 
                              onClick={() => restoreCitation(citation.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 text-zinc-500 rounded-lg transition-all shadow-sm" title={language === 'TH' ? 'กู้คืนกลับไปยังตาราง' : 'Restore'}
                            >
                              <RotateCw className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => permanentlyDeleteCitation(citation.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 text-zinc-500 rounded-lg transition-all shadow-sm" title={language === 'TH' ? 'ลบทิ้งถาวร 1 รายการ' : 'Delete Permanently'}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                  {language === 'TH' ? 'ระบบกู้คืนไฟล์' : 'Trash System'}
                </span>
                {deletedCitations?.length > 0 && (
                  <button 
                    onClick={async () => {
                      try {
                        await Promise.all(deletedCitations.map((c: any) => 
                          fetch(`/api/citations/${c.id}`, { method: 'DELETE' })
                        ));
                        mutateDeletedCitations();
                        toast.success(language === 'TH' ? 'เคลียร์ถังขยะเรียบร้อย' : 'Trash emptied');
                      } catch (e) {
                         console.error("Failed to empty trash", e);
                         toast.error("Failed to empty trash");
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 dark:text-red-400 font-bold transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg active:scale-95"
                  >
                    <Trash2 className="h-3 w-3" />
                    {language === 'TH' ? 'ล้างถังขยะทั้งหมด' : 'Empty Trash'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isArchivedProjectsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsArchivedProjectsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Archive className="h-4 w-4 text-zinc-500" />
                  </div>
                  {language === 'TH' ? 'คลังโปรเจกต์ (Archived Projects)' : 'Archived Projects'}
                  <span className="ml-1 text-[11px] font-bold text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{archivedProjects?.length || 0}</span>
                </h3>
                <button 
                  onClick={() => setIsArchivedProjectsModalOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                {(!archivedProjects || archivedProjects.length === 0) ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <Archive className="h-10 w-10 text-zinc-200 dark:text-zinc-800 mb-4" />
                    <p className="text-sm font-medium text-zinc-400">
                      {language === 'TH' ? 'ไม่มีโปรเจกต์ในคลัง' : 'No archived projects found'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {archivedProjects.map((project: any) => (
                      <div 
                        key={project.id}
                        className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${project.color}15` }}>
                            {React.cloneElement(iconComponents[project.icon] as React.ReactElement<any>, { className: "h-5 w-5", style: { color: project.color } })}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{project.name}</span>
                            <span className="text-[10px] text-zinc-500">{project.description || (language === 'TH' ? 'ไม่มีรายละเอียด' : 'No description')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleArchiveProject(project.id, false)}
                            className="h-8 w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 text-zinc-500 rounded-lg transition-all shadow-sm" title={language === 'TH' ? 'กู้คืน' : 'Restore'}
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="h-8 w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 text-zinc-500 rounded-lg transition-all shadow-sm" title={language === 'TH' ? 'ลบถาวร' : 'Delete Permanently'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditProjectModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </div>
                  {language === 'TH' ? 'แก้ไขโปรเจกต์' : 'Edit Project'}
                </h3>
                <button 
                  onClick={() => setIsEditProjectModalOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {language === 'TH' ? 'ชื่อโปรเจกต์' : 'Project Name'}
                  </label>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder={language === 'TH' ? 'ระบุชื่อโปรเจกต์...' : 'Enter project name...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {language === 'TH' ? 'รายละเอียด' : 'Description'}
                  </label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder={language === 'TH' ? 'ระบุรายละเอียดคร่าวๆ...' : 'Optional description...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                      {language === 'TH' ? 'ธีมสี' : 'Theme Color'}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {['#407bc4', '#f58e58', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#facc15', '#71717a'].map((color) => (
                        <button 
                          key={color}
                          onClick={() => setNewProject({...newProject, color})}
                          className={`h-7 w-7 rounded-full border-2 transition-transform active:scale-90 flex items-center justify-center ${newProject.color === color ? 'border-zinc-400 scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        >
                          {newProject.color === color && <Check className="h-3 w-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1 flex justify-between">
                      <span>{language === 'TH' ? 'ไอคอน' : 'Icon'}</span>
                    </label>
                    <div className="grid grid-cols-6 gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 max-h-32 overflow-y-auto custom-scrollbar">
                      {[
                        { id: 'BookOpen', icon: <BookOpen /> },
                        { id: 'Globe', icon: <Globe /> },
                        { id: 'FileText', icon: <FileText /> },
                        { id: 'Library', icon: <Library /> },
                        { id: 'Archive', icon: <Archive /> },
                        { id: 'Book', icon: <Book /> },
                        { id: 'Pencil', icon: <Pencil /> },
                        { id: 'Quote', icon: <Quote /> },
                        { id: 'Sparkles', icon: <Sparkles /> },
                        { id: 'Bot', icon: <Bot /> },
                        { id: 'Search', icon: <Search /> },
                        { id: 'Settings2', icon: <Settings2 /> },
                        { id: 'Briefcase', icon: <Briefcase /> },
                        { id: 'LayoutDashboard', icon: <LayoutDashboard /> },
                        { id: 'ShoppingCart', icon: <ShoppingCart /> },
                        { id: 'Smartphone', icon: <Smartphone /> },
                        { id: 'Heart', icon: <Heart /> },
                        { id: 'ShieldCheck', icon: <ShieldCheck /> },
                        { id: 'Info', icon: <Info /> },
                        { id: 'HelpCircle', icon: <HelpCircle /> },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setNewProject({...newProject, icon: item.id})}
                          className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all ${
                            newProject.icon === item.id 
                              ? 'bg-[#407bc4] text-white border-transparent scale-105 shadow-md ring-2 ring-[#407bc4]/20' 
                              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          {React.cloneElement(item.icon as React.ReactElement<any>, { className: "h-4 w-4" })}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsEditProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button 
                  onClick={handleUpdateProject}
                  className="px-6 py-2 rounded-xl bg-[#407bc4] text-white text-xs font-bold hover:bg-[#32629e] transition-all shadow-md active:scale-95"
                >
                  {language === 'TH' ? 'บันทึกการแก้ไข' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <div className="hidden">Archived Modals Spacer</div>
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#f58e58]/10 flex items-center justify-center">
                    <FilePlus className="h-4 w-4 text-[#f58e58]" />
                  </div>
                  {language === 'TH' ? 'สร้างโปรเจกต์ใหม่' : 'Create New Project'}
                </h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {/* Project Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {language === 'TH' ? 'ชื่อโปรเจกต์' : 'Project Name'}
                  </label>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder={language === 'TH' ? 'ระบุชื่อโปรเจกต์...' : 'Enter project name...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {language === 'TH' ? 'รายละเอียด' : 'Description'}
                  </label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder={language === 'TH' ? 'ระบุรายละเอียดคร่าวๆ...' : 'Optional description...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Color Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                      {language === 'TH' ? 'ธีมสี' : 'Theme Color'}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {['#407bc4', '#f58e58', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#facc15', '#71717a'].map((color) => (
                        <button 
                          key={color}
                          onClick={() => setNewProject({...newProject, color})}
                          className={`h-7 w-7 rounded-full border-2 transition-transform active:scale-90 flex items-center justify-center ${newProject.color === color ? 'border-zinc-400 scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        >
                          {newProject.color === color && <Check className="h-3 w-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1 flex justify-between">
                      <span>{language === 'TH' ? 'ไอคอน' : 'Icon'}</span>
                      <span className="text-[10px] lowercase opacity-60">Scroll for more</span>
                    </label>
                    <div className="grid grid-cols-6 gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 max-h-32 overflow-y-auto custom-scrollbar">
                      {[
                        { id: 'BookOpen', icon: <BookOpen /> },
                        { id: 'Globe', icon: <Globe /> },
                        { id: 'FileText', icon: <FileText /> },
                        { id: 'Library', icon: <Library /> },
                        { id: 'Archive', icon: <Archive /> },
                        { id: 'Book', icon: <Book /> },
                        { id: 'Pencil', icon: <Pencil /> },
                        { id: 'Quote', icon: <Quote /> },
                        { id: 'Sparkles', icon: <Sparkles /> },
                        { id: 'Bot', icon: <Bot /> },
                        { id: 'Search', icon: <Search /> },
                        { id: 'Settings2', icon: <Settings2 /> },
                        { id: 'Briefcase', icon: <Briefcase /> },
                        { id: 'LayoutDashboard', icon: <LayoutDashboard /> },
                        { id: 'ShoppingCart', icon: <ShoppingCart /> },
                        { id: 'Smartphone', icon: <Smartphone /> },
                        { id: 'Heart', icon: <Heart /> },
                        { id: 'ShieldCheck', icon: <ShieldCheck /> },
                        { id: 'Info', icon: <Info /> },
                        { id: 'HelpCircle', icon: <HelpCircle /> },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setNewProject({...newProject, icon: item.id})}
                          className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all ${
                            newProject.icon === item.id 
                              ? 'bg-[#407bc4] text-white border-transparent scale-105 shadow-md ring-2 ring-[#407bc4]/20' 
                              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          {React.cloneElement(item.icon as React.ReactElement<any>, { className: "h-4 w-4" })}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button 
                  onClick={handleCreateProject}
                  disabled={isCreatingProject || !newProject.name.trim()}
                  className="px-6 py-2 rounded-xl bg-[#f58e58] text-white text-xs font-bold hover:bg-[#e67e43] disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  {isCreatingProject ? (language === 'TH' ? 'กำลังสร้าง...' : 'Creating...') : (language === 'TH' ? 'สร้างโปรเจกต์' : 'Create Project')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#407bc4]/10 flex items-center justify-center">
                    <FileUp className="h-4 w-4 text-[#407bc4]" />
                  </div>
                  {language === 'TH' ? 'นำเข้าบรรณานุกรม' : 'Import Bibliography'}
                </h3>
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* RIS file */}
                <div className="flex flex-col gap-2">
                   <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                     .RIS file
                   </label>
                   <div className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-[#407bc4]/50 transition-all cursor-pointer">
                     <span className="text-xs text-zinc-500 overflow-hidden truncate">
                       {importRefFiles.ris || (language === 'TH' ? 'ยังไม่ได้เลือกไฟล์' : 'No file chosen')}
                     </span>
                     <button className="h-7 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 rounded-lg group-hover:bg-[#407bc4] group-hover:text-white group-hover:border-transparent transition-all">
                       {language === 'TH' ? 'เลือกไฟล์' : 'Choose file'}
                     </button>
                      <input 
                        type="file" accept=".ris" className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImportRefFiles({...importRefFiles, ris: file.name});
                            setImportRefFilesData({...importRefFilesData, ris: file});
                          }
                        }} 
                      />
                   </div>
                </div>

                {/* BibTeX file */}
                <div className="flex flex-col gap-2">
                   <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                     BibTeX file
                   </label>
                   <div className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-[#407bc4]/50 transition-all cursor-pointer">
                     <span className="text-xs text-zinc-500 overflow-hidden truncate">
                       {importRefFiles.bib || (language === 'TH' ? 'ยังไม่ได้เลือกไฟล์' : 'No file chosen')}
                     </span>
                     <button className="h-7 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 rounded-lg group-hover:bg-[#407bc4] group-hover:text-white group-hover:border-transparent transition-all">
                       {language === 'TH' ? 'เลือกไฟล์' : 'Choose file'}
                     </button>
                      <input 
                        type="file" accept=".bib,.bibtex" className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImportRefFiles({...importRefFiles, bib: file.name});
                            setImportRefFilesData({...importRefFilesData, bib: file});
                          }
                        }} 
                      />
                   </div>
                </div>

                {/* Load backup */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                   <label className="text-[11px] font-bold text-[#f58e58] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                     <RotateCw className="h-3 w-3" /> Load Backup
                   </label>
                   <div className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-[#f58e58]/50 transition-all cursor-pointer">
                     <span className="text-xs text-zinc-500 overflow-hidden truncate">
                       {importRefFiles.backup || (language === 'TH' ? 'ยังไม่ได้เลือกไฟล์' : 'No file chosen')}
                     </span>
                     <button className="h-7 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 rounded-lg group-hover:bg-[#f58e58] group-hover:text-white group-hover:border-transparent transition-all">
                       {language === 'TH' ? 'เลือกไฟล์' : 'Choose file'}
                     </button>
                     <input 
                       type="file" className="absolute inset-0 opacity-0 cursor-pointer" 
                       onChange={(e) => setImportRefFiles({...importRefFiles, backup: e.target.files?.[0]?.name || null})} 
                     />
                   </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                 <button 
                   onClick={handleImport}
                   className="px-8 py-2.5 rounded-xl bg-[#f58e58] text-white text-xs font-bold hover:bg-[#e67e43] transition-all shadow-md active:scale-95"
                 >
                   {language === 'TH' ? 'นำเข้าข้อมูล' : 'Import'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddCitationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddCitationModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-[#407bc4]/10 flex items-center justify-center">
                    {citationStep === 0 ? <Plus className="h-5 w-5 text-[#407bc4]" /> : <BookOpen className="h-5 w-5 text-[#407bc4]" />}
                  </div>
                  {citationStep === 0 
                    ? (language === 'TH' ? 'เลือกประเภททรัพยากร' : 'Select Resource Type')
                    : citationStep === 2 
                        ? (language === 'TH' ? 'ทรัพยากรเพิ่มเติม' : 'More Resources')
                        : (
                          <button 
                            onClick={() => setCitationStep(0)}
                            className="flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 -ml-2 rounded-lg transition-all text-left"
                          >
                            <span className="font-bold">
                              {language === 'TH' 
                                ? `กรอกข้อมูล: ${selectedType ? resourceLabels[selectedType]?.TH : 'บรรณานุกรม'}` 
                                : `Cite manually: ${selectedType ? resourceLabels[selectedType]?.EN : 'Citation'}`}
                            </span>
                            <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-[#407bc4]" />
                          </button>
                        )}
                </h3>
                <button 
                  onClick={() => setIsAddCitationModalOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {citationStep === 0 ? (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { id: 'book', icon: <Book className="h-6 w-6" />, label: { TH: 'หนังสือ', EN: 'Book' }, color: '#407bc4' },
                          { id: 'article', icon: <FileText className="h-6 w-6" />, label: { TH: 'วารสาร', EN: 'Journal' }, color: '#10b981' },
                          { id: 'website', icon: <Globe className="h-6 w-6" />, label: { TH: 'เว็บไซต์', EN: 'Website' }, color: '#f59e0b' },
                          { id: 'report', icon: <Library className="h-6 w-6" />, label: { TH: 'รายงาน', EN: 'Report' }, color: '#ef4444' },
                          { id: 'news', icon: <Newspaper className="h-6 w-6" />, label: { TH: 'ข่าวสาร', EN: 'News' }, color: '#8b5cf6' },
                          { id: 'more', icon: <Plus className="h-6 w-6" />, label: { TH: 'อื่นๆ', EN: 'More' }, color: '#f58e58' },
                        ].map((type) => (
                          <button 
                            key={type.id}
                            onClick={() => {
                              if (type.id === 'more') {
                                setCitationStep(2); // Step 2 for extended resource selection
                              } else {
                                setSelectedType(type.id);
                                setCitationStep(1);
                              }
                            }}
                            className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800 transition-all group scale-100 active:scale-95 shadow-sm hover:shadow-md h-full"
                            style={{ '--hover-color': type.color } as any}
                          >
                            <div 
                              className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:border-transparent transition-all shadow-sm"
                              style={{ color: type.color, backgroundColor: `${type.color}10` } as any}
                            >
                              {type.icon}
                            </div>
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                              {language === 'TH' ? type.label.TH : type.label.EN}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : citationStep === 2 ? (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
                    >
                      <div className="mb-6 sticky top-0 bg-white dark:bg-zinc-900 z-10 pb-2">
                        <div className="relative group/search">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/search:text-[#407bc4] transition-colors">
                            <Search className="h-4 w-4" />
                          </div>
                          <input 
                            type="text"
                            value={resourceSearch}
                            onChange={(e) => setResourceSearch(e.target.value)}
                            placeholder={language === 'TH' ? 'ค้นหาทรัพยากร...' : 'Search resources...'}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/10 focus:border-[#407bc4] transition-all"
                          />
                          {resourceSearch && (
                            <button 
                              onClick={() => setResourceSearch("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                              <X className="h-3 w-3 text-zinc-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'artwork', label: 'Artwork', icon: <Palette className="h-4 w-4" /> },
                          { id: 'blog', label: 'Blog Post', icon: <Hash className="h-4 w-4" /> },
                          { id: 'chapter', label: 'Book Chapter', icon: <Book className="h-4 w-4" /> },
                          { id: 'review', label: 'Book Review', icon: <Briefcase className="h-4 w-4" /> },
                          { id: 'conference', label: 'Conference Paper', icon: <FileText className="h-4 w-4" /> },
                          { id: 'db-article', label: 'Database Article', icon: <FileCode className="h-4 w-4" /> },
                          { id: 'dictionary', label: 'Dictionary Entry', icon: <Languages className="h-4 w-4" /> },
                          { id: 'ebook', label: 'E-book', icon: <Book className="h-4 w-4" /> },
                          { id: 'encyclopedia', label: 'Encyclopedia Entry', icon: <Library className="h-4 w-4" /> },
                          { id: 'film', label: 'Film/Movie', icon: <Film className="h-4 w-4" /> },
                          { id: 'image', label: 'Image', icon: <Palette className="h-4 w-4" /> },
                          { id: 'interview', label: 'Interview', icon: <Mic2 className="h-4 w-4" /> },
                          { id: 'journal', label: 'Journal Article', icon: <FileText className="h-4 w-4" /> },
                          { id: 'legal-bill', label: 'Legal Bill', icon: <Gavel className="h-4 w-4" /> },
                          { id: 'legal-case', label: 'Legal Case', icon: <Scale className="h-4 w-4" /> },
                          { id: 'legislation', label: 'Legislation', icon: <Gavel className="h-4 w-4" /> },
                          { id: 'magazine', label: 'Magazine Article', icon: <Newspaper className="h-4 w-4" /> },
                          { id: 'map', label: 'Map', icon: <MapIcon className="h-4 w-4" /> },
                          { id: 'news-article', label: 'News Article', icon: <Newspaper className="h-4 w-4" /> },
                          { id: 'patent', label: 'Patent', icon: <Award className="h-4 w-4" /> },
                          { id: 'personal', label: 'Personal Communication', icon: <Mail className="h-4 w-4" /> },
                          { id: 'regulation', label: 'Regulation', icon: <Check className="h-4 w-4" /> },
                          { id: 'song', label: 'Song', icon: <Music className="h-4 w-4" /> },
                          { id: 'speech', label: 'Speech', icon: <Mic2 className="h-4 w-4" /> },
                          { id: 'standard', label: 'Standard', icon: <Check className="h-4 w-4" /> },
                          { id: 'thesis', label: 'Thesis/Dissertation', icon: <Library className="h-4 w-4" /> },
                          { id: 'broadcast', label: 'TV/Radio Broadcast', icon: <Tv className="h-4 w-4" /> },
                          { id: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
                          { id: 'paste', label: 'Write/paste citation', icon: <ClipboardList className="h-4 w-4" /> },
                        ].filter(item => 
                          item.label.toLowerCase().includes(resourceSearch.toLowerCase())
                        ).map((item) => (
                           <button 
                             key={item.id}
                             onClick={() => {
                               setSelectedType(item.id);
                               setCitationStep(1);
                               setResourceSearch("");
                             }}
                             className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-left group"
                           >
                             <div className="text-zinc-400 group-hover:text-[#407bc4] transition-colors">
                               {item.icon}
                             </div>
                             <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 ">
                               {item.label}
                             </span>
                           </button>
                        ))}
                      </div>
                      {resourceSearch && ([
                        { id: 'artwork', label: 'Artwork' }, { id: 'blog', label: 'Blog Post' }, { id: 'chapter', label: 'Book Chapter' }, 
                        { id: 'review', label: 'Book Review' }, { id: 'conference', label: 'Conference Paper' }, { id: 'db-article', label: 'Database Article' }, 
                        { id: 'dictionary', label: 'Dictionary Entry' }, { id: 'ebook', label: 'E-book' }, { id: 'encyclopedia', label: 'Encyclopedia Entry' }, 
                        { id: 'film', label: 'Film/Movie' }, { id: 'image', label: 'Image' }, { id: 'interview', label: 'Interview' }, 
                        { id: 'journal', label: 'Journal Article' }, { id: 'legal-bill', label: 'Legal Bill' }, { id: 'legal-case', label: 'Legal Case' }, 
                        { id: 'legislation', label: 'Legislation' }, { id: 'magazine', label: 'Magazine Article' }, { id: 'map', label: 'Map' }, 
                        { id: 'news', label: 'News Article' }, { id: 'patent', label: 'Patent' }, { id: 'personal', label: 'Personal Communication' }, 
                        { id: 'regulation', label: 'Regulation' }, { id: 'song', label: 'Song' }, { id: 'speech', label: 'Speech' }, 
                        { id: 'standard', label: 'Standard' }, { id: 'thesis', label: 'Thesis/Dissertation' }, { id: 'broadcast', label: 'TV/Radio Broadcast' }, 
                        { id: 'video', label: 'Video' }, { id: 'paste', label: 'Write/paste citation' }
                      ].filter(i => i.label.toLowerCase().includes(resourceSearch.toLowerCase())).length === 0) && (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                          <Search className="h-8 w-8 mb-3 opacity-20" />
                          <p className="text-xs">{language === 'TH' ? 'ไม่พบทรัพยากรที่ค้นหา' : 'No resources found'}</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800"
                    >
                      {/* Form Section */}
                      <div className="flex-1 p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                {language === 'TH' ? 'รายการผู้แต่ง' : 'Authors'}
                              </label>
                            </div>

                            <div className="space-y-6">
                              {newCitationData.authors.map((author: any, index: number) => (
                                <div key={index} className="p-5 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative group/author">
                                  {/* Author Header with Condition */}
                                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                                    <span className="text-[10px] font-bold text-[#407bc4] uppercase tracking-widest">
                                      {language === 'TH' ? `ผู้แต่งคนที่ ${index + 1}` : `Author ${index + 1}`}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <label className="text-[9px] font-bold text-zinc-400 uppercase">
                                        {language === 'TH' ? 'เงื่อนไข' : 'Condition'}
                                      </label>
                                      <select 
                                        value={author.condition || 'general'}
                                        onChange={(e) => {
                                          const updated = [...newCitationData.authors];
                                          updated[index].condition = e.target.value;
                                          setNewCitationData({...newCitationData, authors: updated});
                                        }}
                                        className="text-[10px] font-bold text-white bg-[#407bc4] px-2 py-1 rounded-lg border-none focus:ring-0 cursor-pointer hover:bg-[#32629e] transition-colors shadow-sm"
                                      >
                                        <option value="general">{language === 'TH' ? 'ทั่วไป' : 'General'}</option>
                                        <option value="none">{language === 'TH' ? 'ไม่ปรากฏชื่อ' : 'No author'}</option>
                                        <option value="pseudonym">{language === 'TH' ? 'นามแฝง' : 'Pseudonym'}</option>
                                        <option value="royal">{language === 'TH' ? 'ราชสกุล / ฐานันดร' : 'Royal family'}</option>
                                        <option value="title">{language === 'TH' ? 'บรรดาศักดิ์' : 'Titled author'}</option>
                                        <option value="monk">{language === 'TH' ? 'พระสงฆ์' : 'Buddhist Monk'}</option>
                                        <option value="editor">{language === 'TH' ? 'บรรณาธิการ' : 'Editor'}</option>
                                        <option value="org">{language === 'TH' ? 'หน่วยงาน / สถาบัน' : 'Organization'}</option>
                                      </select>
                                    </div>
                                  </div>

                                  {author.condition !== 'none' && (
                                    <div className={`grid grid-cols-1 ${author.condition === 'org' ? 'sm:grid-cols-1' : 'sm:grid-cols-12'} gap-4`}>
                                      {/* Prefix for Royal, Title, Monk */}
                                      {(author.condition === 'royal' || author.condition === 'title' || author.condition === 'monk') && (
                                        <div className="sm:col-span-3 flex flex-col gap-1.5">
                                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-0.5">
                                            {author.condition === 'monk' ? (language === 'TH' ? 'สมณศักดิ์' : 'Ecclesiastical Title') : (language === 'TH' ? 'คำนำหน้า / ฐานันดร' : 'Prefix / Title')}
                                          </label>
                                          <input 
                                            type="text" 
                                            value={author.prefix || ''}
                                            onChange={(e) => {
                                              const updated = [...newCitationData.authors];
                                              updated[index].prefix = e.target.value;
                                              setNewCitationData({...newCitationData, authors: updated});
                                            }}
                                            placeholder={author.condition === 'royal' ? 'ม.ร.ว.' : (author.condition === 'monk' ? 'พระครู...' : 'คุณหญิง...')}
                                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                                          />
                                        </div>
                                      )}

                                      <div className={`${author.condition === 'org' ? '' : (author.condition === 'royal' || author.condition === 'title' || author.condition === 'monk' ? 'sm:col-span-3' : 'sm:col-span-4')} flex flex-col gap-1.5`}>
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-0.5">
                                          {author.condition === 'org' ? (language === 'TH' ? 'ชื่อหน่วยงาน' : 'Organization Name') : (language === 'TH' ? 'ชื่อ' : 'First Name')}
                                        </label>
                                        <input 
                                          type="text" 
                                          value={author.firstName}
                                          onChange={(e) => {
                                            const updated = [...newCitationData.authors];
                                            updated[index].firstName = e.target.value;
                                            setNewCitationData({...newCitationData, authors: updated});
                                          }}
                                          placeholder="..."
                                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                                        />
                                      </div>

                                      {author.condition !== 'org' && (
                                        <>
                                          <div className={`${author.condition === 'royal' || author.condition === 'title' || author.condition === 'monk' ? 'sm:col-span-3' : 'sm:col-span-4'} flex flex-col gap-1.5`}>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-0.5">
                                              {language === 'TH' ? 'ชื่อกลาง' : 'Middle Name'}
                                            </label>
                                            <input 
                                              type="text" 
                                              value={author.middleName}
                                              onChange={(e) => {
                                                const updated = [...newCitationData.authors];
                                                updated[index].middleName = e.target.value;
                                                setNewCitationData({...newCitationData, authors: updated});
                                              }}
                                              placeholder="..."
                                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                                            />
                                          </div>
                                          <div className={`${author.condition === 'royal' || author.condition === 'title' || author.condition === 'monk' ? 'sm:col-span-3' : 'sm:col-span-4'} flex flex-col gap-1.5`}>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-0.5">
                                              {language === 'TH' ? 'นามสกุล' : 'Last Name'}
                                            </label>
                                            <input 
                                              type="text" 
                                              value={author.lastName}
                                              onChange={(e) => {
                                                const updated = [...newCitationData.authors];
                                                updated[index].lastName = e.target.value;
                                                setNewCitationData({...newCitationData, authors: updated});
                                              }}
                                              placeholder="..."
                                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                                            />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {author.condition === 'none' && (
                                    <div className="flex items-center justify-center py-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                      <p className="text-[10px] font-bold text-zinc-400 italic">
                                        {language === 'TH' ? 'ระบุว่าไม่ทราบชื่อผู้แต่ง' : 'Marked as unknown author'}
                                      </p>
                                    </div>
                                  )}

                                  {newCitationData.authors.length > 1 && (
                                    <button 
                                      onClick={() => {
                                        const updated = newCitationData.authors.filter((_: any, i: number) => i !== index);
                                        setNewCitationData({...newCitationData, authors: updated});
                                      }}
                                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center shadow-md opacity-0 group-hover/author:opacity-100 transition-all z-10"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                                <button 
                                  onClick={() => {
                                    setNewCitationData({
                                      ...newCitationData, 
                                      authors: [...newCitationData.authors, { firstName: "", middleName: "", lastName: "", prefix: "", condition: "general" }]
                                    });
                                  }}
                                  className="w-full py-2.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-500 hover:text-[#407bc4] hover:border-[#407bc4] hover:bg-[#407bc4]/5 transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                {language === 'TH' ? 'ปีที่พิมพ์' : 'Year'}
                              </label>
                              <input 
                                type="text" 
                                value={newCitationData.year}
                                onChange={(e) => setNewCitationData({...newCitationData, year: e.target.value})}
                                placeholder="2024"
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                {language === 'TH' ? 'แหล่งที่มา' : 'Source'}
                              </label>
                              <input 
                                type="text" 
                                value={newCitationData.source}
                                onChange={(e) => setNewCitationData({...newCitationData, source: e.target.value})}
                                placeholder={language === 'TH' ? 'ชื่อวารสาร / สำนักพิมพ์...' : 'Journal / Publisher...'}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                              {language === 'TH' ? 'ชื่อเรื่อง' : 'Title'}
                            </label>
                            <input 
                              type="text" 
                              value={newCitationData.title}
                              onChange={(e) => setNewCitationData({...newCitationData, title: e.target.value})}
                              placeholder={language === 'TH' ? 'ชื่อบทความหรือหนังสือ...' : 'Article or Book title...'}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                              URL / DOI
                            </label>
                            <input 
                              type="text" 
                              value={newCitationData.url}
                              onChange={(e) => setNewCitationData({...newCitationData, url: e.target.value})}
                              placeholder="https://..."
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preview Section */}
                      <div className="w-full md:w-[380px] bg-zinc-50/50 dark:bg-zinc-800/30 p-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> {language === 'TH' ? 'พรีวิว' : 'Live Preview'}
                          </span>
                          <div className="relative">
                            <button 
                              onClick={() => setIsStyleOpen(!isStyleOpen)}
                              className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase tracking-tighter shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
                            >
                              {style}
                              <ChevronDown className={`h-3 w-3 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isStyleOpen && (
                              <div className="absolute top-full right-0 mt-1 w-48 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-[60] overflow-hidden flex flex-col">
                                <div className="py-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                  {styles.map((s: string) => (
                                    <button
                                      key={s}
                                      onClick={() => {
                                        setStyle(s);
                                        setIsStyleOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${style === s ? 'text-[#407bc4] font-bold bg-zinc-50 dark:bg-zinc-800/50' : 'text-zinc-600 dark:text-zinc-400'}`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bibliography Preview */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between ml-1">
                            <span className="text-[10px] font-bold text-zinc-400">{language === 'TH' ? 'บรรณานุกรม' : 'Bibliography'}</span>
                            <button 
                              onClick={() => {
                                setCopiedBib(true);
                                setTimeout(() => setCopiedBib(false), 2000);
                              }}
                              className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                              {copiedBib ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-zinc-400" />}
                            </button>
                          </div>
                          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[100px] flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <FileText className="h-3 w-3 text-zinc-300" />
                            </div>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic-preview">
                              {newCitationData.authors.every((a: any) => a.condition === 'none') 
                                ? "No author" 
                                : newCitationData.authors.map((a: any, i: number) => {
                                    if (a.condition === 'none') return '';
                                    if (a.condition === 'org') return a.firstName + (i < newCitationData.authors.length - 1 ? ', & ' : '');
                                    
                                    const prefix = a.prefix ? a.prefix + ' ' : '';
                                    const first = a.firstName ? a.firstName.charAt(0) + '.' : '';
                                    const middle = a.middleName ? ' ' + a.middleName.charAt(0) + '.' : '';
                                    const last = a.lastName || '';
                                    if (!last && !first) return i === 0 ? "Author, A. A." : "";
                                    const name = `${prefix}${last}${first || middle ? ', ' : ''}${first}${middle}`;
                                    return name + (i < newCitationData.authors.length - 1 ? ', & ' : '');
                                  }).join('')
                              }
                              {newCitationData.year ? ` (${newCitationData.year}). ` : " (Year). "} 
                              <span className="italic">
                                {newCitationData.title ? newCitationData.title : "Title of the work."}
                              </span>
                              {newCitationData.source ? `. ${newCitationData.source}.` : ". Publisher/Source."}
                            </p>
                          </div>
                        </div>

                        {/* In-text Preview */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between ml-1">
                            <span className="text-[10px] font-bold text-zinc-400">{language === 'TH' ? 'การอ้างอิงในเนื้อหา' : 'In-text citation'}</span>
                            <button 
                              onClick={() => {
                                setCopiedInText(true);
                                setTimeout(() => setCopiedInText(false), 2000);
                              }}
                              className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                              {copiedInText ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-zinc-400" />}
                            </button>
                          </div>
                          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[60px] flex items-center relative group">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Quote className="h-3 w-3 text-zinc-300" />
                            </div>
                            <p className="text-sm font-medium text-[#407bc4] dark:text-[#6ba1e6]">
                              ({newCitationData.authors.every((a: any) => a.condition === 'none') 
                                ? (newCitationData.title?.split(' ').slice(0, 3).join(' ') || "Title") 
                                : (newCitationData.authors[0].condition === 'org' ? newCitationData.authors[0].firstName : (newCitationData.authors[0].lastName || "Author"))} 
                               {newCitationData.authors.filter((a: any) => a.condition !== 'none').length > 1 ? " et al." : ""}, 
                               {newCitationData.year || "Year"})
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-8 py-5 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-4">
                {(citationStep === 1 || citationStep === 2) && (
                  <button 
                    onClick={() => {
                      setCitationStep(0);
                      setResourceSearch("");
                    }}
                    className="mr-auto flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#407bc4] hover:bg-[#407bc4]/5 rounded-xl transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> {language === 'TH' ? 'ย้อนกลับ' : 'Back'}
                  </button>
                )}
                
                <button 
                  onClick={() => setIsAddCitationModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  {language === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                
                {citationStep === 1 && (
                  <button 
                    onClick={handleSaveManualCitation}
                    className="px-8 py-2.5 rounded-xl bg-[#407bc4] text-white text-sm font-bold hover:bg-[#32629e] transition-all shadow-lg active:scale-95"
                  >
                    {language === 'TH' ? 'บันทึกรายการ' : 'Save Citation'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
