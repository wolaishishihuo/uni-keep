<template>
  <view class="home-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <button @click="startFasting">
      11212
    </button>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { ACTION_PLAN_TEMPLATE_ID } from '@/constants';
import { useFastingTimer } from '@/hooks/useFastingTimer';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';

defineOptions({
  name: 'Home'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);

// 用户状态管理
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

function startFasting() {
  uni.requestSubscribeMessage({
    tmplIds: [ACTION_PLAN_TEMPLATE_ID],
    success: (res) => {
      console.log(res);
    }
  });
}
// 模拟的情侣信息（后续可以从后端获取）
const coupleInfo = ref({
  partner: ''
});

// 进度条颜色配置
const gradientColor = { 0: '#ff9800', 100: '#ff5722' };

// 使用断食计时器 Hook（内部处理所有逻辑）
const { percent, statusText, descText, activePlan } = useFastingTimer();

// 获取进食窗口显示文本
const eatingWindow = computed(() => {
  if (!activePlan.value)
    return '未设置';
  return `${activePlan.value.startTime} - ${activePlan.value.endTime}`;
});

// 获取问候语
function getGreeting() {
  const hour = dayjs().hour();
  if (hour < 6)
    return '夜深了';
  if (hour < 12)
    return '早安';
  if (hour < 18)
    return '下午好';
  return '晚上好';
}

const greeting = computed(() => getGreeting());

// 快速操作
const quickActions = [
  { icon: '📊', text: '记录体重', action: 'recordWeight' },
  { icon: '💧', text: '喝水记录', action: 'recordWater' },
  { icon: '🏃‍♂️', text: '运动打卡', action: 'recordExercise' },
  { icon: '❤️', text: '情侣互动', action: 'coupleInteraction' }
];

// 处理快速操作点击
function handleQuickAction(action: string) {
  switch (action) {
    case 'recordWeight':
      uni.navigateTo({ url: '/pages/weight/record' });
      break;
    case 'recordWater':
      // TODO: 实现喝水记录
      uni.showToast({ title: '功能开发中', icon: 'none' });
      break;
    case 'recordExercise':
      // TODO: 实现运动打卡
      uni.showToast({ title: '功能开发中', icon: 'none' });
      break;
    case 'coupleInteraction':
      uni.navigateTo({ url: '/pages/couple/interaction' });
      break;
  }
}

// 页面加载
onLoad(() => {
  console.log('首页加载完成');
  // 如果用户没有完成设置，则跳转到设置页面
  if (!userInfo.value.isSetup) {
    uni.navigateTo({ url: '/pages/setup/index' });
  }
});
</script>

<route lang="json5" type="home">
{
  layout: 'tabbar',
  needLogin: true,
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '坚持有你'
  }
}
</route>

<style lang="scss">
@import './index.scss';
</style>
