import dayjs from 'dayjs';

/**
 * 断食计时器 Hook
 * @param eatingWindow 进食窗口，格式: "08:00 - 16:00"
 */
export function useFastingTimer(eatingWindow: string) {
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

  // 解析进食窗口
  const parseEatingWindow = (window: string) => {
    const [startTime, endTime] = window.split('-').map(time => time.trim());
    return { startTime, endTime };
  };

  // 获取今日进食时间段
  const getTodayEatingPeriod = () => {
    const { startTime, endTime } = parseEatingWindow(eatingWindow);
    const today = now.value.format('YYYY-MM-DD');

    let eatingStart = dayjs(`${today} ${startTime}`);
    let eatingEnd = dayjs(`${today} ${endTime}`);

    // 处理跨天情况（如 22:00 - 06:00）
    if (eatingEnd.isBefore(eatingStart)) {
      if (now.value.isBefore(eatingEnd)) {
        // 当前时间在结束时间之前，说明是昨天开始的进食窗口
        eatingStart = eatingStart.subtract(1, 'day');
      }
      else {
        // 当前时间在开始时间之后，进食窗口延续到明天
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

  // 获取当前周期信息（进食周期或断食周期）
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
        // 当前时间在今日进食开始前，断食窗口是昨天结束到今天开始
        fastingStart = eatingEnd.subtract(1, 'day');
        fastingEnd = eatingStart;
      }
      else {
        // 当前时间在今日进食结束后，断食窗口是今天结束到明天开始
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
    const { start, end } = currentPeriod.value;
    const totalSeconds = end.diff(start, 'second');
    const passedSeconds = now.value.diff(start, 'second');
    return Math.min(100, Math.max(0, Math.floor((passedSeconds / totalSeconds) * 100)));
  });

  // 计算剩余时间文本
  const remainingText = computed(() => {
    const remainingSeconds = currentPeriod.value.end.diff(now.value, 'second');
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    return `${hours}小时${minutes}分`;
  });

  // 完整的描述文本（包含剩余时间）
  const fullDescText = computed(() => {
    return `${currentPeriod.value.descText}${remainingText.value}`;
  });

  return {
    // 状态数据
    percent,
    remainingText,
    statusText: computed(() => currentPeriod.value.statusText),
    descText: fullDescText, // 使用完整的描述文本

    // 布尔状态
    isFasting: computed(() => !isInEatingWindow.value),
    isEating: computed(() => isInEatingWindow.value),

    // 周期信息
    currentPeriod: computed(() => ({
      type: currentPeriod.value.type,
      start: currentPeriod.value.start,
      end: currentPeriod.value.end
    }))
  };
}
