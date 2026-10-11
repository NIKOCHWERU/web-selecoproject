import React from 'react';
import { cn } from '@/lib/utils';

export default function PageContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-1 flex-col px-4 pt-3 pb-8 md:px-8 md:pt-6 space-y-6 max-w-7xl mx-auto w-full', className)}>
      {children}
    </div>
  );
}
