import type { Ref } from 'vue';
import type { FastingPlan, FastingRecord } from '@/models';
import dayjs from 'dayjs';
import { formatDuration } from '@/utils/time';

/**
 * 断食计时器 Hook
 * 基于断食记录状态进行计时
 */
export function useFastingTimer(
  activePlan: Ref<FastingPlan | null>,
  fastingRecord: Ref<FastingRecord | null>
) {
  const now = ref(dayjs());
  let timer: any;

  // 每秒更新当前时间
  const startTimer = () => {
    timer = setInterval(() => {
      now.value = dayjs();
    }, 1000);
  };

  startTimer();
  onUnmounted(() => clearInterval(timer));

  // 是否已开始今日计划
  const hasTodayStarted = computed(() => {
    return !!fastingRecord.value;
  });

  // 是否断食中
  const isFasting = computed(() => {
    if (!hasTodayStarted.value)
      return false;
    return fastingRecord.value?.status === 'active';
  });

  // 状态文本
  const statusText = computed(() => {
    if (!fastingRecord.value)
      return '未开始';

    switch (fastingRecord.value.status) {
      case 'active': return '断食中';
      case 'completed': return '已完成';
      case 'broken': return '已中断';
      default: return '未开始';
    }
  });

  // 计算进度和时间信息
  const timeInfo = computed(() => {
    if (!fastingRecord.value || !activePlan.value) {
      return {
        percent: 0,
        remainingText: '0小时0分',
        elapsedText: '0小时0分'
      };
    }

    const record = fastingRecord.value;
    const plan = activePlan.value;

    if (record.status === 'pending') {
      return {
        percent: 0,
        remainingText: '未开始',
        elapsedText: '0小时0分'
      };
    }

    // 使用记录中的开始时间
    const startTime = dayjs(record.startTime);
    const plannedDuration = plan.fastingHours * 60 * 60; // 转为秒
    const elapsed = now.value.diff(startTime, 'second');

    let percent = 0;
    let remainingSeconds = 0;

    if (record.status === 'active') {
      percent = Math.min(100, (elapsed / plannedDuration) * 100);
      remainingSeconds = Math.max(0, plannedDuration - elapsed);
    }
    else if (record.status === 'completed') {
      percent = 100;
      remainingSeconds = 0;
    }
    else if (record.status === 'broken') {
      // 中断时显示已完成的进度
      percent = Math.min(100, (elapsed / plannedDuration) * 100);
      remainingSeconds = 0;
    }

    return {
      percent: Math.floor(percent),
      remainingText: formatDuration(remainingSeconds),
      elapsedText: formatDuration(Math.max(0, elapsed))
    };
  });

  return {
    // 状态
    isFasting,
    hasTodayStarted,
    statusText,

    // 时间信息
    percent: computed(() => timeInfo.value.percent),
    remainingText: computed(() => timeInfo.value.remainingText),
    elapsedText: computed(() => timeInfo.value.elapsedText),

    // 计划信息
    activePlan: readonly(activePlan)
  };
}
