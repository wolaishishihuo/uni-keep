import type { FastingPlan } from '@/models';
import { http } from '@/utils/http';

//  获取断食计划
export function getFastingPlanList(params) {
  return http.get<FastingPlan[]>('/fasting/plan/list', params);
}
