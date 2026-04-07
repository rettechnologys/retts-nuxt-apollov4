import { useLang } from '~/composables/Lang';
import { SysMenuAclEntity } from '~/modules//domain/internal/sys/sys-menu-acl';
import { capitalCaseStr } from '~/utils/helpers/String';
import cloneDeep from 'lodash/cloneDeep';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { SysMenuEntity } from '~/modules//domain/internal/sys/sys-menu';
import { IVueTreeNode } from '@/utils/types/VueTree';
import { flatenNestedArray } from './Array';
import sortBy from 'lodash/sortBy';
import { APP } from '~/utils/config';

export type SysMenuTreeEntity = SysMenuEntity & IVueTreeNode;
export type SysMenuAclTreeEntity = SysMenuAclEntity & IVueTreeNode;
export type MenuTreeItem = {
  uuid: string;
  orderNumber: number;
  name: string;
};
export type MenuModel = {
  label: string;
  to: string;
  linkTarget?: string;
  linkType?: string;
  isHidden?: boolean;
  icon?: string;
  class?: string;
  url?: string;
  badge?: string;
  items?: MenuModel[];
};

export function findMenuByKeyValue(
  menus: SysMenuAclEntity[],
  keyToFind: string,
  valueToFind: any,
): SysMenuAclEntity | undefined {
  for (const item of menus) {
    //if (item[keyToFind] === _find) return item;
    if (
      keyToFind in item &&
      item[keyToFind as keyof typeof item] === valueToFind
    ) {
      return item;
    }

    if (item.children) {
      const recursiveResult = findMenuByKeyValue(
        item.children,
        keyToFind,
        valueToFind,
      );
      if (recursiveResult) return recursiveResult;
    }
  }
  return undefined;
}

export function getBreadcrumb(
  menu: SysMenuAclEntity | SysMenuAclEntity[],
  name: string,
): any {
  //const flatMenus = flatenNestedArray(menus, 'children');
  // return flatMenus
  //   .filter((menu) => menu.parentId === 2)
  //   .map((menu) => menu.name);
  //console.log('childrenKey', menus);
  //return getPath(menus, 'id', 9, 'children');
  //return findPath(menus, 'children', 'id', 2);
  //return _find(flatMenus, ({ parentId }) => parentId == 2);

  if (!Array.isArray(menu) && menu.name === name) {
    const desc = getMenuDescription(menu);
    return [
      {
        name: desc,
        path: menu?.path && !menu.path.endsWith('#') ? menu.path : undefined,
      },
    ];
  } else if ((!Array.isArray(menu) && menu.children) || Array.isArray(menu)) {
    const children = Array.isArray(menu) ? menu : menu.children;
    for (const child of children) {
      const result = getBreadcrumb(child, name);
      if (result) {
        if (!Array.isArray(menu) && menu.name) {
          const desc = getMenuDescription(menu);
          result.unshift({
            name: desc,
            path:
              menu?.path && !menu.path.endsWith('#') ? menu.path : undefined,
          });
        }
        //console.log('getBreadcrumb:2', result);
        return result;
      }
    }
  }
}

export function addBreadcrumb(route: RouteLocationNormalized, name: string) {
  const cloneBreadcrumb: any[] = cloneDeep(route.meta.breadcrumb) as any[];
  cloneBreadcrumb?.push({ name });

  route.meta.breadcrumb = cloneBreadcrumb;
}

export function getRouteLastName() {
  const route = useRoute();
  console.log('getRouteLastName', route);
  const toName = route.name?.toString();
  console.log('getRouteLastName', toName);
  const sName = toName?.split(APP.RNS) || [];
  console.log('getRouteLastName', sName);
  const lastName = sName[sName.length - 1];
  console.log('getRouteLastName:lastName', lastName);
  return lastName;
}

export function getMenuDescription(menu: SysMenuAclEntity | SysMenuEntity) {
  let desc;
  desc = menu.sysMenuLangs.find(
    (item) => item.sysLangId === useLang().currentLang.value,
  )?.description;

  if (!desc) {
    desc = menu.name;
  }

  return capitalCaseStr(desc);
}

export function generateMenuApp(arr: SysMenuAclEntity[]): MenuModel[] {
  return arr.map((obj) => {
    const menu: MenuModel = {
      label: obj.sysMenuLangs.length ? getMenuDescription(obj) : obj.name,
      to: obj.path,
      url: obj.url,
      linkTarget: obj.linkTarget,
      linkType: obj.linkType,
      isHidden: obj.isHidden,
      icon: obj.iconCls ?? 'pi pi-th-large',
      items: obj.children.length ? generateMenuApp(obj.children) : undefined,
    };
    return menu;
  });
}
//TODO: Adjustment Done
export function getRoutePaths() {
  const router = useRouter();
  console.log('getRoutePaths', router.getRoutes());
  const appRoutes = router.getRoutes();

  console.log('appLayoutRouter', appRoutes);


  return sortBy(flatenNestedArray(appRoutes), 'path');
}
