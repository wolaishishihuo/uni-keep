import type { FastingPlan, FastingRecord, FastingStatistics } from '@/models';
import { http } from '@/utils/http';

//  获取断食计划列表
export function getFastingPlanList(params) {
  return http.get<FastingPlan[]>('/fasting/plan/list', params);
}

// 获取当前断食计划
export function getFastingPlan(params) {
  return http.get<{
    plan: FastingPlan;
    statistics: FastingStatistics;
  }>('/fasting/plan/active', params);
}

// 根据日期获取今日断食记录
export function getFastingRecordByDate(params) {
  return http.get<FastingRecord>('/fastingRecord/getRecordByDate', params);
}

// 获取未完成的断食记录
export function getUnfinishedRecord(params) {
  return http.get<FastingRecord>('/fastingRecord/getUnfinishedRecord', params);
}

// 创建断食记录
export function createFastingRecord(params: {
  userId: string;
  planId: string;
  status: string;
  startTime: string;
  fastingDate: string;
}) {
  return http.post<FastingRecord>('/fastingRecord/create', params);
}

// 更新断食记录
export function updateFastingRecord(params: {
  id: string;
  status: string;
  endTime: string;
}) {
  return http.post<FastingRecord>('/fastingRecord/update', params);
}

// 根据id获取断食记录
export function getRecordById(params: {
  id: string;
}) {
  return http.get<FastingRecord>('/fastingRecord/getRecordById', params);
}
