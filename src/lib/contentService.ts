import fs from 'fs';
import path from 'path';
import { SiteContent, defaultSiteContent } from '@/data/defaultSiteContent';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'siteContent.json');

export function getSiteContent(): SiteContent {
  try {
    if (fs.existsSync(contentFilePath)) {
      const fileData = fs.readFileSync(contentFilePath, 'utf8');
      const parsed = JSON.parse(fileData);
      return deepMerge(defaultSiteContent, parsed);
    }
  } catch (error) {
    console.error('Error reading siteContent.json:', error);
  }
  return defaultSiteContent;
}

export function saveSiteContent(newContent: SiteContent): boolean {
  try {
    const dir = path.dirname(contentFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing siteContent.json:', error);
    return false;
  }
}

// Deep merge helper to guarantee all fields exist
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
