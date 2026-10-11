import * as React from 'react';

interface HeadingProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function Heading({ title, description, action }: HeadingProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>{title}</h2>
        <p className='text-muted-foreground text-xs sm:text-sm mt-1'>{description}</p>
      </div>
      {action && <div className='shrink-0'>{action}</div>}
    </div>
  );
}
