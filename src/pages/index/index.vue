<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
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
import ProfileGuideCard from '@/components/profile-guide-card/index.vue';
import QuickSetupModal from '@/components/quick-setup-modal/index.vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useFastingTimer } from '@/pages/index/hooks/useFastingTimer';
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
const { userInfo, isNewUserFlag, isProfileComplete } = storeToRefs(userStore);

// 模拟的情侣信息（后续可以从后端获取）
const coupleInfo = ref({
  partner: '小红'
});

// 断食状态配置
const fastingState = ref({
  fastingHours: 16,
  eatingHours: 8,
  eatingWindow: '08:00 - 16:00'
});

// 进度条颜色配置
const gradientColor = { 0: '#ff9800', 100: '#ff5722' };

// 使用断食计时器 Hook（统一的数据源）
const { percent, statusText, descText } = useFastingTimer(
  fastingState.value.eatingWindow
);

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

// 快速设置弹窗状态
const showQuickSetup = ref(false);

// 处理快速设置完成
async function handleQuickSetupComplete(setupData: any) {
  const success = await userStore.quickSetupProfile(setupData);
  if (success) {
    showQuickSetup.value = false;
  }
}

// 处理快速设置跳过
function handleQuickSetupSkip() {
  showQuickSetup.value = false;
}

// 处理引导卡片的快速设置按钮
function handleGuideQuickSetup() {
  showQuickSetup.value = true;
}

// 处理引导卡片的去完善按钮
function handleGuideGoProfile() {
  uni.navigateTo({
    url: '/pages/profile/edit/edit'
  });
}

// 处理引导卡片关闭
function handleGuideDismiss() {
  console.log('引导卡片已关闭');
}

// 检查是否需要显示新用户设置弹窗
function checkNewUserSetup() {
  // 如果是新用户且信息不完整，延迟显示快速设置弹窗
  if (isNewUserFlag.value && !isProfileComplete.value) {
    setTimeout(() => {
      showQuickSetup.value = true;
    }, 1000); // 延迟1秒显示，让用户先看到首页
  }
}

// 页面加载
onLoad(() => {
  console.log('首页加载完成');
  // 检查新用户设置
  nextTick(() => {
    checkNewUserSetup();
  });
});
</script>

<template>
  <view class="home-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <!-- 个人信息引导卡片 -->
    <ProfileGuideCard
      :user-info="userInfo"
      @quick-setup="handleGuideQuickSetup"
      @go-profile="handleGuideGoProfile"
      @dismiss="handleGuideDismiss"
    />

    <!-- 问候语区域 -->
    <view class="greeting-section">
      <view class="greeting-text">
        <text class="greeting-main">
          {{ greeting }}，{{ userInfo.nickname }} ❤️
        </text>
        <text class="greeting-sub">
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
          {{ fastingState.eatingWindow }}
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

  <!-- 快速设置弹窗 -->
  <QuickSetupModal
    v-model="showQuickSetup"
    @complete="handleQuickSetupComplete"
    @skip="handleQuickSetupSkip"
  />
</template>

<style lang="scss">
@import './index.scss';
</style>
