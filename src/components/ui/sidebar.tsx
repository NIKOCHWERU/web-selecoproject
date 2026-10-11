'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3.5rem';

type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      try {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      } catch (e) {}
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
  }, [isMobile, setOpen, setOpenMobile]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          'group/sidebar-wrapper flex min-h-screen w-full bg-background text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  side = 'left',
  collapsible = 'icon',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  collapsible?: 'icon' | 'offcanvas' | 'none';
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    if (!openMobile) return null;
    return (
      <div className="fixed inset-0 z-50 flex md:hidden">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setOpenMobile(false)}
        />
        <div
          style={{ width: SIDEBAR_WIDTH_MOBILE }}
          className={cn(
            'relative flex h-full flex-col border-r border-border bg-sidebar p-0 text-sidebar-foreground shadow-2xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <aside
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      style={{
        width: state === 'collapsed' && collapsible === 'icon' ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
      }}
      className={cn(
        'group relative hidden md:flex flex-col shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out',
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full flex-col overflow-hidden">
        {children}
      </div>
    </aside>
  );
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <Icons.panelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        className
      )}
      {...props}
    />
  );
}

export function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-1 flex-col bg-background overflow-x-hidden',
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-4 border-b border-border/50', className)}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2',
        className
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { state } = useSidebar();
  if (state === 'collapsed') return null;

  return (
    <div
      data-sidebar="group-label"
      className={cn(
        'flex h-7 shrink-0 items-center rounded-md px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 outline-none',
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-sidebar="menu-item"
      className={cn('group/menu-item relative list-none', className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-lg p-2 text-left text-xs font-medium outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer',
  {
    variants: {
      isActive: {
        true: 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-xs border border-border/40',
        false: 'text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export function SidebarMenuButton({
  className,
  isActive = false,
  tooltip,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  isActive?: boolean;
  tooltip?: string;
}) {
  return (
    <button
      data-sidebar="menu-button"
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ isActive }), className)}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-3 border-t border-border/50 bg-sidebar', className)}
      {...props}
    />
  );
}
