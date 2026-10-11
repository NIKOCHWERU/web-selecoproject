'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';

interface AdminSidebarProps {
  currentUser?: { name: string; username: string; role?: string } | null;
  onLogout?: () => void;
}

export default function AdminSidebar({
  currentUser,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const mainNav = [
    {
      title: 'Admin Hub',
      url: '/admin',
      icon: Icons.dashboard,
      match: pathname === '/admin',
    },
    {
      title: 'Editor Web (Visual)',
      url: '/admin/editor',
      icon: Icons.forms,
      match: pathname.startsWith('/admin/editor'),
    },
    {
      title: 'Dashboard Artikel',
      url: '/admin/articles',
      icon: Icons.post,
      match: pathname.startsWith('/admin/articles'),
    },
    {
      title: 'Kelola Pengguna',
      url: '/admin/users',
      icon: Icons.teams,
      match: pathname.startsWith('/admin/users'),
    },
  ];

  const publicLinks = [
    {
      title: 'Website Utama',
      url: '/',
      icon: Icons.externalLink,
    },
    {
      title: 'Halaman Layanan',
      url: '/layanan',
      icon: Icons.fileTypeDoc,
    },
    {
      title: 'Portal Insight Publik',
      url: '/insight',
      icon: Icons.page,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* Brand Header */}
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-3 px-1 py-1 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 border border-border shadow-xs">
            <img
              src="/logo-seleco.png"
              alt="SELECO"
              className="size-7 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-foreground truncate">
                SELECO
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                Command Center
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.url}>
                  <Link href={item.url} className="w-full">
                    <SidebarMenuButton
                      isActive={item.match}
                      tooltip={item.title}
                    >
                      <Icon className="size-4 shrink-0 text-[#dfa82e]" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Akses Web</SidebarGroupLabel>
          <SidebarMenu>
            {publicLinks.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.url}>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <SidebarMenuButton tooltip={item.title}>
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 rounded-lg shrink-0 border border-border">
              <AvatarFallback className="bg-primary/20 text-[#dfa82e] font-bold text-xs">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              className="text-muted-foreground hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
              title="Keluar"
            >
              <Icons.logout className="size-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
