'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/admin-layout';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';

export default function AdminClient() {
  const [articleCount, setArticleCount] = useState<number>(0);
  const [publishedCount, setPublishedCount] = useState<number>(0);
  const [siteMode, setSiteMode] = useState<'maintenance' | 'live'>('maintenance');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [contentRes, articlesRes] = await Promise.all([
        fetch('/api/admin/content', { cache: 'no-store' }),
        fetch('/api/admin/articles', { cache: 'no-store' }),
      ]);

      if (contentRes.ok) {
        const data = await contentRes.json();
        if (data.content?.siteMode?.status) {
          setSiteMode(data.content.siteMode.status);
        }
      }

      if (articlesRes.ok) {
        const artData = await articlesRes.json();
        if (artData.articles) {
          setArticleCount(artData.articles.length);
          const pub = artData.articles.filter((a: any) => a.status === 'published').length;
          setPublishedCount(pub);
        }
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      activeNav="hub"
      title="Dashboard Utama"
      breadcrumbTitle="Admin"
      breadcrumbHref="/admin"
      authNamespace="hub"
    >
      <PageContainer>
        {/* Header Heading with Actions */}
        <Heading
          title="Dashboard Utama"
          description="Pusat kendali pengaturan tampilan website dan publikasi artikel berita SELECO."
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" target="_blank">
                  <Icons.externalLink className="size-3.5 text-[#dfa82e] mr-1.5" />
                  <span>Lihat Web Publik</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/articles">
                  <Icons.add className="size-3.5 mr-1.5" />
                  <span>Tulis Artikel</span>
                </Link>
              </Button>
            </div>
          }
        />

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Site Status */}
          <Card>
            <CardHeader>
              <CardDescription>Status Akses Website</CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {siteMode === 'live' ? 'Live (Online)' : 'Mode Dev'}
              </CardTitle>
              <CardAction>
                <Badge variant={siteMode === 'live' ? 'success' : 'warning'}>
                  {siteMode === 'live' ? (
                    <>
                      <Icons.circleCheck className="size-3 mr-1" />
                      Live (Online)
                    </>
                  ) : (
                    <>
                      <Icons.clock className="size-3 mr-1" />
                      Mode Dev
                    </>
                  )}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`size-2 rounded-full ${siteMode === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{siteMode === 'live' ? 'Web aktif diakses klien publik' : 'Hanya tim internal dengan sandi'}</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 2: Total Articles */}
          <Card>
            <CardHeader>
              <CardDescription>Total Publikasi Artikel</CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
                {articleCount}
              </CardTitle>
              <CardAction>
                <Badge variant="default">
                  <Icons.post className="size-3 mr-1" />
                  Insight Hub
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icons.check className="size-3 text-emerald-400" />
                <span>{publishedCount} terbit aktif, {articleCount - publishedCount} draft</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 3: Pilar Layanan */}
          <Card>
            <CardHeader>
              <CardDescription>Pilar Layanan Hukum</CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
                5 Layanan
              </CardTitle>
              <CardAction>
                <Badge variant="secondary">
                  <Icons.product className="size-3 mr-1" />
                  Legal Pillar
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icons.sparkles className="size-3 text-[#dfa82e]" />
                <span>Perizinan, Pajak, Imigrasi, Tanah, SDM</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 4: Visual Sections */}
          <Card>
            <CardHeader>
              <CardDescription>Visual Builder Section</CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
                7 Modul
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Icons.forms className="size-3 mr-1" />
                  WYSIWYG
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icons.trendingUp className="size-3 text-emerald-400" />
                <span>Live editor teks, media &amp; layout</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* TABS & MAIN MODULES */}
        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules">
              <Icons.dashboard className="size-3.5 mr-1.5" />
              Modul Utama
            </TabsTrigger>
            <TabsTrigger value="quick-access">
              <Icons.settings className="size-3.5 mr-1.5" />
              Pengaturan &amp; Akses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* MODUL 1: VISUAL BUILDER WEB */}
              <Card className="flex flex-col justify-between hover:border-[#dfa82e]/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 border border-[#dfa82e]/30 text-[#dfa82e]">
                      <Icons.forms className="size-5" />
                    </div>
                    <Badge variant="default">Visual Builder</Badge>
                  </div>
                  <CardTitle className="text-xl">1. Editor Web (Ala Elementor)</CardTitle>
                  <CardDescription>
                    Editor visual langsung untuk mengedit website seperti Elementor di WordPress. Klik langsung pada teks, ubah video latar kantor, ganti gambar, kontak &amp; WhatsApp.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-[#dfa82e]" />
                      <span>Live Visual Preview Desktop, Tablet &amp; Mobile</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-[#dfa82e]" />
                      <span>Ganti Video Latar Ruang Konsultasi Kantor</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-[#dfa82e]" />
                      <span>Ubah 5 Pilar Layanan, Angka Statistik, &amp; Kontak</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-[#dfa82e]" />
                      <span>1-Klik Simpan langsung tayang ke publik</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/admin/editor" className="flex items-center justify-center gap-2">
                      <span>Buka Editor Web Visual</span>
                      <Icons.arrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* MODUL 2: DASHBOARD ARTIKEL */}
              <Card className="flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Icons.post className="size-5" />
                    </div>
                    <Badge variant="success">Newsroom Editorial</Badge>
                  </div>
                  <CardTitle className="text-xl">2. Dashboard Artikel (Portal Berita)</CardTitle>
                  <CardDescription>
                    Pusat penulisan berita &amp; insight regulasi hukum SELECO. Dilengkapi Gutenberg block editor, pengaturan SEO, slug otomatis, kategori 5 pilar, dan manajemen draft.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-emerald-400" />
                      <span>Tabel berita lengkap dengan filter status &amp; pencarian</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-emerald-400" />
                      <span>Gutenberg Block Editor untuk heading, kutipan &amp; gambar</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-emerald-400" />
                      <span>Kategori 5 pilar: Perizinan, Pajak, Imigrasi, Pertanahan, SDM</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Icons.check className="size-3.5 text-emerald-400" />
                      <span>Kelola artikel unggulan (featured) di beranda</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button asChild variant="outline" className="w-full border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10">
                    <Link href="/admin/articles" className="flex items-center justify-center gap-2">
                      <span>Buka Dashboard Artikel</span>
                      <Icons.arrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quick-access">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pengelolaan Akun &amp; Keamanan</CardTitle>
                <CardDescription>
                  Atur administrator yang memiliki izin mengedit website atau menulis artikel.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-card border border-border text-muted-foreground">
                    <Icons.teams className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Kelola Pengguna Admin</p>
                    <p className="text-xs text-muted-foreground">
                      Ubah kata sandi admin, kelola akun tim editor internal SELECO.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/users">
                    <Icons.settings className="size-3.5 mr-1.5" />
                    <span>Buka Kelola Pengguna</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AdminLayout>
  );
}
