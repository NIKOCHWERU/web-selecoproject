'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '@/context/ContentContext';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Type, 
  Palette, 
  Upload, 
  Sparkles, 
  Check, 
  X, 
  Edit3,
  Sliders,
  Maximize2,
  Image as ImageIcon,
  Layout,
  Scale,
  Paintbrush,
  Move,
  Crop,
  Sun,
  Contrast,
  RotateCw,
  ZoomIn,
  SlidersHorizontal,
  Square,
  RectangleHorizontal,
  Focus,
  ExternalLink,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Baseline,
  Space,
  Box,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { compressImageToDataUrl } from '@/lib/imageUtils';
import { IconPicker, ICON_MAP } from './IconPicker';

interface EditableTextProps {
  fieldPath: string; // e.g., 'hero.headlinePart1'
  fallback: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'blockquote' | 'button';
  className?: string;
  label?: string;
  multiline?: boolean;
  linkPath?: string;
  fallbackLink?: string;
}

export function EditableText({
  fieldPath,
  fallback,
  as: Component = 'span',
  className = '',
  label,
  multiline = false,
  linkPath,
  fallbackLink,
}: EditableTextProps) {
  const { content, setContent } = useContent();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Check if preview is in click-to-edit mode
  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowToolbar(false);
      }
    };
    if (showToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolbar]);

  // Resolve current value from path
  const getValue = (): string => {
    try {
      const parts = fieldPath.split('.');
      let cur: any = content;
      for (const p of parts) {
        if (cur === undefined || cur === null) return fallback;
        cur = cur[p];
      }
      return typeof cur === 'string' ? cur : fallback;
    } catch {
      return fallback;
    }
  };

  // Resolve custom styling if set
  const customStyle = content?.styles?.[fieldPath] || {};

  const currentText = getValue();

  // Helper update value in content context and postMessage to parent
  const updateContentValue = (newVal: string) => {
    const parts = fieldPath.split('.');
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = newVal;

      // Auto-propagate if stat2Number / totalServices changed
      if (fieldPath === 'hero.stat2Number' || fieldPath === 'global.totalServices') {
        const oldNum = prev?.global?.totalServices || prev?.hero?.stat2Number || '445+';
        const newNum = newVal;
        if (!copy.global) copy.global = {};
        if (!copy.hero) copy.hero = {};
        copy.global.totalServices = newNum;
        copy.hero.stat2Number = newNum;
        if (copy.hero.ctaButton1Text && copy.hero.ctaButton1Text.includes(oldNum)) {
          copy.hero.ctaButton1Text = copy.hero.ctaButton1Text.replaceAll(oldNum, newNum);
        }
        if (copy.services?.title && copy.services.title.includes(oldNum)) {
          copy.services.title = copy.services.title.replaceAll(oldNum, newNum);
        }
        if (copy.services?.ctaBannerButtonText && copy.services.ctaBannerButtonText.includes(oldNum)) {
          copy.services.ctaBannerButtonText = copy.services.ctaBannerButtonText.replaceAll(oldNum, newNum);
        }
      }

      // Sync to parent window & sessionStorage
      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath,
            value: newVal,
          }, '*');
        }
      } catch (err) {
        console.error('Error posting to parent:', err);
      }

      return copy;
    });
  };

  const getLinkValue = (): string => {
    if (!linkPath) return '';
    try {
      const parts = linkPath.split('.');
      let cur: any = content;
      for (const p of parts) {
        if (cur === undefined || cur === null) return fallbackLink || '';
        cur = cur[p];
      }
      return typeof cur === 'string' ? cur : (fallbackLink || '');
    } catch {
      return fallbackLink || '';
    }
  };

  const updateLinkValue = (newLink: string) => {
    if (!linkPath) return;
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      const parts = linkPath.split('.');
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = newLink;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath: linkPath,
            value: newLink,
          }, '*');
        }
      } catch (err) {}

      return copy;
    });
  };

  const updateStyleProp = (prop: string, val: any) => {
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      if (!copy.styles) copy.styles = {};
      if (!copy.styles[fieldPath]) copy.styles[fieldPath] = {};
      copy.styles[fieldPath][prop] = val;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath,
            styleProp: prop,
            styleVal: val,
          }, '*');
        }
      } catch (err) {
        console.error('Error posting style to parent:', err);
      }

      return copy;
    });
  };

  // Applied inline styles (Word-Style Formatting)
  const appliedStyle: React.CSSProperties = {
    ...(customStyle.textAlign ? { 
      textAlign: customStyle.textAlign as any,
      textJustify: customStyle.textAlign === 'justify' ? 'inter-word' : undefined,
      textAlignLast: customStyle.textAlign === 'justify' ? 'left' : undefined,
    } : {}),
    ...(customStyle.color ? { color: customStyle.color } : {}),
    ...(customStyle.fontSize ? { fontSize: customStyle.fontSize } : {}),
    ...(customStyle.fontWeight ? { fontWeight: customStyle.fontWeight } : {}),
    ...(customStyle.fontStyle ? { fontStyle: customStyle.fontStyle } : {}),
    ...(customStyle.textDecoration ? { textDecoration: customStyle.textDecoration } : {}),
    ...(customStyle.lineHeight ? { lineHeight: customStyle.lineHeight } : {}),
    ...(customStyle.letterSpacing ? { letterSpacing: customStyle.letterSpacing } : {}),
    ...(customStyle.margin ? { margin: customStyle.margin } : {}),
    ...(customStyle.padding ? { padding: customStyle.padding } : {}),
    ...(customStyle.backgroundColor ? { backgroundColor: customStyle.backgroundColor } : {}),
    ...(customStyle.borderRadius ? { borderRadius: customStyle.borderRadius } : {}),
  };

  const isBlock = multiline || Component === 'p' || Component === 'div' || Component === 'h1' || Component === 'h2' || Component === 'h3' || Component === 'h4' || Component === 'blockquote' || Boolean(customStyle.textAlign) || Boolean(customStyle.margin);

  if (!isEditMode) {
    return (
      <Component 
        className={className} 
        style={{
          ...(isBlock ? { display: 'block', width: '100%' } : {}),
          ...appliedStyle,
        }}
      >
        {currentText}
      </Component>
    );
  }

  // CLICK-TO-EDIT MODE ACTIVE
  return (
    <span 
      className="relative group/editable"
      style={{ 
        display: isBlock ? 'block' : 'inline-block',
        width: isBlock ? '100%' : 'auto',
        maxWidth: '100%',
        textAlign: customStyle.textAlign ? (customStyle.textAlign as any) : undefined,
        ...(customStyle.margin ? { margin: customStyle.margin } : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={toolbarRef}
    >
      {/* Visual Outline Indicator on Hover */}
      <span 
        className={`absolute -inset-1 rounded-md pointer-events-none transition-all duration-150 z-20 ${
          showToolbar 
            ? 'border-2 border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
            : isHovered 
            ? 'border-2 border-dashed border-amber-400/80 bg-amber-400/5' 
            : 'border border-transparent'
        }`}
      />

      {/* Label Tooltip & Quick Action Pill on Hover */}
      {isHovered && !showToolbar && (
        <span className="absolute -top-7 left-0 z-30 flex items-center gap-1 bg-slate-950 text-white text-[10px] px-2 py-0.5 rounded shadow-lg border border-amber-400/40 pointer-events-none whitespace-nowrap animate-fade-in">
          <Edit3 className="w-2.5 h-2.5 text-amber-400" />
          <span className="font-semibold text-amber-300">{label || fieldPath}</span>
          <span className="text-slate-400 text-[9px]">(Klik untuk edit)</span>
        </span>
      )}

      {/* Editable Component */}
      <Component
        className={`${className} cursor-text outline-none relative z-10 select-text`}
        style={{
          ...(isBlock ? { display: 'block', width: '100%' } : {}),
          ...appliedStyle,
        }}
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onClick={(e) => {
          if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
          }
          setShowToolbar(true);
        }}
        onBlur={(e) => {
          const newText = e.currentTarget.innerText?.trim() ?? '';
          if (newText !== currentText) {
            updateContentValue(newText);
          }
        }}
        onKeyDown={(e) => {
          if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      >
        {currentText}
      </Component>

      {/* ELEMENTOR-STYLE FLOATING QUICK TOOLBAR (Style, Align, Color, Size) */}
      {showToolbar && (
        <div 
          className="absolute left-0 bottom-full mb-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-amber-400/60 rounded-xl shadow-2xl p-2 flex items-center gap-2 text-white text-xs select-none animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap max-w-[95vw] overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Label Header */}
          <div className="flex items-center gap-1 px-1.5 border-r border-slate-700 pr-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              {label || 'Format'}
            </span>
          </div>

          {/* Word Style: Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('fontWeight', customStyle.fontWeight === 'bold' ? 'normal' : 'bold');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.fontWeight === 'bold' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300'
              }`}
              title="Tebal (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('fontStyle', customStyle.fontStyle === 'italic' ? 'normal' : 'italic');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.fontStyle === 'italic' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Miring (Italic)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('textDecoration', customStyle.textDecoration === 'underline' ? 'none' : 'underline');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.textDecoration === 'underline' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Garis Bawah (Underline)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('textDecoration', customStyle.textDecoration === 'line-through' ? 'none' : 'line-through');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.textDecoration === 'line-through' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Coret Teks (Strikethrough)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Alignments (Left, Center, Right, Justify) */}
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('textAlign', 'left');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.textAlign === 'left' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Rata Kiri (Left)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('textAlign', 'center');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.textAlign === 'center' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Rata Tengah (Center)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('textAlign', 'right');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.textAlign === 'right' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Rata Kanan (Right)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateStyleProp('textAlign', 'justify');
              }}
              className={`p-1.5 rounded hover:bg-amber-400 hover:text-slate-950 transition-colors ${
                customStyle.textAlign === 'justify' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
              title="Rata Kanan-Kiri Penuh (Justify)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Picker Quick Palette */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-1.5 py-1 rounded-lg border border-slate-800">
            <Palette className="w-3.5 h-3.5 text-amber-300 mr-0.5" />
            {['#ffffff', '#0f172a', '#D4AF37', '#f8fafc', '#94a3b8', '#dc2626', '#16a34a', '#2563eb'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateStyleProp('color', c);
                }}
                style={{ backgroundColor: c }}
                className="w-4 h-4 rounded-full border border-slate-700 hover:scale-125 transition-transform"
                title={`Warna Teks ${c}`}
              />
            ))}
            <input
              type="color"
              value={customStyle.color || '#ffffff'}
              onChange={(e) => updateStyleProp('color', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Pilih Warna Custom"
            />
          </div>

          {/* Font Size Quick Adjust */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Type className="w-3 h-3 text-amber-300" />
            <select
              value={customStyle.fontSize || ''}
              onChange={(e) => updateStyleProp('fontSize', e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Font Normal</option>
              <option value="11px" className="bg-slate-900">11px (Sangat Kecil)</option>
              <option value="12px" className="bg-slate-900">12px (Kecil)</option>
              <option value="14px" className="bg-slate-900">14px (Reguler)</option>
              <option value="16px" className="bg-slate-900">16px (Medium)</option>
              <option value="18px" className="bg-slate-900">18px (Paragraf Tebal)</option>
              <option value="20px" className="bg-slate-900">20px (Subjudul Kecil)</option>
              <option value="24px" className="bg-slate-900">24px (Subjudul)</option>
              <option value="30px" className="bg-slate-900">30px (Judul Section)</option>
              <option value="36px" className="bg-slate-900">36px (Header Besar)</option>
              <option value="48px" className="bg-slate-900">48px (Hero Title)</option>
            </select>
          </div>

          {/* Spasi Karakter (Letter Spacing) */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Baseline className="w-3 h-3 text-amber-300" />
            <select
              value={customStyle.letterSpacing || ''}
              onChange={(e) => updateStyleProp('letterSpacing', e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
              title="Spasi Karakter (Letter Spacing)"
            >
              <option value="" className="bg-slate-900">Spasi Huruf Normal</option>
              <option value="-0.05em" className="bg-slate-900">Rapat (-0.05em)</option>
              <option value="0.05em" className="bg-slate-900">Sedikit Lebar (0.05em)</option>
              <option value="0.1em" className="bg-slate-900">Lebar (0.1em)</option>
              <option value="0.2em" className="bg-slate-900">Sangat Lebar (0.2em)</option>
            </select>
          </div>

          {/* Line Height (Spasi Baris) */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-[10px] text-amber-300 font-bold">1↕</span>
            <select
              value={customStyle.lineHeight || ''}
              onChange={(e) => updateStyleProp('lineHeight', e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
              title="Spasi Baris (Line Height)"
            >
              <option value="" className="bg-slate-900">Spasi Baris Default</option>
              <option value="1.1" className="bg-slate-900">Rapat (1.1)</option>
              <option value="1.25" className="bg-slate-900">Judul (1.25)</option>
              <option value="1.5" className="bg-slate-900">Normal (1.5)</option>
              <option value="1.75" className="bg-slate-900">Paragraf Longgar (1.75)</option>
              <option value="2" className="bg-slate-900">Ganda (2.0)</option>
            </select>
          </div>

          {/* Margin & Spacing (Word MS Format) */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Space className="w-3 h-3 text-amber-300" />
            <select
              value={customStyle.margin || ''}
              onChange={(e) => updateStyleProp('margin', e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
              title="Margin / Jarak Luar Elemen"
            >
              <option value="" className="bg-slate-900">Margin Default</option>
              <option value="0px" className="bg-slate-900">Margin 0px</option>
              <option value="4px" className="bg-slate-900">Margin 4px</option>
              <option value="8px" className="bg-slate-900">Margin 8px</option>
              <option value="12px" className="bg-slate-900">Margin 12px</option>
              <option value="16px" className="bg-slate-900">Margin 16px</option>
              <option value="24px" className="bg-slate-900">Margin 24px</option>
              <option value="32px" className="bg-slate-900">Margin 32px</option>
              <option value="8px 0" className="bg-slate-900">Margin Vertikal (8px)</option>
              <option value="16px 0" className="bg-slate-900">Margin Vertikal (16px)</option>
              <option value="0 auto" className="bg-slate-900">Margin Auto (Center Block)</option>
            </select>
          </div>

          {/* Padding (Jarak Dalam) */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
            <Box className="w-3 h-3 text-amber-300" />
            <select
              value={customStyle.padding || ''}
              onChange={(e) => updateStyleProp('padding', e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
              title="Padding / Ruang Dalam Elemen"
            >
              <option value="" className="bg-slate-900">Padding Default</option>
              <option value="0px" className="bg-slate-900">Padding 0px</option>
              <option value="4px 8px" className="bg-slate-900">Padding Kecil (4px 8px)</option>
              <option value="8px 12px" className="bg-slate-900">Padding Sedang (8px 12px)</option>
              <option value="12px 16px" className="bg-slate-900">Padding Longgar (12px 16px)</option>
              <option value="16px 24px" className="bg-slate-900">Padding Tombol/Banner (16px 24px)</option>
            </select>
          </div>

          {/* Link / URL Editor */}
          {linkPath && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
              <ExternalLink className="w-3 h-3 text-amber-300 shrink-0" />
              <input
                type="text"
                value={getLinkValue()}
                onChange={(e) => updateLinkValue(e.target.value)}
                placeholder="Link URL (/kontak atau https://...)"
                className="bg-transparent text-amber-300 w-36 sm:w-48 text-[11px] focus:outline-none border-b border-transparent focus:border-amber-400 placeholder:text-slate-500"
                title="URL Tujuan Tombol"
              />
            </div>
          )}

          {/* Reset Style Button */}
          {Object.keys(customStyle).length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContent((prev: any) => {
                  const copy = JSON.parse(JSON.stringify(prev || {}));
                  if (copy.styles && copy.styles[fieldPath]) {
                    delete copy.styles[fieldPath];
                  }
                  try {
                    sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
                    if (window.parent && window.parent !== window) {
                      window.parent.postMessage({
                        type: 'ON_ELEMENT_UPDATED',
                        content: copy,
                        fieldPath,
                      }, '*');
                    }
                  } catch (err) {}
                  return copy;
                });
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 rounded text-[10px] transition-colors"
              title="Reset Format Teks ke Semula"
            >
              Reset
            </button>
          )}

          {/* Close Toolbar */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowToolbar(false);
            }}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Selesai"
          >
            <Check className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}
    </span>
  );
}

/* ========================================================================= */
/* EDITABLE IMAGE COMPONENT                                                 */
/* ========================================================================= */

interface EditableImageProps {
  fieldPath: string; // e.g., 'about.image1'
  fallback: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  label?: string;
}

export function EditableImage({
  fieldPath,
  fallback,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  label,
}: EditableImageProps) {
  const { content, setContent } = useContent();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getValue = (): string => {
    try {
      const parts = fieldPath.split('.');
      let cur: any = content;
      for (const p of parts) {
        if (cur === undefined || cur === null) return fallback;
        cur = cur[p];
      }
      return typeof cur === 'string' ? cur : fallback;
    } catch {
      return fallback;
    }
  };

  const currentSrc = getValue();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Compress to 100% offline Base64 Data URL (0% 404 guarantee)
      const dataUrl = await compressImageToDataUrl(file);
      
      const parts = fieldPath.split('.');
      setContent((prev: any) => {
        const copy = JSON.parse(JSON.stringify(prev || {}));
        let cur = copy;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cur[parts[i]]) cur[parts[i]] = {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = dataUrl;

        try {
          sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'ON_ELEMENT_UPDATED',
              content: copy,
              fieldPath,
              value: dataUrl,
            }, '*');
          }
        } catch (err) {
          console.error('Error posting image to parent:', err);
        }

        return copy;
      });
    } catch (err) {
      console.error('Error handling inline image upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Resolve custom image styling from content context
  const customImgStyle = content?.styles?.[`img.${fieldPath}`] || {};

  const updateImageStyle = (prop: string, val: any) => {
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      if (!copy.styles) copy.styles = {};
      const key = `img.${fieldPath}`;
      if (!copy.styles[key]) copy.styles[key] = {};
      copy.styles[key][prop] = val;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath: key,
            styleProp: prop,
            styleVal: val,
          }, '*');
        }
      } catch (err) {
        console.error('Error posting image style:', err);
      }

      return copy;
    });
  };

  const [showImageToolbar, setShowImageToolbar] = useState<boolean>(false);
  const imageToolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (imageToolbarRef.current && !imageToolbarRef.current.contains(e.target as Node)) {
        setShowImageToolbar(false);
      }
    };
    if (showImageToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showImageToolbar]);

  // Compute CSS filter string
  const filterParts = [];
  if (customImgStyle.filterBrightness) filterParts.push(`brightness(${customImgStyle.filterBrightness})`);
  if (customImgStyle.filterContrast) filterParts.push(`contrast(${customImgStyle.filterContrast})`);
  if (customImgStyle.filterGrayscale) filterParts.push(`grayscale(${customImgStyle.filterGrayscale})`);
  if (customImgStyle.filterBlur) filterParts.push(`blur(${customImgStyle.filterBlur})`);
  const filterString = filterParts.length > 0 ? filterParts.join(' ') : undefined;

  // Compute transform string
  const transformParts = [];
  if (customImgStyle.scale) transformParts.push(`scale(${customImgStyle.scale})`);
  if (customImgStyle.rotate) transformParts.push(`rotate(${customImgStyle.rotate})`);
  const transformString = transformParts.length > 0 ? transformParts.join(' ') : undefined;

  const appliedImgStyle: React.CSSProperties = {
    ...(customImgStyle.objectFit ? { objectFit: customImgStyle.objectFit as any } : {}),
    ...(customImgStyle.objectPosition ? { objectPosition: customImgStyle.objectPosition } : {}),
    ...(customImgStyle.aspectRatio ? { aspectRatio: customImgStyle.aspectRatio } : {}),
    ...(customImgStyle.borderRadius ? { borderRadius: customImgStyle.borderRadius } : {}),
    ...(customImgStyle.opacity ? { opacity: customImgStyle.opacity } : {}),
    ...(filterString ? { filter: filterString } : {}),
    ...(transformString ? { transform: transformString } : {}),
    transition: 'all 0.2s ease',
  };

  if (!isEditMode) {
    return (
      <div className={`${containerClassName} overflow-hidden`} style={customImgStyle.borderRadius ? { borderRadius: customImgStyle.borderRadius } : undefined}>
        <img src={currentSrc} alt={alt} className={className} style={appliedImgStyle} />
      </div>
    );
  }

  return (
    <div 
      className={`relative group/editable-img ${containerClassName} overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={imageToolbarRef}
      style={customImgStyle.borderRadius ? { borderRadius: customImgStyle.borderRadius } : undefined}
    >
      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <img src={currentSrc} alt={alt} className={className} style={appliedImgStyle} />

      {/* Floating Header Action Pill (Elementor-style) */}
      {isHovered && !showImageToolbar && (
        <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between pointer-events-none animate-fade-in">
          <div className="bg-slate-950/90 text-amber-300 border border-amber-400/50 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-md">
            <ImageIcon className="w-3 h-3 text-amber-400" />
            <span>{label || 'Gambar'}</span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowImageToolbar(true);
              }}
              className="px-2.5 py-1 bg-amber-400 text-slate-950 hover:brightness-110 text-[11px] font-bold rounded-lg shadow-lg flex items-center gap-1 transition-all"
              title="Sesuaikan Crop, Posisi, Filter & Format CSS"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Setting CSS / Crop</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg border border-slate-700 shadow-lg flex items-center gap-1 transition-all"
              title="Ganti Foto Baru"
            >
              <Upload className="w-3 h-3 text-amber-400" />
              <span>Ganti Foto</span>
            </button>
          </div>
        </div>
      )}

      {/* ELEMENTOR IMAGE SETTINGS POPUP MODAL (Crop, Fit, Position, Zoom, Filters) */}
      {showImageToolbar && (
        <div 
          className="absolute inset-x-2 top-2 z-50 bg-slate-950/95 backdrop-blur-xl border border-amber-400/70 rounded-2xl shadow-2xl p-4 text-white text-xs select-none animate-in fade-in zoom-in-95 duration-150 max-h-[92%] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                Setting Gambar (CSS &amp; Crop)
              </span>
            </div>
            <button
              onClick={() => setShowImageToolbar(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Check className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* 1. Aspect Ratio (Crop Presets) */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Crop className="w-3 h-3 text-amber-300" />
                <span>Crop / Rasio Aspek (Aspect Ratio)</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                {[
                  { label: 'Default', val: '' },
                  { label: '1:1 Persegi', val: '1/1' },
                  { label: '4:3 Kamera', val: '4/3' },
                  { label: '16:9 Banner', val: '16/9' },
                  { label: '3:2 Klasik', val: '3/2' },
                  { label: '3:4 Potret', val: '3/4' },
                  { label: '9:16 Story', val: '9/16' },
                  { label: '21:9 Ultra', val: '21/9' },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => updateImageStyle('aspectRatio', r.val)}
                    className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                      (customImgStyle.aspectRatio || '') === r.val
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Object Fit (Ukuran Tampilan Gambar) */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-amber-300" />
                <span>Kesesuaian Gambar (Object Fit)</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                {[
                  { label: 'Cover (Isi Penuh)', val: 'cover' },
                  { label: 'Contain (Pas Utuh)', val: 'contain' },
                  { label: 'Fill (Stretch)', val: 'fill' },
                  { label: 'Scale-down', val: 'scale-down' },
                ].map((f) => (
                  <button
                    key={f.val}
                    onClick={() => updateImageStyle('objectFit', f.val)}
                    className={`py-1 px-1 rounded-lg border text-center font-medium transition-all ${
                      (customImgStyle.objectFit || 'cover') === f.val
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Object Position (Fokus Pemotongan) */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Focus className="w-3 h-3 text-amber-300" />
                <span>Titik Fokus Pemotongan (Object Position)</span>
              </label>
              <div className="grid grid-cols-5 gap-1 text-[10px]">
                {[
                  { label: 'Tengah', val: 'center' },
                  { label: 'Atas', val: 'top' },
                  { label: 'Bawah', val: 'bottom' },
                  { label: 'Kiri', val: 'left' },
                  { label: 'Kanan', val: 'right' },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => updateImageStyle('objectPosition', p.val)}
                    className={`py-1 px-1 rounded-lg border text-center font-medium transition-all ${
                      (customImgStyle.objectPosition || 'center') === p.val
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Zoom / Scale Slider */}
            <div>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-amber-300" />
                  <span>Zoom / Skala:</span>
                </span>
                <span className="font-mono text-amber-300">{customImgStyle.scale || '1.0'}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.05"
                value={customImgStyle.scale || '1'}
                onChange={(e) => updateImageStyle('scale', e.target.value)}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* 5. Sudut Lengkung (Border Radius) */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Square className="w-3 h-3 text-amber-300" />
                <span>Bentuk Sudut (Border Radius)</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                {[
                  { label: 'Siku (0px)', val: '0px' },
                  { label: 'Halus (8px)', val: '8px' },
                  { label: 'Sedang (16px)', val: '16px' },
                  { label: 'Bulat (9999px)', val: '9999px' },
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => updateImageStyle('borderRadius', b.val)}
                    className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                      (customImgStyle.borderRadius || '') === b.val
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. CSS Filters (Brightness, Contrast, Grayscale) */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <Sun className="w-2.5 h-2.5 text-amber-300" />
                  <span>Kecerahan</span>
                </label>
                <select
                  value={customImgStyle.filterBrightness || '1'}
                  onChange={(e) => updateImageStyle('filterBrightness', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                >
                  <option value="0.7">Gelap (70%)</option>
                  <option value="0.85">Redup (85%)</option>
                  <option value="1">Normal (100%)</option>
                  <option value="1.15">Terang (115%)</option>
                  <option value="1.3">Sangat Terang</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <Contrast className="w-2.5 h-2.5 text-amber-300" />
                  <span>Kontras</span>
                </label>
                <select
                  value={customImgStyle.filterContrast || '1'}
                  onChange={(e) => updateImageStyle('filterContrast', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                >
                  <option value="0.8">Lembut (80%)</option>
                  <option value="1">Normal (100%)</option>
                  <option value="1.2">Tegas (120%)</option>
                  <option value="1.4">Tinggi (140%)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span>Efek Warna</span>
                </label>
                <select
                  value={customImgStyle.filterGrayscale || '0%'}
                  onChange={(e) => updateImageStyle('filterGrayscale', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                >
                  <option value="0%">Warna Asli</option>
                  <option value="50%">Semi Hitam-Putih</option>
                  <option value="100%">Hitam-Putih (B&amp;W)</option>
                </select>
              </div>
            </div>

            {/* Quick Ganti Foto Button Inside Modal */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Foto Pengganti</span>
              </button>

              <button
                onClick={() => setShowImageToolbar(false)}
                className="px-4 py-1.5 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 rounded-lg text-[10px] font-bold hover:brightness-110 transition-all"
              >
                Terapkan &amp; Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* EDITABLE BACKGROUND IMAGE / COLOR (HERO & SECTION BACKGROUNDS)            */
/* ========================================================================= */

interface EditableBackgroundProps {
  fieldPath: string; // e.g. 'hero.bgImage'
  fallback: string;
  className?: string;
  label?: string;
}

export function EditableBackground({
  fieldPath,
  fallback,
  className = 'absolute inset-0 bg-cover bg-center z-0',
  label = 'Background Section',
}: EditableBackgroundProps) {
  const { content, setContent } = useContent();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showBgToolbar, setShowBgToolbar] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgToolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bgToolbarRef.current && !bgToolbarRef.current.contains(e.target as Node)) {
        setShowBgToolbar(false);
      }
    };
    if (showBgToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBgToolbar]);

  const getValue = (): string => {
    try {
      const parts = fieldPath.split('.');
      let cur: any = content;
      for (const p of parts) {
        if (cur === undefined || cur === null) return fallback;
        cur = cur[p];
      }
      return typeof cur === 'string' ? cur : fallback;
    } catch {
      return fallback;
    }
  };

  const currentBg = getValue();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      const parts = fieldPath.split('.');
      setContent((prev: any) => {
        const copy = JSON.parse(JSON.stringify(prev || {}));
        let cur = copy;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cur[parts[i]]) cur[parts[i]] = {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = dataUrl;

        try {
          sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'ON_ELEMENT_UPDATED',
              content: copy,
              fieldPath,
              value: dataUrl,
            }, '*');
          }
        } catch (err) {
          console.error('Error posting bg to parent:', err);
        }

        return copy;
      });
    } catch (err) {
      console.error('Error uploading background:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Resolve custom background styling from content context
  const customBgStyle = content?.styles?.[`bg.${fieldPath}`] || {};

  const updateBgStyle = (prop: string, val: any) => {
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      if (!copy.styles) copy.styles = {};
      const key = `bg.${fieldPath}`;
      if (!copy.styles[key]) copy.styles[key] = {};
      copy.styles[key][prop] = val;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath: key,
            styleProp: prop,
            styleVal: val,
          }, '*');
        }
      } catch (err) {
        console.error('Error posting bg style:', err);
      }

      return copy;
    });
  };

  // Filters
  const filterParts = [];
  if (customBgStyle.filterBrightness) filterParts.push(`brightness(${customBgStyle.filterBrightness})`);
  if (customBgStyle.filterContrast) filterParts.push(`contrast(${customBgStyle.filterContrast})`);
  if (customBgStyle.filterGrayscale) filterParts.push(`grayscale(${customBgStyle.filterGrayscale})`);
  if (customBgStyle.filterBlur) filterParts.push(`blur(${customBgStyle.filterBlur})`);
  const filterString = filterParts.length > 0 ? filterParts.join(' ') : undefined;

  // Transform
  const transformParts = [];
  if (customBgStyle.scale) transformParts.push(`scale(${customBgStyle.scale})`);
  const transformString = transformParts.length > 0 ? transformParts.join(' ') : undefined;

  const appliedBgStyle: React.CSSProperties = {
    backgroundImage: `url('${currentBg}')`,
    ...(customBgStyle.backgroundPosition ? { backgroundPosition: customBgStyle.backgroundPosition } : {}),
    ...(customBgStyle.backgroundSize ? { backgroundSize: customBgStyle.backgroundSize } : {}),
    ...(customBgStyle.opacity ? { opacity: customBgStyle.opacity } : {}),
    ...(filterString ? { filter: filterString } : {}),
    ...(transformString ? { transform: transformString } : {}),
    transition: 'all 0.3s ease',
  };

  return (
    <>
      <div 
        className={className}
        style={appliedBgStyle}
      />

      {isEditMode && (
        <div 
          className="absolute top-4 left-4 z-50 pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={bgToolbarRef}
        >
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBgToolbar(!showBgToolbar);
              }}
              className="px-3.5 py-2 bg-amber-400 hover:brightness-110 text-slate-950 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-200"
              title="Atur Posisi, Zoom, dan Efek CSS Background"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Setting CSS Background</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3.5 py-2 bg-slate-950/90 hover:bg-slate-900 text-amber-300 border border-amber-400/50 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-200"
              title="Klik untuk mengganti background image hero ini"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? 'Memproses...' : 'Ganti Background Hero'}</span>
            </button>
          </div>

          {/* Modal Settings */}
          {showBgToolbar && (
            <div 
              className="mt-3 w-80 bg-slate-950/95 backdrop-blur-xl border border-amber-400/70 rounded-2xl shadow-2xl p-4 text-white text-xs select-none animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                    Setting Background Hero
                  </span>
                </div>
                <button
                  onClick={() => setShowBgToolbar(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* 1. Posisi Background (Titik Fokus) */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Focus className="w-3 h-3 text-amber-300" />
                    <span>Posisi Background (Focus Point)</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1 text-[10px]">
                    {[
                      { label: 'Tengah', val: 'center center' },
                      { label: 'Atas', val: 'center top' },
                      { label: 'Bawah', val: 'center bottom' },
                      { label: 'Kiri', val: 'left center' },
                      { label: 'Kanan', val: 'right center' },
                    ].map((p) => (
                      <button
                        key={p.val}
                        onClick={() => updateBgStyle('backgroundPosition', p.val)}
                        className={`py-1 px-1 rounded-lg border text-center font-medium transition-all ${
                          (customBgStyle.backgroundPosition || 'center center') === p.val
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Ukuran Background (Size) */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-amber-300" />
                    <span>Ukuran Background (Size)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    {[
                      { label: 'Cover (Penuh)', val: 'cover' },
                      { label: 'Contain (Pas)', val: 'contain' },
                      { label: 'Otomatis', val: 'auto' },
                    ].map((s) => (
                      <button
                        key={s.val}
                        onClick={() => updateBgStyle('backgroundSize', s.val)}
                        className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                          (customBgStyle.backgroundSize || 'cover') === s.val
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Zoom / Scale Slider */}
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-amber-300" />
                      <span>Zoom Background:</span>
                    </span>
                    <span className="font-mono text-amber-300">{customBgStyle.scale || '1.0'}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.9"
                    max="2.0"
                    step="0.05"
                    value={customBgStyle.scale || '1'}
                    onChange={(e) => updateBgStyle('scale', e.target.value)}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 4. Opasitas & Kecerahan */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                      <Sun className="w-2.5 h-2.5 text-amber-300" />
                      <span>Kecerahan</span>
                    </label>
                    <select
                      value={customBgStyle.filterBrightness || '1'}
                      onChange={(e) => updateBgStyle('filterBrightness', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                    >
                      <option value="0.5">Gelap (50%)</option>
                      <option value="0.7">Redup (70%)</option>
                      <option value="0.85">Sedang (85%)</option>
                      <option value="1">Normal (100%)</option>
                      <option value="1.2">Terang (120%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                      <Contrast className="w-2.5 h-2.5 text-amber-300" />
                      <span>Kontras</span>
                    </label>
                    <select
                      value={customBgStyle.filterContrast || '1'}
                      onChange={(e) => updateBgStyle('filterContrast', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                    >
                      <option value="0.8">Lembut (80%)</option>
                      <option value="1">Normal (100%)</option>
                      <option value="1.2">Tinggi (120%)</option>
                      <option value="1.4">Ekstrem (140%)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Efek Warna & Blur */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>Filter Warna</span>
                    </label>
                    <select
                      value={customBgStyle.filterGrayscale || '0%'}
                      onChange={(e) => updateBgStyle('filterGrayscale', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                    >
                      <option value="0%">Warna Penuh</option>
                      <option value="50%">Semi Muted (50%)</option>
                      <option value="100%">Monochrome (Hitam Putih)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                      <span>Blur / Halus</span>
                    </label>
                    <select
                      value={customBgStyle.filterBlur || '0px'}
                      onChange={(e) => updateBgStyle('filterBlur', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-1.5 text-[10px] text-white focus:outline-none"
                    >
                      <option value="0px">Tajam (0px)</option>
                      <option value="2px">Halus (2px)</option>
                      <option value="4px">Sedang (4px)</option>
                      <option value="8px">Kabur (8px)</option>
                    </select>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                  </button>

                  <button
                    onClick={() => setShowBgToolbar(false)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 rounded-lg text-[10px] font-bold hover:brightness-110 transition-all"
                  >
                    Terapkan &amp; Selesai
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ========================================================================= */
/* EDITABLE SECTION / DIV CONTAINER (SECTION STYLING & CONTROLS)            */
/* ========================================================================= */

interface EditableSectionProps {
  id: string;
  name: string;
  children: React.ReactNode;
  className?: string;
  tag?: 'section' | 'div' | 'header' | 'footer';
}

export function EditableSection({
  id,
  name,
  children,
  className = '',
  tag: Tag = 'section',
}: EditableSectionProps) {
  const { content, setContent } = useContent();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowToolbar(false);
      }
    };
    if (showToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolbar]);

  const customStyle = content?.styles?.[`section.${id}`] || {};

  const updateSectionStyle = (prop: string, val: any) => {
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      if (!copy.styles) copy.styles = {};
      const key = `section.${id}`;
      if (!copy.styles[key]) copy.styles[key] = {};
      copy.styles[key][prop] = val;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath: key,
            styleProp: prop,
            styleVal: val,
          }, '*');
        }
      } catch (err) {
        console.error('Error posting section style:', err);
      }

      return copy;
    });
  };

  const appliedStyle: React.CSSProperties = {
    ...(customStyle.backgroundColor ? { backgroundColor: customStyle.backgroundColor } : {}),
    ...(customStyle.padding ? { padding: customStyle.padding } : {}),
  };

  if (!isEditMode) {
    return (
      <Tag id={id} className={className} style={appliedStyle}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag 
      id={id} 
      className={`relative group/editable-section ${className}`}
      style={appliedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={toolbarRef}
    >
      {/* Elementor Section Outline */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-all duration-150 z-20 ${
          showToolbar 
            ? 'border-2 border-amber-400/90 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]' 
            : isHovered 
            ? 'border border-dashed border-amber-400/50' 
            : 'border-0'
        }`}
      />

      {/* Elementor Section Header Handle Bar */}
      {isHovered && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-slate-900/95 text-white text-xs px-3.5 py-1.5 rounded-full shadow-2xl border border-amber-400/60 backdrop-blur-md animate-fade-in">
          <Layout className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">{name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowToolbar(!showToolbar);
            }}
            className="ml-1 px-2 py-0.5 bg-amber-400 hover:brightness-110 text-slate-950 font-bold text-[10px] rounded transition-all"
            title="Ubah style / warna latar section ini"
          >
            Edit Section
          </button>
        </div>
      )}

      {/* Floating Section Style Toolbar */}
      {showToolbar && (
        <div 
          className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl border border-amber-400/60 rounded-2xl shadow-2xl p-3 flex items-center gap-3 text-white text-xs select-none animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
            <Paintbrush className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Latar Section</span>
          </div>

          {/* Quick Bg Color Presets */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1.5 rounded-xl border border-slate-800">
            {[
              { color: '#ffffff', label: 'Putih Bersih' },
              { color: '#f8fafc', label: 'Slate Terang' },
              { color: '#0f172a', label: 'Navy Deep' },
              { color: '#020617', label: 'Slate Gelap' },
              { color: '#0b1120', label: 'Midnight' },
            ].map((p) => (
              <button
                key={p.color}
                onClick={() => updateSectionStyle('backgroundColor', p.color)}
                style={{ backgroundColor: p.color }}
                className="w-5 h-5 rounded-full border border-slate-600 hover:scale-125 transition-transform"
                title={p.label}
              />
            ))}
            <input
              type="color"
              value={customStyle.backgroundColor || '#ffffff'}
              onChange={(e) => updateSectionStyle('backgroundColor', e.target.value)}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              title="Pilih Warna Bebas"
            />
          </div>

          {/* Padding Adjust */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1.5 rounded-xl border border-slate-800 text-[11px]">
            <span>Padding:</span>
            <select
              value={customStyle.padding || ''}
              onChange={(e) => updateSectionStyle('padding', e.target.value)}
              className="bg-transparent text-amber-300 text-[11px] focus:outline-none cursor-pointer font-semibold"
            >
              <option value="" className="bg-slate-900">Normal (Default)</option>
              <option value="40px 0" className="bg-slate-900">Rapat (40px)</option>
              <option value="80px 0" className="bg-slate-900">Sedang (80px)</option>
              <option value="120px 0" className="bg-slate-900">Luas (120px)</option>
            </select>
          </div>

          <button
            onClick={() => setShowToolbar(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <Check className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {children}
    </Tag>
  );
}

/* ========================================================================= */
/* EDITABLE ICON COMPONENT (WITH EMOTE-STYLE PALETTE)                       */
/* ========================================================================= */

interface EditableIconProps {
  iconKey: string; // e.g. 'navbar.ctaIcon', 'hero.cta1Icon', 'services.pillars.0.icon'
  fallbackIcon?: string; // e.g. 'Calendar', 'Briefcase', 'Scale'
  className?: string;
  label?: string;
  containerClassName?: string;
}

export function EditableIcon({
  iconKey,
  fallbackIcon = 'Scale',
  className = 'w-5 h-5 text-gold-accent',
  label,
  containerClassName = '',
}: EditableIconProps) {
  const { content, setContent } = useContent();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  // Read current icon name
  const currentIconName = (content?.icons && content.icons[iconKey]) || fallbackIcon;

  // Custom icon style (color, fontSize)
  const customStyle = content?.styles?.[`icon.${iconKey}`] || {};

  const handleSelectIcon = (newIconName: string) => {
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      if (!copy.icons) copy.icons = {};
      copy.icons[iconKey] = newIconName;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath: `icons.${iconKey}`,
            value: newIconName,
          }, '*');
        }
      } catch (err) {}

      return copy;
    });
  };

  const handleUpdateIconStyle = (prop: string, val: any) => {
    setContent((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      if (!copy.styles) copy.styles = {};
      const styleKey = `icon.${iconKey}`;
      if (!copy.styles[styleKey]) copy.styles[styleKey] = {};
      copy.styles[styleKey][prop] = val;

      try {
        sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(copy));
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'ON_ELEMENT_UPDATED',
            content: copy,
            fieldPath: styleKey,
            styleProp: prop,
            styleVal: val,
          }, '*');
        }
      } catch (err) {}

      return copy;
    });
  };

  const IconComp = ICON_MAP[currentIconName] || ICON_MAP[fallbackIcon] || ICON_MAP['Scale'] || Scale;

  const appliedStyle: React.CSSProperties = {
    ...(customStyle.color ? { color: customStyle.color } : {}),
    ...(customStyle.size ? { width: customStyle.size, height: customStyle.size } : {}),
  };

  if (!isEditMode) {
    return (
      <span className={`inline-flex items-center justify-center shrink-0 ${containerClassName}`} style={appliedStyle}>
        <IconComp className={className} style={customStyle.color ? { color: customStyle.color } : undefined} />
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center justify-center cursor-pointer group/editable-icon select-none ${containerClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={pickerRef}
      data-action="true"
      data-toolbar="true"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPicker(!showPicker);
      }}
    >
      {/* Visual outline on hover in edit mode */}
      <span
        className={`absolute -inset-1 rounded-lg pointer-events-none transition-all duration-150 z-20 ${
          showPicker
            ? 'border-2 border-amber-400 bg-amber-400/20 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
            : isHovered
            ? 'border-2 border-dashed border-amber-400/90 bg-amber-400/10'
            : 'border border-transparent'
        }`}
      />

      {/* Hover tooltip */}
      {isHovered && !showPicker && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-slate-950 text-white text-[10px] px-2 py-0.5 rounded shadow-xl border border-amber-400/50 pointer-events-none whitespace-nowrap animate-fade-in">
          <Edit3 className="w-2.5 h-2.5 text-amber-400" />
          <span className="font-bold text-amber-300">{label || currentIconName}</span>
          <span className="text-slate-400 text-[9px]">(Ganti Ikon)</span>
        </span>
      )}

      <IconComp 
        className={`${className} transition-transform group-hover/editable-icon:scale-110`} 
        style={customStyle.color ? { color: customStyle.color } : undefined} 
      />

      {/* Emote Icon Picker Popover */}
      {showPicker && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <IconPicker
            currentIconName={currentIconName}
            onSelectIcon={handleSelectIcon}
            onClose={() => setShowPicker(false)}
            customColor={customStyle.color}
            onChangeColor={(c) => handleUpdateIconStyle('color', c)}
            customSize={customStyle.size}
            onChangeSize={(s) => handleUpdateIconStyle('size', s)}
            title={`Pilih Ikon: ${label || iconKey}`}
          />
        </div>
      )}
    </span>
  );
}


