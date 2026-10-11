import * as React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn('text-base leading-snug font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn('ml-auto self-start', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot='card-content' className={cn('p-0', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center pt-3 text-xs text-muted-foreground border-t border-border/50', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
