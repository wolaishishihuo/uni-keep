import type { FastingPlan, SystemConfig, UserInfo } from './types';
import type { UserProfile } from '@/models';
import { http } from '@/utils/http';

// 完成个人信息基础设置
export function completeSetupApi(data: {
  fastingPlan: FastingPlan;
  systemConfig: SystemConfig[];
  userId: string;
  userInfo: UserInfo;
}) {
  return http.post('/user/completeSetup', data);
}

/**
 * 获取用户信息
 */
export function getUserInfo(id: string) {
  return http.get<UserProfile>(`/user/info/${id}`);
}
