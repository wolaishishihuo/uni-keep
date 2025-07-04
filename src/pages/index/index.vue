<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
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

<script lang="ts" setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
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
});

function handleClick() {
  //  前往设置页面
  uni.navigateTo({ url: '/pages/setup/index' });
}
</script>

<template>
  <view class="home-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <view @click="handleClick">
      点击
    </view>
    <!-- 问候语区域 -->
    <view class="greeting-section">
      <view class="greeting-text">
        <text class="greeting-main">
          {{ greeting }}，{{ userInfo.nickname }} ❤️
        </text>
        <text v-show="coupleInfo.partner" class="greeting-sub">
          今天也要和{{ coupleInfo.partner }}一起坚持哦
        </text>
      </view>
    </view>

    <!-- 断食计时器 - 使用组合样式类 -->
    <view class="fasting-timer keep-glass-card">
      <view class="timer-circle">
        <wd-circle v-model="percent" :color="gradientColor">
          <view class="timer-content">
            {{ statusText }}
          </view>
        </wd-circle>
      </view>
      <text class="timer-description">
        {{ descText }}
      </text>
    </view>

    <!-- 今日概览 - 使用组合样式类 -->
    <view class="daily-overview">
      <view class="overview-item keep-glass-card-light">
        <text class="overview-label">
          进食窗口
        </text>
        <text class="overview-value">
          {{ eatingWindow }}
        </text>
      </view>
      <view class="overview-item keep-glass-card-light">
        <text class="overview-label">
          今日坚持
        </text>
        <text class="overview-value">
          第7天
        </text>
      </view>
    </view>

    <!-- 快速操作 - 使用组合样式类 -->
    <view class="quick-actions">
      <view class="quick-actions-title">
        快速操作
      </view>
      <view class="actions-grid">
        <view
          v-for="action in quickActions"
          :key="action.action"
          class="keep-glass-card-light action-item"
          @click="handleQuickAction(action.action)"
        >
          <text class="action-icon">
            {{ action.icon }}
          </text>
          <text class="action-text">
            {{ action.text }}
          </text>
        </view>
      </view>
    </view>

    <!-- 情侣状态 - 使用组合样式类 -->
    <view class="keep-glass-card-light couple-status">
      <view class="couple-header">
        <text class="couple-title">
          {{ coupleInfo.partner }}的状态
        </text>
      </view>
      <view class="couple-info">
        <view class="couple-item">
          <text class="couple-label">
            当前状态
          </text>
          <text class="couple-value active">
            断食中
          </text>
        </view>
        <view class="couple-item">
          <text class="couple-label">
            坚持天数
          </text>
          <text class="couple-value">
            6天
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
