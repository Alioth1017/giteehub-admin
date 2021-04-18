import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel,
  CaptchaParams,
  CaptchaResultModel,
} from './model/userModel';

import { ErrorMessageMode } from '/@/utils/http/axios/types';

enum Api {
  Captcha = '/admin/base/open/captcha',
  Login = '/admin/base/open/login',
  GetUserInfoById = '/admin/base/comm/person',
  GetPermCodeByUserId = '/admin/base/comm/permmenu',
}

/**
 * @description: captcha api
 */
export function captchaApi(params: CaptchaParams) {
  return defHttp.get<CaptchaResultModel>({
    url: Api.Captcha,
    params,
  });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfoById
 */
export function getUserInfoById() {
  return defHttp.get<GetUserInfoByUserIdModel>({
    url: Api.GetUserInfoById,
  });
}

export function getPermCodeByUserId(params: GetUserInfoByUserIdParams) {
  return defHttp.get<string[]>({
    url: Api.GetPermCodeByUserId,
    params,
  });
}
