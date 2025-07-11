<template>
  <view class="home-screen" :class="themeClassName" :style="{ paddingTop: `${safeAreaInsets?.top || 0}px` }">
    <!-- 顶部导航栏 - 固定吸顶 -->
    <view class="top-navbar" :style="{ paddingTop: `${safeAreaInsets?.top || 0}px` }">
      <text class="app-name">
        坚持有你
      </text>
      <wot-avatar size="small" text="L" />
    </view>

    <view class="main-content">
      <!-- 断食卡片 -->
      <view class="fasting-card">
        <view class="fasting-header">
          <text class="fasting-title">
            {{ activePlan?.name }}
          </text>
          <text class="fasting-status" :class="isFasting ? 'status-active' : 'status-eating'">
            {{ statusText }}
          </text>
        </view>
        <view class="timer-container">
          <wd-circle
            v-model="percent"
            :size="180"
            :color="gradientColor"
            :stroke-width="12"
          >
            <view class="timer-info">
              <text class="time-left">
                {{ remainingText }}
              </text>
              <text class="time-label">
                {{ isFasting ? '断食时间' : '进食时间' }}
              </text>
            </view>
          </wd-circle>
        </view>
        <view class="fasting-details">
          <view class="detail-item">
            <text class="detail-label">
              已完成
            </text>
            <text class="detail-value">
              {{ elapsedText }}
            </text>
          </view>
          <view class="detail-item">
            <text class="detail-label">
              进食窗口
            </text>
            <text class="detail-value">
              {{ `${activePlan?.startTime}-${activePlan?.endTime}` }}
            </text>
          </view>
        </view>
        <view v-if="isFasting" class="fasting-actions">
          <button class="action-btn btn-end" @click="endFasting">
            <span class="action-icon">⏹️</span>
            结束断食
          </button>
        </view>
      </view>

      <!-- 统计卡片 -->
      <view class="stats-card">
        <view class="section-title">
          本周统计
        </view>
        <view class="stats-row">
          <view class="stat-box">
            <view class="stat-value">
              {{ weekDays }}
            </view>
            <view class="stat-label">
              坚持天数
            </view>
          </view>
          <view class="stat-box">
            <view class="stat-value">
              {{ weekRate }}
            </view>
            <view class="stat-label">
              完成率
            </view>
          </view>
          <view class="stat-box">
            <view class="stat-value">
              {{ weekHours }}
            </view>
            <view class="stat-label">
              总断食时间
            </view>
          </view>
        </view>
      </view>

      <!-- 连续打卡 -->
      <view class="streak-card">
        <view class="streak-icon">
          🔥
        </view>
        <view class="streak-info">
          <view class="streak-value">
            连续坚持{{ streakDays }}天
          </view>
          <view class="streak-text">
            继续保持，创造新纪录！
          </view>
        </view>
      </view>

      <!-- 伴侣状态 -->
      <view class="partner-card">
        <view class="section-title">
          伴侣状态
        </view>
        <view class="partner-info">
          <view class="partner-avatar">
            S
          </view>
          <view>
            <view class="partner-name">
              {{ partnerName }}
            </view>
            <view class="partner-status">
              {{ partnerStatus }}
            </view>
          </view>
        </view>
        <view class="partner-details">
          <view class="partner-stat">
            <view class="partner-stat-value">
              {{ partnerDays }}
            </view>
            <view class="partner-stat-label">
              坚持天数
            </view>
          </view>
          <view class="partner-stat">
            <view class="partner-stat-value">
              {{ partnerRate }}
            </view>
            <view class="partner-stat-label">
              完成率
            </view>
          </view>
          <view class="partner-stat">
            <view class="partner-stat-value">
              {{ partnerAchievements }}
            </view>
            <view class="partner-stat-label">
              达成成就
            </view>
          </view>
        </view>
      </view>

      <!-- 断食日历 -->
      <view class="stats-card">
        <view class="section-title">
          断食日历
        </view>
        <view class="calendar-view">
          <view v-for="(item, idx) in 7" :key="idx" class="calendar-day" :class="[idx < completedDays ? 'completed' : '']" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useFastingTimer } from '@/hooks/useFastingTimer';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';

defineOptions({
  name: 'Home'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);

// 断食计时器
const {
  percent,
  remainingText,
  elapsedText,
  statusText,
  isFasting,
  activePlan
} = useFastingTimer();

// wot-circle 渐变色配置
const gradientColor = computed(() => {
  return {
    '0%': themeClassName.value === 'theme-female' ? '#ff6b9d' : '#4195e1',
    '50%': themeClassName.value === 'theme-female' ? '#ff85a1' : '#667eea',
    '100%': themeClassName.value === 'theme-female' ? '#fff0f5' : '#e8f4ff'
  };
});

// 结束断食
function endFasting() {
  uni.showToast({ title: '断食已结束', icon: 'none' });
  // TODO: 调用API结束断食
}

// 统计数据
const weekDays = ref('5天');
const weekRate = ref('78%');
const weekHours = ref('82小时');
const streakDays = ref(12);

// 伴侣信息
const partnerName = ref('小诗');
const partnerStatus = ref('正在断食中 · 已完成3小时22分');
const partnerDays = ref('14天');
const partnerRate = ref('92%');
const partnerAchievements = ref('3个');

// 日历
const completedDays = ref(5);
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<route lang="json5" type="home">
{
  layout: 'tabbar',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '坚持有你'
  }
}
</route>
