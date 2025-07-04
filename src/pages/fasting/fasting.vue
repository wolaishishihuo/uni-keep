<route lang="json5">
{
  layout: 'tabbar',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '断食计划'
  }
}
</route>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useFastingTimer } from '@/hooks/useFastingTimer';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';

defineOptions({
  name: 'Fasting'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);

// 使用断食计时器 Hook（内部处理所有逻辑）
const { isFasting, statusText, elapsedText, remainingText, descText, activePlan } = useFastingTimer();

// 历史记录数据（后续可以从后端获取）
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
  <view class="fasting-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">
        断食计划
      </text>
    </view>

    <!-- 计划信息 -->
    <view v-if="activePlan" class="plan-info">
      <view class="plan-type">
        {{ activePlan.name }}
      </view>
      <text class="plan-description">
        {{ activePlan.fastingHours }}小时禁食 · {{ activePlan.eatingHours }}小时进食
      </text>
    </view>

    <!-- 时间安排 -->
    <view v-if="activePlan" class="schedule-card">
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
          {{ activePlan.startTime }} - {{ activePlan.endTime }}
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
          {{ activePlan.fastingHours }} 小时
        </view>
      </view>
    </view>

    <!-- 当前状态 -->
    <view v-if="activePlan" class="current-status">
      <view class="status-header">
        <text class="status-title">
          当前状态
        </text>
      </view>
      <view class="status-content">
        <view class="status-phase">
          <text class="phase-text" :class="{ active: isFasting }">
            {{ statusText }}
          </text>
        </view>
        <view class="status-time">
          <text class="time-label">
            已坚持
          </text>
          <text class="time-value">
            {{ elapsedText }}
          </text>
        </view>
        <view class="remaining-time">
          <text class="remaining-label">
            {{ descText }}
          </text>
          <text class="remaining-value">
            {{ remainingText }}
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

    <!-- 无计划提示 -->
    <view v-if="!activePlan" class="no-plan-tip">
      <text class="tip-text">
        暂无活跃的断食计划
      </text>
      <button class="create-plan-btn" @click="adjustPlan">
        创建计划
      </button>
    </view>
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
