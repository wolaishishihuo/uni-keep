import type { UserProfile } from '@/models/user';
import { http, httpPost } from '@/utils/http';

/**
 * 登录表单
 */
export interface ILoginForm {
  code: string;
}

/**
 * 登录返回的信息
 */
export interface UserLoginRes {
  token: string;
  userInfo: UserProfile;
}

/**
 * 用户登录
 * @param loginForm 登录表单
 */
export function login(loginForm: ILoginForm) {
  return httpPost<UserLoginRes>('/user/login', loginForm);
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get<UserProfile>('/user/info');
}

/**
 * 修改用户信息
 */
export function updateInfo(data: UserProfile) {
  return http.post('/user/updateInfo', data);
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: (err) => {
        console.error('微信登录失败:', err);
        reject(new Error(err.errMsg || '微信登录失败'));
      }
    });
  });
}

/**
 * 获取微信个人信息授权
 * @returns Promise 包含微信用户信息
 */
export function getWxUserInfo() {
  return new Promise<UniApp.GetUserProfileRes>((resolve, reject) => {
    uni.getUserInfo({
      provider: 'weixin',
      success: res => resolve(res),
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        reject(new Error(err.errMsg || '获取用户信息失败'));
      }
    });
  });
}
