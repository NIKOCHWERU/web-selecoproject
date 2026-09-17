export interface SiteContent {
  global: {
    brandName: string;
    brandTagline: string;
    logo?: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    phone: string;
    email: string;
    address: string;
    consultationUrl: string;
    badgeText: string;
    totalServices: string;
    litigationCount: string;
    ossLicenseCount: string;
  };
  hero: {
    topBadge: string;
    headlinePart1: string;
    headlineItalic: string;
    subheadline: string;
    bgImage: string;
    ctaButton1Text: string;
    ctaButton1Link: string;
    ctaButton2Text: string;
    ctaButton2Link: string;
    featurePills: string[];
    sealQuote: string;
    sealDescription: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
  };
  about: {
    badge: string;
    title: string;
    titleAccent: string;
    paragraph1: string;
    paragraph2: string;
    image1: string;
    image2: string;
    experienceYears: string;
    values: Array<{
      title: string;
      description: string;
    }>;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBannerTitle: string;
    ctaBannerSubtitle: string;
    ctaBannerButtonText: string;
    pillars?: Array<{
      id: string;
      name: string;
      count: string;
      description: string;
      linkText: string;
      linkUrl: string;
      iconName?: string;
    }>;
  };
  retainer: {
    badge: string;
    title: string;
    subtitle: string;
  };
  team: {
    badge: string;
    title: string;
    subtitle: string;
    members: Array<{
      id: string;
      name: string;
      role: string;
      specialization: string;
      image: string;
      bio: string;
    }>;
  };
  insights: {
    badge: string;
    title: string;
    subtitle: string;
    articles: Array<{
      id: string;
      title: string;
      tag: string;
      date: string;
      readTime: string;
      image: string;
      excerpt: string;
    }>;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    offices: Array<{
      city: string;
      name: string;
      address: string;
      phone: string;
    }>;
  };
  footer: {
    description: string;
    copyright: string;
  };
  siteMode?: {
    status: 'maintenance' | 'live';
    badgeText: string;
    title: string;
    subtitle: string;
    estimatedDate: string;
    whatsappText: string;
  };
  styles?: {
    [elementKey: string]: {
      textAlign?: 'left' | 'center' | 'right' | 'justify';
      fontSize?: string;
      color?: string;
      fontWeight?: string;
      fontStyle?: string;
      textDecoration?: string;
      lineHeight?: string;
      letterSpacing?: string;
      margin?: string;
      padding?: string;
      borderRadius?: string;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: string;
      borderStyle?: string;
      opacity?: string;
      boxShadow?: string;
      // Image & Background CSS & Cropping properties
      objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
      objectPosition?: string; // e.g. 'center', 'top', 'bottom', '50% 20%'
      backgroundPosition?: string;
      backgroundSize?: string;
      aspectRatio?: string; // e.g. '16/9', '4/3', '1/1', 'auto'
      filterBrightness?: string; // e.g. '1', '0.8', '1.2'
      filterContrast?: string;
      filterGrayscale?: string; // e.g. '0%', '100%'
      filterBlur?: string;
      scale?: string; // zoom factor e.g. '1', '1.1', '1.25'
      rotate?: string; // e.g. '0deg', '90deg'
      [prop: string]: any;
    };
  };
}

