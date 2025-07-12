import type { FastingPlan, FastingRecord, FastingStatistics } from '@/models';
import { defineStore, storeToRefs } from 'pinia';
import {
  createFastingRecord as createFastingRecordApi,
  getFastingPlan,
  getRecordById as getRecordByIdApi,
  getUnfinishedRecord as getUnfinishedRecordApi,
  updateFastingRecord as updateFastingRecordApi
} from '@/api/fasting';
import { FastingStatus } from '@/enums';
import { useUserStore } from './user';

export const useFastingStore = defineStore(
  'fasting',
  () => {
    // 状态
    const fastingPlan = ref<FastingPlan | null>(null);
    const fastingRecord = ref<FastingRecord | null>(null);
    const fastingStatistics = ref<FastingStatistics | null>(null);
    const { userInfo } = storeToRefs(useUserStore());

    // 获取未完成的断食记录
    const getUnfinishedRecord = async () => {
      const unfinishedRecordResult = await getUnfinishedRecordApi({
        userId: userInfo.value.id
      });
      if (unfinishedRecordResult.code === 200) {
        fastingRecord.value = unfinishedRecordResult.data || null;
      }
    };

    // 获取断食计划和未完成的断食记录
    const fetchFastingData = async () => {
      try {
        // 获取断食计划
        const fastingResult = await getFastingPlan({ userId: userInfo.value.id });
        if (fastingResult.code === 200) {
          fastingPlan.value = fastingResult.data.plan;
          fastingStatistics.value = fastingResult.data.statistics;
        }
      }
      catch (error) {
        console.error('获取断食数据失败:', error);
        throw error;
      }
    };

    // 根据id获取断食记录
    const getRecordById = async (id: string) => {
      const recordResult = await getRecordByIdApi({ id });
      if (recordResult.code === 200) {
        fastingRecord.value = recordResult.data || null;
      }
    };

    // 开始断食
    const startFasting = async () => {
      if (!fastingPlan.value || !userInfo.value) {
        return { code: 400, message: '断食计划或用户信息不存在' };
      }

      const result = await createFastingRecordApi({
        userId: userInfo.value.id,
        planId: fastingPlan.value.id,
        status: FastingStatus.active,
        startTime: new Date().toISOString(),
        fastingDate: new Date().toISOString()
      });

      if (result.code === 200) {
        // 创建成功后更新当前记录
        await getUnfinishedRecord();
      }

      return result;
    };

    // 更新断食记录状态
    const updateFastingRecord = async (status: FastingStatus) => {
      if (!fastingRecord.value) {
        return { code: 400, message: '没有正在进行的断食记录' };
      }

      const result = await updateFastingRecordApi({
        id: fastingRecord.value.id,
        status,
        endTime: new Date().toISOString()
      });

      if (result.code === 200) {
        // 更新成功后重新获取断食记录
        await getRecordById(fastingRecord.value.id);
      }

      return result;
    };

    // 清除断食数据
    const clearFastingData = () => {
      fastingPlan.value = null;
      fastingRecord.value = null;
    };

    return {
      // 状态
      fastingPlan,
      fastingRecord,
      fastingStatistics,
      // 方法
      fetchFastingData,
      clearFastingData,
      getUnfinishedRecord,
      getRecordById,
      startFasting,
      updateFastingRecord
    };
  },
  {
    persist: {
      key: 'fasting',
      paths: ['fastingPlan', 'fastingRecord', 'fastingStatistics'],
      storage: localStorage
    }
  }
);
