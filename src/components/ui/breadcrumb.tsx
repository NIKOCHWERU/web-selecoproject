import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav aria-label='breadcrumb' data-slot='breadcrumb' className={cn(className)} {...props} />
  );
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-item'
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  className,
  asChild,
  ...props
}: React.ComponentProps<'a'> & { asChild?: boolean }) {
  return (
    <a
      data-slot='breadcrumb-link'
      className={cn('transition-colors hover:text-foreground cursor-pointer', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='breadcrumb-page'
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={cn('[&>svg]:size-3.5 text-muted-foreground/60', className)}
      {...props}
    >
      {children ?? <Icons.chevronRight />}
    </li>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
