import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
import { formatDuration } from '@/utils/time';

/**
 * 断食计时器 Hook
 * 自动获取用户的断食计划并处理计时逻辑
 */
export function useFastingTimer() {
  // 获取用户断食计划
  const { fastingPlan } = storeToRefs(useUserStore());

  // 获取当前活跃的断食计划
  const activePlan = computed(() =>
    fastingPlan.value.find(plan => plan.isActive === '1')
  );

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

  // 获取进食窗口时间
  const eatingWindow = computed(() => {
    if (!activePlan.value)
      return '08:00 - 16:00'; // 默认进食窗口
    return `${activePlan.value.startTime} - ${activePlan.value.endTime}`;
  });

  // 解析进食窗口
  const parseEatingWindow = (window: string) => {
    const [startTime, endTime] = window.split('-').map(time => time.trim());
    return { startTime, endTime };
  };

  // 获取今日进食时间段
  const getTodayEatingPeriod = () => {
    const { startTime, endTime } = parseEatingWindow(eatingWindow.value);
    const today = now.value.format('YYYY-MM-DD');

    let eatingStart = dayjs(`${today} ${startTime}`);
    let eatingEnd = dayjs(`${today} ${endTime}`);

    // 处理跨天情况（如 22:00 - 06:00）
    if (eatingEnd.isBefore(eatingStart)) {
      if (now.value.isBefore(eatingEnd)) {
        eatingStart = eatingStart.subtract(1, 'day');
      }
      else {
        eatingEnd = eatingEnd.add(1, 'day');
      }
    }

    return { eatingStart, eatingEnd };
  };

  // 判断当前是否在进食窗口
  const isInEatingWindow = computed(() => {
    const { eatingStart, eatingEnd } = getTodayEatingPeriod();
    return now.value.isAfter(eatingStart) && now.value.isBefore(eatingEnd);
  });

  // 获取当前周期信息
  const currentPeriod = computed(() => {
    const { eatingStart, eatingEnd } = getTodayEatingPeriod();

    if (isInEatingWindow.value) {
      // 进食中
      return {
        type: 'eating' as const,
        start: eatingStart,
        end: eatingEnd,
        statusText: '进食中',
        descText: '距离断食开始还有'
      };
    }
    else {
      // 断食中
      let fastingStart: dayjs.Dayjs;
      let fastingEnd: dayjs.Dayjs;

      if (now.value.isBefore(eatingStart)) {
        fastingStart = eatingEnd.subtract(1, 'day');
        fastingEnd = eatingStart;
      }
      else {
        fastingStart = eatingEnd;
        fastingEnd = eatingStart.add(1, 'day');
      }

      return {
        type: 'fasting' as const,
        start: fastingStart,
        end: fastingEnd,
        statusText: '断食中',
        descText: '距离进食窗口还有'
      };
    }
  });

  // 计算进度百分比
  const percent = computed(() => {
    if (!activePlan.value)
      return 0;
    const { start, end } = currentPeriod.value;
    const totalSeconds = end.diff(start, 'second');
    const passedSeconds = now.value.diff(start, 'second');
    return Math.min(100, Math.max(0, Math.floor((passedSeconds / totalSeconds) * 100)));
  });

  // 计算剩余时间文本
  const remainingText = computed(() => {
    if (!activePlan.value)
      return '0小时0分';
    const remainingSeconds = currentPeriod.value.end.diff(now.value, 'second');
    return formatDuration(remainingSeconds);
  });

  // 计算已坚持时间文本
  const elapsedText = computed(() => {
    if (!activePlan.value)
      return '0小时0分';
    const elapsedSeconds = now.value.diff(currentPeriod.value.start, 'second');
    return formatDuration(elapsedSeconds);
  });

  return {
    // 状态数据
    percent,
    remainingText,
    elapsedText,
    statusText: computed(() => activePlan.value ? currentPeriod.value.statusText : '暂无计划'),
    descText: computed(() => activePlan.value ? `${currentPeriod.value.descText}${remainingText.value}` : '请设置断食计划'),

    // 布尔状态
    isFasting: computed(() => !isInEatingWindow.value),
    isEating: computed(() => isInEatingWindow.value),

    // 周期信息
    currentPeriod: computed(() => ({
      type: currentPeriod.value.type,
      start: currentPeriod.value.start,
      end: currentPeriod.value.end
    })),

    // 当前活跃计划
    activePlan: readonly(activePlan)
  };
}
