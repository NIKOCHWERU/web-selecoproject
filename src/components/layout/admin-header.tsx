'use client';

import React from 'react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';

interface AdminHeaderProps {
  breadcrumbTitle?: string;
  breadcrumbHref?: string;
  currentPageTitle?: string;
  siteMode?: 'maintenance' | 'live';
  onToggleSiteMode?: (mode: 'maintenance' | 'live') => void;
  isSwitchingMode?: boolean;
  currentUser?: { name: string; username: string; role?: string } | null;
  onLogout?: () => void;
}

export default function AdminHeader({
  breadcrumbTitle = 'Admin',
  breadcrumbHref = '/admin',
  currentPageTitle = 'Dashboard',
  siteMode = 'maintenance',
  onToggleSiteMode,
  isSwitchingMode = false,
  currentUser,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md md:h-14 md:px-6">
      {/* Left: Sidebar Trigger & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumbHref}>
                {breadcrumbTitle}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Site Mode, Public Link, User Nav */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Site Mode Switcher Pill */}
        {onToggleSiteMode && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-card/60 p-1 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground px-1.5 flex items-center gap-1">
              <span className={`size-1.5 rounded-full ${siteMode === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              Status:
            </span>
            <button
              onClick={() => onToggleSiteMode('maintenance')}
              disabled={isSwitchingMode}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                siteMode === 'maintenance'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mode Dev
            </button>
            <button
              onClick={() => onToggleSiteMode('live')}
              disabled={isSwitchingMode}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                siteMode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Live (Online)
            </button>
          </div>
        )}

        {/* View Public Web button */}
        <Button variant="outline" size="sm" asChild className="hidden md:inline-flex h-8 gap-1.5 text-xs">
          <Link href="/" target="_blank">
            <Icons.externalLink className="size-3.5 text-[#dfa82e]" />
            <span>Lihat Web</span>
          </Link>
        </Button>

        {/* User Nav Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-lg p-0">
              <Avatar className="h-8 w-8 rounded-lg border border-border">
                <AvatarFallback className="bg-primary/20 text-[#dfa82e] font-bold text-xs">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-foreground">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[11px] leading-none text-muted-foreground">
                  @{currentUser?.username || 'admin'} • {currentUser?.role || 'Admin'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <Icons.dashboard className="size-4" />
                  <span>Admin Hub</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/editor" className="flex items-center gap-2">
                  <Icons.forms className="size-4" />
                  <span>Editor Web</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/articles" className="flex items-center gap-2">
                  <Icons.post className="size-4" />
                  <span>Dashboard Artikel</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users" className="flex items-center gap-2">
                  <Icons.teams className="size-4" />
                  <span>Kelola Pengguna</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {onLogout && (
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-400 focus:text-red-300 focus:bg-destructive/20"
              >
                <Icons.logout className="size-4 mr-2" />
                <span>Keluar (Logout)</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
