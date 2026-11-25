'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft, 
  RefreshCw, 
  Layers,
  FileText,
  AlertCircle,
  Eye, 
  Undo2, 
  Redo2,
  Search, 
  Image as ImageIcon, 
  Type, 
  Link2, 
  CheckCircle2, 
  X, 
  Plus, 
  Trash2, 
  History,
  Copy,
  Sparkles,
  Heading as HeadingIcon,
  LayoutGrid,
  Maximize2,
  ZoomIn,
  ZoomOut,
  GripVertical,
  HelpCircle,
  MessageCircle,
  Palette,
  Sliders,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Box,
  Move,
  Baseline,
  SlidersHorizontal,
  ChevronRight,
  Video,
  MapPin,
  Phone,
  Mail,
  Code,
  Building2,
  Briefcase,
  ShieldCheck,
  Newspaper,
  BarChart3,
  LayoutTemplate,
  EyeOff,
  PanelLeft,
  PanelRight,
  Globe,
  Columns,
  Minus,
  MousePointerClick,
  Star,
  CreditCard,
  Gauge,
  ListChecks,
  Menu,
  Send
} from 'lucide-react';
import { defaultSiteContent, SiteContent, defaultSectionOrder } from '@/data/defaultSiteContent';

export type PreviewPageOption = 'home' | 'about' | 'services' | 'insight' | 'contact';

interface HistorySnapshot {
  id: string;
  time: string;
  action: string;
  content: SiteContent;
}

interface ComponentTemplate {
  type: 'banner' | 'text' | 'columns' | 'cta' | 'faq' | 'image' | 'html' | 'blank';
  title: string;
  desc: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
}

export default function ElementorEditorClient() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activePage, setActivePage] = useState<PreviewPageOption>('home');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Left Sidebar: 'elements' | 'structure' | 'pages' | 'templates' | 'styles'
  const [canvaTab, setCanvaTab] = useState<'elements' | 'structure' | 'pages' | 'templates' | 'styles'>('elements');
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [searchElementQuery, setSearchElementQuery] = useState<string>('');
  const [openElementGroups, setOpenElementGroups] = useState<Record<string, boolean>>({
    Layout: true,
    Basic: true,
    General: false,
    Marketing: false,
    Form: false,
    Navigation: false,
    Advanced: false,
  });

  // Selected Section & Right Inspector Panel ('content' | 'design' | 'layout')
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('hero');
  const [showPropertiesPanel, setShowPropertiesPanel] = useState<boolean>(true);
  const [propertyTab, setPropertyTab] = useState<'content' | 'design' | 'layout'>('content');
  const [openDesignSections, setOpenDesignSections] = useState<{ background: boolean; typography: boolean }>({
    background: true,
    typography: true,
  });
  const [openLayoutSections, setOpenLayoutSections] = useState<{ spacing: boolean; actions: boolean }>({
    spacing: true,
    actions: true,
  });
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ hero: true });

  // Modal Insert Component Before Target Section
  const [insertModalTarget, setInsertModalTarget] = useState<string | null>(null);

  // Drag and drop states for sidebar page reordering
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

  // Undo / Redo & Save States History
  const [undoStack, setUndoStack] = useState<SiteContent[]>([]);
  const [redoStack, setRedoStack] = useState<SiteContent[]>([]);
  const [historySnapshots, setHistorySnapshots] = useState<HistorySnapshot[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Elementor-style 7-Category Element Catalog (maps directly to live custom section renderer)
  const elementGroups: {
    group: string;
    items: { id: string; label: string; mapType: ComponentTemplate['type']; icon: React.ReactNode; presetTitle?: string }[];
  }[] = [
    {
      group: 'Layout',
      items: [
        { id: 'container', label: 'Container', mapType: 'blank', icon: <Box className="w-4 h-4" />, presetTitle: 'Container Baru' },
        { id: 'section', label: 'Section', mapType: 'banner', icon: <LayoutTemplate className="w-4 h-4" />, presetTitle: 'Section Baru' },
        { id: 'grid', label: 'Grid', mapType: 'columns', icon: <LayoutGrid className="w-4 h-4" />, presetTitle: 'Grid Konten' },
        { id: 'columns', label: 'Columns', mapType: 'columns', icon: <Columns className="w-4 h-4" />, presetTitle: '3 Kolom Konten' },
      ],
    },
    {
      group: 'Basic',
      items: [
        { id: 'heading', label: 'Heading', mapType: 'text', icon: <HeadingIcon className="w-4 h-4" />, presetTitle: 'Judul Bagian Baru' },
        { id: 'text', label: 'Text', mapType: 'text', icon: <Type className="w-4 h-4" />, presetTitle: 'Paragraf Teks' },
        { id: 'image', label: 'Image', mapType: 'image', icon: <ImageIcon className="w-4 h-4" />, presetTitle: 'Gambar & Keterangan' },
        { id: 'video', label: 'Video', mapType: 'html', icon: <Video className="w-4 h-4" />, presetTitle: 'Video Embed' },
        { id: 'button', label: 'Button', mapType: 'cta', icon: <MousePointerClick className="w-4 h-4" />, presetTitle: 'Tombol Aksi' },
        { id: 'divider', label: 'Divider', mapType: 'blank', icon: <Minus className="w-4 h-4" />, presetTitle: 'Garis Pemisah' },
        { id: 'spacer', label: 'Spacer', mapType: 'blank', icon: <Move className="w-4 h-4" />, presetTitle: 'Ruang Kosong' },
      ],
    },
    {
      group: 'General',
      items: [
        { id: 'icon', label: 'Icon', mapType: 'columns', icon: <Star className="w-4 h-4" />, presetTitle: 'Sorotan Ikon' },
        { id: 'icon-box', label: 'Icon Box', mapType: 'columns', icon: <Sparkles className="w-4 h-4" />, presetTitle: 'Kotak Ikon Fitur' },
        { id: 'image-box', label: 'Image Box', mapType: 'image', icon: <ImageIcon className="w-4 h-4" />, presetTitle: 'Kotak Gambar' },
        { id: 'gallery', label: 'Gallery', mapType: 'image', icon: <LayoutGrid className="w-4 h-4" />, presetTitle: 'Galeri Foto' },
        { id: 'accordion', label: 'Accordion', mapType: 'faq', icon: <ListChecks className="w-4 h-4" />, presetTitle: 'Accordion / Tanya Jawab' },
        { id: 'tabs', label: 'Tabs', mapType: 'faq', icon: <Layers className="w-4 h-4" />, presetTitle: 'Tab Informasi' },
      ],
    },
    {
      group: 'Marketing',
      items: [
        { id: 'testimonial', label: 'Testimonial', mapType: 'text', icon: <MessageCircle className="w-4 h-4" />, presetTitle: 'Kutipan Klien' },
        { id: 'pricing', label: 'Pricing', mapType: 'columns', icon: <CreditCard className="w-4 h-4" />, presetTitle: 'Paket Layanan' },
        { id: 'counter', label: 'Counter', mapType: 'columns', icon: <BarChart3 className="w-4 h-4" />, presetTitle: 'Angka Pencapaian' },
        { id: 'progress', label: 'Progress Bar', mapType: 'text', icon: <Gauge className="w-4 h-4" />, presetTitle: 'Indikator Tahapan' },
      ],
    },
    {
      group: 'Form',
      items: [
        { id: 'contact-form', label: 'Contact Form', mapType: 'cta', icon: <Mail className="w-4 h-4" />, presetTitle: 'Formulir Kontak Cepat' },
        { id: 'input', label: 'Input', mapType: 'cta', icon: <Type className="w-4 h-4" />, presetTitle: 'Kolom Isian' },
        { id: 'textarea', label: 'Textarea', mapType: 'text', icon: <FileText className="w-4 h-4" />, presetTitle: 'Kotak Pesan' },
        { id: 'submit-btn', label: 'Submit Button', mapType: 'cta', icon: <Send className="w-4 h-4" />, presetTitle: 'Tombol Kirim WhatsApp' },
      ],
    },
    {
      group: 'Navigation',
      items: [
        { id: 'navbar', label: 'Navbar', mapType: 'banner', icon: <Menu className="w-4 h-4" />, presetTitle: 'Bar Navigasi' },
        { id: 'menu', label: 'Menu', mapType: 'text', icon: <ListChecks className="w-4 h-4" />, presetTitle: 'Daftar Menu Tautan' },
        { id: 'footer', label: 'Footer', mapType: 'banner', icon: <LayoutTemplate className="w-4 h-4" />, presetTitle: 'Bagian Bawah (Footer)' },
      ],
    },
    {
      group: 'Advanced',
      items: [
        { id: 'html-embed', label: 'HTML Embed', mapType: 'html', icon: <Code className="w-4 h-4" />, presetTitle: 'Embed Peta / HTML' },
        { id: 'custom-code', label: 'Custom Code', mapType: 'html', icon: <Code className="w-4 h-4" />, presetTitle: 'Kode Kustom' },
      ],
    },
  ];

  // Hierarchy child preview labels for the Struktur (Layers) Navigator
  const sectionHierarchyChildren: Record<string, string[]> = {
    hero: ['Badge Atas', 'Heading Utama', 'Deskripsi', 'Tombol Aksi', '5 Pilar'],
    'trust-stats': ['4 Kartu Statistik'],
    about: ['Gambar Utama', 'Heading & Deskripsi', '4 Nilai Kerja'],
    services: ['Judul Seksi', '5 Kartu Layanan', 'Kolom Pencarian'],
    retainer: ['Judul & Deskripsi', '6 Ruang Lingkup', 'Tombol Proposal'],
    insights: ['Judul Seksi', '3 Kartu Artikel'],
    faq: ['Judul Seksi', 'Daftar Accordion'],
    contact: ['3 Kartu Kontak', 'Formulir WhatsApp'],
  };

  // Standard Sections Information for Home
  const standardHomeSections: Record<string, { name: string; icon: React.ReactNode; desc: string }> = {
    hero: { name: 'Hero Banner Utama', icon: <LayoutTemplate className="w-4 h-4" />, desc: 'Headline, video latar, tombol CTA' },
    'trust-stats': { name: 'Statistik Kepercayaan', icon: <BarChart3 className="w-4 h-4" />, desc: 'Angka legalitas, izin OSS, standar kepatuhan' },
    about: { name: 'Tentang SELECO', icon: <Building2 className="w-4 h-4" />, desc: 'Profil firma, nilai korporasi' },
    services: { name: '5 Pilar Layanan', icon: <Briefcase className="w-4 h-4" />, desc: 'Perizinan, imigrasi, pajak, tanah, SDM' },
    retainer: { name: 'Program Retainer', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Pendampingan konsultasi korporasi bulanan' },
    insights: { name: 'Legal Insights', icon: <Newspaper className="w-4 h-4" />, desc: 'Artikel publikasi & analisa regulasi' },
    faq: { name: 'Tanya Jawab (FAQ)', icon: <HelpCircle className="w-4 h-4" />, desc: 'Pertanyaan seputar konsultasi' },
    contact: { name: 'Kontak & Alamat Kantor', icon: <Phone className="w-4 h-4" />, desc: 'Nomor WhatsApp, email, peta kantor' },
  };

  // Available Draggable Component Templates (Canva Element Library)
  const componentTemplates: ComponentTemplate[] = [
    {
      type: 'banner',
      title: 'Hero Banner / Promo',
      desc: 'Banner headline besar, latar warna elegan, badge, & tombol aksi',
      icon: <LayoutTemplate className="w-4 h-4" />,
      badge: 'BANNER',
      color: 'from-amber-500/20 to-amber-900/30 border-amber-500/30'
    },
    {
      type: 'text',
      title: 'Teks & Paragraf Konten',
      desc: 'Judul seksi, subjudul, dan teks paragraf penjelasan bebas',
      icon: <Type className="w-4 h-4" />,
      badge: 'TEKS',
      color: 'from-blue-500/20 to-blue-900/30 border-blue-500/30'
    },
    {
      type: 'cta',
      title: 'Tombol WhatsApp & CTA',
      desc: 'Banner konversi dengan tombol kontak langsung ke WhatsApp konsultan',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: 'WHATSAPP',
      color: 'from-emerald-500/20 to-emerald-900/30 border-emerald-500/30'
    },
    {
      type: 'columns',
      title: '3 Kolom Fitur / Kartu',
      desc: '3 kartu berdampingan untuk pilar keunggulan layanan',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: '3 KOLOM',
      color: 'from-purple-500/20 to-purple-900/30 border-purple-500/30'
    },
    {
      type: 'faq',
      title: 'Tanya Jawab (FAQ) Tambahan',
      desc: 'Daftar pertanyaan & jawaban konsultasi bisnis baru',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: 'FAQ',
      color: 'from-cyan-500/20 to-cyan-900/30 border-cyan-500/30'
    },
    {
      type: 'image',
      title: 'Galeri Foto & Visual',
      desc: 'Banner gambar dokumentasi legalitas dengan keterangan foto',
      icon: <ImageIcon className="w-4 h-4" />,
      badge: 'GAMBAR',
      color: 'from-rose-500/20 to-rose-900/30 border-rose-500/30'
    },
    {
      type: 'html',
      title: 'HTML & Widget Kustom (Peta / Video)',
      desc: 'Embed Google Maps, Video YouTube, atau widget bebas tanpa koding',
      icon: <Code className="w-4 h-4" />,
      badge: 'WIDGET / MAPS',
      color: 'from-orange-500/20 to-orange-900/30 border-orange-500/30'
    },
    {
      type: 'blank',
      title: 'Kontainer / Div Kosong',
      desc: 'Div serbaguna untuk tata letak custom bebas',
      icon: <Box className="w-4 h-4" />,
      badge: 'DIV KOSONG',
      color: 'from-slate-500/20 to-slate-900/30 border-slate-500/30'
    },
  ];

  // 1. Initial Load
  useEffect(() => {
    const auth = sessionStorage.getItem('seleco_admin_auth_editor') || sessionStorage.getItem('seleco_admin_auth');
    if (auth !== 'true') {
      window.location.href = '/admin';
      return;
    }

    sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');

    try {
      const cached = localStorage.getItem('seleco_site_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        setContent(parsed);
        addSnapshot('Buka Dokumen Desain', parsed);
      } else {
        fetchCurrentContent();
      }
    } catch (e) {
      fetchCurrentContent();
    }
  }, []);

  const fetchCurrentContent = async () => {
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
          addSnapshot('Versi Tersimpan di Server', data.content);
        }
      }
    } catch (err) {
      console.error('Error loading content:', err);
    }
  };

  const addSnapshot = (action: string, newContent: SiteContent) => {
    const snapshot: HistorySnapshot = {
      id: `snap-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      content: JSON.parse(JSON.stringify(newContent)),
    };
    setHistorySnapshots((prev) => [snapshot, ...prev.slice(0, 29)]);
  };

  // Broadcast to Preview Iframe
  const sendContentToIframe = (contentToSend: SiteContent) => {
    try {
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(contentToSend));
      sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_SITE_CONTENT',
          content: contentToSend,
        }, '*');
      }
    } catch (e) {
      console.error('Error broadcasting to iframe:', e);
    }
  };

  const sendPageToIframe = (page: PreviewPageOption) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_PREVIEW_PAGE',
        page: page,
      }, '*');
    }
  };

  const sendSelectedSectionToIframe = (sectionId: string | null) => {
    if (iframeRef.current?.contentWindow && sectionId) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_SELECTED_SECTION',
        sectionId: sectionId,
      }, '*');
    }
  };

  // Listen to messages from iframe
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_IFRAME_READY') {
        sendContentToIframe(content);
        sendPageToIframe(activePage);
        if (selectedSectionId) {
          sendSelectedSectionToIframe(selectedSectionId);
        }
      }
      if (e.data?.type === 'SECTION_SELECTED' && e.data.sectionId) {
        setSelectedSectionId(e.data.sectionId);
        setShowPropertiesPanel(true);
      }
      if (e.data?.type === 'ON_ELEMENT_UPDATED' && e.data.content) {
        pushStateChange('Edit Teks / Media Elemen', e.data.content);
      }
      if (e.data?.type === 'INSERT_COMPONENT_BEFORE') {
        insertComponentBefore(e.data.targetSectionId, e.data.componentType || 'banner');
      }
      if (e.data?.type === 'OPEN_INSERT_MODAL_BEFORE') {
        setInsertModalTarget(e.data.targetSectionId);
      }
      if (e.data?.type === 'MOVE_SECTION_UP') {
        moveSectionUp(e.data.sectionId);
      }
      if (e.data?.type === 'MOVE_SECTION_DOWN') {
        moveSectionDown(e.data.sectionId);
      }
      if (e.data?.type === 'DELETE_SECTION') {
        handleDeleteSection(e.data.sectionId);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [content, activePage, selectedSectionId]);

  // Push new state change to Undo stack
  const pushStateChange = (actionName: string, newContent: SiteContent) => {
    setUndoStack((prev) => [...prev.slice(-25), content]);
    setRedoStack([]); // reset redo on new action
    setContent(newContent);
    setHasUnsavedChanges(true);
    addSnapshot(actionName, newContent);
    sendContentToIframe(newContent);
  };

  // Handle Undo (Ctrl + Z)
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, content]);
    setContent(previous);
    setHasUnsavedChanges(true);
    sendContentToIframe(previous);
  };

  // Handle Redo (Ctrl + Y)
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, content]);
    setContent(next);
    setHasUnsavedChanges(true);
    sendContentToIframe(next);
  };

  // Restore snapshot from History
  const handleRestoreSnapshot = (snapshot: HistorySnapshot) => {
    if (!confirm(`Kembalikan tampilan ke versi: "${snapshot.action}" (${snapshot.time})?`)) return;
    pushStateChange(`Restore versi: ${snapshot.action}`, snapshot.content);
    setShowHistoryModal(false);
  };

  // Handle Select Page
  const handleSelectPage = (page: PreviewPageOption) => {
    setActivePage(page);
    sendPageToIframe(page);
    setSelectedSectionId(null);
  };

  // Select section handler
  const handleSelectSection = (secId: string) => {
    setSelectedSectionId(secId);
    setShowPropertiesPanel(true);
    sendSelectedSectionToIframe(secId);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SCROLL_TO_SECTION',
        sectionId: secId,
      }, '*');
    }
  };

  // Save to Server
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    try {
      localStorage.setItem('seleco_site_content', JSON.stringify(content));
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(content));

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        addSnapshot('Simpan Perubahan', content);
        setSaveSuccessMessage('Perubahan berhasil disimpan.');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        alert('Gagal menyimpan ke server. Silakan coba kembali.');
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish live to website
  const handlePublish = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    const liveContent: SiteContent = {
      ...content,
      siteMode: {
        badgeText: content.siteMode?.badgeText ?? defaultSiteContent.siteMode?.badgeText ?? '',
        title: content.siteMode?.title ?? defaultSiteContent.siteMode?.title ?? '',
        subtitle: content.siteMode?.subtitle ?? defaultSiteContent.siteMode?.subtitle ?? '',
        estimatedDate: content.siteMode?.estimatedDate ?? defaultSiteContent.siteMode?.estimatedDate ?? '',
        whatsappText: content.siteMode?.whatsappText ?? defaultSiteContent.siteMode?.whatsappText ?? '',
        status: 'live',
      },
    };
    try {
      setContent(liveContent);
      localStorage.setItem('seleco_site_content', JSON.stringify(liveContent));
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(liveContent));

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: liveContent }),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        addSnapshot('Publikasikan Website', liveContent);
        setSaveSuccessMessage('Website berhasil dipublikasikan dan tayang secara langsung.');
        setTimeout(() => setSaveSuccessMessage(null), 4500);
      } else {
        alert('Gagal mempublikasikan ke server. Silakan coba kembali.');
      }
    } catch (err) {
      console.error('Error publishing:', err);
      alert('Terjadi kesalahan koneksi saat mempublikasikan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get active order list for active page
  const getCurrentPageSections = (): string[] => {
    const pageOrder = content.sectionOrder?.[activePage] || defaultSectionOrder[activePage] || [];
    const customPageIds = (content.customSections || [])
      .filter((c: any) => !c.page || c.page === activePage)
      .map((c: any) => c.id);

    const merged = [...pageOrder];
    customPageIds.forEach((id: string) => {
      if (!merged.includes(id)) {
        merged.push(id);
      }
    });
    return merged;
  };

  // ── UPDATE SECTION PROPERTIES (PROPERTIES INSPECTOR) ─────────────────────────
  const updateSectionProperty = (propKey: string, value: any) => {
    if (!selectedSectionId) return;

    // A. If selected section is a Custom Section
    if (selectedSectionId.startsWith('custom-div-')) {
      const updatedCustom = (content.customSections || []).map((sec: any) => {
        if (sec.id === selectedSectionId) {
          return { ...sec, [propKey]: value };
        }
        return sec;
      });

      const newContent: SiteContent = {
        ...content,
        customSections: updatedCustom,
      };
      pushStateChange(`Ubah ${propKey}`, newContent);
      return;
    }

    // B. If selected section is a Standard Section (e.g. hero, about, services, contact)
    const secKey = selectedSectionId as keyof SiteContent;
    if (content[secKey] && typeof content[secKey] === 'object' && propKey in (content[secKey] as any)) {
      const newContent: SiteContent = {
        ...content,
        [secKey]: {
          ...(content[secKey] as any),
          [propKey]: value,
        },
      };
      pushStateChange(`Ubah ${propKey}`, newContent);
      return;
    }

    // Global properties (e.g. global.whatsappNumber, global.email)
    if (propKey.startsWith('global.')) {
      const field = propKey.replace('global.', '');
      const newContent: SiteContent = {
        ...content,
        global: {
          ...content.global,
          [field]: value,
        },
      };
      pushStateChange(`Ubah ${field}`, newContent);
      return;
    }

    // Style override in content.styles
    const currentStyles = content.styles || {};
    const secStyle = currentStyles[selectedSectionId] || {};
    const newContent: SiteContent = {
      ...content,
      styles: {
        ...currentStyles,
        [selectedSectionId]: {
          ...secStyle,
          [propKey]: value,
        },
      },
    };
    pushStateChange(`Ubah gaya ${propKey}`, newContent);
  };

  // Get current value of property for selected section
  const getSelectedSectionProperty = (propKey: string, fallback: any = ''): any => {
    if (!selectedSectionId) return fallback;

    if (selectedSectionId.startsWith('custom-div-')) {
      const custom: any = (content.customSections || []).find((c: any) => c.id === selectedSectionId);
      if (custom && custom[propKey] !== undefined) return custom[propKey];
      return fallback;
    }

    if (propKey.startsWith('global.')) {
      const field = propKey.replace('global.', '') as keyof typeof content.global;
      return content.global?.[field] !== undefined ? content.global[field] : fallback;
    }

    const secKey = selectedSectionId as keyof SiteContent;
    if (content[secKey] && typeof content[secKey] === 'object' && propKey in (content[secKey] as any)) {
      return (content[secKey] as any)[propKey];
    }

    const secStyle: any = (content.styles as any)?.[selectedSectionId];
    if (secStyle && secStyle[propKey] !== undefined) {
      return secStyle[propKey];
    }

    return fallback;
  };

  // ── MANAGE PILLS FOR HERO ──────────────────────────────────────────────────
  const handleAddHeroPill = () => {
    const current = content.hero?.featurePills || [];
    const newContent: SiteContent = {
      ...content,
      hero: {
        ...content.hero,
        featurePills: [...current, 'Tag Fitur Baru'],
      },
    };
    pushStateChange('Tambah Tag Keunggulan Hero', newContent);
  };

  const handleUpdateHeroPill = (idx: number, val: string) => {
    const current = [...(content.hero?.featurePills || [])];
    current[idx] = val;
    const newContent: SiteContent = {
      ...content,
      hero: {
        ...content.hero,
        featurePills: current,
      },
    };
    pushStateChange('Edit Tag Keunggulan Hero', newContent);
  };

  const handleRemoveHeroPill = (idx: number) => {
    const current = (content.hero?.featurePills || []).filter((_, i) => i !== idx);
    const newContent: SiteContent = {
      ...content,
      hero: {
        ...content.hero,
        featurePills: current,
      },
    };
    pushStateChange('Hapus Tag Keunggulan Hero', newContent);
  };

  // ── MANAGE FAQ ITEMS ────────────────────────────────────────────────────────
  const handleAddFaqItem = () => {
    const current = content.faq?.items || [];
    const newContent: SiteContent = {
      ...content,
      faq: {
        ...content.faq,
        items: [
          ...current,
          { question: 'Pertanyaan baru mengenai perizinan & kepatuhan?', answer: 'Tuliskan jawaban penjelasan di sini.' }
        ],
      },
    };
    pushStateChange('Tambah Pertanyaan FAQ', newContent);
  };

  const handleUpdateFaqItem = (idx: number, field: 'question' | 'answer', val: string) => {
    const current = [...(content.faq?.items || [])];
    if (current[idx]) {
      current[idx] = { ...current[idx], [field]: val };
      const newContent: SiteContent = {
        ...content,
        faq: {
          ...content.faq,
          items: current,
        },
      };
      pushStateChange(`Edit FAQ: ${field}`, newContent);
    }
  };

  const handleRemoveFaqItem = (idx: number) => {
    const current = (content.faq?.items || []).filter((_, i) => i !== idx);
    const newContent: SiteContent = {
      ...content,
      faq: {
        ...content.faq,
        items: current,
      },
    };
    pushStateChange('Hapus Pertanyaan FAQ', newContent);
  };

  // ── INSERT COMPONENT BEFORE TARGET SECTION ──────────────────────────────────
  const insertComponentBefore = (targetSectionId: string, type: string) => {
    const newId = `custom-div-${Date.now()}`;
    let newSection: any = {
      id: newId,
      page: activePage,
      type,
      title: 'Judul Komponen Baru',
      subtitle: 'Tuliskan deskripsi atau penjelasan komponen di sini.',
      badge: 'KOMPONEN BARU',
      bg: '#ffffff',
      textColor: '#0f172a',
      paddingY: '64px',
      paddingX: '24px',
      marginY: '0px',
      maxWidth: '1152px',
      textAlign: 'center',
      fontSize: '36px',
      fontWeight: '700',
      fontFamily: 'serif',
      borderRadius: '0px',
      borderWidth: '0',
      borderColor: '#e2e8f0',
      boxShadow: 'none',
      buttonText: 'Pelajari Selengkapnya',
      buttonUrl: '#',
    };

    if (type === 'banner') {
      newSection = {
        ...newSection,
        title: 'Penawaran Khusus Konsultasi Bisnis',
        subtitle: 'Dapatkan pendampingan legalitas dan perizinan OSS terpercaya dari konsultan spesialis SELECO.',
        badge: 'INFORMASI KHUSUS',
        bg: '#0a1420',
        textColor: '#ffffff',
        buttonText: 'Konsultasi Sekarang',
        buttonUrl: '#',
        fontSize: '40px',
      };
    } else if (type === 'text') {
      newSection = {
        ...newSection,
        title: 'Ketentuan & Kebijakan Kepatuhan',
        subtitle: 'Pedoman standar operasional konsultasi hukum terpadu.',
        badge: 'KEBIJAKAN KORPORASI',
        content: 'Klik langsung untuk mengedit teks paragraf ini sesuai kebutuhan website perusahaan Anda.',
        textAlign: 'left',
        fontSize: '32px',
      };
    } else if (type === 'cta') {
      newSection = {
        ...newSection,
        title: 'Siap Mengembangkan Usaha Anda Bersama SELECO?',
        subtitle: 'Hubungi tim konsultan kami via WhatsApp untuk respon cepat dan solusi terukur.',
        badge: 'KONSULTASI GRATIS',
        buttonText: 'Chat WhatsApp Konsultan',
        buttonUrl: 'https://wa.me/6282211020022',
        bg: '#0f2034',
        textColor: '#ffffff',
        paddingY: '80px',
      };
    } else if (type === 'columns') {
      newSection = {
        ...newSection,
        title: 'Keunggulan Pendampingan Terpadu',
        subtitle: 'Tiga pilar komitmen kami dalam mengawal kelancaran bisnis Anda.',
        badge: 'KEUNGGULAN UTAMA',
        bg: '#f8fafc',
      };
    } else if (type === 'faq') {
      newSection = {
        ...newSection,
        title: 'Pertanyaan Umum Seputar Konsultasi',
        subtitle: 'Jawaban atas pertanyaan mendasar mengenai proses layanan.',
        badge: 'TANYA JAWAB',
      };
    } else if (type === 'image') {
      newSection = {
        ...newSection,
        title: 'Dokumentasi & Portofolio Legalitas',
        subtitle: 'Standar kerja profesional dan terverifikasi di berbagai kementerian terkait.',
        badge: 'DOKUMENTASI RESMI',
        image: 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1200&q=80',
      };
    } else if (type === 'html') {
      newSection = {
        ...newSection,
        title: 'Lokasi Kantor & Peta Wilayah',
        subtitle: 'Kunjungi kantor kami atau lihat rute perjalanan Anda.',
        badge: 'PETA & WIDGET',
        rawHtml: '<div class="w-full h-80 rounded-2xl overflow-hidden border border-slate-300"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6234038743117!2d106.82226217499008!3d-6.181129993806307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305dfd58b7%3A0xe54d9c490a6ea259!2sJl.%20M.H.%20Thamrin%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>',
      };
    }

    const currentSections = getCurrentPageSections();
    let newOrder: string[] = [];

    if (targetSectionId === '__end__') {
      newOrder = [...currentSections, newId];
    } else {
      const targetIndex = currentSections.indexOf(targetSectionId);
      if (targetIndex !== -1) {
        newOrder = [
          ...currentSections.slice(0, targetIndex),
          newId,
          ...currentSections.slice(targetIndex)
        ];
      } else {
        newOrder = [newId, ...currentSections];
      }
    }

    const updatedCustom = [...(content.customSections || []), newSection];
    const newContent: SiteContent = {
      ...content,
      customSections: updatedCustom,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    const targetName = targetSectionId === '__end__' ? 'Paling Bawah' : (standardHomeSections[targetSectionId]?.name || 'Bagian Tujuan');
    pushStateChange(`Tambahkan ${newSection.title} (Sebelum ${targetName})`, newContent);
    setInsertModalTarget(null);
    setSelectedSectionId(newId);
    setShowPropertiesPanel(true);
    setSaveSuccessMessage(`Bagian "${newSection.title}" berhasil ditambahkan.`);
    setTimeout(() => setSaveSuccessMessage(null), 2500);
  };

  // ── MOVE SECTION UP / DOWN ──────────────────────────────────────────────────
  const moveSectionUp = (sectionId: string) => {
    const currentSections = getCurrentPageSections();
    const index = currentSections.indexOf(sectionId);
    if (index <= 0) return;

    const newOrder = [...currentSections];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;

    const newContent = {
      ...content,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    const name = standardHomeSections[sectionId]?.name || 'Komponen';
    pushStateChange(`Naikkan Posisi: ${name}`, newContent);
  };

  const moveSectionDown = (sectionId: string) => {
    const currentSections = getCurrentPageSections();
    const index = currentSections.indexOf(sectionId);
    if (index === -1 || index >= currentSections.length - 1) return;

    const newOrder = [...currentSections];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;

    const newContent = {
      ...content,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    const name = standardHomeSections[sectionId]?.name || 'Komponen';
    pushStateChange(`Turunkan Posisi: ${name}`, newContent);
  };

  // ── DRAG & DROP REORDER IN SIDEBAR ───────────────────────────────────────────
  const handleDragStartSidebarItem = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverSidebarItem = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropSidebarItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === targetIndex) return;

    const currentSections = getCurrentPageSections();
    const newOrder = [...currentSections];
    const [movedItem] = newOrder.splice(draggedSectionIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);

    const newContent = {
      ...content,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    pushStateChange(`Tukar Posisi Halaman`, newContent);
    setDraggedSectionIndex(null);
  };

  // ── DELETE / HIDE SECTION ────────────────────────────────────────────────────
  const handleDeleteSection = (sectionId: string) => {
    const isCustom = sectionId.startsWith('custom-div-');
    const secName = standardHomeSections[sectionId]?.name || 'Komponen';

    if (!confirm(`Hapus/Sembunyikan "${secName}"? Anda dapat membatalkannya kapan saja lewat tombol Undo.`)) {
      return;
    }

    if (isCustom) {
      const updatedCustom = (content.customSections || []).filter((s: any) => s.id !== sectionId);
      const currentSections = getCurrentPageSections().filter((id) => id !== sectionId);
      const newContent = {
        ...content,
        customSections: updatedCustom,
        sectionOrder: {
          ...(content.sectionOrder || {}),
          [activePage]: currentSections,
        },
      };
      pushStateChange(`Hapus Komponen Kustom: ${secName}`, newContent);
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
      return;
    }

    // Standard section: add to hiddenSections
    const currentHidden = content.hiddenSections || [];
    if (!currentHidden.includes(sectionId)) {
      const newContent = {
        ...content,
        hiddenSections: [...currentHidden, sectionId],
      };
      pushStateChange(`Hapus / Sembunyikan: ${secName}`, newContent);
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
    }
  };

  // Restore Hidden Section
  const handleRestoreDefaultSection = (sectionId: string) => {
    const secName = standardHomeSections[sectionId]?.name || 'Komponen';
    const currentHidden = content.hiddenSections || [];
    const newContent = {
      ...content,
      hiddenSections: currentHidden.filter((id: string) => id !== sectionId),
    };
    pushStateChange(`Tampilkan Kembali: ${secName}`, newContent);
  };

  // Duplicate Section
  const handleDuplicateSection = (sectionId: string) => {
    const isCustom = sectionId.startsWith('custom-div-');
    if (!isCustom) {
      alert('Seksi bawaan tidak dapat diduplikasi. Gunakan + Tambah Komponen untuk membuat seksi baru.');
      return;
    }

    const custom = (content.customSections || []).find((c: any) => c.id === sectionId);
    if (!custom) return;

    const newId = `custom-div-${Date.now()}`;
    const duplicated = {
      ...custom,
      id: newId,
      title: `${custom.title} (Salinan)`,
    };

    const currentSections = getCurrentPageSections();
    const index = currentSections.indexOf(sectionId);
    const newOrder = [
      ...currentSections.slice(0, index + 1),
      newId,
      ...currentSections.slice(index + 1)
    ];

    const updatedCustom = [...(content.customSections || []), duplicated];
    const newContent = {
      ...content,
      customSections: updatedCustom,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    pushStateChange(`Duplikat Komponen: ${custom.title}`, newContent);
    setSelectedSectionId(newId);
  };

  // Drag start for component card from library
  const handleDragStartComponent = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ componentType: type }));
    e.dataTransfer.setData('text/plain', JSON.stringify({ componentType: type }));
    e.dataTransfer.effectAllowed = 'copy';
    (window as any).__draggedComponentType = type;
  };

  // Keyboard shortcut listener (Ctrl+Z = Undo, Ctrl+Y = Redo, Ctrl+S = Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, content]);

  const currentSections = getCurrentPageSections();
  const selectedCustom = selectedSectionId?.startsWith('custom-div-') 
    ? (content.customSections || []).find((c: any) => c.id === selectedSectionId) 
    : null;
  const selectedTitle = standardHomeSections[selectedSectionId || '']?.name || selectedCustom?.title || 'Komponen Dipilih';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b0e17] text-slate-100 select-none overflow-hidden font-sans">
      
      {/* ── 1. ELEMENTOR-STYLE TOP TOOLBAR ───────────────────────────────────── */}
      <header className="h-14 bg-[#111624] border-b border-[#232c42] px-3 sm:px-4 flex items-center justify-between gap-2 z-30 shrink-0">
        {/* Left: Kembali ke Dashboard + Nama Halaman + Toggle Panel Kiri */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] text-xs text-slate-200 border border-[#2d3a58] transition-colors shrink-0"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden lg:inline font-semibold">Dashboard</span>
          </Link>

          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
              showLeftSidebar
                ? 'bg-[#dfa82e]/15 border-[#dfa82e]/40 text-[#dfa82e]'
                : 'bg-[#1a2236] border-[#2d3a58] text-slate-300 hover:text-white'
            }`}
            title={showLeftSidebar ? 'Sembunyikan Sidebar Kiri' : 'Tampilkan Sidebar Kiri'}
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-700/60 hidden sm:block" />

          {/* Nama Halaman Aktif */}
          <select
            value={activePage}
            onChange={(e) => handleSelectPage(e.target.value as PreviewPageOption)}
            className="bg-[#1a2236] border border-[#2d3a58] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#dfa82e] cursor-pointer font-semibold max-w-[160px] sm:max-w-none"
            title="Pilih halaman yang ingin diedit"
          >
            <option value="home">Halaman: Beranda</option>
            <option value="about">Halaman: Tentang Kami</option>
            <option value="services">Halaman: Layanan</option>
            <option value="insight">Halaman: Insight</option>
            <option value="contact">Halaman: Kontak</option>
          </select>
        </div>

        {/* Center: Undo / Redo + Responsive Mode (Desktop, Tablet, Mobile) + Status */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              undoStack.length > 0
                ? 'bg-[#1a2236] border-[#2d3a58] text-white hover:bg-[#25304a] cursor-pointer'
                : 'bg-[#121827] border-[#1e2638] text-slate-600 cursor-not-allowed'
            }`}
            title="Batalkan Perubahan (Undo - Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Undo</span>
          </button>

          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              redoStack.length > 0
                ? 'bg-[#1a2236] border-[#2d3a58] text-white hover:bg-[#25304a] cursor-pointer'
                : 'bg-[#121827] border-[#1e2638] text-slate-600 cursor-not-allowed'
            }`}
            title="Ulangi Perubahan (Redo - Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Redo</span>
          </button>

          <div className="h-5 w-px bg-slate-700/60 hidden sm:block mx-0.5" />

          {/* Responsive Mode Toggle */}
          <div className="hidden sm:flex items-center bg-[#1a2236] rounded-lg p-0.5 border border-[#2d3a58]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 px-2 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-[#dfa82e] text-[#0a1420] font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Tampilan Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 px-2 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'tablet' ? 'bg-[#dfa82e] text-[#0a1420] font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Tampilan Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 px-2 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-[#dfa82e] text-[#0a1420] font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Tampilan Mobile (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status Penyimpanan */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs pl-2">
            {hasUnsavedChanges ? (
              <span className="text-amber-300 flex items-center gap-1.5 font-medium">
                <span className="size-2 rounded-full bg-amber-400" />
                Belum disimpan
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Tersimpan
              </span>
            )}
          </div>
        </div>

        {/* Right: Riwayat + Preview + Toggle Pengaturan + Simpan + Publikasikan */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 px-2 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#2d3a58] text-xs text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            title="Riwayat Perubahan"
          >
            <History className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span className="text-xs font-semibold hidden xl:inline">Riwayat</span>
          </button>

          <Link
            href={activePage === 'home' ? '/' : activePage === 'about' ? '/tentang' : activePage === 'services' ? '/layanan' : activePage === 'insight' ? '/insight' : '/kontak'}
            target="_blank"
            className="p-1.5 px-2.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#2d3a58] text-xs text-slate-200 transition-colors flex items-center gap-1.5"
            title="Pratinjau Website di Tab Baru"
          >
            <Eye className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span className="hidden lg:inline font-semibold">Preview</span>
          </Link>

          <button
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showPropertiesPanel
                ? 'bg-[#dfa82e]/15 border-[#dfa82e]/40 text-[#dfa82e]'
                : 'bg-[#1a2236] border-[#2d3a58] text-slate-300 hover:text-white'
            }`}
            title={showPropertiesPanel ? 'Sembunyikan Panel Pengaturan' : 'Tampilkan Panel Pengaturan'}
          >
            <PanelRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#dfa82e]/50 text-[#dfa82e] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Simpan Perubahan (Ctrl+S)"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Simpan</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-[#dfa82e] hover:bg-[#eab946] text-[#0a1420] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Simpan dan Publikasikan Website"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publikasikan</span>
          </button>
        </div>
      </header>

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs py-2 px-4 flex items-center justify-center gap-2 shrink-0 z-30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* ── 2. ELEMENTOR 3-PANEL WORKSPACE (SIDEBAR KIRI + TAMPILAN WEBSITE + PENGATURAN) */}
      <div className="flex-1 flex overflow-hidden relative min-w-0">

        {/* ── A. SIDEBAR KIRI: NAVIGASI 5 TAB ──────────────────────────────────── */}
        <aside className="w-16 bg-[#0e121e] border-r border-[#20273a] flex flex-col items-center py-3 gap-1.5 shrink-0 z-20">
          {[
            { id: 'elements' as const, label: 'Elemen', icon: <LayoutGrid className="w-4 h-4" />, title: 'Tambah Elemen ke Halaman' },
            { id: 'structure' as const, label: 'Struktur', icon: <Layers className="w-4 h-4" />, title: 'Struktur & Urutan Bagian' },
            { id: 'pages' as const, label: 'Halaman', icon: <FileText className="w-4 h-4" />, title: 'Pilih Halaman Website' },
            { id: 'templates' as const, label: 'Template', icon: <LayoutTemplate className="w-4 h-4" />, title: 'Template Bagian Siap Pakai' },
            { id: 'styles' as const, label: 'Gaya', icon: <Palette className="w-4 h-4" />, title: 'Gaya Global Website' },
          ].map((tab) => {
            const isActive = showLeftSidebar && canvaTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (showLeftSidebar && canvaTab === tab.id) {
                    setShowLeftSidebar(false);
                  } else {
                    setCanvaTab(tab.id);
                    setShowLeftSidebar(true);
                  }
                }}
                className={`w-13 py-2 px-1 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#dfa82e]/15 text-[#dfa82e] border border-[#dfa82e]/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
                title={tab.title}
              >
                {tab.icon}
                <span className="truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* ── B. PANEL SIDEBAR KIRI (COLLAPSIBLE) ──────────────────────────────── */}
        {showLeftSidebar && (
          <aside className="w-64 lg:w-72 bg-[#131929] border-r border-[#232c42] flex flex-col shrink-0 z-10 overflow-hidden">

            {/* TAB 1: ELEMEN (7 KATEGORI ELEMENTOR) */}
            {canvaTab === 'elements' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Elemen</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tarik ke tampilan atau klik + untuk menambah.
                    </p>
                  </div>
                </div>

                {/* Pencarian Elemen */}
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari elemen..."
                    value={searchElementQuery}
                    onChange={(e) => setSearchElementQuery(e.target.value)}
                    className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#dfa82e]"
                  />
                </div>

                {/* Daftar 7 Kategori Elemen */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {elementGroups.map((cat) => {
                    const q = searchElementQuery.trim().toLowerCase();
                    const filteredItems = q
                      ? cat.items.filter(
                          (item) =>
                            item.label.toLowerCase().includes(q) ||
                            cat.group.toLowerCase().includes(q)
                        )
                      : cat.items;

                    if (filteredItems.length === 0) return null;
                    const isOpen = q ? true : !!openElementGroups[cat.group];

                    return (
                      <div key={cat.group} className="rounded-xl border border-[#232c42] bg-[#0f1524] overflow-hidden">
                        <button
                          onClick={() =>
                            setOpenElementGroups((prev) => ({
                              ...prev,
                              [cat.group]: !prev[cat.group],
                            }))
                          }
                          className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          <span>{cat.group}</span>
                          {isOpen ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="p-2 pt-0 grid grid-cols-2 gap-1.5">
                            {filteredItems.map((item) => (
                              <div
                                key={item.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStartComponent(e, item.mapType)}
                                className="relative group p-2.5 rounded-lg bg-[#161e31] border border-[#25304a] hover:border-[#dfa82e]/60 hover:bg-[#1b253d] transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center gap-1.5 text-center"
                                title={`Tarik "${item.label}" ke tampilan website`}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    insertComponentBefore('__end__', item.mapType);
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 rounded bg-[#0e1320]/90 hover:bg-[#dfa82e] text-slate-300 hover:text-[#0a1420] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title={`Tambahkan ${item.label} ke halaman`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <span className="text-slate-300 group-hover:text-[#dfa82e] transition-colors">
                                  {item.icon}
                                </span>
                                <span className="text-[11px] font-medium text-slate-200 leading-tight">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: STRUKTUR (HIERARKI & LAYERS) */}
            {canvaTab === 'structure' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Struktur</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Urutan bagian pada halaman ini.
                    </p>
                  </div>
                  <button
                    onClick={() => setInsertModalTarget('__end__')}
                    className="px-2 py-1 rounded-lg bg-[#dfa82e]/15 hover:bg-[#dfa82e]/25 text-[#dfa82e] border border-[#dfa82e]/40 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Tambah bagian baru di bawah halaman"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Bagian</span>
                  </button>
                </div>

                {/* Root Halaman Label */}
                <div className="px-2.5 py-1.5 mb-2 rounded-lg bg-[#0e1320] border border-[#232c42] flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-[#dfa82e]" />
                  <span>Halaman: {activePage === 'home' ? 'Beranda' : activePage.charAt(0).toUpperCase() + activePage.slice(1)}</span>
                </div>

                {/* Hierarchical Section Tree */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {currentSections.map((secId, idx) => {
                    const isHidden = content.hiddenSections?.includes(secId);
                    const isCustom = secId.startsWith('custom-div-');
                    const customObj = isCustom ? (content.customSections || []).find((c: any) => c.id === secId) : null;
                    const secTitle = standardHomeSections[secId]?.name || customObj?.title || 'Bagian Kustom';
                    const isSelected = selectedSectionId === secId;
                    const isExpanded = !!expandedNodes[secId];
                    const childLabels = sectionHierarchyChildren[secId] || ['Judul', 'Konten', 'Tombol'];

                    return (
                      <div
                        key={secId}
                        draggable={true}
                        onDragStart={(e) => handleDragStartSidebarItem(e, idx)}
                        onDragOver={handleDragOverSidebarItem}
                        onDrop={(e) => handleDropSidebarItem(e, idx)}
                        className={`rounded-xl border text-xs transition-all overflow-hidden ${
                          isSelected
                            ? 'bg-[#dfa82e]/10 border-[#dfa82e]/60'
                            : isHidden
                            ? 'bg-rose-950/20 border-rose-500/30 opacity-75'
                            : 'bg-[#161e31] border-[#25304a] hover:border-slate-500'
                        }`}
                      >
                        <div
                          onClick={() => handleSelectSection(secId)}
                          className="p-2 flex items-center justify-between gap-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <GripVertical className="w-3 h-3 text-slate-500 shrink-0 cursor-grab" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedNodes((prev) => ({ ...prev, [secId]: !prev[secId] }));
                              }}
                              className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                              title={isExpanded ? 'Tutup rincian' : 'Lihat isi bagian'}
                            >
                              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3 rotate-90" />}
                            </button>
                            <span className={`font-semibold truncate ${isSelected ? 'text-[#dfa82e]' : 'text-slate-100'}`}>
                              {secTitle}
                            </span>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => moveSectionUp(secId)}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-slate-700/60 disabled:opacity-20 text-slate-300 cursor-pointer"
                              title="Pindah ke atas"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveSectionDown(secId)}
                              disabled={idx === currentSections.length - 1}
                              className="p-1 rounded hover:bg-slate-700/60 disabled:opacity-20 text-slate-300 cursor-pointer"
                              title="Pindah ke bawah"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            {isCustom && (
                              <button
                                onClick={() => handleDuplicateSection(secId)}
                                className="p-1 rounded hover:bg-slate-700/60 text-slate-300 cursor-pointer"
                                title="Duplikat bagian"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                            {isHidden ? (
                              <button
                                onClick={() => handleRestoreDefaultSection(secId)}
                                className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                                title="Tampilkan kembali"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteSection(secId)}
                                className="p-1 rounded hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 cursor-pointer"
                                title={isCustom ? 'Hapus bagian' : 'Sembunyikan bagian'}
                              >
                                {isCustom ? <Trash2 className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-3 pb-2 pt-1 border-t border-white/5 bg-[#0f1524]/70 space-y-1">
                            {childLabels.map((child, cIdx) => (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => {
                                  handleSelectSection(secId);
                                  setPropertyTab('content');
                                }}
                                className="w-full text-left pl-4 py-1 rounded text-[11px] text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                <span>{child}</span>
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setInsertModalTarget(secId)}
                              className="w-full mt-1 py-1 rounded bg-white/5 hover:bg-[#dfa82e]/15 border border-white/10 hover:border-[#dfa82e]/40 text-[11px] text-slate-300 hover:text-[#dfa82e] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambahkan Sebelum</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: HALAMAN */}
            {canvaTab === 'pages' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3.5">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Halaman</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pilih halaman website yang ingin Anda edit.
                  </p>
                </div>

                <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                  {([
                    { id: 'home', label: 'Beranda', path: '/' },
                    { id: 'about', label: 'Tentang Kami', path: '/about' },
                    { id: 'services', label: 'Layanan', path: '/services' },
                    { id: 'insights', label: 'Insight & Artikel', path: '/insights' },
                    { id: 'contact', label: 'Kontak', path: '/contact' },
                  ] as { id: PreviewPageOption; label: string; path: string }[]).map((pg) => {
                    const isCurrent = activePage === pg.id;
                    return (
                      <button
                        key={pg.id}
                        onClick={() => handleSelectPage(pg.id)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#dfa82e]/15 border-[#dfa82e]/50 text-white'
                            : 'bg-[#161e31] border-[#25304a] text-slate-300 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{pg.label}</div>
                          <div className="text-[11px] text-slate-400">{pg.path}</div>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#dfa82e] text-[#0a1420]">
                            Aktif
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-3 mt-3 border-t border-[#232c42] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                      Pintasan Dashboard
                    </span>
                    <Link
                      href="/admin/articles"
                      className="w-full p-2.5 rounded-xl bg-[#0f1524] border border-[#232c42] hover:border-slate-500 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span>Kelola Artikel Insight</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TEMPLATE */}
            {canvaTab === 'templates' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3.5">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Template</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Bagian siap pakai. Tarik ke tampilan atau klik Tambah.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {componentTemplates.map((tpl) => (
                    <div
                      key={tpl.type}
                      draggable={true}
                      onDragStart={(e) => handleDragStartComponent(e, tpl.type)}
                      className="p-3 rounded-xl border border-[#25304a] bg-[#161e31] hover:border-[#dfa82e]/60 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[#dfa82e] shrink-0">{tpl.icon}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{tpl.title}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{tpl.badge}</span>
                          </div>
                        </div>
                        <GripVertical className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{tpl.desc}</p>
                      <button
                        type="button"
                        onClick={() => insertComponentBefore('__end__', tpl.type)}
                        className="w-full py-1.5 rounded-lg bg-[#dfa82e]/15 hover:bg-[#dfa82e] text-[#dfa82e] hover:text-[#0a1420] border border-[#dfa82e]/30 text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Tambahkan ke Halaman
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: GAYA GLOBAL */}
            {canvaTab === 'styles' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3.5">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Gaya Global</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Palet warna dan tipografi resmi SELECO.
                  </p>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                  <div className="p-3 rounded-xl bg-[#161e31] border border-[#25304a] space-y-2">
                    <h4 className="text-xs font-bold text-white">Palet Warna Utama</h4>
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                      <div className="p-2 rounded-lg bg-[#0a1420] text-white border border-white/15">
                        <span className="font-mono block">#0a1420</span>
                        <span className="opacity-70">Navy Utama</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#0f2034] text-white border border-white/15">
                        <span className="font-mono block">#0f2034</span>
                        <span className="opacity-70">Navy Sekunder</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#dfa82e] text-[#0a1420] font-bold">
                        <span className="font-mono block">#dfa82e</span>
                        <span className="opacity-80">Gold Aksen</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#ffffff] text-[#0a1420] font-bold">
                        <span className="font-mono block">#ffffff</span>
                        <span className="opacity-70">Latar Terang</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#161e31] border border-[#25304a] space-y-2 text-xs">
                    <h4 className="font-bold text-white">Tipografi</h4>
                    <div className="space-y-1.5 text-[11px] text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Judul Utama</span>
                        <strong className="text-[#dfa82e]">Playfair Display</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Teks &amp; Paragraf</span>
                        <strong className="text-white">Inter</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#161e31] border border-[#25304a] space-y-1.5 text-xs">
                    <h4 className="font-bold text-white">Status Publikasi</h4>
                    <p className="text-[11px] text-slate-400">
                      Mode website saat ini:{' '}
                      <strong className="text-emerald-400 uppercase">
                        {content.siteMode?.status || 'live'}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

          </aside>
        )}

        {/* ── C. TAMPILAN WEBSITE (CENTER CANVAS) ──────────────────────────────── */}
        <main className="flex-1 min-w-0 bg-[#090d16] p-2 sm:p-4 overflow-auto flex flex-col items-center justify-start relative">

          {/* Live Website Preview Sheet */}
          <div
            style={{
              width:
                deviceMode === 'desktop'
                  ? '100%'
                  : deviceMode === 'tablet'
                  ? '768px'
                  : '390px',
              maxWidth: deviceMode === 'desktop' ? '1280px' : undefined,
              transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              transformOrigin: 'top center',
            }}
            className="bg-white rounded-xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.75)] border border-slate-700/70 overflow-hidden transition-all duration-300 flex flex-col min-h-[860px] my-1"
          >
            {/* Minimal Status Strip */}
            <div className="bg-[#111624] border-b border-[#232c42] px-3.5 py-2 flex items-center justify-between gap-2 text-xs text-slate-400 select-none">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-white truncate">
                  Tampilan Website
                </span>
                {selectedSectionId && (
                  <span className="text-[11px] bg-[#dfa82e]/15 text-[#dfa82e] px-2 py-0.5 rounded border border-[#dfa82e]/30 font-semibold truncate max-w-[200px]">
                    {selectedTitle}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="hidden md:inline text-[11px] text-slate-400 mr-1">
                  Klik elemen untuk mengedit
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  title="Perkecil tampilan"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 w-9 text-center">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(120, z + 10))}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  title="Perbesar tampilan"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Iframe View of Live Website Page */}
            <iframe
              ref={iframeRef}
              src={`/admin/preview?page=${activePage}&mode=click_to_edit`}
              className="w-full flex-1 min-h-[820px] border-0 bg-white"
              title="Tampilan Website SELECO"
            />
          </div>

          {/* Empty-Area Quick Add Section Button */}
          <div className="w-full max-w-[1280px] py-4 flex justify-center">
            <button
              type="button"
              onClick={() => setInsertModalTarget('__end__')}
              className="px-5 py-2.5 rounded-xl border border-dashed border-slate-600 hover:border-[#dfa82e] bg-[#111624]/80 hover:bg-[#dfa82e]/10 text-slate-300 hover:text-[#dfa82e] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title="Tambahkan bagian baru di bawah halaman"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Bagian Baru</span>
            </button>
          </div>

        </main>

        {/* ── D. SIDEBAR KANAN: PENGATURAN (3 TAB: KONTEN, DESAIN, LAYOUT) ─────── */}
        {showPropertiesPanel && (
          <aside className="w-72 lg:w-80 bg-[#131929] border-l border-[#232c42] flex flex-col shrink-0 z-20 overflow-hidden shadow-2xl">

            {/* Pengaturan Header */}
            <div className="p-3 bg-[#111624] border-b border-[#232c42] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#dfa82e]/15 text-[#dfa82e] flex items-center justify-center border border-[#dfa82e]/30 shrink-0">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white">Pengaturan</h3>
                  <p className="text-[11px] text-[#dfa82e] truncate">
                    {selectedTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPropertiesPanel(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Sembunyikan panel pengaturan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Elementor Tabs: Konten | Desain | Layout */}
            <div className="grid grid-cols-3 border-b border-[#232c42] bg-[#0e121e] text-xs">
              {[
                { id: 'content' as const, label: 'Konten' },
                { id: 'design' as const, label: 'Desain' },
                { id: 'layout' as const, label: 'Layout' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPropertyTab(tab.id)}
                  className={`py-2.5 font-semibold transition-colors border-b-2 text-center cursor-pointer ${
                    propertyTab === tab.id
                      ? 'border-[#dfa82e] text-[#dfa82e] bg-[#131929]/60'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Properties Form Content */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
              {!selectedSectionId ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Sliders className="w-7 h-7 text-slate-600 mx-auto" />
                  <p className="font-semibold text-slate-300">Belum Ada Bagian Dipilih</p>
                  <p className="text-[11px] text-slate-400">
                    Klik salah satu elemen pada Tampilan Website untuk mengubah isi, warna, atau tata letaknya.
                  </p>
                </div>
              ) : (
                <>
                  {/* TAB 1: KONTEN & ISI KOMPONEN SECARA SPESIFIK */}
                  {propertyTab === 'content' && (
                    <div className="space-y-4">
                      
                      {/* 1. KHUSUS HERO BANNER UTAMA */}
                      {selectedSectionId === 'hero' && (
                        <div className="space-y-3.5">
                          <div className="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded-xl text-xs text-purple-300">
                            <strong>Isi Komponen Hero:</strong> Ubah headline, video, tombol, dan statistik di bawah ini secara instan.
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Badge Kecil di Atas Judul
                            </label>
                            <input
                              type="text"
                              value={content.hero?.topBadge || ''}
                              onChange={(e) => updateSectionProperty('topBadge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Headline Utama (Baris 1)
                            </label>
                            <input
                              type="text"
                              value={content.hero?.headlinePart1 || ''}
                              onChange={(e) => updateSectionProperty('headlinePart1', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Teks Aksen Miring / Emas
                            </label>
                            <input
                              type="text"
                              value={content.hero?.headlineItalic || ''}
                              onChange={(e) => updateSectionProperty('headlineItalic', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-purple-500 italic"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Deskripsi / Paragraf Hero
                            </label>
                            <textarea
                              rows={3}
                              value={content.hero?.subheadline || ''}
                              onChange={(e) => updateSectionProperty('subheadline', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                            />
                          </div>

                          {/* Tombol CTA Hero */}
                          <div className="p-3 rounded-xl bg-[#0e1320] border border-[#252f47] space-y-2">
                            <span className="font-bold text-white block text-xs">Tombol Utama (CTA 1)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Teks Tombol"
                                value={content.hero?.ctaButton1Text || ''}
                                onChange={(e) => updateSectionProperty('ctaButton1Text', e.target.value)}
                                className="bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                              />
                              <input
                                type="text"
                                placeholder="Link Tujuan"
                                value={content.hero?.ctaButton1Link || ''}
                                onChange={(e) => updateSectionProperty('ctaButton1Link', e.target.value)}
                                className="bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-[#0e1320] border border-[#252f47] space-y-2">
                            <span className="font-bold text-white block text-xs">Tombol Kedua (CTA 2)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Teks Tombol"
                                value={content.hero?.ctaButton2Text || ''}
                                onChange={(e) => updateSectionProperty('ctaButton2Text', e.target.value)}
                                className="bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                              />
                              <input
                                type="text"
                                placeholder="Link Tujuan"
                                value={content.hero?.ctaButton2Link || ''}
                                onChange={(e) => updateSectionProperty('ctaButton2Link', e.target.value)}
                                className="bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* Video & Poster Background */}
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              File Video Latar Belakang (URL)
                            </label>
                            <input
                              type="text"
                              value={content.hero?.bgVideo || ''}
                              onChange={(e) => updateSectionProperty('bgVideo', e.target.value)}
                              placeholder="/bg_hero.mp4"
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          {/* Kartu Statistik di Hero */}
                          <div className="p-3 rounded-xl bg-[#0e1320] border border-[#252f47] space-y-2">
                            <span className="font-bold text-white block text-xs">Angka Statistik Kepercayaan</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-xs text-slate-400">Angka 1</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat1Number || ''}
                                  onChange={(e) => updateSectionProperty('stat1Number', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                                <span className="text-xs text-slate-400 mt-1 block">Label 1</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat1Label || ''}
                                  onChange={(e) => updateSectionProperty('stat1Label', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                              </div>
                              <div>
                                <span className="text-xs text-slate-400">Angka 2</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat2Number || ''}
                                  onChange={(e) => updateSectionProperty('stat2Number', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                                <span className="text-xs text-slate-400 mt-1 block">Label 2</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat2Label || ''}
                                  onChange={(e) => updateSectionProperty('stat2Label', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Feature Pills */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-slate-300">
                                Tag Keunggulan Layanan ({content.hero?.featurePills?.length || 0})
                              </label>
                              <button
                                type="button"
                                onClick={handleAddHeroPill}
                                className="text-xs text-purple-300 hover:text-white font-bold bg-purple-600/30 px-2 py-0.5 rounded cursor-pointer"
                              >
                                + Tambah Tag
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {(content.hero?.featurePills || []).map((pill, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={pill}
                                    onChange={(e) => handleUpdateHeroPill(i, e.target.value)}
                                    className="flex-1 bg-[#0e1320] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveHeroPill(i)}
                                    className="p-1 text-slate-400 hover:text-rose-400"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. KHUSUS TENTANG KAMI (ABOUT) */}
                      {selectedSectionId === 'about' && (
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Badge Kategori</label>
                            <input
                              type="text"
                              value={content.about?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Judul Utama</label>
                            <input
                              type="text"
                              value={content.about?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Judul Aksen Emas</label>
                            <input
                              type="text"
                              value={content.about?.titleAccent || ''}
                              onChange={(e) => updateSectionProperty('titleAccent', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-amber-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Paragraf 1</label>
                            <textarea
                              rows={3}
                              value={content.about?.paragraph1 || ''}
                              onChange={(e) => updateSectionProperty('paragraph1', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Paragraf 2</label>
                            <textarea
                              rows={3}
                              value={content.about?.paragraph2 || ''}
                              onChange={(e) => updateSectionProperty('paragraph2', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Tahun Pengalaman</label>
                            <input
                              type="text"
                              value={content.about?.experienceYears || ''}
                              onChange={(e) => updateSectionProperty('experienceYears', e.target.value)}
                              placeholder="10+"
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">URL Foto 1</label>
                            <input
                              type="text"
                              value={content.about?.image1 || ''}
                              onChange={(e) => updateSectionProperty('image1', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">URL Foto 2</label>
                            <input
                              type="text"
                              value={content.about?.image2 || ''}
                              onChange={(e) => updateSectionProperty('image2', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. KHUSUS LAYANAN (SERVICES) */}
                      {selectedSectionId === 'services' && (
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Badge Kategori</label>
                            <input
                              type="text"
                              value={content.services?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Judul Layanan</label>
                            <input
                              type="text"
                              value={content.services?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Subjudul Deskripsi</label>
                            <textarea
                              rows={3}
                              value={content.services?.subtitle || ''}
                              onChange={(e) => updateSectionProperty('subtitle', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          <div className="p-3 rounded-xl bg-[#0e1320] border border-[#252f47] space-y-2">
                            <span className="font-bold text-white block text-xs">Banner Promo CTA di Layanan</span>
                            <input
                              type="text"
                              placeholder="Judul Banner"
                              value={content.services?.ctaBannerTitle || ''}
                              onChange={(e) => updateSectionProperty('ctaBannerTitle', e.target.value)}
                              className="w-full bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                            />
                            <textarea
                              rows={2}
                              placeholder="Subjudul Banner"
                              value={content.services?.ctaBannerSubtitle || ''}
                              onChange={(e) => updateSectionProperty('ctaBannerSubtitle', e.target.value)}
                              className="w-full bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Teks Tombol"
                              value={content.services?.ctaBannerButtonText || ''}
                              onChange={(e) => updateSectionProperty('ctaBannerButtonText', e.target.value)}
                              className="w-full bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* 4. KHUSUS FAQ (TANYA JAWAB) */}
                      {selectedSectionId === 'faq' && (
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Badge</label>
                            <input
                              type="text"
                              value={content.faq?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Judul Seksi</label>
                            <input
                              type="text"
                              value={content.faq?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Subjudul</label>
                            <textarea
                              rows={2}
                              value={content.faq?.subtitle || ''}
                              onChange={(e) => updateSectionProperty('subtitle', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          {/* List of FAQ items */}
                          <div className="pt-2 border-t border-slate-700/60">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-white text-xs">
                                Daftar Pertanyaan &amp; Jawaban ({content.faq?.items?.length || 0})
                              </span>
                              <button
                                type="button"
                                onClick={handleAddFaqItem}
                                className="px-2 py-0.5 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold"
                              >
                                + Tambah FAQ
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(content.faq?.items || []).map((faq, i) => (
                                <div key={i} className="p-2.5 rounded-lg bg-[#0e1320] border border-[#252f47] space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-amber-300">FAQ #{i + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFaqItem(i)}
                                      className="text-slate-400 hover:text-rose-400"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Pertanyaan"
                                    value={faq.question}
                                    onChange={(e) => handleUpdateFaqItem(i, 'question', e.target.value)}
                                    className="w-full bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white"
                                  />
                                  <textarea
                                    rows={2}
                                    placeholder="Jawaban"
                                    value={faq.answer}
                                    onChange={(e) => handleUpdateFaqItem(i, 'answer', e.target.value)}
                                    className="w-full bg-[#131929] border border-[#252f47] rounded px-2.5 py-1 text-xs text-white leading-relaxed"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. KHUSUS KONTAK (CONTACT) */}
                      {selectedSectionId === 'contact' && (
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Badge</label>
                            <input
                              type="text"
                              value={content.contact?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Judul Seksi</label>
                            <input
                              type="text"
                              value={content.contact?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Nomor WhatsApp Konsultan</label>
                            <input
                              type="text"
                              value={content.global?.whatsappNumber || ''}
                              onChange={(e) => updateSectionProperty('global.whatsappNumber', e.target.value)}
                              placeholder="6282211020022"
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Telepon Kantor</label>
                            <input
                              type="text"
                              value={content.global?.phone || ''}
                              onChange={(e) => updateSectionProperty('global.phone', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Email Resmi</label>
                            <input
                              type="text"
                              value={content.global?.email || ''}
                              onChange={(e) => updateSectionProperty('global.email', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Alamat Fisik Kantor</label>
                            <textarea
                              rows={3}
                              value={content.global?.address || ''}
                              onChange={(e) => updateSectionProperty('global.address', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>
                        </div>
                      )}

                      {/* 6. KHUSUS KOMPONEN KUSTOM (CUSTOM DIVS / HTML / BANNER) */}
                      {selectedSectionId?.startsWith('custom-div-') && (
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Badge / Label Kategori
                            </label>
                            <input
                              type="text"
                              value={getSelectedSectionProperty('badge', '')}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              placeholder="e.g. INFORMASI KHUSUS"
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Judul Komponen
                            </label>
                            <textarea
                              rows={2}
                              value={getSelectedSectionProperty('title', '')}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              placeholder="Tulis judul utama di sini..."
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white resize-none font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Subjudul / Penjelasan Pendek
                            </label>
                            <textarea
                              rows={2}
                              value={getSelectedSectionProperty('subtitle', '')}
                              onChange={(e) => updateSectionProperty('subtitle', e.target.value)}
                              placeholder="Tuliskan deskripsi ringkas..."
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Isi Paragraf Teks
                            </label>
                            <textarea
                              rows={3}
                              value={getSelectedSectionProperty('content', '')}
                              onChange={(e) => updateSectionProperty('content', e.target.value)}
                              placeholder="Tuliskan teks paragraf..."
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          {/* Foto / Gambar */}
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              URL Gambar / Foto
                            </label>
                            <input
                              type="text"
                              value={getSelectedSectionProperty('image', '')}
                              onChange={(e) => updateSectionProperty('image', e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          {/* Tombol CTA */}
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/60">
                            <div>
                              <span className="text-xs text-slate-400 block mb-0.5">Teks Tombol</span>
                              <input
                                type="text"
                                value={getSelectedSectionProperty('buttonText', '')}
                                onChange={(e) => updateSectionProperty('buttonText', e.target.value)}
                                placeholder="e.g. Chat WhatsApp"
                                className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block mb-0.5">Link / WhatsApp</span>
                              <input
                                type="text"
                                value={getSelectedSectionProperty('buttonUrl', '')}
                                onChange={(e) => updateSectionProperty('buttonUrl', e.target.value)}
                                placeholder="e.g. https://wa.me/..."
                                className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* KODE HTML KUSTOM / EMBED BEBAS */}
                          <div className="p-3 rounded-xl bg-[#0e1320] border border-orange-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-orange-300 flex items-center gap-1.5 text-xs">
                                <Code className="w-3.5 h-3.5" /> HTML / Embed Bebas (Maps, Video, Widget)
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Untuk embed Google Maps, video YouTube, atau widget lain, tempelkan kode HTML di sini:
                            </p>
                            <textarea
                              rows={4}
                              value={getSelectedSectionProperty('rawHtml', '')}
                              onChange={(e) => updateSectionProperty('rawHtml', e.target.value)}
                              placeholder='<iframe src="https://www.google.com/maps/embed?..." width="100%" height="400"></iframe>'
                              className="w-full bg-[#131929] border border-[#252f47] rounded p-2 text-xs font-mono text-orange-200 focus:outline-none focus:border-orange-400"
                            />
                            {/* Tombol Contoh 1-Klik */}
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateSectionProperty('rawHtml', '<div class="w-full h-80 rounded-2xl overflow-hidden border border-slate-300"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6234038743117!2d106.82226217499008!3d-6.181129993806307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305dfd58b7%3A0xe54d9c490a6ea259!2sJl.%20M.H.%20Thamrin%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>')}
                                className="text-xs px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded font-bold"
                              >
                                + Contoh Maps
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSectionProperty('rawHtml', '<div class="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"><iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe></div>')}
                                className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded font-bold"
                              >
                                + Contoh YouTube
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 7. FALLBACK / LAINNYA */}
                      {selectedSectionId === 'retainer' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Badge</label>
                            <input
                              type="text"
                              value={content.retainer?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Judul Retainer</label>
                            <input
                              type="text"
                              value={content.retainer?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Subjudul</label>
                            <textarea
                              rows={3}
                              value={content.retainer?.subtitle || ''}
                              onChange={(e) => updateSectionProperty('subtitle', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}

                      {selectedSectionId === 'trust-stats' && (
                        <div className="space-y-3">
                          <p className="text-xs text-slate-400">Statistik kepercayaan utama perusahaan:</p>
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Total Sektoral Layanan</label>
                            <input
                              type="text"
                              value={content.global?.totalServices || ''}
                              onChange={(e) => updateSectionProperty('global.totalServices', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Izin OSS Terbit</label>
                            <input
                              type="text"
                              value={content.global?.ossLicenseCount || ''}
                              onChange={(e) => updateSectionProperty('global.ossLicenseCount', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DESAIN ACCORDION 1: LATAR & WARNA */}
                  {propertyTab === 'design' && (
                    <div className="rounded-xl border border-[#232c42] bg-[#0e1320] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenDesignSections((s) => ({ ...s, background: !s.background }))}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white hover:bg-[#1a2236] transition-colors cursor-pointer"
                      >
                        <span>Latar, Warna &amp; Bingkai</span>
                        {openDesignSections.background ? <ChevronUp className="w-3.5 h-3.5 text-[#dfa82e]" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {openDesignSections.background && (
                      <div className="p-3.5 pt-2 border-t border-[#232c42] space-y-4">
                      {/* Warna Latar (Background Color) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                          Warna Background
                        </label>
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="color"
                            value={getSelectedSectionProperty('bg', '#ffffff')}
                            onChange={(e) => updateSectionProperty('bg', e.target.value)}
                            className="w-9 h-9 rounded-lg border border-[#252f47] bg-[#0e1320] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={getSelectedSectionProperty('bg', '#ffffff')}
                            onChange={(e) => updateSectionProperty('bg', e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1 bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Preset Warna SELECO */}
                        <div className="grid grid-cols-6 gap-1.5">
                          {[
                            { hex: '#0a1420', label: 'Navy' },
                            { hex: '#dfa82e', label: 'Gold' },
                            { hex: '#ffffff', label: 'Putih' },
                            { hex: '#f8fafc', label: 'Light' },
                            { hex: '#0f2034', label: 'Malam' },
                            { hex: '#000000', label: 'Hitam' },
                          ].map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => updateSectionProperty('bg', c.hex)}
                              style={{ backgroundColor: c.hex }}
                              className="h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform"
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Warna Teks (Text Color) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                          Warna Teks
                        </label>
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="color"
                            value={getSelectedSectionProperty('textColor', '#0f172a')}
                            onChange={(e) => updateSectionProperty('textColor', e.target.value)}
                            className="w-9 h-9 rounded-lg border border-[#252f47] bg-[#0e1320] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={getSelectedSectionProperty('textColor', '#0f172a')}
                            onChange={(e) => updateSectionProperty('textColor', e.target.value)}
                            placeholder="#0f172a"
                            className="flex-1 bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Presets Teks */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textColor', '#ffffff')}
                            className="flex-1 py-1 rounded bg-[#0e1320] border border-white/20 text-white font-bold text-xs"
                          >
                            Teks Putih
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textColor', '#0f172a')}
                            className="flex-1 py-1 rounded bg-white text-slate-900 font-bold text-xs"
                          >
                            Teks Gelap
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textColor', '#dfa82e')}
                            className="flex-1 py-1 rounded bg-[#dfa82e] text-slate-950 font-bold text-xs"
                          >
                            Teks Gold
                          </button>
                        </div>
                      </div>

                      {/* Gambar Latar (Background Image) */}
                      <div className="pt-2 border-t border-slate-700/60">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                          URL Gambar Latar Belakang
                        </label>
                        <input
                          type="text"
                          value={getSelectedSectionProperty('bgImage', '')}
                          onChange={(e) => updateSectionProperty('bgImage', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                        <div className="flex gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('bgImage', 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1200&q=80')}
                            className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          >
                            Gedung Bisnis
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('bgImage', 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1200&q=80')}
                            className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          >
                            Ruang Meeting
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('bgImage', '')}
                            className="text-xs px-2 py-1 bg-rose-900/40 hover:bg-rose-900/60 rounded text-rose-300"
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      </div>
                      </div>
                      )}
                    </div>
                  )}

                  {/* LAYOUT ACCORDION 1: UKURAN, MARGIN & PADDING */}
                  {propertyTab === 'layout' && (
                    <div className="rounded-xl border border-[#232c42] bg-[#0e1320] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenLayoutSections((s) => ({ ...s, spacing: !s.spacing }))}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white hover:bg-[#1a2236] transition-colors cursor-pointer"
                      >
                        <span>Ukuran, Margin &amp; Padding</span>
                        {openLayoutSections.spacing ? <ChevronUp className="w-3.5 h-3.5 text-[#dfa82e]" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {openLayoutSections.spacing && (
                      <div className="p-3.5 pt-2 border-t border-[#232c42] space-y-4">
                      {/* Padding Atas & Bawah (Padding Y) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                            Jarak Atas &amp; Bawah (Padding Y)
                          </label>
                          <span className="text-xs font-mono text-purple-300">
                            {getSelectedSectionProperty('paddingY', '64px')}
                          </span>
                        </div>
                        <select
                          value={getSelectedSectionProperty('paddingY', '64px')}
                          onChange={(e) => updateSectionProperty('paddingY', e.target.value)}
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="16px">Sangat Ramping (16px)</option>
                          <option value="32px">Ramping (32px)</option>
                          <option value="48px">Sedang (48px)</option>
                          <option value="64px">Standar Lapang (64px)</option>
                          <option value="80px">Besar (80px)</option>
                          <option value="96px">Sangat Besar (96px)</option>
                          <option value="120px">Ekstra Megah (120px)</option>
                        </select>
                      </div>

                      {/* Padding Samping (Padding X) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                            Jarak Samping (Padding X)
                          </label>
                          <span className="text-xs font-mono text-purple-300">
                            {getSelectedSectionProperty('paddingX', '24px')}
                          </span>
                        </div>
                        <select
                          value={getSelectedSectionProperty('paddingX', '24px')}
                          onChange={(e) => updateSectionProperty('paddingX', e.target.value)}
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="16px">Normal Mobile (16px)</option>
                          <option value="24px">Standar (24px)</option>
                          <option value="48px">Lapang (48px)</option>
                          <option value="64px">Lebar Penuh (64px)</option>
                        </select>
                      </div>

                      {/* Margin Atas-Bawah (Margin Y) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                            Jarak Luar Antar Seksi (Margin Y)
                          </label>
                          <span className="text-xs font-mono text-purple-300">
                            {getSelectedSectionProperty('marginY', '0px')}
                          </span>
                        </div>
                        <select
                          value={getSelectedSectionProperty('marginY', '0px')}
                          onChange={(e) => updateSectionProperty('marginY', e.target.value)}
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="0px">Tanpa Margin (0px)</option>
                          <option value="16px">Jarak Kecil (16px)</option>
                          <option value="32px">Jarak Sedang (32px)</option>
                          <option value="48px">Jarak Lebar (48px)</option>
                          <option value="64px">Jarak Sangat Lebar (64px)</option>
                        </select>
                      </div>

                      {/* Lebar Maksimal Konten (Max Width) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                          Lebar Maksimal Konten
                        </label>
                        <select
                          value={getSelectedSectionProperty('maxWidth', '1152px')}
                          onChange={(e) => updateSectionProperty('maxWidth', e.target.value)}
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="100%">Penuh 100% Layar (Full Width)</option>
                          <option value="1280px">Ekstra Lebar (1280px)</option>
                          <option value="1152px">Standar Nyaman (1152px - Max 6xl)</option>
                          <option value="896px">Sedang (896px - Max 4xl)</option>
                          <option value="672px">Ramping Tengah (672px - Max 2xl)</option>
                        </select>
                      </div>
                      </div>
                      )}
                    </div>
                  )}

                  {/* DESAIN ACCORDION 2: TIPOGRAFI & PERATAAN */}
                  {propertyTab === 'design' && (
                    <div className="rounded-xl border border-[#232c42] bg-[#0e1320] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenDesignSections((s) => ({ ...s, typography: !s.typography }))}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white hover:bg-[#1a2236] transition-colors cursor-pointer"
                      >
                        <span>Tipografi &amp; Perataan Teks</span>
                        {openDesignSections.typography ? <ChevronUp className="w-3.5 h-3.5 text-[#dfa82e]" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {openDesignSections.typography && (
                      <div className="p-3.5 pt-2 border-t border-[#232c42] space-y-4">
                      {/* Posisi Rata Teks */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                          Posisi Rata Teks
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 bg-[#0e1320] p-1 rounded-lg border border-[#252f47]">
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textAlign', 'left')}
                            className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                              getSelectedSectionProperty('textAlign', 'center') === 'left'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Rata Kiri"
                          >
                            <AlignLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textAlign', 'center')}
                            className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                              getSelectedSectionProperty('textAlign', 'center') === 'center'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Rata Tengah"
                          >
                            <AlignCenter className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textAlign', 'right')}
                            className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                              getSelectedSectionProperty('textAlign', 'center') === 'right'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Rata Kanan"
                          >
                            <AlignRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textAlign', 'justify')}
                            className={`py-1.5 rounded flex items-center justify-center transition-colors ${
                              getSelectedSectionProperty('textAlign', 'center') === 'justify'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Rata Kiri-Kanan"
                          >
                            <AlignJustify className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Ukuran Font Judul */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                          Ukuran Font Judul
                        </label>
                        <select
                          value={getSelectedSectionProperty('fontSize', '36px')}
                          onChange={(e) => updateSectionProperty('fontSize', e.target.value)}
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="24px">Kecil / Subjudul (24px)</option>
                          <option value="30px">Sedang (30px)</option>
                          <option value="36px">Standar Judul (36px)</option>
                          <option value="44px">Besar (44px)</option>
                          <option value="52px">Raksasa Hero (52px)</option>
                        </select>
                      </div>

                      {/* Gaya Font (Font Family) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                          Gaya Font
                        </label>
                        <select
                          value={getSelectedSectionProperty('fontFamily', 'serif')}
                          onChange={(e) => updateSectionProperty('fontFamily', e.target.value)}
                          className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="serif">Cinzel Serif (Klasik Korporasi / Legal)</option>
                          <option value="sans">Plus Jakarta Sans (Modern / Bersih)</option>
                        </select>
                      </div>
                      </div>
                      )}
                    </div>
                  )}

                  {/* LAYOUT ACCORDION 2: POSISI & TINDAKAN */}
                  {propertyTab === 'layout' && (
                    <div className="rounded-xl border border-[#232c42] bg-[#0e1320] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenLayoutSections((s) => ({ ...s, actions: !s.actions }))}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white hover:bg-[#1a2236] transition-colors cursor-pointer"
                      >
                        <span>Posisi, Visibilitas &amp; Tindakan</span>
                        {openLayoutSections.actions ? <ChevronUp className="w-3.5 h-3.5 text-[#dfa82e]" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {openLayoutSections.actions && (
                      <div className="p-3.5 pt-2 border-t border-[#232c42] space-y-4">
                      {/* Tindakan Cepat Seksi */}
                      <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                          Tindakan Seksi &amp; Posisi
                        </label>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => moveSectionUp(selectedSectionId)}
                            className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ChevronUp className="w-4 h-4" />
                            <span>Naikkan Posisi</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSectionDown(selectedSectionId)}
                            className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                            <span>Turunkan Posisi</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDuplicateSection(selectedSectionId)}
                            className="py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Duplikat Div</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSection(selectedSectionId)}
                            className="py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus Div</span>
                          </button>
                        </div>
                      </div>

                      {/* Border & Shadow */}
                      <div className="pt-3 border-t border-slate-700/60 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                            Sudut Melengkung (Border Radius)
                          </label>
                          <select
                            value={getSelectedSectionProperty('borderRadius', '0px')}
                            onChange={(e) => updateSectionProperty('borderRadius', e.target.value)}
                            className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                          >
                            <option value="0px">Persegi (0px)</option>
                            <option value="8px">Membulat Halus (8px)</option>
                            <option value="16px">Membulat Sedang (16px)</option>
                            <option value="24px">Membulat Lebar (24px)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                            Efek Bayangan (Shadow)
                          </label>
                          <select
                            value={getSelectedSectionProperty('boxShadow', 'none')}
                            onChange={(e) => updateSectionProperty('boxShadow', e.target.value)}
                            className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                          >
                            <option value="none">Tanpa Bayangan (None)</option>
                            <option value="0 1px 3px 0 rgba(0, 0, 0, 0.1)">Bayangan Halus (Soft)</option>
                            <option value="0 10px 15px -3px rgba(0, 0, 0, 0.2)">Bayangan Sedang (Medium)</option>
                            <option value="0 25px 50px -12px rgba(0, 0, 0, 0.35)">Bayangan Mewah Berlapis (Luxury)</option>
                          </select>
                        </div>
                      </div>
                      </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Panel Pengaturan Footer */}
            <div className="p-3 bg-[#111624] border-t border-[#232c42] flex items-center justify-between text-xs">
              <span className="text-slate-400">Sinkron langsung ke tampilan</span>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-[#dfa82e] hover:bg-[#eab946] text-[#0a1420] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>

          </aside>
        )}

      </div>

      {/* ── 3. MODAL TAMBAHKAN BAGIAN ────────────────────────────────────────── */}
      {insertModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#131929] border border-[#dfa82e]/30 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#232c42] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#dfa82e]" />
                  Tambahkan Bagian Baru
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {insertModalTarget === '__end__' ? (
                    <>Pilih bagian yang ingin ditambahkan di <strong className="text-white">Paling Bawah Halaman</strong>.</>
                  ) : (
                    <>Pilih bagian yang ingin ditambahkan sebelum <strong className="text-white">{standardHomeSections[insertModalTarget]?.name || 'Bagian Tujuan'}</strong>.</>
                  )}
                </p>
              </div>
              <button
                onClick={() => setInsertModalTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Templates Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {componentTemplates.map((tpl) => (
                <button
                  key={tpl.type}
                  onClick={() => insertComponentBefore(insertModalTarget, tpl.type)}
                  className="p-3.5 rounded-xl border border-[#25304a] bg-[#161e31] hover:border-[#dfa82e]/70 hover:bg-[#1b253d] text-left transition-all flex flex-col gap-1.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#dfa82e]">{tpl.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#dfa82e]">
                        {tpl.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {tpl.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tpl.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#232c42] flex items-center justify-end">
              <button
                onClick={() => setInsertModalTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. MODAL RIWAYAT PERUBAHAN (SAVE STATES RESTORE) ───────────────────── */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#131929] border border-amber-500/30 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#232c42] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  Riwayat Perubahan &amp; Titik Pemulihan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jika komponen tidak sengaja terhapus, pilih versi sebelumnya untuk mengembalikannya secara utuh.
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Snapshots List */}
            <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
              {historySnapshots.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada riwayat perubahan terekam pada sesi ini.
                </div>
              ) : (
                historySnapshots.map((snap, i) => (
                  <div
                    key={snap.id}
                    className="p-3.5 rounded-xl bg-[#0f1422] border border-[#252f47] hover:border-amber-400/40 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{snap.action}</span>
                        {i === 0 && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                            Terkini
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        Terekam pukul {snap.time}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-400/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#232c42] text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
