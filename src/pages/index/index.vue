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
import { useSafeArea } from '@/hooks/useSafeArea'
import { formatTime } from '@/utils'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea()

// 用户信息
const userInfo = ref({
  name: '小明',
  partner: '小红',
})

// 断食状态
const fastingState = ref({
  isFasting: true,
  remainingTime: 5 * 3600 + 32 * 60, // 5小时32分钟（秒）
  fastingHours: 16,
  eatingHours: 8,
  eatingWindow: '10:00 - 18:00',
})

// 计算剩余时间显示
const remainingTimeDisplay = computed(() => {
  const hours = Math.floor(fastingState.value.remainingTime / 3600)
  const minutes = Math.floor((fastingState.value.remainingTime % 3600) / 60)
  return `${hours}小时${minutes}分`
})

// 获取问候语
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6)
    return '夜深了'
  if (hour < 12)
    return '早安'
  if (hour < 18)
    return '下午好'
  return '晚上好'
}

const greeting = computed(() => getGreeting())

// 快速操作
const quickActions = [
  { icon: '📊', text: '记录体重', action: 'recordWeight' },
  { icon: '💧', text: '喝水记录', action: 'recordWater' },
  { icon: '🏃‍♂️', text: '运动打卡', action: 'recordExercise' },
  { icon: '❤️', text: '情侣互动', action: 'coupleInteraction' },
]

// 处理快速操作点击
function handleQuickAction(action: string) {
  switch (action) {
    case 'recordWeight':
      uni.navigateTo({ url: '/pages/weight/record' })
      break
    case 'recordWater':
      // TODO: 实现喝水记录
      uni.showToast({ title: '功能开发中', icon: 'none' })
      break
    case 'recordExercise':
      // TODO: 实现运动打卡
      uni.showToast({ title: '功能开发中', icon: 'none' })
      break
    case 'coupleInteraction':
      uni.navigateTo({ url: '/pages/couple/interaction' })
      break
  }
}

// 页面加载
onLoad(() => {
  console.log('首页加载完成')
})
</script>

<template>
  <view class="home-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text class="status-time">
        {{ formatTime(new Date(), 'HH:mm') }}
      </text>
      <text class="status-battery">
        100%
      </text>
    </view>

    <!-- 问候语区域 -->
    <view class="greeting-section">
      <view class="greeting-text">
        <text class="greeting-main">
          {{ greeting }}，{{ userInfo.name }} ❤️
        </text>
        <text class="greeting-sub">
          今天也要和{{ userInfo.partner }}一起坚持哦
        </text>
      </view>
    </view>

    <!-- 断食计时器 -->
    <view class="fasting-timer">
      <view class="timer-circle">
        <view class="timer-content">
          <text class="timer-time">
            {{ remainingTimeDisplay }}
          </text>
          <text class="timer-status">
            {{ fastingState.isFasting ? '断食中' : '进食中' }}
          </text>
        </view>
      </view>
      <text class="timer-description">
        {{ fastingState.isFasting ? '距离进食窗口还有' : '距离断食开始还有' }}
      </text>
    </view>

    <!-- 今日概览 -->
    <view class="daily-overview">
      <view class="overview-item">
        <text class="overview-label">
          进食窗口
        </text>
        <text class="overview-value">
          {{ fastingState.eatingWindow }}
        </text>
      </view>
      <view class="overview-item">
        <text class="overview-label">
          今日坚持
        </text>
        <text class="overview-value">
          第7天
        </text>
      </view>
    </view>

    <!-- 快速操作 -->
    <view class="quick-actions">
      <view class="quick-actions-title">
        快速操作
      </view>
      <view class="actions-grid">
        <view
          v-for="action in quickActions"
          :key="action.action"
          class="action-item"
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

    <!-- 情侣状态 -->
    <view class="couple-status">
      <view class="couple-header">
        <text class="couple-title">
          {{ userInfo.partner }}的状态
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

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 40rpx 40rpx;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  opacity: 0.9;
}

.greeting-section {
  padding: 60rpx 0;
  text-align: center;
}

.greeting-main {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.greeting-sub {
  font-size: 30rpx;
  opacity: 0.9;
}

.fasting-timer {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  margin-bottom: 40rpx;
  backdrop-filter: blur(10rpx);
}

.timer-circle {
  width: 240rpx;
  height: 240rpx;
  border: 12rpx solid rgba(255, 255, 255, 0.3);
  border-top: 12rpx solid white;
  border-radius: 50%;
  margin: 0 auto 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.timer-content {
  text-align: center;
}

.timer-time {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.timer-status {
  font-size: 24rpx;
  opacity: 0.8;
}

.timer-description {
  font-size: 28rpx;
  opacity: 0.9;
}

.daily-overview {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.overview-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  backdrop-filter: blur(10rpx);
}

.overview-label {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.overview-value {
  font-size: 32rpx;
  font-weight: 600;
}

.quick-actions {
  margin-bottom: 40rpx;
}

.quick-actions-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 30rpx;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.action-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  border: 1rpx solid rgba(255, 255, 255, 0.1);

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
  }
}

.action-icon {
  display: block;
  font-size: 48rpx;
  margin-bottom: 15rpx;
}

.action-text {
  font-size: 26rpx;
  font-weight: 500;
}

.couple-status {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 40rpx;
  backdrop-filter: blur(10rpx);
}

.couple-header {
  text-align: center;
  margin-bottom: 30rpx;
}

.couple-title {
  font-size: 32rpx;
  font-weight: 600;
}

.couple-info {
  display: flex;
  justify-content: space-around;
}

.couple-item {
  text-align: center;
}

.couple-label {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.couple-value {
  font-size: 30rpx;
  font-weight: 600;

  &.active {
    color: #4ecdc4;
  }
}
</style>
