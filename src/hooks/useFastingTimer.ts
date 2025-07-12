import type { Ref } from 'vue';
import type { FastingPlan, FastingRecord } from '@/models';
import dayjs from 'dayjs';
import { FastingStatus } from '@/enums';
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
  const fastingStatus = computed(() => {
    if (!hasTodayStarted.value)
      return FastingStatus.pending;
    return fastingRecord.value?.status;
  });

  // 状态文本优化
  const fastingStatusText = computed<{
    text: string;
    color: string;
    actionText: string;
    timeText: string;
  }>(() => {
    if (!fastingRecord.value) {
      return {
        text: '未开始',
        color: '#999',
        actionText: '开始断食',
        timeText: '断食时间'
      };
    };

    // 使用枚举映射表简化状态转换
    const statusMap = {
      [FastingStatus.active]: {
        text: '断食中',
        color: '#4195e1',
        actionText: '中断断食',
        timeText: '断食时间'
      },
      [FastingStatus.completed]: {
        text: '已完成',
        color: '#00b368',
        timeText: '进食时间'
      }
    };

    return statusMap[fastingRecord.value.status];
  });

  // 基础计算属性 - 处理共享的时间计算逻辑
  const baseTimeInfo = computed(() => {
    if (!fastingRecord.value || !activePlan.value) {
      return null; // 没有记录或计划
    }

    const record = fastingRecord.value;
    if (record.status === FastingStatus.pending) {
      return { isPending: true };
    }

    // 计算基础时间信息
    const startTime = dayjs(record.startTime); // 开始时间
    const plannedDuration = activePlan.value.fastingHours * 60 * 60; // 计划时长
    const elapsed = now.value.diff(startTime, 'second'); // 已过时间
    const isActive = record.status === FastingStatus.active; // 是否活跃
    const isCompleted = record.status === FastingStatus.completed; // 是否已完成

    return {
      isPending: false,
      startTime,
      plannedDuration,
      elapsed,
      isActive,
      isCompleted
    };
  });

  // 计算进度百分比
  const percent = computed(() => {
    const base = baseTimeInfo.value;
    if (!base)
      return 0;
    if (base.isPending)
      return 0;
    if (base.isCompleted)
      return 100;

    // 计算进度百分比
    return Math.min(100, Math.floor((base.elapsed / base.plannedDuration) * 100));
  });

  // 是否在时间窗口内
  const isInTimeWindow = computed(() => {
    const base = baseTimeInfo.value;
    if (!base)
      return false;
    return base.isActive && percent.value < 100;
  });

  // 计算剩余时间文本
  const remainingText = computed(() => {
    const base = baseTimeInfo.value;
    if (!base)
      return '0小时0分';
    if (base.isPending)
      return '未开始';
    if (!base.isActive)
      return '0小时0分';

    // 计算剩余时间
    const remainingSeconds = Math.max(0, base.plannedDuration - base.elapsed);
    return formatDuration(remainingSeconds);
  });

  // 计算已经过时间文本
  const elapsedText = computed(() => {
    const base = baseTimeInfo.value;
    if (!base)
      return '0小时0分';
    if (base.isPending)
      return '0小时0分';

    return formatDuration(Math.max(0, base.elapsed));
  });

  // 在返回值中使用这些独立的计算属性
  return {
    // 状态
    fastingStatus,
    hasTodayStarted,
    fastingStatusText,

    // 时间信息 - 现在都是独立的计算属性，不再嵌套
    percent,
    remainingText,
    elapsedText,
    isInTimeWindow
  };
}