export const defaultSiteContent: SiteContent = {
  global: {
    brandName: "SELECO",
    brandTagline: "SEDANA LEGAL CONSULTANT",
    logo: "/logo-seleco.png",
    whatsappNumber: "6282211020022",
    whatsappDisplay: "0822-1102-0022",
    phone: "+62 822-1102-0022",
    email: "hello@selecoproject.com",
    address: "Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340",
    consultationUrl: "/kontak",
    badgeText: "5 Pilar Konsultan Bisnis Terpadu",
    totalServices: "445+",
    litigationCount: "34",
    ossLicenseCount: "411+",
  },
  hero: {
    topBadge: "5 Pilar Konsultan Bisnis Terpadu",
    headlinePart1: "Konsultan Terpadu untuk Akselerasi &",
    headlineItalic: "Pertumbuhan Bisnis.",
    subheadline: "SELECO menyediakan 5 pilar konsultan korporasi profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara transparan, akurat, dan terpercaya.",
    bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
    ctaButton1Text: "Cari 445+ Layanan Konsultan",
    ctaButton1Link: "/layanan",
    ctaButton2Text: "Jadwalkan Konsultasi",
    ctaButton2Link: "/kontak",
    featurePills: [
      "Konsultan Perizinan",
      "Konsultan Imigrasi",
      "Konsultan Pajak",
      "Konsultan Pertanahan",
      "Konsultan SDM"
    ],
    sealQuote: "“Integrity. Strategy. Corporate Excellence.”",
    sealDescription: "Mitra konsultan korporasi terpercaya di Indonesia yang berfokus pada perizinan berusaha, keimigrasian & TKA, perpajakan, legalitas pertanahan BPN, serta manajemen SDM.",
    stat1Number: "10+",
    stat1Label: "Tahun Pengalaman",
    stat2Number: "445+",
    stat2Label: "Cakupan Layanan",
  },
  about: {
    badge: "Tentang SELECO",
    title: "Solusi Konsultan Terstruktur untuk",
    titleAccent: "Pertumbuhan Bisnis.",
    paragraph1: "SELECO (Sedana Corporate Consultant) adalah konsultan korporasi terkemuka di Indonesia yang berdedikasi memberikan solusi terpadu mencakup Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM bagi pelaku usaha, korporasi nasional, dan multinasional.",
    paragraph2: "Dengan keahlian mendalam pada 5 pilar layanan konsultan serta pengurusan 411+ izin usaha OSS RBA dan kepatuhan instansi teknis, kami memastikan seluruh operasional bisnis Anda berjalan lancar, aman, dan patuh regulasi.",
    image1: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    image2: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    experienceYears: "10+",
    values: [
      {
        title: "Integritas Tertinggi",
        description: "Menjunjung standar etika konsultan profesional dengan transparansi penuh dalam setiap pendampingan dan perizinan bisnis.",
      },
      {
        title: "Solusi Strategis & Terarah",
        description: "Kami merancang kepatuhan perizinan dan strategi mitigasi operasional untuk mendukung pertumbuhan perusahaan.",
      },
      {
        title: "Responsif & Terukur",
        description: "Komunikasi aktif, pembaruan proses berkala, dan kepastian biaya jasa konsultan yang jelas tanpa biaya tersembunyi.",
      },
      {
        title: "Kerahasiaan Klien Mutlak",
        description: "Seluruh data, dokumen rahasia perusahaan, dan informasi operasional klien terlindungi dengan standar kerahasiaan tinggi.",
      },
    ],
  },
  services: {
    badge: "5 Pilar Layanan Konsultan Terpadu",
    title: "Solusi Konsultan Terpadu untuk",
    subtitle: "Kebutuhan Bisnis & Korporasi",
    ctaBannerTitle: "Membutuhkan Konsultasi Bisnis Spesifik?",
    ctaBannerSubtitle: "Tim konsultan kami siap meninjau kebutuhan dan memberikan panduan perizinan, imigrasi, pajak, pertanahan, serta manajemen SDM terbaik.",
    ctaBannerButtonText: "Konsultasi WhatsApp Langsung",
    pillars: [
      {
        id: "perizinan",
        name: "Konsultan Perizinan",
        count: "242 Items",
        description: "Pendirian Badan Usaha (PT/CV/PMA), Izin Usaha Berbasis Risiko OSS RBA, NIB, Sertifikat Standar, PB UMKU, Izin Operasional Sektoral, BPOM, Halal & SNI.",
        linkText: "Lihat Seluruh 242 Layanan",
        linkUrl: "/layanan?cat=perizinan",
        iconName: "FileCheck"
      },
      {
        id: "imigrasi",
        name: "Konsultan Imigrasi",
        count: "36 Items",
        description: "Pengurusan VISA Bisnis/Investor, KITAS/ITAS Kerja, ITAP Izin Tinggal Tetap, RPTKA Tenaga Kerja Asing, Paspor, dan Layanan Keimigrasian WNA/WNI.",
        linkText: "Lihat Seluruh 36 Layanan",
        linkUrl: "/layanan?cat=imigrasi",
        iconName: "Globe"
      },
      {
        id: "pajak",
        name: "Konsultan Pajak",
        count: "86 Items",
        description: "Tax Advisory & Planning, Kepatuhan Pajak Badan & Pribadi, Pelaporan SPT Masa & Tahunan, Restitusi Pajak, dan Pendampingan Pemeriksaan Pajak.",
        linkText: "Lihat Seluruh 86 Layanan",
        linkUrl: "/layanan?cat=pajak",
        iconName: "Receipt"
      },
      {
        id: "pertanahan",
        name: "Konsultan Pertanahan",
        count: "45 Items",
        description: "Pengurusan Sertifikat Tanah BPN (SHM, HGB, HGU), Pengecekan Keabsahan Sertifikat, Balik Nama, Roya Hak Tanggungan, KKPR Tata Ruang, serta PBG & SLF.",
        linkText: "Lihat Seluruh 45 Layanan",
        linkUrl: "/layanan?cat=pertanahan",
        iconName: "Landmark"
      },
      {
        id: "sdm",
        name: "Konsultan SDM",
        count: "36 Items",
        description: "Penyusunan Peraturan Perusahaan (PP), Perjanjian Kerja Bersama (PKB), Struktur & Skala Upah, Kontrak Kerja Karyawan PKWT/PKWTT, BPJS, dan Audit SDM.",
        linkText: "Lihat Seluruh 36 Layanan",
        linkUrl: "/layanan?cat=sdm",
        iconName: "Users"
      }
    ],
  },
  retainer: {
    badge: "Corporate Retainer Program",
    title: "Mitra Konsultan In-House untuk",
    subtitle: "Keberlanjutan & Kepatuhan Bisnis Anda",
  },
  team: {
    badge: "Tim Konsultan Profesional",
    title: "Dipimpin oleh Praktisi Berpengalaman",
    subtitle: "Berdedikasi & Terpercaya",
    members: [
      {
        id: "1",
        name: "Sedana, S.H., M.H.",
        role: "Managing Partner & Corporate Consultant",
        specialization: "Konsultan Perizinan, Investasi PMA & Restrukturisasi Usaha",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80",
        bio: "Berpengalaman lebih dari 12 tahun mendampingi perizinan investasi, pendirian badan usaha, dan kepatuhan regulasi korporasi nasional & multinasional.",
      },
      {
        id: "2",
        name: "Arya Wibawa, S.H., LL.M.",
        role: "Partner - Immigration & Tax Consultant",
        specialization: "Konsultan Imigrasi (KITAS/VISA/TKA) & Konsultan Pajak Korporasi",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        bio: "Ahli regulasi penanaman modal, perizinan tenaga kerja asing (TKA/RPTKA), serta kepatuhan perpajakan korporasi dan audit pajak.",
      },
      {
        id: "3",
        name: "Ratna Sari, S.H., M.Kn.",
        role: "Senior Consultant - Land & HR Specialist",
        specialization: "Konsultan Pertanahan (BPN/KKPR/PBG) & Konsultan SDM (PP/PKB/Upah)",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        bio: "Spesialis audit legalitas pertanahan & perizinan tata ruang BPN, serta penyusunan Peraturan Perusahaan, PKB, dan audit ketenagakerjaan SDM.",
      },
    ],
  },
  insights: {
    badge: "Artikel & Analisis Bisnis",
    title: "Insight Regulasi & Manajemen Terkini untuk",
    subtitle: "Pengambilan Keputusan Cermat",
    articles: [
      {
        id: "1",
        title: "Panduan Lengkap Migrasi Izin Usaha ke Sistem OSS RBA Terbaru 2026",
        tag: "Perizinan OSS",
        date: "10 Sep 2026",
        readTime: "5 menit baca",
        image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
        excerpt: "Langkah-langkah strategis bagi korporasi dan pelaku usaha dalam memenuhi persyaratan dasar perizinan berusaha berbasis risiko sesuai regulasi pemerintah terkini.",
      },
      {
        id: "2",
        title: "Strategi Pengelolaan Pajak dan Kepatuhan SPT Tahunan Badan yang Efisien",
        tag: "Konsultan Pajak",
        date: "04 Sep 2026",
        readTime: "7 menit baca",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
        excerpt: "Tips praktis mengelola tax planning, pelaporan SPT badan secara akurat, dan mitigasi risiko sanksi denda administrasi perpajakan.",
      },
      {
        id: "3",
        title: "Prosedur Pengurusan KITAS Investor dan Izin Kerja Tenaga Kerja Asing (TKA) di Indonesia",
        tag: "Konsultan Imigrasi",
        date: "28 Agu 2026",
        readTime: "6 menit baca",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
        excerpt: "Panduan komprehensif bagi perusahaan PMA dalam pengajuan RPTKA, notifikasi Kemenaker, serta izin tinggal KITAS dan ITAP di Ditjen Imigrasi.",
      },
    ],
  },
  faq: {
    badge: "Pertanyaan Populer",
    title: "Pertanyaan yang Sering",
    subtitle: "Diajukan seputar Layanan Kami",
    items: [
      {
        question: "Bagaimana tahapan awal konsultasi di SELECO?",
        answer: "Anda dapat menghubungi kami melalui WhatsApp atau formulir website. Tim kami akan melakukan penjadwalan konsultasi awal (tatap muka atau online via Zoom) untuk menelaah kebutuhan perizinan, imigrasi, perpajakan, pertanahan, atau manajemen SDM, meninjau dokumen perusahaan, dan menyusun roadmap langkah kerja terbaik.",
      },
      {
        question: "Berapa lama estimasi pengurusan izin usaha OSS RBA?",
        answer: "Lama pengurusan bergantung pada tingkat risiko KBLI (Rendah, Menengah Rendah, Menengah Tinggi, atau Tinggi). Untuk risiko rendah-menengah, NIB dapat terbit dalam 1-3 hari kerja. Untuk risiko tinggi dengan AMDAL/PBG/SLF, tim kami mendampingi verifikasi teknis instansi terkait hingga izin operasional terbit penuh.",
      },
      {
        question: "Apakah SELECO melayani pengurusan perizinan dan konsultasi di luar Jabodetabek?",
        answer: "Ya. Tim konsultan kami menangani pendirian badan usaha, perizinan OSS RBA, serta perizinan sektoral di seluruh wilayah Indonesia, berkoordinasi langsung dengan kementerian teknis dan dinas penanaman modal (DPMPTSP) di berbagai daerah.",
      },
      {
        question: "Apa keuntungan mengambil program Retainer Konsultan Korporasi bulanan?",
        answer: "Program Retainer memberikan perusahaan Anda akses ke tim konsultan profesional terpadu (perizinan, imigrasi, pajak, pertanahan, dan SDM) tanpa biaya penggajian staf internal. Manfaatnya mencakup penelaahan dokumen bisnis berkala, advis regulasi harian via WhatsApp/Telepon, audit kepatuhan berkala, dan pendampingan tata kelola perusahaan.",
      },
      {
        question: "Bagaimana sistem transparansi biaya konsultasi dan pengurusan?",
        answer: "Semua biaya disepakati tertulis di awal dalam Surat Penawaran & Perjanjian Kerjasama (PKS) dengan rincian biaya resmi PNBP/retribusi dan jasa konsultan yang dipertanggungjawabkan secara transparan tanpa biaya tersembunyi.",
      },
    ],
  },
  contact: {
    badge: "Hubungi Kantor Kami",
    title: "Diskusikan Kebutuhan Konsultan Bisnis Anda",
    subtitle: "Bersama Tim Konsultan Kami",
    formTitle: "Kirim Pesan & Konsultasi Singkat",
    formSubtitle: "Pesan Anda akan langsung ditinjau oleh tim konsultan kami dengan jaminan kerahasiaan 100%.",
    offices: [
      {
        city: "Jakarta (Kantor Utama)",
        name: "SELECO Head Office",
        address: "Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340",
        phone: "+62 822-1102-0022",
      },
    ],
  },
  footer: {
    description: "Seleco (Sedana legal consultant) adalah konsultan terpercaya di Indonesia, mengkhususkan diri pada 5 pilar layanan utama: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM.",
    copyright: "© 2026 Seleco (Sedana legal consultant). Hak Cipta Dilindungi Undang-Undang.",
  },
  siteMode: {
    status: 'maintenance',
    badgeText: 'Website Dalam Pengembangan',
    title: 'Website Resmi Seleco Sedang Dalam Pengembangan',
    subtitle: 'Kami sedang mempersiapkan sistem dan direktori layanan konsultan terbaik untuk Anda. Untuk konsultasi perizinan, imigrasi, pajak, pertanahan, atau SDM, tim konsultan Seleco tetap aktif melayani Anda via WhatsApp dan Email resmi.',
    estimatedDate: 'Segera Hadir (Coming Soon)',
    whatsappText: 'Konsultasi Sekarang via WhatsApp',
  },
  styles: {},
};
