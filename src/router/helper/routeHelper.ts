import type { AppRouteModule, AppRouteRecordRaw, MenuItem } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { cloneDeep } from 'lodash-es';
import { warn } from '/@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';
import { isEmpty } from '/@/utils/is';

export type LayoutMapKey = 'LAYOUT';

const LayoutMap = new Map<LayoutMapKey, () => Promise<typeof import('*.vue')>>();

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    const { component, name } = item;
    const { children } = item;
    if (component) {
      item.component = dynamicImport(dynamicViewsModules, component as string);
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../../views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
}

// Turn background objects into routing objects
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  LayoutMap.set('LAYOUT', LAYOUT);

  routeList.forEach((route) => {
    if (route.component) {
      if ((route.component as string).toUpperCase() === 'LAYOUT') {
        //route.component = LayoutMap.get(route.component as LayoutMapKey);
        route.component = LayoutMap.get((route.component as string).toUpperCase() as LayoutMapKey);
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    }
    route.children && asyncImportRoute(route.children);
  });
  return (routeList as unknown) as T[];
}

/**
 * Convert multi-level routing to level 2 routing
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  let router: Router | null = createRouter({
    routes: [(routeModule as unknown) as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  routeModule.children = routeModule.children?.filter((item) => !item.children?.length);
}

// Add all sub-routes to the secondary route
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push((route as unknown) as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

// 将菜单转化成树
export function transformPermMenu(menus: MenuItem[]): AppRouteRecordRaw[] {
  const routes = menus
    .filter((e: MenuItem) => e.type !== 2)
    .map((e: MenuItem) => {
      return {
        id: e.id,
        parentId: e.parentId,
        path: revisePath(e.router || String(e.id)),
        name: e.name,
        component: e.type === 0 ? 'LAYOUT' : e.viewPath,
        type: e.type,
        orderNo: e.orderNum,
        meta: {
          title: e.name,
          icon: e.icon,
          hideMenu: !(isEmpty(e.isShow) ? true : e.isShow),
        },
        children: [],
      } as AppRouteRecordRaw;
      // return {
      //   id: e.id,
      //   parentId: e.parentId,
      //   path: revisePath(e.router || String(e.id)),
      //   viewPath: e.viewPath,
      //   type: e.type,
      //   name: e.name,
      //   icon: e.icon,
      //   orderNum: e.orderNum,
      //   isShow: isEmpty(e.isShow) ? true : e.isShow,
      //   meta: {
      //     label: e.name,
      //     keepAlive: e.keepAlive,
      //   },
      //   children: [],
      // };
    });
  // 转成树形菜单
  const menuGroup = deepTree(routes);
  return menuGroup;
}
export const revisePath = (path: string) => {
  if (!path) {
    return '';
  }

  if (path[0] == '/') {
    return path;
  } else {
    return `/${path}`;
  }
};
export function orderBy(list: Array<any>, key: any) {
  return list.sort((a, b) => a[key] - b[key]);
}
export function deepTree(list: Array<any>) {
  const newList: Array<any> = [];
  const map: any = {};

  list.forEach((e) => (map[e.id] = e));

  list.forEach((e) => {
    const parent = map[e.parentId];

    if (parent) {
      (parent.children || (parent.children = [])).push(e);
    } else {
      newList.push(e);
    }
  });

  const fn = (list: Array<any>) => {
    list.map((e) => {
      if (e.children instanceof Array) {
        e.children = orderBy(e.children, 'orderNum');

        fn(e.children);
      }
    });
  };

  fn(newList);

  return orderBy(newList, 'orderNum');
}
