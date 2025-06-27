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
import { storeToRefs } from 'pinia';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';
import { formatDuration, formatTime } from '@/utils/time';

defineOptions({
  name: 'Fasting'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { gender } = storeToRefs(themeStore);

// 断食计划配置
const fastingPlan = ref({
  type: '168',
  name: '168 间歇性断食',
  description: '16小时禁食 · 8小时进食',
  eatingWindow: {
    start: '10:00',
    end: '18:00'
  },
  fastingWindow: {
    start: '18:00',
    end: '10:00'
  },
  startDate: '2024-12-19'
});

// 当前状态
const currentStatus = ref({
  isFasting: true,
  elapsedTime: 5 * 3600 + 32 * 60, // 已坚持5小时32分钟
  remainingTime: 10 * 3600 + 28 * 60, // 剩余10小时28分钟
  phase: 'fasting' // fasting 或 eating
});

// 计算已坚持时间显示
const elapsedTimeDisplay = computed(() => formatDuration(currentStatus.value.elapsedTime));

// 计算剩余时间显示
const remainingTimeDisplay = computed(() => formatDuration(currentStatus.value.remainingTime));

// 历史记录数据
const historyStats = ref({
  totalDays: 25,
  successDays: 22,
  successRate: 88,
  continuousDays: 7
});

// 处理紧急中断
function handleEmergencyStop() {
  uni.showModal({
    title: '确认中断',
    content: '确定要中断当前断食吗？请选择中断原因。',
    success: (res) => {
      if (res.confirm) {
        // TODO: 实现中断逻辑
        uni.showToast({ title: '已中断断食', icon: 'none' });
      }
    }
  });
}

// 查看历史记录
function viewHistory() {
  uni.navigateTo({ url: '/pages/fasting/history' });
}

// 调整计划
function adjustPlan() {
  uni.navigateTo({ url: '/pages/fasting/settings' });
}

onLoad(() => {
  console.log('断食页面加载完成');
});
</script>

<template>
  <view class="fasting-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="`theme-${gender}`">
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
          {{ formatTime(fastingPlan.startDate, 'YYYY-MM-DD') }}
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

<style lang="scss">
@import './index.scss';
</style>
