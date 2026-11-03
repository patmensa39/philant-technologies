/**
 * Power Platform products shown on the homepage.
 * Icons are Microsoft's official, unmodified SVGs (public/images/power-platform).
 * Microsoft's terms: do not crop, flip, rotate, or distort the icons, and always show the
 * full product name near each icon. Keep descriptions factual about the products.
 */
export interface PlatformProduct {
  id: 'dataverse' | 'power-apps' | 'power-automate' | 'power-pages' | 'ai-builder';
  name: string;
  icon: string;
  description: string;
}

export const PLATFORM_ICON = { name: 'Microsoft Power Platform', icon: '/images/power-platform/PowerPlatform.svg' };

/** The data layer sits at the center; the other products connect to it. */
export const PLATFORM_HUB: PlatformProduct = {
  id: 'dataverse', name: 'Microsoft Dataverse', icon: '/images/power-platform/Dataverse.svg',
  description: 'Data modeling, relationships, business rules, and security roles.',
};

export const PLATFORM_NODES: PlatformProduct[] = [
  { id: 'power-apps', name: 'Power Apps', icon: '/images/power-platform/PowerApps.svg', description: 'Model-driven and canvas applications.' },
  { id: 'power-automate', name: 'Power Automate', icon: '/images/power-platform/PowerAutomate.svg', description: 'Cloud flows for approvals, notifications, and integrations.' },
  { id: 'power-pages', name: 'Power Pages', icon: '/images/power-platform/PowerPages.svg', description: 'Websites and portals built on Dataverse.' },
  { id: 'ai-builder', name: 'AI Builder', icon: '/images/power-platform/AIBuilder.svg', description: 'AI capabilities inside apps and flows.' },
];

export const TRADEMARK_NOTE =
  'Microsoft, Power Platform, Power Apps, Power Automate, Power Pages, Dataverse, and AI Builder are trademarks of the Microsoft group of companies. ' +
  'The official icons are shown unmodified to illustrate technologies I work with. This site is not affiliated with or endorsed by Microsoft.';
