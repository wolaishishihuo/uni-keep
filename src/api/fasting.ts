import type { FastingPlan, FastingRecord } from '@/models';
import { http } from '@/utils/http';

//  获取断食计划列表
export function getFastingPlanList(params) {
  return http.get<FastingPlan[]>('/fasting/plan/list', params);
}

// 获取当前断食计划
export function getFastingPlan(params) {
  return http.get<FastingPlan>('/fasting/plan/active', params);
}

// 根据日期获取今日断食记录
export function getFastingRecordByDate(params) {
  return http.get<FastingRecord>('/fastingRecord/getRecordByDate', params);
}

// 获取未完成的断食记录
export function getUnfinishedRecord(params) {
  return http.get<FastingRecord>('/fastingRecord/getUnfinishedRecord', params);
}
