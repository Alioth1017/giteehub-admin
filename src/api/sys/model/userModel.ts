/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Get user information
 */
export interface GetUserInfoByUserIdParams {
  userId: string | number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  expire: number;
  refreshExpire: number;
  token: string;
  refreshToken: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoByUserIdModel {
  roles: RoleInfo[];
  // 用户id
  // userId: string | number;
  id: string | number;
  // 用户名
  username: string;
  // 真实名字
  // realName: string;
  name: string;
  // 介绍
  remark?: string;
}

/**
 * @description: Captcha interface parameters
 */
export interface CaptchaParams {
  height: number;
  width: number;
  background: string;
}

/**
 * @description: Captcha interface return value
 */
export interface CaptchaResultModel {
  captchaId: string;
  data: string;
}
