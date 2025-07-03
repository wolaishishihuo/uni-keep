import type { FastingPlan, SystemConfig, UserInfo } from './types';
import { http } from '@/utils/http';

// 完成个人信息基础设置
export function completeSetup(data: {
  fastingPlan: FastingPlan;
  systemConfig: SystemConfig;
  userId: string;
  userInfo: UserInfo;
}) {
  return http.post('/user/completeSetup', data);
}
