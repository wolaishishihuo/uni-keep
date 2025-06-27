<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '体重管理'
  }
}
</route>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';
import { formatTime } from '@/utils/time';

defineOptions({
  name: 'Weight'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { gender } = storeToRefs(themeStore);

// 当前体重数据
const currentWeight = ref({
  weight: 65.5,
  lastWeight: 66.2,
  change: -0.7,
  date: '2024-12-20',
  bmi: 22.8
});

// 目标体重
const targetWeight = ref({
  target: 60.0,
  remaining: 5.5,
  progress: 85 // 进度百分比
});

// 体重历史数据（模拟图表数据）
const weightHistory = ref([
  { date: '12-01', weight: 68.5 },
  { date: '12-05', weight: 67.8 },
  { date: '12-10', weight: 67.2 },
  { date: '12-15', weight: 66.5 },
  { date: '12-20', weight: 65.5 }
]);

// 周期选择
const selectedPeriod = ref('7天');
const periods = ['7天', '30天', '90天'];

// 快速记录选项
const quickRecords = ref([
  { label: '早晨', time: '07:00', selected: true },
  { label: '睡前', time: '22:00', selected: false },
  { label: '自定义', time: '', selected: false }
]);

// 计算体重变化显示
const weightChangeDisplay = computed(() => {
  const change = currentWeight.value.change;
  if (change > 0) {
    return { text: `+${change}kg`, color: 'var(--keep-accent)', icon: '📈' };
  }
  else if (change < 0) {
    return { text: `${change}kg`, color: 'var(--keep-accent)', icon: '📉' };
  }
  else {
    return { text: '0kg', color: 'var(--keep-accent)', icon: '➖' };
  }
});

// 计算BMI状态
const bmiStatus = computed(() => {
  const bmi = currentWeight.value.bmi;
  if (bmi < 18.5)
    return { text: '偏瘦', color: 'var(--keep-accent)' };
  if (bmi < 24)
    return { text: '正常', color: 'var(--keep-accent)' };
  if (bmi < 28)
    return { text: '超重', color: 'var(--keep-accent)' };
  return { text: '肥胖', color: 'var(--keep-accent)' };
});

// 记录体重
function recordWeight() {
  uni.navigateTo({ url: '/pages/weight/record' });
}

// 查看详细历史
function viewHistory() {
  uni.navigateTo({ url: '/pages/weight/history' });
}

// 设置目标
function setTarget() {
  uni.navigateTo({ url: '/pages/weight/target' });
}

// 切换周期
function changePeriod(period: string) {
  selectedPeriod.value = period;
  // TODO: 根据周期获取数据
}

onLoad(() => {
  console.log('体重管理页面加载完成');
});
</script>

<template>
  <view class="weight-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="`theme-${gender}`">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">
        体重管理
      </text>
    </view>

    <!-- 当前体重显示 -->
    <view class="weight-display">
      <view class="weight-main">
        <text class="weight-value">
          {{ currentWeight.weight }}
        </text>
        <text class="weight-unit">
          kg
        </text>
      </view>
      <view class="weight-change">
        <text class="change-icon">
          {{ weightChangeDisplay.icon }}
        </text>
        <text class="change-text" :style="{ color: weightChangeDisplay.color }">
          {{ weightChangeDisplay.text }}
        </text>
        <text class="change-date">
          相比昨日
        </text>
      </view>
      <view class="bmi-info">
        <text class="bmi-label">
          BMI: {{ currentWeight.bmi }}
        </text>
        <text class="bmi-status" :style="{ color: bmiStatus.color }">
          {{ bmiStatus.text }}
        </text>
      </view>
    </view>

    <!-- 目标进度 -->
    <view class="target-progress">
      <view class="progress-header">
        <text class="progress-title">
          目标进度
        </text>
        <text class="progress-target">
          目标: {{ targetWeight.target }}kg
        </text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: `${targetWeight.progress}%` }" />
      </view>
      <view class="progress-info">
        <text class="progress-text">
          还需减重 {{ targetWeight.remaining }}kg
        </text>
        <text class="progress-percent">
          {{ targetWeight.progress }}%
        </text>
      </view>
    </view>

    <!-- 趋势图表 -->
    <view class="chart-container">
      <view class="chart-header">
        <text class="chart-title">
          体重趋势
        </text>
        <view class="period-selector">
          <text
            v-for="period in periods"
            :key="period"
            class="period-item"
            :class="{ active: selectedPeriod === period }"
            @click="changePeriod(period)"
          >
            {{ period }}
          </text>
        </view>
      </view>
      <view class="chart-placeholder">
        <text class="chart-text">
          体重变化趋势图
        </text>
        <text class="chart-subtitle">
          {{ selectedPeriod }}数据
        </text>
      </view>
    </view>

    <!-- 最近记录 -->
    <view class="recent-records">
      <view class="records-header">
        <text class="records-title">
          最近记录
        </text>
        <text class="view-all" @click="viewHistory">
          查看全部
        </text>
      </view>
      <view class="records-list">
        <view v-for="(record, index) in weightHistory.slice(-3)" :key="index" class="record-item">
          <view class="record-date">
            {{ formatTime(record.date, 'MM-DD') }}
          </view>
          <view class="record-weight">
            {{ record.weight }}kg
          </view>
          <view class="record-trend">
            <text v-if="index > 0" class="trend-icon">
              {{
                record.weight > weightHistory[weightHistory.length - 3 + index - 1].weight
                  ? '📈'
                  : '📉'
              }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快速记录 -->
    <view class="quick-record">
      <view class="quick-header">
        <text class="quick-title">
          快速记录
        </text>
      </view>
      <view class="quick-options">
        <view
          v-for="option in quickRecords"
          :key="option.label"
          class="quick-option"
          :class="{ selected: option.selected }"
        >
          <text class="option-label">
            {{ option.label }}
          </text>
          <text class="option-time">
            {{ option.time }}
          </text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="record-btn" @click="recordWeight">
        记录体重
      </button>
      <button class="target-btn" @click="setTarget">
        设置目标
      </button>
    </view>
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
