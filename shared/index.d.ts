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