import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AccountList = '/admin/base/sys/user/page',
  DeptList = '/admin/base/sys/department/list',
  DeptAdd = '/admin/base/sys/department/add',
  DeptUpdate = '/admin/base/sys/department/update',
  DeptDelete = '/admin/base/sys/department/delete',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/admin/base/sys/role/list',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.post<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.post<DeptListGetResultModel>({ url: Api.DeptList, params });

export const DeptAdd = (params?: DeptListItem) =>
  defHttp.post<DeptListItem>({ url: Api.DeptAdd, params });

export const DeptUpdate = (params?: DeptListItem) =>
  defHttp.post<DeptListItem>({ url: Api.DeptUpdate, params });

export const DeptDelete = (params: any) =>
  defHttp.post<DeptListItem>({ url: Api.DeptDelete, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.post<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });
