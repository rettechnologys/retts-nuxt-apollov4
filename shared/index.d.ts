export interface Menu {
  name: string;
  link?: string;
  sysMenuLangs: {
    code: string;
    description: string;
  }[];
  children?: Menu[];
}

export interface GlobalConfigs {
  menus: Menu[];
}

export interface GlobalConfigsResponse {
  data: GlobalConfigs;
}

// ── Footer types ─────────────────────────────────────────────────────────────

export interface FooterLink {
  id: number;
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  type: 'links' | 'text' | 'contact';
  links?: FooterLink[];
  content?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
  enabled: boolean;
}

export interface FooterConfig {
  layout: 'columns' | 'centered' | 'minimal';
  columns: number;
  showSocial: boolean;
  showNewsletter: boolean;
  copyright: string;
  columnData: FooterColumn[];
  socialLinks: SocialLink[];
}

// ── Site info ─────────────────────────────────────────────────────────────────

export interface SiteInfo {
  name: string;
  logoUrl?: string;
  tagline?: string;
}

// ── Unified config response ───────────────────────────────────────────────────

export interface SiteConfig {
  navigation: Menu[];
  footer: FooterConfig;
  site: SiteInfo;
}
