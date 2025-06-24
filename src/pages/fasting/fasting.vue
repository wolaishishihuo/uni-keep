<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '断食计划'
  }
}
</route>

<script lang="ts" setup>
import { useSafeArea } from '@/hooks/useSafeArea'

defineOptions({
  name: 'Fasting',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea()

// 断食计划配置
const fastingPlan = ref({
  type: '168',
  name: '168 间歇性断食',
  description: '16小时禁食 · 8小时进食',
  eatingWindow: {
    start: '10:00',
    end: '18:00',
  },
  fastingWindow: {
    start: '18:00',
    end: '10:00',
  },
  startDate: '2024-12-19',
})

// 当前状态
const currentStatus = ref({
  isFasting: true,
  elapsedTime: 5 * 3600 + 32 * 60, // 已坚持5小时32分钟
  remainingTime: 10 * 3600 + 28 * 60, // 剩余10小时28分钟
  phase: 'fasting', // fasting 或 eating
})

// 计算已坚持时间显示
const elapsedTimeDisplay = computed(() => {
  const hours = Math.floor(currentStatus.value.elapsedTime / 3600)
  const minutes = Math.floor((currentStatus.value.elapsedTime % 3600) / 60)
  return `${hours}小时${minutes}分钟`
})

// 计算剩余时间显示
const remainingTimeDisplay = computed(() => {
  const hours = Math.floor(currentStatus.value.remainingTime / 3600)
  const minutes = Math.floor((currentStatus.value.remainingTime % 3600) / 60)
  return `${hours}小时${minutes}分`
})

// 历史记录数据
const historyStats = ref({
  totalDays: 25,
  successDays: 22,
  successRate: 88,
  continuousDays: 7,
})

// 处理紧急中断
function handleEmergencyStop() {
  uni.showModal({
    title: '确认中断',
    content: '确定要中断当前断食吗？请选择中断原因。',
    success: (res) => {
      if (res.confirm) {
        // TODO: 实现中断逻辑
        uni.showToast({ title: '已中断断食', icon: 'none' })
      }
    },
  })
}

// 查看历史记录
function viewHistory() {
  uni.navigateTo({ url: '/pages/fasting/history' })
}

// 调整计划
function adjustPlan() {
  uni.navigateTo({ url: '/pages/fasting/settings' })
}

onLoad(() => {
  console.log('断食页面加载完成')
})
</script>

<template>
  <view class="fasting-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">
        断食计划
      </text>
    </view>

    <!-- 计划信息 -->
    <view class="plan-info">
      <view class="plan-type">
        {{ fastingPlan.name }}
      </view>
      <text class="plan-description">
        {{ fastingPlan.description }}
      </text>
    </view>

    <!-- 时间安排 -->
    <view class="schedule-card">
      <view class="schedule-item">
        <view class="schedule-info">
          <text class="schedule-icon">
            🍽️
          </text>
          <text class="schedule-label">
            进食窗口
          </text>
        </view>
        <view class="time-badge eating">
          {{ fastingPlan.eatingWindow.start }} - {{ fastingPlan.eatingWindow.end }}
        </view>
      </view>
      <view class="schedule-item">
        <view class="schedule-info">
          <text class="schedule-icon">
            🚫
          </text>
          <text class="schedule-label">
            禁食时间
          </text>
        </view>
        <view class="time-badge fasting">
          {{ fastingPlan.fastingWindow.start }} - {{ fastingPlan.fastingWindow.end }}
        </view>
      </view>
      <view class="schedule-item">
        <view class="schedule-info">
          <text class="schedule-icon">
            📅
          </text>
          <text class="schedule-label">
            开始日期
          </text>
        </view>
        <text class="schedule-value">
          {{ fastingPlan.startDate }}
        </text>
      </view>
    </view>

    <!-- 当前状态 -->
    <view class="current-status">
      <view class="status-header">
        <text class="status-title">
          当前状态
        </text>
      </view>
      <view class="status-content">
        <view class="status-phase">
          <text class="phase-text" :class="{ active: currentStatus.isFasting }">
            {{ currentStatus.isFasting ? '禁食中' : '进食中' }}
          </text>
        </view>
        <view class="status-time">
          <text class="time-label">
            已坚持
          </text>
          <text class="time-value">
            {{ elapsedTimeDisplay }}
          </text>
        </view>
        <view class="remaining-time">
          <text class="remaining-label">
            {{ currentStatus.isFasting ? '距离进食还有' : '距离禁食还有' }}
          </text>
          <text class="remaining-value">
            {{ remainingTimeDisplay }}
          </text>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-grid">
      <view class="stat-item">
        <text class="stat-value">
          {{ historyStats.totalDays }}
        </text>
        <text class="stat-label">
          总天数
        </text>
      </view>
      <view class="stat-item">
        <text class="stat-value">
          {{ historyStats.successDays }}
        </text>
        <text class="stat-label">
          成功天数
        </text>
      </view>
      <view class="stat-item">
        <text class="stat-value">
          {{ historyStats.successRate }}%
        </text>
        <text class="stat-label">
          成功率
        </text>
      </view>
      <view class="stat-item">
        <text class="stat-value">
          {{ historyStats.continuousDays }}
        </text>
        <text class="stat-label">
          连续天数
        </text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn emergency" @click="handleEmergencyStop">
        紧急中断
      </button>
      <button class="action-btn history" @click="viewHistory">
        查看历史
      </button>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="adjust-btn" @click="adjustPlan">
        调整计划
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.fasting-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0 40rpx 40rpx;
}

.page-header {
  padding: 40rpx 0;
  text-align: center;
}

.page-title {
  font-size: 44rpx;
  font-weight: 600;
  color: #333;
}

.plan-info {
  text-align: center;
  margin-bottom: 40rpx;
}

.plan-type {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  padding: 20rpx 60rpx;
  border-radius: 50rpx;
  display: inline-block;
  font-weight: 600;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.plan-description {
  font-size: 28rpx;
  color: #666;
}

.schedule-card {
  background: white;
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.schedule-info {
  display: flex;
  align-items: center;
}

.schedule-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.schedule-label {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.time-badge {
  padding: 10rpx 30rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 600;

  &.eating {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
  }

  &.fasting {
    background: linear-gradient(45deg, #ff9a9e, #fecfef);
    color: white;
  }
}

.schedule-value {
  font-size: 28rpx;
  color: #666;
}

.current-status {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  color: white;
  text-align: center;
}

.status-header {
  margin-bottom: 30rpx;
}

.status-title {
  font-size: 32rpx;
  font-weight: 600;
}

.status-phase {
  margin-bottom: 30rpx;
}

.phase-text {
  font-size: 48rpx;
  font-weight: bold;

  &.active {
    color: #4ecdc4;
  }
}

.status-time {
  margin-bottom: 20rpx;
}

.time-label {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.time-value {
  font-size: 36rpx;
  font-weight: 600;
}

.remaining-time {
  margin-top: 20rpx;
}

.remaining-label {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.remaining-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #4ecdc4;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.stat-item {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #4ecdc4;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.action-btn {
  border: none;
  border-radius: 30rpx;
  padding: 30rpx 40rpx;
  font-size: 30rpx;
  font-weight: 600;

  &.emergency {
    background: linear-gradient(45deg, #ff6b9d, #ff8e9e);
    color: white;
  }

  &.history {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
  }
}

.bottom-actions {
  text-align: center;
}

.adjust-btn {
  background: white;
  color: #4ecdc4;
  border: 2rpx solid #4ecdc4;
  border-radius: 50rpx;
  padding: 25rpx 80rpx;
  font-size: 28rpx;
  font-weight: 600;
}
</style>
