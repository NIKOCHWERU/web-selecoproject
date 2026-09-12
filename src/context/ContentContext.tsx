'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, defaultSiteContent } from '@/data/defaultSiteContent';

interface ContentContextType {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  updateSection: <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => void;
  saveToServer: () => Promise<{ success: boolean; message?: string }>;
  reloadContent: () => Promise<void>;
  isLoading: boolean;
}

export const ContentContext = createContext<ContentContextType>({
  content: defaultSiteContent,
  setContent: () => {},
  updateSection: () => {},
  saveToServer: async () => ({ success: false }),
  reloadContent: async () => {},
  isLoading: false,
});

export const ContentProvider = ({ 
  children, 
  initialContent 
}: { 
  children: React.ReactNode; 
  initialContent?: SiteContent;
}) => {
  const [content, setContent] = useState<SiteContent>(initialContent || defaultSiteContent);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize state immediately when initialContent prop changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const reloadContent = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
        }
      }
    } catch (err) {
      console.error('Failed to reload content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSection = <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const saveToServer = async () => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: 'Perubahan berhasil disimpan!' };
      }
      return { success: false, message: data.error || 'Gagal menyimpan perubahan.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Terjadi kesalahan jaringan.' };
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        updateSection,
        saveToServer,
        reloadContent,
        isLoading,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
