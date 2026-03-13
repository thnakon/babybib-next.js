"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { UserNav } from "@/components/user-nav";
import { UsageLimit } from "@/components/usage-limit";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { 
  BookOpen, Triangle, Pencil, Copy, ChevronDown, Check,
  ArrowLeft, ArrowRight, RotateCw, SlidersHorizontal, AlignLeft, Plus,
  FileText, Globe, Smartphone, Bot, ShoppingCart, LayoutDashboard, Briefcase, Library,
  Heart, ShieldCheck, Search, HelpCircle, Book, Download, FileJson, FileCode, FileSpreadsheet,
  List, LayoutList, Settings2, Info, Trash2, Quote, GripVertical, Sparkles, Archive, MoreVertical, 
  Type, ChevronRight, X, FilePlus, FileUp, Eye, Palette, Hash, Scale, Gavel, Mic2, Tv, Film, Music, Award, Mail, MessageSquare, Map as MapIcon, Languages, Newspaper, Video, ClipboardList, Star, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import useSWR from 'swr';
import { toast } from "sonner";
import { 
  exportToBibTeX, 
  exportToRIS, 
  exportToWord, 
  exportToPDF 
} from "@/lib/export-utils";
import { checkRateLimit } from "@/lib/rate-limiter";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GeneratePage() {
  const { language } = useLanguage();
  const t = t;
  const { data: session } = useSession();
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

  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<any>(null);
  const [deleteConfirmName, setDeleteConfirmName] = React.useState("");

  // Smart Search State
  const [mainSearchQuery, setMainSearchQuery] = React.useState("");
  const [isMainSearchDropdownOpen, setIsMainSearchDropdownOpen] = React.useState(false);
  const [isMainSearching, setIsMainSearching] = React.useState(false);
  const [mainSearchResults, setMainSearchResults] = React.useState<any[]>([]);
  const [localCitations, setLocalCitations] = React.useState<any[]>([]);
  const [localProjects, setLocalProjects] = React.useState<any[]>([
    { id: 1, name: t.myProjects, icon: "BookOpen", color: "#407bc4" }
  ]);
  const [activeProjectId, setActiveProjectId] = React.useState<number | null>(null);

  // Load guest data on mount or session change
  React.useEffect(() => {
    if (!session) {
      const storedCitations = localStorage.getItem("babybib_citations");
      const storedProjects = localStorage.getItem("babybib_projects");
      
      if (storedCitations) {
        setLocalCitations(JSON.parse(storedCitations));
      }
      
      if (storedProjects) {
        try {
          const parsed = JSON.parse(storedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLocalProjects(parsed);
          } else {
            const defaultProject = { id: 1, name: t.myProjects, icon: "BookOpen", color: "#407bc4" };
            setLocalProjects([defaultProject]);
            localStorage.setItem("babybib_projects", JSON.stringify([defaultProject]));
          }
        } catch (e) {
          console.error("Error parsing stored projects", e);
        }
      } else {
        const defaultProject = { id: 1, name: t.myProjects, icon: "BookOpen", color: "#407bc4" };
        setLocalProjects([defaultProject]);
        localStorage.setItem("babybib_projects", JSON.stringify([defaultProject]));
      }
    }
  }, [session]);

  // Reset active project when auth state changes
  React.useEffect(() => {
    setActiveProjectId(null);
  }, [session?.user?.email]);

  // Helper to save guest data
  const saveGuestData = (citations: any[], projects: any[]) => {
    localStorage.setItem("babybib_citations", JSON.stringify(citations));
    localStorage.setItem("babybib_projects", JSON.stringify(projects));
  };

  const paperRef = React.useRef<HTMLDivElement>(null);

  const mockSearchResults = [
    { id: '1', title: 'The Design of Everyday Things', authors: [{ firstName: 'Donald', middleName: 'A.', lastName: 'Norman' }], year: '2013', source: 'Basic Books', type: 'book' },
    { id: '2', title: 'Sapiens: A Brief History of Humankind', authors: [{ firstName: 'Yuval', middleName: 'Noah', lastName: 'Harari' }], year: '2015', source: 'Harper', type: 'book' },
    { id: '3', title: 'A Brief History of Time', authors: [{ firstName: 'Stephen', middleName: '', lastName: 'Hawking' }], year: '1988', source: 'Bantam Books', type: 'book' },
    { id: '4', title: 'The Elements of Typographic Style', authors: [{ firstName: 'Robert', middleName: '', lastName: 'Bringhurst' }], year: '1992', source: 'Hartley & Marks', type: 'book' },
    { id: '5', title: 'Historical Analysis of Design Patterns', authors: [{ firstName: 'Jane', middleName: '', lastName: 'Doe' }], year: '2020', source: 'Journal of Software Engineering', type: 'article' },
  ];

  const handleMainSearch = async (query: string) => {
    setMainSearchQuery(query);
    if (query.trim().length > 2) {
      if (!checkRateLimit()) {
        toast.error(t.toasts.rateLimit);
        return;
      }
      setIsMainSearching(true);
      setIsMainSearchDropdownOpen(true);
      
      try {
        const res = await fetch(`/api/smart-search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setMainSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsMainSearching(false);
      }
    } else {
      setMainSearchResults([]);
      setIsMainSearchDropdownOpen(false);
    }
  };

  const handleSelectSearchResult = async (item: any) => {
    if (!activeProjectId) {
      toast.error(t.toasts.selectProject);
      return;
    }

    if (!session) {
      // Enforce guest limit (Global)
      if (localCitations.length >= 5) {
        toast.error(
          t.toasts.guestLimit, 
          {
            action: {
              label: translations[language].usage.signUp,
              onClick: () => window.location.href = '/signup'
            },
            duration: 5000
          }
        );
        return;
      }

      const newLocalCitation = {
        id: Date.now(), // Use timestamp as local ID
        projectId: activeProjectId,
        type: item.type,
        authors: item.authors,
        year: item.year?.toString() || "",
        title: item.title,
        source: item.source,
        url: item.url || "",
        createdAt: new Date().toISOString()
      };

      const updatedCitations = [...localCitations, newLocalCitation];
      setLocalCitations(updatedCitations);
      saveGuestData(updatedCitations, localProjects);
      
      setHighlightedId(newLocalCitation.id);
      setTimeout(() => setHighlightedId(null), 3000);
      toast.success(t.toasts.added);
      setIsMainSearchDropdownOpen(false);
      setMainSearchQuery("");
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
        // Optimistic update
        mutateCitations([...citations, newCitation], false);
        setHighlightedId(newCitation.id);
        setTimeout(() => setHighlightedId(null), 3000);
        toast.success(t.toasts.added);
      } else {
        throw new Error("Failed to save citation");
      }
    } catch (error) {
      console.error(error);
      toast.error(t.toasts.importError);
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
    if (!session) {
      toast(
        translations[language].usage.signInPrompt,
        {
          action: {
            label: translations[language].usage.signUp,
            onClick: () => window.location.href = '/signup'
          },
          duration: 5000
        }
      );
      return;
    }

    if (!activeProjectId) {
      toast.error(t.toasts.selectProject);
      return;
    }

    const loaders = [];
    if (importRefFilesData.ris) loaders.push({ file: importRefFilesData.ris, parser: parseRIS, type: 'RIS' });
    if (importRefFilesData.bib) loaders.push({ file: importRefFilesData.bib, parser: parseBibTeX, type: 'BibTeX' });

    if (loaders.length === 0) {
      toast.error(t.toasts.selectFile);
      return;
    }

    toast.loading(t.toasts.importing);

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
      toast.success(t.toasts.importSuccess.replace('{count}', totalImported.toString()));
    } catch (err) {
      toast.dismiss();
      toast.error(t.toasts.importError);
    }
  };

  const resourceLabels: Record<string, { TH: string, EN: string, ZH: string }> = {
    book: { TH: 'หนังสือ', EN: 'Book', ZH: '图书' },
    article: { TH: 'วารสาร', EN: 'Journal', ZH: '期刊' },
    website: { TH: 'เว็บไซต์', EN: 'Website', ZH: '网站' },
    report: { TH: 'รายงาน', EN: 'Report', ZH: '报告' },
    news: { TH: 'ข่าวสาร', EN: 'News', ZH: '新闻' },
    artwork: { TH: 'งานศิลปะ', EN: 'Artwork', ZH: '艺术品' },
    blog: { TH: 'บล็อกโพสต์', EN: 'Blog Post', ZH: '博客文章' },
    chapter: { TH: 'บทในหนังสือ', EN: 'Book Chapter', ZH: '书章节' },
    review: { TH: 'บทวิจารณ์หนังสือ', EN: 'Book Review', ZH: '书评' },
    conference: { TH: 'เอกสารการประชุม', EN: 'Conference Paper', ZH: '会议论文' },
    'db-article': { TH: 'บทความฐานข้อมูล', EN: 'Database Article', ZH: '数据库文章' },
    dictionary: { TH: 'พจนานุกรม', EN: 'Dictionary Entry', ZH: '词典条目' },
    ebook: { TH: 'อีบุ๊ก', EN: 'E-book', ZH: '电子书' },
    encyclopedia: { TH: 'สารานุกรม', EN: 'Encyclopedia Entry', ZH: '百科全书条目' },
    film: { TH: 'ภาพยนตร์', EN: 'Film/Movie', ZH: '电影' },
    image: { TH: 'รูปภาพ', EN: 'Image', ZH: '图像' },
    interview: { TH: 'บทสัมภาษณ์', EN: 'Interview', ZH: '访谈' },
    journal: { TH: 'บทความวารสาร', EN: 'Journal Article', ZH: '期刊文章' },
    'legal-bill': { TH: 'ร่างกฎหมาย', EN: 'Legal Bill', ZH: '法律法案' },
    'legal-case': { TH: 'คดีความ', EN: 'Legal Case', ZH: '法律案例' },
    legislation: { TH: 'กฎหมาย', EN: 'Legislation', ZH: '立法' },
    magazine: { TH: 'บทความนิตยสาร', EN: 'Magazine Article', ZH: '杂志文章' },
    map: { TH: 'แผนที่', EN: 'Map', ZH: '地图' },
    'news-article': { TH: 'บทความข่าว', EN: 'News Article', ZH: '新闻文章' },
    patent: { TH: 'สิทธิบัตร', EN: 'Patent', ZH: '专利' },
    personal: { TH: 'การสื่อสารส่วนตัว', EN: 'Personal Communication', ZH: '个人通讯' },
    regulation: { TH: 'ระเบียบข้อบังคับ', EN: 'Regulation', ZH: '规章' },
    song: { TH: 'เพลง', EN: 'Song', ZH: '歌曲' },
    speech: { TH: 'สุนพรพจน์', EN: 'Speech', ZH: '演讲' },
    standard: { TH: 'มาตรฐาน', EN: 'Standard', ZH: '标准' },
    thesis: { TH: 'วิทยานิพนธ์', EN: 'Thesis/Dissertation', ZH: '论文/学位论文' },
    broadcast: { TH: 'รายการทีวี/วิทยุ', EN: 'TV/Radio Broadcast', ZH: '电视/广播' },
    video: { TH: 'วิดีโอ', EN: 'Video', ZH: '视频' },
    paste: { TH: 'เขียน/วางบรรณานุกรม', EN: 'Write/paste citation', ZH: '键入/粘贴引文' },
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
      toast.error(t.toasts.selectProject);
      return;
    }
    
    // basic validation
    if (!newCitationData.title || newCitationData.authors.every((a: any) => !a.lastName && !a.firstName)) {
      toast.error(t.toasts.fillRequired);
      return;
    }

    if (!session) {
      if (!editingCitationId && localCitations.length >= 5) {
        toast.error(
          t.toasts.guestLimit,
          {
            action: {
              label: translations[language].usage.signUp,
              onClick: () => window.location.href = '/signup'
            },
            duration: 5000
          }
        );
        return;
      }

      let updatedCitations;
      let targetId = editingCitationId;

      if (editingCitationId) {
        updatedCitations = localCitations.map(c => 
          c.id === editingCitationId ? {
            ...c,
            type: selectedType || 'book',
            authors: newCitationData.authors,
            year: newCitationData.year,
            title: newCitationData.title,
            source: newCitationData.source,
            url: newCitationData.url
          } : c
        );
      } else {
        targetId = Date.now();
        const newLocalCitation = {
          id: targetId,
          projectId: activeProjectId,
          type: selectedType || 'book',
          authors: newCitationData.authors,
          year: newCitationData.year,
          title: newCitationData.title,
          source: newCitationData.source,
          url: newCitationData.url,
          createdAt: new Date().toISOString()
        };
        updatedCitations = [...localCitations, newLocalCitation];
      }

      setLocalCitations(updatedCitations);
      saveGuestData(updatedCitations, localProjects);
      
      setHighlightedId(targetId);
      setTimeout(() => setHighlightedId(null), 3000);
      setIsAddCitationModalOpen(false);
      setEditingCitationId(null);
      toast.success(editingCitationId 
        ? t.toasts.updated
        : t.toasts.added
      );
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
        // Optimistic update
        if (editingCitationId) {
          mutateCitations(citations.map((c: any) => c.id === editingCitationId ? savedCitation : c), false);
        } else {
          mutateCitations([...citations, savedCitation], false);
        }
        
        setHighlightedId(savedCitation.id);
        setTimeout(() => setHighlightedId(null), 3000);
        setIsAddCitationModalOpen(false);
        setEditingCitationId(null);
        toast.success(editingCitationId 
          ? t.toasts.updated
          : t.toasts.added
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error(t.toasts.importError);
    }
  };
  
  // Guest Data Expiration Logic (1 Day)
  React.useEffect(() => {
    if (!session) {
      const guestStartedAt = localStorage.getItem("babybib_guest_started_at");
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      if (!guestStartedAt) {
        localStorage.setItem("babybib_guest_started_at", now.toString());
      } else if (now - parseInt(guestStartedAt) > ONE_DAY) {
        // Clear guest data
        localStorage.removeItem("babybib_citations");
        localStorage.removeItem("babybib_projects");
        setLocalCitations([]);
        setLocalProjects([{ id: 1, name: t.myProjects, icon: "BookOpen", color: "#407bc4" }]);
        localStorage.setItem("babybib_guest_started_at", now.toString());
        toast.info(t.toasts.securityReset);
      }
    }
  }, [session, language]);

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
    const rawCitations = session 
      ? citations 
      : localCitations.filter(c => c.projectId === activeProjectId);

    let result = rawCitations.map((c: any) => ({
      id: c.id,
      original: c,
      ...getFormattedCitation(c, style)
    }));

    // Data Expiration filtering (1 Year for members)
    if (session) {
      const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      result = result.filter((c: any) => {
        const addedDate = c.original.createdAt ? new Date(c.original.createdAt).getTime() : now;
        return now - addedDate < ONE_YEAR;
      });
    }
    
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
  }, [citations, localCitations, session, activeProjectId, style, searchReferencesQuery, settings.sortBy]);

  // Drag and Drop State
  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  const handleSort = () => {
    // Disabled sort dragging for now, as order needs to sync with backend optionally
  };

  // Toast handling removed in favor of sonner


  const deleteCitation = async (id: number) => {
    if (!session) {
      const updatedCitations = localCitations.filter(c => c.id !== id);
      setLocalCitations(updatedCitations);
      saveGuestData(updatedCitations, localProjects);
      toast.success(t.toasts.deleted);
      return;
    }

    try {
      const res = await fetch(`/api/citations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
      });
      if (res.ok) {
        // Optimistic update: remove from citations, add to deletedCitations if available
        mutateCitations(citations.filter((c: any) => c.id !== id), false);
        mutateDeletedCitations();
        toast.success(t.toasts.movedToTrash);
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
        const restoredCitation = await res.json();
        // Optimistic update
        mutateCitations([...citations, restoredCitation], false);
        mutateDeletedCitations(deletedCitations.filter((c: any) => c.id !== id), false);
        toast.success(t.toasts.restored);
      }
    } catch (e) { console.error(e) }
  };
  
  const permanentlyDeleteCitation = async (id: number) => {
    try {
      const res = await fetch(`/api/citations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutateDeletedCitations();
        toast.warning(t.toasts.permanentlyDeleted);
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
    const headerPlain = t.viewBibliography;
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
      toast.success(t.toasts.added); // Assuming added success message or create a generic one
    }
  };

  const handleItemCopy = async (id: number) => {
    const citation = processedCitations.find((c: any) => c.id === id);
    if (!citation) return;
    
    const success = await copyRichText(citation.html, citation.plainText);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success(t.toasts.copiedBib);
    }
  };

  const handleCopyInTextCitation = async (id: number, text: string) => {
    // In-text citations are usually not italicized in most styles, but we can wrap them in rich text anyway
    const success = await copyRichText(`<span>${text}</span>`, text);
    if (success) {
      setInTextCopiedId(id);
      setTimeout(() => setInTextCopiedId(null), 2000);
      toast.success(t.toasts.copiedInText);
    }
  };

  const styles = ["APA - 7th Edition", "MLA - 9th Edition", "Harvard", "Chicago", "AMA", "CSE"];
  
  const views = [
    { id: "Plain list", icon: <List className="h-4 w-4" />, label: t.plainList },
    { id: "Bibliography", icon: <FileText className="h-4 w-4" />, label: t.viewBibliography },
    { id: "Bibliography and in-text citations", icon: <LayoutList className="h-4 w-4" />, label: t.bibliographyAndInText },
  ];

  const handleExport = async (format: string) => {
    if (!session) {
      toast(
        translations[language].usage.signInPrompt,
        {
          action: {
            label: translations[language].usage.signUp,
            onClick: () => window.location.href = '/signup'
          },
          duration: 5000
        }
      );
      return;
    }

    if (processedCitations.length === 0) {
      toast.error(t.toasts.noCitationsToExport);
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
      toast.success(t.toasts.exportSuccess);
    } catch (err) {
      console.error(err);
      toast.error(t.toasts.exportError);
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

  const { data: fetchedProjects, mutate: mutateProjects } = useSWR<any[]>('/api/projects?isArchived=false', fetcher);
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

  const displayProjects = React.useMemo(() => {
    if (session) {
      return fetchedProjects || [];
    }
    return localProjects || [];
  }, [session, fetchedProjects, localProjects]);

  const projects = displayProjects.map((p: any) => ({
    id: p.id,
    name: p.name,
    icon: iconComponents[p.icon] ? React.cloneElement(iconComponents[p.icon] as React.ReactElement<any>, { className: "h-3 w-3 shrink-0" }) : <BookOpen className="h-3 w-3 shrink-0" />,
    color: p.color,
    active: activeProjectId === p.id || (activeProjectId === null && displayProjects.length > 0 && displayProjects[0].id === p.id),
  }));

  React.useEffect(() => {
    const projectIds = displayProjects.map((p: any) => p.id);
    if ((activeProjectId === null || !projectIds.includes(activeProjectId)) && displayProjects.length > 0) {
      setActiveProjectId(displayProjects[0].id);
    }
  }, [displayProjects, activeProjectId]);

  // Auto-create default project for users if none exist on first load
  const [hasCheckedDefaultProject, setHasCheckedDefaultProject] = React.useState(false);

  React.useEffect(() => {
    if (session && fetchedProjects && fetchedProjects.length === 0 && !isCreatingProject && !hasCheckedDefaultProject) {
      setHasCheckedDefaultProject(true);
      const createDefault = async () => {
        setIsCreatingProject(true);
        try {
              await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: t.myProjects,
              description: t.defaultProjectDescription,
              color: "#407bc4",
              icon: "BookOpen"
            })
          });
          mutateProjects();
        } catch (e) {
          console.error(e);
          toast.error(t.toasts.defaultProjectError);
        } finally {
          setIsCreatingProject(false);
        }
      };
      createDefault();
    } else if (fetchedProjects && fetchedProjects.length > 0) {
      setHasCheckedDefaultProject(true);
    }
  }, [session, fetchedProjects, language, isCreatingProject, mutateProjects, hasCheckedDefaultProject]);

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;

    if (!session) {
      if (localProjects.length >= 1) {
        toast.error(
          t.toasts.guestLimit,
          {
            action: {
              label: translations[language].usage.signUp,
              onClick: () => window.location.href = '/signup'
            },
            duration: 5000
          }
        );
        return;
      }

      const newLocalProject = {
        ...newProject,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      const updatedProjects = [...localProjects, newLocalProject];
      setLocalProjects(updatedProjects);
      saveGuestData(localCitations, updatedProjects);
      setActiveProjectId(newLocalProject.id);
      setIsCreateModalOpen(false);
      setNewProject({ name: "", description: "", color: "#407bc4", icon: "BookOpen" });
      toast.success(t.toasts.added);
      return;
    }

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
        toast.success(t.toasts.added);
      }
    } catch (e) {
      console.error(e);
      toast.error(t.toasts.error);
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
        toast.success(isArchived ? t.toasts.projectArchived : t.toasts.projectRestored);
      }
    } catch (e) { console.error(e) }
  };

  const handleDuplicateProject = async (id: number) => {
    if (!session) {
      toast(
        translations[language].usage.signInPrompt,
        {
          action: {
            label: translations[language].usage.signUp,
            onClick: () => window.location.href = '/signup'
          },
          duration: 5000
        }
      );
      return;
    }
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        mutateProjects();
        toast.success(t.toasts.projectDuplicated);
      }
    } catch (e) { console.error(e) }
  };

  const handleEditProjectClick = (p: any) => {
    const raw = (fetchedProjects || []).find((pf: any) => pf.id === p.id) || archivedProjects.find((pf: any) => pf.id === p.id);
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

    if (!session) {
      const updatedProjects = localProjects.map(p => 
        p.id === editingProject.id ? { ...p, ...newProject } : p
      );
      setLocalProjects(updatedProjects);
      saveGuestData(localCitations, updatedProjects);
      setIsEditProjectModalOpen(false);
      setEditingProject(null);
      toast.success(t.toasts.updated);
      return;
    }

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
        toast.success(t.toasts.updated);
      }
    } catch (e) { console.error(e) }
  };

  const handleDeleteProject = async (id: number) => {
    if (!session) {
      const updatedProjects = localProjects.filter(p => p.id !== id);
      const updatedCitations = localCitations.filter(c => c.projectId !== id);
      setLocalProjects(updatedProjects);
      setLocalCitations(updatedCitations);
      saveGuestData(updatedCitations, updatedProjects);
      if (activeProjectId === id) setActiveProjectId(null);
      toast.success(t.toasts.deleted);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutateProjects();
        mutateArchivedProjects();
        toast.success(t.toasts.deleted);
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
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 flex w-full h-16 items-center justify-between px-6 sm:px-8 lg:px-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100/50 dark:border-zinc-800/50 shadow-sm"
      >
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
          <UserNav />
        </div>
      </motion.nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex w-full max-w-screen-2xl items-start"
      >
        
        <motion.aside 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-transparent py-6 pr-6 md:sticky md:block lg:py-8 md:w-[240px] lg:w-[280px] pl-6 sm:pl-8 lg:pl-12"
        >
          <div className="flex flex-col gap-6">

            <div className="relative group mx-auto">
              <button 
                onMouseEnter={() => setIsAddTooltipVisible(true)}
                onMouseLeave={() => setIsAddTooltipVisible(false)}
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-8 w-32 items-center justify-center gap-1.5 rounded-md bg-[#f58e58] text-xs font-medium text-white hover:bg-[#e67e43] active:scale-95 transition-all shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> {t.newProject}
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
                <span className="text-sm font-semibold">{translations[language].usage.projects}</span>
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
                                { id: 'edit', label: t.form.title, icon: <Pencil className="h-4 w-4" /> },
                                { id: 'duplicate', label: 'Duplicate', icon: <Copy className="h-4 w-4" /> },
                                { id: 'archive', label: t.archive, icon: <Archive className="h-4 w-4" /> },
                                { id: 'delete', label: t.deleteTitle, icon: <Trash2 className="h-4 w-4" />, color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProjectMenuIdx(null);
                                    if (option.id === 'archive') {
                                      if (!session) {
                                        toast(
                                          translations[language].usage.signInPrompt,
                                          {
                                            action: {
                                              label: translations[language].usage.signUp,
                                              onClick: () => window.location.href = '/signup'
                                            },
                                            duration: 5000
                                          }
                                        );
                                      } else {
                                        handleArchiveProject(project.id);
                                      }
                                    } else if (option.id === 'delete') {
                                      setProjectToDelete(project);
                                      setDeleteConfirmName("");
                                      setIsDeleteProjectModalOpen(true);
                                    } else if (option.id === 'duplicate') {
                                      if (!session) {
                                        toast(
                                          translations[language].usage.signInPrompt,
                                          {
                                            action: {
                                              label: translations[language].usage.signUp,
                                              onClick: () => window.location.href = '/signup'
                                            },
                                            duration: 5000
                                          }
                                        );
                                      } else {
                                        handleDuplicateProject(project.id);
                                      }
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
                    ? t.showLess
                    : t.showMore}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#f58e58]/10 dark:bg-[#f58e58]/20">
                  <Triangle className="h-3 w-3 text-[#f58e58] dark:text-[#f58e58]" />
                </div>
                <span className="text-sm font-semibold text-zinc-500">{t.latestBibliography}</span>
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
                  onClick={() => {
                    if (!session) {
                      toast(
                        translations[language].usage.signInPrompt,
                        {
                          action: {
                            label: translations[language].usage.signUp,
                            onClick: () => window.location.href = '/signup'
                          },
                          duration: 5000
                        }
                      );
                    } else {
                      setIsArchivedProjectsModalOpen(true);
                    }
                  }}
                  className="flex items-center overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-white dark:hover:bg-zinc-800 rounded-full px-2 py-1 group/archived w-8 hover:w-28"
                >
                  <Archive className="h-3.5 w-3.5 shrink-0" />
                  <span className="ml-2 opacity-0 group-hover/archived:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {t.archive}
                  </span>
                </div>
                
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
                
                {/* Delete Button */}
                <div 
                  onClick={() => {
                    if (!session) {
                      toast(
                        translations[language].usage.signInPrompt,
                        {
                          action: {
                            label: translations[language].usage.signUp,
                            onClick: () => window.location.href = '/signup'
                          },
                          duration: 5000
                        }
                      );
                    } else {
                      setIsDeletedModalOpen(true);
                    }
                  }}
                  className="flex items-center overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-white dark:hover:bg-zinc-800 rounded-full px-2 py-1 group/deleted w-8 hover:w-24"
                >
                  <Trash2 className="h-3.5 w-3.5 shrink-0 group-hover/deleted:text-red-500" />
                  <span className="ml-2 opacity-0 group-hover/deleted:opacity-100 transition-opacity duration-200 whitespace-nowrap group-hover/deleted:text-red-500">{t.trash}</span>
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
        </motion.aside>

        {/* Center Content Area */}
        <motion.main 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative py-6 lg:py-8 w-full min-w-0 px-6 md:px-8 xl:px-12 flex-1"
        >
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
                      {t.addCitation}
                    </button>
                  
                  <button 
                      onClick={() => {
                        if (!session) {
                          toast(
                            translations[language].usage.signInPrompt,
                            {
                              action: {
                                label: translations[language].usage.signUp,
                                onClick: () => window.location.href = '/signup'
                              },
                              duration: 5000
                            }
                          );
                        } else {
                          setIsImportModalOpen(true);
                        }
                      }}
                      className="flex h-9 items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                    >
                      <FileUp className="h-4 w-4" />
                      {t.import}
                    </button>
                </div>
                
                <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group">
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{translations[language].nav.help}</span>
                </button>
              </div>

            {/* Focus Backdrop for Smart Search */}
            <AnimatePresence>
              {(isMainSearchDropdownOpen && mainSearchQuery.trim().length > 2) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMainSearchDropdownOpen(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[40]"
                />
              )}
            </AnimatePresence>

            <div className={`relative group transition-all duration-300 ${isMainSearchDropdownOpen && mainSearchQuery.trim().length > 2 ? 'z-[50]' : 'z-10'}`}>
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
                  placeholder={t.searchPlaceholder}
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
                          <span className="text-xs">{t.searching}</span>
                        </div>
                      ) : mainSearchResults.length > 0 ? (
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                          {mainSearchResults.map((result) => (
                            <div 
                              key={result.id} 
                              onClick={() => handleSelectSearchResult(result)}
                              className="flex items-center justify-between p-4 hover:bg-[#407bc4]/5 dark:hover:bg-[#407bc4]/10 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-all group cursor-pointer active:scale-[0.99]"
                            >
                               <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#407bc4] transition-colors">
                                    <span className="text-zinc-500 group-hover:text-white transition-colors">
                                      {getResourceIcon ? getResourceIcon(result.type) : <FileText className="h-4 w-4" />}
                                    </span>
                                  </div>
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                      <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate max-w-[200px] group-hover:text-[#407bc4] transition-colors">{result.title}</span>
                                      <div className="flex items-center gap-1">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0 ${getResourceBadgeStyle ? getResourceBadgeStyle(result.type) : ''}`}>
                                          {language === 'TH' && resourceLabels[result.type] ? resourceLabels[result.type].TH : resourceLabels[result.type]?.EN || result.type}
                                        </span>
                                        {result.sourceApi && (
                                          <span className="text-[8px] font-bold uppercase tracking-tighter px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                            {result.sourceApi}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-xs text-zinc-500 line-clamp-1">
                                      {result.authors?.length > 0 
                                        ? result.authors.map((a: any) => `${a.firstName} ${a.lastName}`).join(', ') 
                                        : t.unknownAuthor} 
                                      {result.year ? ` (${result.year})` : ''} - {result.source}
                                    </span>
                                  </div>
                               </div>
                               <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#407bc4]/10 text-[#407bc4] group-hover:bg-[#407bc4] group-hover:text-white transition-all">
                                 <Plus className="h-4 w-4" />
                               </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 flex flex-col items-center justify-center text-zinc-400">
                          <Search className="h-6 w-6 mb-2 opacity-50" />
                          <span className="text-xs">{t.noResults}</span>
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
                          {t.styleHelp} <Link href="#" className="text-[#407bc4] hover:underline">{translations[language].nav.help}</Link>
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
                          <span>{t.moreCitationStyles}</span>
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
                  {copied ? t.copied : t.copyAll}
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => {
                      if (!session) {
                        toast(
                          translations[language].usage.signInPrompt,
                          {
                            action: {
                              label: translations[language].usage.signUp,
                              onClick: () => window.location.href = '/signup'
                            },
                            duration: 5000
                          }
                        );
                      } else {
                        setIsExportOpen(!isExportOpen);
                      }
                    }}
                    className="flex h-8 items-center gap-1 rounded-md bg-[#407bc4] pl-3 pr-2 text-xs font-medium text-white hover:bg-[#32629e] transition-colors shadow-sm"
                  >
                    <Download className="h-3 w-3 mr-1" /> {t.export} <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
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
                    placeholder={t.searchReferences}
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
                            <Settings2 className="h-3.5 w-3.5 text-[#407bc4]" /> {t.bibliographySettings}
                          </span>
                        </div>
                        
                        <div className="p-2 flex flex-col gap-1">
                          {[
                            { id: 'hangingIndent', label: t.hangingIndent, desc: t.hangingIndentDesc },
                            { id: 'doubleSpaced', label: t.doubleSpacing, desc: t.doubleSpacingDesc },
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
                            { label: t.font, value: settings.font, options: FONT_OPTIONS, handler: handleFontChange },
                            { label: t.textSize, value: settings.textSize, options: TEXT_SIZE_OPTIONS, handler: handleTextSizeChange },
                            { label: t.sortBy, value: settings.sortBy, options: SORT_OPTIONS, handler: handleSortSettings },
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
                              {t.bibliographySettingsInfo}
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
                className="px-24 py-16 max-w-5xl mx-auto w-full transition-all duration-300 bg-white dark:bg-zinc-900/50"
                style={{ 
                  fontFamily: settings.font === 'Sarabun' ? "'Sarabun', sans-serif" : settings.font,
                  fontSize: settings.textSize 
                }}
              >
                <h2 className="text-2xl font-serif text-center mb-12 text-zinc-900 dark:text-zinc-100">{t.references}</h2>
                
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
                            className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4] transition-all shadow-sm" title={t.edit}
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
                            title={t.copyInTextCitation}
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
                            title={t.copyAll}
                          >
                            {copiedId === citation.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <button 
                            onClick={() => deleteCitation(citation.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm" title={t.deleteTitle}
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
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{t.noCitationsYet}</h3>
                    <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                      {t.noCitationsYetDesc}
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
        </motion.main>

        {/* Right Sidebar (Registration CTA) */}
        <motion.aside 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hidden xl:sticky top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto py-6 xl:block xl:w-[240px] 2xl:w-[280px] pr-6 sm:pr-8 lg:pr-12"
        >
          <div className="flex flex-col gap-4">
            <UsageLimit 
              citationCount={session ? citations.length : localCitations.length}
              projectCount={projects.length}
            />

          </div>
        </motion.aside>

       </motion.div>
 
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
                  {t.trash}
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
                      {t.noDeletedCitations}
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
                              className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 text-zinc-500 rounded-lg transition-all shadow-sm" title={t.toasts.restored}
                            >
                              <RotateCw className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => permanentlyDeleteCitation(citation.id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 text-zinc-500 rounded-lg transition-all shadow-sm" title={t.deleteTitle}
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
                  {t.trashSystem}
                </span>
                {deletedCitations?.length > 0 && (
                  <button 
                    onClick={async () => {
                      try {
                        await Promise.all(deletedCitations.map((c: any) => 
                          fetch(`/api/citations/${c.id}`, { method: 'DELETE' })
                        ));
                        mutateDeletedCitations();
                        toast.success(t.toasts.trashEmptied);
                      } catch (e) {
                         console.error("Failed to empty trash", e);
                         toast.error("Failed to empty trash");
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 dark:text-red-400 font-bold transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg active:scale-95"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t.emptyTrash}
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
                  {t.archive}
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
                      {t.noArchivedProjects}
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
                            <span className="text-[10px] text-zinc-500">{project.description || t.noDescription}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleArchiveProject(project.id, false)}
                            className="h-8 w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 text-zinc-500 rounded-lg transition-all shadow-sm" title={t.restore}
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </button>
                           <button 
                            onClick={() => {
                              setProjectToDelete(project);
                              setDeleteConfirmName("");
                              setIsDeleteProjectModalOpen(true);
                            }}
                            className="h-8 w-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 text-zinc-500 rounded-lg transition-all shadow-sm" title={t.deletePermanently}
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
                  {editingProject ? t.edit : t.newProject}
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
                    {translations[language].usage.projects}
                  </label>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder={t.searchPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {t.details}
                  </label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder={t.noDescription}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                      {t.themeColor}
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
                      <span>{t.icon}</span>
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
                  {t.cancel}
                </button>
                <button 
                  onClick={handleUpdateProject}
                  className="px-6 py-2 rounded-xl bg-[#407bc4] text-white text-xs font-bold hover:bg-[#32629e] transition-all shadow-md active:scale-95"
                >
                  {t.save}
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
                  {t.newProject}
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
                    {translations[language].usage.projects}
                  </label>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder={t.searchPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    {t.details}
                  </label>
                  <textarea 
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder={t.noDescription}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Color Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                      {t.themeColor}
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
                      <span>{t.icon}</span>
                      <span className="text-[10px] lowercase opacity-60">{t.scrollForMore}</span>
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
                  {t.cancel}
                </button>
                <button 
                  onClick={handleCreateProject}
                  disabled={isCreatingProject || !newProject.name.trim()}
                  className="px-6 py-2 rounded-xl bg-[#f58e58] text-white text-xs font-bold hover:bg-[#e67e43] disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  {isCreatingProject ? t.creating : t.newProject}
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
                  {t.import}
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
                       {importRefFiles.ris || (t.noFileChosen)}
                     </span>
                     <button className="h-7 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 rounded-lg group-hover:bg-[#407bc4] group-hover:text-white group-hover:border-transparent transition-all">
                       {t.chooseFile}
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
                       {importRefFiles.bib || (t.noFileChosen)}
                     </span>
                     <button className="h-7 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 rounded-lg group-hover:bg-[#407bc4] group-hover:text-white group-hover:border-transparent transition-all">
                       {t.chooseFile}
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
                     <RotateCw className="h-3 w-3" /> {t.loadBackup}
                   </label>
                   <div className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-[#f58e58]/50 transition-all cursor-pointer">
                     <span className="text-xs text-zinc-500 overflow-hidden truncate">
                       {importRefFiles.backup || (t.noFileChosen)}
                     </span>
                     <button className="h-7 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 rounded-lg group-hover:bg-[#f58e58] group-hover:text-white group-hover:border-transparent transition-all">
                       {t.chooseFile}
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
                  {t.cancel}
                </button>
                 <button 
                   onClick={handleImport}
                   className="px-8 py-2.5 rounded-xl bg-[#f58e58] text-white text-xs font-bold hover:bg-[#e67e43] transition-all shadow-md active:scale-95"
                 >
                   {t.import}
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
                    ? t.selectResourceType
                    : citationStep === 2 
                        ? t.moreResources
                        : (
                          <button 
                            onClick={() => setCitationStep(0)}
                            className="flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 -ml-2 rounded-lg transition-all text-left"
                          >
                            <span className="font-bold">
                              {t.citeManually} {selectedType ? (resourceLabels[selectedType] as any)[language] : t.references}
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
                          { id: 'book', icon: <Book className="h-6 w-6" />, label: { TH: 'หนังสือ', EN: 'Book', ZH: '书籍' }, color: '#407bc4' },
                          { id: 'article', icon: <FileText className="h-6 w-6" />, label: { TH: 'วารสาร', EN: 'Journal', ZH: '期刊' }, color: '#10b981' },
                          { id: 'website', icon: <Globe className="h-6 w-6" />, label: { TH: 'เว็บไซต์', EN: 'Website', ZH: '网站' }, color: '#f59e0b' },
                          { id: 'report', icon: <Library className="h-6 w-6" />, label: { TH: 'รายงาน', EN: 'Report', ZH: '报告' }, color: '#ef4444' },
                          { id: 'news', icon: <Newspaper className="h-6 w-6" />, label: { TH: 'ข่าวสาร', EN: 'News', ZH: '新闻' }, color: '#8b5cf6' },
                          { id: 'more', icon: <Plus className="h-6 w-6" />, label: { TH: 'อื่นๆ', EN: 'More', ZH: '更多' }, color: '#f58e58' },
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
                              {(type.label as any)[language] || type.label.EN}
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
                            placeholder={t.searchReferences}
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
                          <p className="text-xs">{t.no_resources_found}</p>
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
                                {t.authors_list}
                              </label>
                            </div>

                            <div className="space-y-6">
                              {newCitationData.authors.map((author: any, index: number) => (
                                <div key={index} className="p-5 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 relative group/author">
                                  {/* Author Header with Condition */}
                                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                                    <span className="text-[10px] font-bold text-[#407bc4] uppercase tracking-widest">
                                      {t.authorIndex} {index + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <label className="text-[9px] font-bold text-zinc-400 uppercase">
                                        {t.resourceCondition}
                                      </label>
                                      <select 
                                        value={author.condition || 'general'}
                                        onChange={(e) => {
                                          const updated = [...newCitationData.authors];
                                          updated[index].condition = e.target.value;
                                          setNewCitationData({...newCitationData, authors: updated});
                                        }}
                                        className="text-[10px] font-bold text-white bg-[#407bc4] px-2 py-1 rounded-lg border-none focus:ring-0 cursor:pointer hover:bg-[#32629e] transition-colors shadow-sm"
                                      >
                                         <option value="general">{t.author_condition_general}</option>
                                         <option value="none">{t.author_condition_no_author}</option>
                                         <option value="pseudonym">{t.author_condition_pseudonym}</option>
                                         <option value="royal">{t.author_condition_royal_family}</option>
                                         <option value="title">{t.author_condition_titled_author}</option>
                                         <option value="monk">{t.author_condition_buddhist_monk}</option>
                                         <option value="editor">{t.author_condition_editor}</option>
                                         <option value="org">{t.author_condition_organization}</option>
                                      </select>
                                    </div>
                                  </div>

                                  {author.condition !== 'none' && (
                                    <div className={`grid grid-cols-1 ${author.condition === 'org' ? 'sm:grid-cols-1' : 'sm:grid-cols-12'} gap-4`}>
                                      {/* Prefix for Royal, Title, Monk */}
                                      {(author.condition === 'royal' || author.condition === 'title' || author.condition === 'monk') && (
                                        <div className="sm:col-span-3 flex flex-col gap-1.5">
                                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-0.5">
                                             {author.condition === 'monk' ? t.ecclesiastical_title : t.prefix_title}
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
                                           {author.condition === 'org' ? t.organization_name : t.first_name}
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
                                               {t.middle_name}
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
                                              {t.last_name}
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
                                        {t.marked_as_unknown}
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
                                {t.publication_year}
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
                                {t.source}
                              </label>
                              <input 
                                type="text" 
                                value={newCitationData.source}
                                onChange={(e) => setNewCitationData({...newCitationData, source: e.target.value})}
                                placeholder={t.sourcePlaceholder}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#407bc4]/20 focus:border-[#407bc4] transition-all"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">
                              {t.form.title}
                            </label>
                            <input 
                              type="text" 
                              value={newCitationData.title}
                              onChange={(e) => setNewCitationData({...newCitationData, title: e.target.value})}
                              placeholder={t.titlePlaceholder}
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
                            <Eye className="h-3.5 w-3.5" /> {t.livePreview}
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
                            <span className="text-[10px] font-bold text-zinc-400">{t.references}</span>
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
                            <span className="text-[10px] font-bold text-zinc-400">{t.viewInText}</span>
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
                    <ArrowLeft className="h-4 w-4" /> {t.back}
                  </button>
                )}
                
                <button 
                  onClick={() => setIsAddCitationModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  {t.cancel}
                </button>
                
                {citationStep === 1 && (
                  <button 
                    onClick={handleSaveManualCitation}
                    className="px-8 py-2.5 rounded-xl bg-[#407bc4] text-white text-sm font-bold hover:bg-[#32629e] transition-all shadow-lg active:scale-95"
                  >
                    {t.form.submit}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteProjectModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteProjectModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {t.confirmDeletion}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t.deleteWarning}
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                    {language === 'TH' 
                      ? 'ข้อมูลบรรณานุกรมทั้งหมดในโปรเจกต์นี้จะถูกลบออกถาวร' 
                      : 'All citations within this project will be permanently deleted.'}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
                    {t.deleteConfirmPrefix} <span className="text-zinc-900 dark:text-zinc-50 font-black italic">"{projectToDelete?.name}"</span> {t.deleteConfirmSuffix}
                  </label>
                  <input 
                    type="text"
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                    placeholder={projectToDelete?.name}
                    className="w-full h-12 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteProjectModalOpen(false)}
                    className="flex-1 h-12 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    disabled={deleteConfirmName !== projectToDelete?.name}
                    onClick={() => {
                      handleDeleteProject(projectToDelete.id);
                      setIsDeleteProjectModalOpen(false);
                    }}
                    className="flex-[2] h-12 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    {t.deleteTitle}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
