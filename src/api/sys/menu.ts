import { defHttp } from '/@/utils/http/axios';
import { getMenuListByIdParamsResultModel } from './model/menuModel';

enum Api {
  GetMenuListById = '/admin/base/comm/permmenu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuListById = () => {
  return defHttp.get<getMenuListByIdParamsResultModel>({ url: Api.GetMenuListById });
};
