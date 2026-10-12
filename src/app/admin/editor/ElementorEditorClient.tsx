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
  Code
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
  icon: string;
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

  // Canva Left Dock Tab: 'elements' | 'pages' | 'history' | 'styles'
  const [canvaTab, setCanvaTab] = useState<'elements' | 'pages' | 'history' | 'styles'>('elements');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [searchElementQuery, setSearchElementQuery] = useState<string>('');

  // Selected Section & Properties Inspector State
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('hero');
  const [showPropertiesPanel, setShowPropertiesPanel] = useState<boolean>(true);
  const [propertyTab, setPropertyTab] = useState<'content' | 'background' | 'spacing' | 'typography' | 'effects'>('content');

  // Modal Insert Component Before Target Section
  const [insertModalTarget, setInsertModalTarget] = useState<string | null>(null);

  // Drag and drop states for sidebar page reordering
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

  // Undo / Redo & Save States History
  const [undoStack, setUndoStack] = useState<SiteContent[]>([]);
  const [redoStack, setRedoStack] = useState<SiteContent[]>([]);
  const [historySnapshots, setHistorySnapshots] = useState<HistorySnapshot[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Standard Sections Information for Home
  const standardHomeSections: Record<string, { name: string; icon: string; desc: string }> = {
    hero: { name: 'Hero Banner Utama', icon: '🚀', desc: 'Headline, video latar, tombol CTA' },
    'trust-stats': { name: 'Statistik Kepercayaan', icon: '📊', desc: 'Angka legalitas, izin OSS, standar kepatuhan' },
    about: { name: 'Tentang SELECO', icon: '🏢', desc: 'Profil firma, nilai korporasi' },
    services: { name: '5 Pilar Layanan', icon: '💼', desc: 'Perizinan, imigrasi, pajak, tanah, SDM' },
    retainer: { name: 'Program Retainer', icon: '🛡️', desc: 'Pendampingan hukum bulanan' },
    team: { name: 'Tim Konsultan', icon: '👥', desc: 'Daftar konsultan hukum & spesialis' },
    insights: { name: 'Legal Insights', icon: '📰', desc: 'Artikel publikasi & analisa regulasi' },
    faq: { name: 'Tanya Jawab (FAQ)', icon: '❓', desc: 'Pertanyaan seputar konsultasi' },
    contact: { name: 'Kontak & Alamat Kantor', icon: '📞', desc: 'Nomor WhatsApp, email, peta kantor' },
  };

  // Available Draggable Component Templates (Canva Element Library)
  const componentTemplates: ComponentTemplate[] = [
    {
      type: 'banner',
      title: 'Hero Banner / Promo',
      desc: 'Banner headline besar, latar warna elegan, badge, & tombol aksi',
      icon: '🚀',
      badge: 'BANNER',
      color: 'from-amber-500/20 to-amber-900/30 border-amber-500/30'
    },
    {
      type: 'text',
      title: 'Teks & Paragraf Konten',
      desc: 'Judul seksi, subjudul, dan teks paragraf penjelasan bebas',
      icon: '📝',
      badge: 'TEKS',
      color: 'from-blue-500/20 to-blue-900/30 border-blue-500/30'
    },
    {
      type: 'cta',
      title: 'Tombol WhatsApp & CTA',
      desc: 'Banner konversi dengan tombol kontak langsung ke WhatsApp konsultan',
      icon: '💬',
      badge: 'WHATSAPP',
      color: 'from-emerald-500/20 to-emerald-900/30 border-emerald-500/30'
    },
    {
      type: 'columns',
      title: '3 Kolom Fitur / Kartu',
      desc: '3 kartu berdampingan untuk pilar keunggulan layanan',
      icon: '📊',
      badge: '3 KOLOM',
      color: 'from-purple-500/20 to-purple-900/30 border-purple-500/30'
    },
    {
      type: 'faq',
      title: 'Tanya Jawab (FAQ) Tambahan',
      desc: 'Daftar pertanyaan & jawaban konsultasi bisnis baru',
      icon: '❓',
      badge: 'FAQ',
      color: 'from-cyan-500/20 to-cyan-900/30 border-cyan-500/30'
    },
    {
      type: 'image',
      title: 'Galeri Foto & Visual',
      desc: 'Banner gambar dokumentasi legalitas dengan keterangan foto',
      icon: '🖼️',
      badge: 'GAMBAR',
      color: 'from-rose-500/20 to-rose-900/30 border-rose-500/30'
    },
    {
      type: 'html',
      title: 'HTML & Widget Kustom (Peta / Video)',
      desc: 'Embed Google Maps, Video YouTube, atau widget bebas tanpa koding',
      icon: '💻',
      badge: 'WIDGET / MAPS',
      color: 'from-orange-500/20 to-orange-900/30 border-orange-500/30'
    },
    {
      type: 'blank',
      title: 'Kontainer / Div Kosong',
      desc: 'Div serbaguna untuk tata letak custom bebas',
      icon: '📦',
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
        addSnapshot('Simpan Permanen ke Server', content);
        setSaveSuccessMessage('Semua perubahan berhasil disimpan & online!');
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
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      };
    } else if (type === 'html') {
      newSection = {
        ...newSection,
        title: 'Lokasi Kantor & Peta Wilayah',
        subtitle: 'Kunjungi kantor kami atau lihat rute perjalanan Anda.',
        badge: 'PETA & WIDGET',
        rawHtml: '<div class="w-full h-80 rounded-2xl overflow-hidden border border-slate-300 shadow-md"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6234038743117!2d106.82226217499008!3d-6.181129993806307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305dfd58b7%3A0xe54d9c490a6ea259!2sJl.%20M.H.%20Thamrin%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>',
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

    const targetName = targetSectionId === '__end__' ? 'Paling Bawah' : (standardHomeSections[targetSectionId]?.name || 'Halaman Tujuan');
    pushStateChange(`Sisipkan ${newSection.title} (Sebelum ${targetName})`, newContent);
    setInsertModalTarget(null);
    setSelectedSectionId(newId);
    setShowPropertiesPanel(true);
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
      
      {/* ── 1. CANVA STUDIO TOP HEADER ────────────────────────────────────────── */}
      <header className="h-14 bg-[#111624] border-b border-[#232c42] px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 shadow-md">
        {/* Left: Home & Doc Title & Page Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] text-xs text-slate-200 border border-[#2d3a58] transition-colors"
            title="Kembali ke Dashboard Utama"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-semibold">Dashboard</span>
          </Link>

          <div className="h-5 w-px bg-slate-700/60 hidden sm:block mx-1" />

          {/* Canva Studio Logo Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 px-2.5 py-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Canva Studio
            </span>
          </div>

          {/* Page Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={activePage}
              onChange={(e) => handleSelectPage(e.target.value as PreviewPageOption)}
              className="bg-[#1a2236] border border-[#2d3a58] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer font-medium"
            >
              <option value="home">📄 Halaman Beranda (Home)</option>
              <option value="about">📄 Halaman Profil (Tentang Kami)</option>
              <option value="services">📄 Halaman Layanan (5 Pilar)</option>
              <option value="insight">📄 Halaman Legal Insight</option>
              <option value="contact">📄 Halaman Kontak Kantor</option>
            </select>
          </div>
        </div>

        {/* Center: Undo / Redo & Save State Indicator */}
        <div className="flex items-center gap-1.5">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              undoStack.length > 0
                ? 'bg-[#1a2236] border-[#2d3a58] text-white hover:bg-[#25304a] cursor-pointer'
                : 'bg-[#121827] border-[#1e2638] text-slate-600 cursor-not-allowed'
            }`}
            title="Kembalikan Perubahan (Undo) - Ctrl+Z"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Undo</span>
          </button>

          {/* Redo */}
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              redoStack.length > 0
                ? 'bg-[#1a2236] border-[#2d3a58] text-white hover:bg-[#25304a] cursor-pointer'
                : 'bg-[#121827] border-[#1e2638] text-slate-600 cursor-not-allowed'
            }`}
            title="Ulangi Perubahan (Redo) - Ctrl+Y"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Redo</span>
          </button>

          {/* Riwayat / Save State Button */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 px-2.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#2d3a58] text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Buka Riwayat Perubahan & Titik Pemulihan"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold hidden sm:inline">Riwayat</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {historySnapshots.length}
            </span>
          </button>

          {/* Toggle Properties Panel */}
          <button
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            className={`p-1.5 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              showPropertiesPanel
                ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                : 'bg-[#1a2236] border-[#2d3a58] text-slate-300 hover:bg-[#25304a]'
            }`}
            title="Buka / Tutup Panel Properti"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-semibold hidden md:inline">Properti</span>
          </button>

          {/* Autosave Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 pl-2">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                Ada perubahan
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Tersimpan di cloud
              </span>
            )}
          </div>
        </div>

        {/* Right: Device Viewport, Zoom & Save Publish Button */}
        <div className="flex items-center gap-2">
          {/* Device Viewport Toggle */}
          <div className="hidden sm:flex items-center bg-[#1a2236] rounded-lg p-0.5 border border-[#2d3a58]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                deviceMode === 'desktop' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Desktop / Komputer"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                deviceMode === 'tablet' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                deviceMode === 'mobile' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Ponsel"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center bg-[#1a2236] rounded-lg p-0.5 border border-[#2d3a58] text-xs">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
              className="p-1 px-1.5 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-semibold text-slate-300 px-1 min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
              className="p-1 px-1.5 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Preview Public Web */}
          <Link
            href="/"
            target="_blank"
            className="p-1.5 px-2.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#2d3a58] text-xs text-slate-300 transition-colors flex items-center gap-1.5"
            title="Lihat Website Asli di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline text-[11px]">Lihat Web</span>
          </Link>

          {/* Save / Publish Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Simpan</span>
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

      {/* ── 2. CANVA WORKSPACE BODY (LEFT DOCK + DRAWER + CANVAS + RIGHT PROPERTIES) */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── A. CANVA SLIM ICON DOCK (FAR LEFT) ───────────────────────────────── */}
        <aside className="w-16 bg-[#0e121e] border-r border-[#20273a] flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          <button
            onClick={() => setCanvaTab('elements')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'elements'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Pustaka Elemen & Komponen"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Elemen</span>
          </button>

          <button
            onClick={() => setCanvaTab('pages')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'pages'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Susunan Halaman & Seksi"
          >
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Halaman</span>
          </button>

          <button
            onClick={() => setCanvaTab('history')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'history'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Riwayat Perubahan & Save States"
          >
            <History className="w-5 h-5 text-amber-400" />
            <span>Riwayat</span>
          </button>

          <button
            onClick={() => setCanvaTab('styles')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'styles'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Gaya & Tema Warna"
          >
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Gaya</span>
          </button>
        </aside>

        {/* ── B. CANVA EXPANDED DRAWER PANEL (300px) ───────────────────────────── */}
        <aside className="w-72 sm:w-80 bg-[#131929] border-r border-[#232c42] flex flex-col shrink-0 z-10 overflow-hidden shadow-xl">
          
          {/* TAB 1: ELEMEN & KOMPONEN (DRAG & DROP LIBRARY) */}
          {canvaTab === 'elements' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Pustaka Komponen Visual
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tarik komponen ke kanvas, atau klik &quot;+ Sisipkan&quot; untuk meletakkannya sebelum halaman tertentu.
                </p>
              </div>

              {/* Search Element Bar */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari elemen, div, maps, banner..."
                  value={searchElementQuery}
                  onChange={(e) => setSearchElementQuery(e.target.value)}
                  className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Interactive Tip Box */}
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-2.5 mb-3 text-[11px] text-purple-200 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mudah Tanpa Kode:</strong> Klik komponen mana saja di kanvas untuk membuka menu kustomisasi isi, teks, gambar, dan tombolnya!
                </span>
              </div>

              {/* Component Cards List (Draggable!) */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {componentTemplates
                  .filter((tpl) => 
                    tpl.title.toLowerCase().includes(searchElementQuery.toLowerCase()) ||
                    tpl.desc.toLowerCase().includes(searchElementQuery.toLowerCase())
                  )
                  .map((tpl) => (
                    <div
                      key={tpl.type}
                      draggable={true}
                      onDragStart={(e) => handleDragStartComponent(e, tpl.type)}
                      className={`p-3 rounded-xl border bg-gradient-to-br ${tpl.color} hover:brightness-110 hover:border-purple-400 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2 group shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tpl.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-200">
                              {tpl.title}
                            </h4>
                            <span className="text-[10px] text-purple-300/80 font-bold tracking-wider">
                              {tpl.badge}
                            </span>
                          </div>
                        </div>
                        <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-purple-300" />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        {tpl.desc}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                        <span className="text-slate-400">Tarik ke kanvas</span>
                        <button
                          onClick={() => setInsertModalTarget(currentSections[0] || '__end__')}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                        >
                          + Sisipkan Cepat
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: SUSUNAN HALAMAN & SEKSI (REORDER DRAG & DROP) */}
          {canvaTab === 'pages' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Susunan Halaman
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Klik kartu untuk memilih &amp; edit properti.
                  </p>
                </div>
                <button
                  onClick={() => setInsertModalTarget('__end__')}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Div</span>
                </button>
              </div>

              {/* Sections List in Order with Drag & Drop Reordering */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {currentSections.map((secId, idx) => {
                  const isHidden = content.hiddenSections?.includes(secId);
                  const isCustom = secId.startsWith('custom-div-');
                  const customObj = isCustom ? (content.customSections || []).find((c: any) => c.id === secId) : null;
                  const secTitle = standardHomeSections[secId]?.name || customObj?.title || 'Komponen Kustom';
                  const secIcon = standardHomeSections[secId]?.icon || '⭐';
                  const isSelected = selectedSectionId === secId;

                  return (
                    <div
                      key={secId}
                      draggable={true}
                      onDragStart={(e) => handleDragStartSidebarItem(e, idx)}
                      onDragOver={handleDragOverSidebarItem}
                      onDrop={(e) => handleDropSidebarItem(e, idx)}
                      onClick={() => handleSelectSection(secId)}
                      className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-900/30 border-purple-500 shadow-md ring-2 ring-purple-500/50'
                          : isHidden
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                          : isCustom
                          ? 'bg-purple-950/20 border-purple-500/40 text-purple-200 hover:border-purple-400'
                          : 'bg-[#182136] border-[#293654] text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm">{secIcon}</span>
                          <div>
                            <span className="font-bold text-white block text-[11px]">
                              {idx + 1}. {secTitle}
                            </span>
                            {isSelected ? (
                              <span className="text-[10px] text-purple-300 font-bold flex items-center gap-1">
                                <Settings className="w-2.5 h-2.5" /> Sedang Diedit
                              </span>
                            ) : isHidden ? (
                              <span className="text-[10px] text-rose-400 font-semibold">Tersembunyi</span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-semibold">Aktif</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveSectionUp(secId)}
                            disabled={idx === 0}
                            className="p-1 rounded bg-[#0f1422] hover:bg-[#25304a] disabled:opacity-20 text-slate-300"
                            title="Naikkan Posisi"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveSectionDown(secId)}
                            disabled={idx === currentSections.length - 1}
                            className="p-1 rounded bg-[#0f1422] hover:bg-[#25304a] disabled:opacity-20 text-slate-300"
                            title="Turunkan Posisi"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {isHidden ? (
                            <button
                              onClick={() => handleRestoreDefaultSection(secId)}
                              className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold"
                            >
                              Pulihkan
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteSection(secId)}
                              className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300"
                              title="Hapus / Sembunyikan"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick insert button before this section */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInsertModalTarget(secId);
                        }}
                        className="w-full py-1 rounded bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 text-[10px] text-slate-300 hover:text-purple-200 font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Sisipkan Div Sebelum Halaman Ini</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT SNAPSHOTS (SAVE STATES) */}
          {canvaTab === 'history' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" />
                  Titik Pemulihan
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kembalikan desain ke titik waktu sebelum perubahan dilakukan.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {historySnapshots.map((snap, i) => (
                  <div
                    key={snap.id}
                    className="p-2.5 rounded-xl bg-[#182136] border border-[#293654] hover:border-amber-400/50 flex flex-col gap-1.5 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{snap.action}</span>
                      {i === 0 && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                          Terkini
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Pukul {snap.time}</span>
                    <button
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="w-full mt-1 py-1 rounded bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-[10px] font-bold border border-amber-400/30 transition-all cursor-pointer"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GAYA & WARNA */}
          {canvaTab === 'styles' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  Palet &amp; Tema SELECO
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Identitas visual resmi firma hukum SELECO.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#182136] border border-[#293654] space-y-2">
                  <h4 className="text-xs font-bold text-white">Warna Primer Firma</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-lg bg-[#0a1420] text-white border border-white/20">
                      <span>#0a1420</span>
                      <span className="block opacity-70">Navy Gelap</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#dfa82e] text-slate-950 font-bold">
                      <span>#dfa82e</span>
                      <span className="block opacity-80">Gold Utama</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#ffffff] text-slate-950 font-bold">
                      <span>#ffffff</span>
                      <span className="block opacity-70">Putih Bersih</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#182136] border border-[#293654] space-y-2 text-xs">
                  <h4 className="font-bold text-white">Panduan Tipografi</h4>
                  <p className="text-[11px] text-slate-300">
                    - Judul Utama: <strong className="text-[#dfa82e]">Cinzel Decorative Serif</strong> (Klasik &amp; Elegan)<br/>
                    - Konten &amp; Paragraf: <strong className="text-white">Plus Jakarta Sans</strong> (Modern &amp; Terbaca Jelas)
                  </p>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* ── C. CANVA WORKSPACE KANVAS (CENTER WORKSPACE) ─────────────────────── */}
        <main className="flex-1 bg-[#090d16] p-2 sm:p-6 overflow-auto flex flex-col items-center justify-start relative">
          
          {/* Document Canvas Sheet Wrapper */}
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
            className="bg-white rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] border border-slate-700/80 overflow-hidden transition-all duration-300 flex flex-col min-h-[900px] my-2"
          >
            {/* Document Header Margin Tab ala Canva */}
            <div className="bg-[#111624] border-b border-[#232c42] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="text-purple-400">📄</span>
                <span>Lembar Kerja Canva: <strong className="text-[#dfa82e]">{activePage.toUpperCase()}</strong></span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  Klik bagian apa saja untuk edit isinya
                </span>
                {selectedSectionId && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-semibold">
                    Dipilih: {selectedTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Iframe View of Live Website Page with Dropzones */}
            <iframe
              ref={iframeRef}
              src={`/admin/preview?page=${activePage}&mode=click_to_edit`}
              className="w-full flex-1 min-h-[850px] border-0 bg-white"
              title="Canva Studio Editor"
            />
          </div>

        </main>

        {/* ── D. RIGHT PROPERTIES INSPECTOR PANEL (PANEL PROPERTI LENGKAP) ──────── */}
        {showPropertiesPanel && (
          <aside className="w-80 sm:w-96 bg-[#131929] border-l border-[#232c42] flex flex-col shrink-0 z-20 overflow-hidden shadow-2xl animate-in slide-in-from-right duration-200">
            
            {/* Properties Panel Header */}
            <div className="p-3.5 bg-[#111624] border-b border-[#232c42] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Kustomisasi Komponen
                  </h3>
                  <p className="text-[10px] text-purple-300 truncate max-w-[200px]">
                    {selectedTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPropertiesPanel(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Tutup Panel Properti"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Properties Tabs */}
            <div className="flex items-center border-b border-[#232c42] bg-[#0e121e] px-2 text-[11px] overflow-x-auto">
              <button
                onClick={() => setPropertyTab('content')}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  propertyTab === 'content'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                📝 Isi &amp; Teks
              </button>
              <button
                onClick={() => setPropertyTab('background')}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  propertyTab === 'background'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                🎨 Latar &amp; Warna
              </button>
              <button
                onClick={() => setPropertyTab('spacing')}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  propertyTab === 'spacing'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                📐 Ukuran &amp; Jarak
              </button>
              <button
                onClick={() => setPropertyTab('typography')}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  propertyTab === 'typography'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                🔤 Rata Teks
              </button>
              <button
                onClick={() => setPropertyTab('effects')}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  propertyTab === 'effects'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Tindakan
              </button>
            </div>

            {/* Properties Form Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {!selectedSectionId ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-semibold text-slate-400">Belum Ada Komponen Dipilih</p>
                  <p className="text-[11px]">Klik salah satu komponen pada kanvas untuk mengedit teks dan isinya.</p>
                </div>
              ) : (
                <>
                  {/* TAB 1: KONTEN & ISI KOMPONEN SECARA SPESIFIK */}
                  {propertyTab === 'content' && (
                    <div className="space-y-4">
                      
                      {/* 1. KHUSUS HERO BANNER UTAMA */}
                      {selectedSectionId === 'hero' && (
                        <div className="space-y-3.5">
                          <div className="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded-xl text-[11px] text-purple-300">
                            <strong>Isi Komponen Hero:</strong> Ubah headline, video, tombol, dan statistik di bawah ini secara instan.
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <span className="font-bold text-white block text-[11px]">Tombol Utama (CTA 1)</span>
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
                            <span className="font-bold text-white block text-[11px]">Tombol Kedua (CTA 2)</span>
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <span className="font-bold text-white block text-[11px]">Angka Statistik Kepercayaan</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-400">Angka 1</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat1Number || ''}
                                  onChange={(e) => updateSectionProperty('stat1Number', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">Label 1</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat1Label || ''}
                                  onChange={(e) => updateSectionProperty('stat1Label', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400">Angka 2</span>
                                <input
                                  type="text"
                                  value={content.hero?.stat2Number || ''}
                                  onChange={(e) => updateSectionProperty('stat2Number', e.target.value)}
                                  className="w-full bg-[#131929] border border-[#252f47] rounded px-2 py-1 text-xs text-white"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">Label 2</span>
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
                              <label className="text-[11px] font-bold text-slate-300">
                                Tag Keunggulan Layanan ({content.hero?.featurePills?.length || 0})
                              </label>
                              <button
                                type="button"
                                onClick={handleAddHeroPill}
                                className="text-[10px] text-purple-300 hover:text-white font-bold bg-purple-600/30 px-2 py-0.5 rounded cursor-pointer"
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Kategori</label>
                            <input
                              type="text"
                              value={content.about?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Utama</label>
                            <input
                              type="text"
                              value={content.about?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Aksen Emas</label>
                            <input
                              type="text"
                              value={content.about?.titleAccent || ''}
                              onChange={(e) => updateSectionProperty('titleAccent', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-amber-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Paragraf 1</label>
                            <textarea
                              rows={3}
                              value={content.about?.paragraph1 || ''}
                              onChange={(e) => updateSectionProperty('paragraph1', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Paragraf 2</label>
                            <textarea
                              rows={3}
                              value={content.about?.paragraph2 || ''}
                              onChange={(e) => updateSectionProperty('paragraph2', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Tahun Pengalaman</label>
                            <input
                              type="text"
                              value={content.about?.experienceYears || ''}
                              onChange={(e) => updateSectionProperty('experienceYears', e.target.value)}
                              placeholder="10+"
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">URL Foto 1</label>
                            <input
                              type="text"
                              value={content.about?.image1 || ''}
                              onChange={(e) => updateSectionProperty('image1', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">URL Foto 2</label>
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Kategori</label>
                            <input
                              type="text"
                              value={content.services?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Layanan</label>
                            <input
                              type="text"
                              value={content.services?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Subjudul Deskripsi</label>
                            <textarea
                              rows={3}
                              value={content.services?.subtitle || ''}
                              onChange={(e) => updateSectionProperty('subtitle', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white leading-relaxed"
                            />
                          </div>

                          <div className="p-3 rounded-xl bg-[#0e1320] border border-[#252f47] space-y-2">
                            <span className="font-bold text-white block text-[11px]">Banner Promo CTA di Layanan</span>
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge</label>
                            <input
                              type="text"
                              value={content.faq?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Seksi</label>
                            <input
                              type="text"
                              value={content.faq?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Subjudul</label>
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
                              <span className="font-bold text-white text-[11px]">
                                Daftar Pertanyaan &amp; Jawaban ({content.faq?.items?.length || 0})
                              </span>
                              <button
                                type="button"
                                onClick={handleAddFaqItem}
                                className="px-2 py-0.5 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[10px] font-bold"
                              >
                                + Tambah FAQ
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(content.faq?.items || []).map((faq, i) => (
                                <div key={i} className="p-2.5 rounded-lg bg-[#0e1320] border border-[#252f47] space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-amber-300">FAQ #{i + 1}</span>
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge</label>
                            <input
                              type="text"
                              value={content.contact?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Seksi</label>
                            <input
                              type="text"
                              value={content.contact?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Nomor WhatsApp Konsultan</label>
                            <input
                              type="text"
                              value={content.global?.whatsappNumber || ''}
                              onChange={(e) => updateSectionProperty('global.whatsappNumber', e.target.value)}
                              placeholder="6282211020022"
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Telepon Kantor</label>
                            <input
                              type="text"
                              value={content.global?.phone || ''}
                              onChange={(e) => updateSectionProperty('global.phone', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Resmi</label>
                            <input
                              type="text"
                              value={content.global?.email || ''}
                              onChange={(e) => updateSectionProperty('global.email', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Alamat Fisik Kantor</label>
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
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
                              <span className="text-[10px] text-slate-400 block mb-0.5">Teks Tombol</span>
                              <input
                                type="text"
                                value={getSelectedSectionProperty('buttonText', '')}
                                onChange={(e) => updateSectionProperty('buttonText', e.target.value)}
                                placeholder="e.g. Chat WhatsApp"
                                className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-0.5">Link / WhatsApp</span>
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
                              <span className="font-bold text-orange-300 flex items-center gap-1.5 text-[11px]">
                                <Code className="w-3.5 h-3.5" /> HTML / Embed Bebas (Maps, Video, Widget)
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Untuk embed Google Maps, video YouTube, atau widget lain, tempelkan kode HTML di sini:
                            </p>
                            <textarea
                              rows={4}
                              value={getSelectedSectionProperty('rawHtml', '')}
                              onChange={(e) => updateSectionProperty('rawHtml', e.target.value)}
                              placeholder='<iframe src="https://www.google.com/maps/embed?..." width="100%" height="400"></iframe>'
                              className="w-full bg-[#131929] border border-[#252f47] rounded p-2 text-[11px] font-mono text-orange-200 focus:outline-none focus:border-orange-400"
                            />
                            {/* Tombol Contoh 1-Klik */}
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateSectionProperty('rawHtml', '<div class="w-full h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-300"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6234038743117!2d106.82226217499008!3d-6.181129993806307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305dfd58b7%3A0xe54d9c490a6ea259!2sJl.%20M.H.%20Thamrin%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>')}
                                className="text-[10px] px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded font-bold"
                              >
                                + Contoh Maps
                              </button>
                              <button
                                type="button"
                                onClick={() => updateSectionProperty('rawHtml', '<div class="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"><iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe></div>')}
                                className="text-[10px] px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded font-bold"
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
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge</label>
                            <input
                              type="text"
                              value={content.retainer?.badge || ''}
                              onChange={(e) => updateSectionProperty('badge', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Retainer</label>
                            <input
                              type="text"
                              value={content.retainer?.title || ''}
                              onChange={(e) => updateSectionProperty('title', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Subjudul</label>
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
                          <p className="text-[11px] text-slate-400">Statistik kepercayaan utama perusahaan:</p>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Total Sektoral Layanan</label>
                            <input
                              type="text"
                              value={content.global?.totalServices || ''}
                              onChange={(e) => updateSectionProperty('global.totalServices', e.target.value)}
                              className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Izin OSS Terbit</label>
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

                  {/* TAB 2: LATAR BELAKANG & WARNA (BACKGROUND) */}
                  {propertyTab === 'background' && (
                    <div className="space-y-4">
                      {/* Warna Latar (Background Color) */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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
                              className="h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform shadow-sm"
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Warna Teks (Text Color) */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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
                            className="flex-1 py-1 rounded bg-[#0e1320] border border-white/20 text-white font-bold text-[10px]"
                          >
                            Teks Putih
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textColor', '#0f172a')}
                            className="flex-1 py-1 rounded bg-white text-slate-900 font-bold text-[10px]"
                          >
                            Teks Gelap
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('textColor', '#dfa82e')}
                            className="flex-1 py-1 rounded bg-[#dfa82e] text-slate-950 font-bold text-[10px]"
                          >
                            Teks Gold
                          </button>
                        </div>
                      </div>

                      {/* Gambar Latar (Background Image) */}
                      <div className="pt-2 border-t border-slate-700/60">
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                            onClick={() => updateSectionProperty('bgImage', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')}
                            className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          >
                            Gedung Bisnis
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('bgImage', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80')}
                            className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          >
                            Ruang Meeting
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSectionProperty('bgImage', '')}
                            className="text-[10px] px-2 py-1 bg-rose-900/40 hover:bg-rose-900/60 rounded text-rose-300"
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: UKURAN & SPASI (SPACING, PADDING & MARGIN) */}
                  {propertyTab === 'spacing' && (
                    <div className="space-y-4">
                      {/* Padding Atas & Bawah (Padding Y) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Jarak Atas &amp; Bawah (Padding Y)
                          </label>
                          <span className="text-[11px] font-mono text-purple-300">
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
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Jarak Samping (Padding X)
                          </label>
                          <span className="text-[11px] font-mono text-purple-300">
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
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Jarak Luar Antar Seksi (Margin Y)
                          </label>
                          <span className="text-[11px] font-mono text-purple-300">
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
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
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

                  {/* TAB 4: RATA TEKS & TIPOGRAFI */}
                  {propertyTab === 'typography' && (
                    <div className="space-y-4">
                      {/* Posisi Rata Teks */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
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

                  {/* TAB 5: TINDAKAN CEPAT & DUPLIKASI */}
                  {propertyTab === 'effects' && (
                    <div className="space-y-4">
                      {/* Tindakan Cepat Seksi */}
                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
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
                          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                </>
              )}
            </div>

            {/* Properties Panel Footer */}
            <div className="p-3 bg-[#111624] border-t border-[#232c42] flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Sinkron otomatis ke kanvas</span>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>

          </aside>
        )}

      </div>

      {/* ── 3. MODAL SISIPKAN KOMPONEN SEBELUM HALAMAN TERTENTU ──────────────── */}
      {insertModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131929] border border-purple-500/30 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#232c42] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Sisipkan Komponen / Div
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  Pilih komponen visual yang ingin diletakkan sebelum:{' '}
                  <strong className="text-white">
                    {insertModalTarget === '__end__' ? 'Paling Bawah Halaman' : (standardHomeSections[insertModalTarget]?.name || 'Halaman Tujuan')}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setInsertModalTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                  className={`p-3.5 rounded-xl border bg-gradient-to-br ${tpl.color} hover:brightness-125 hover:border-purple-400 text-left transition-all flex flex-col gap-1.5 group cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tpl.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-200">
                        {tpl.title}
                      </h4>
                      <span className="text-[10px] text-purple-300 font-bold">
                        {tpl.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            Terkini
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
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
