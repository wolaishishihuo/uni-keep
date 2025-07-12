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
            {{ fastingPlan?.name }}
          </text>
          <text class="fasting-status" :style="{ color: fastingStatusText.color }">
            {{ fastingStatusText.text }}
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
                {{ fastingStatusText.timeText }}
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
              断食窗口
            </text>
            <text class="detail-value">
              {{ `${fastingPlan?.startTime}-${fastingPlan?.endTime}` }}
            </text>
          </view>
        </view>
        <view class="fasting-actions">
          <button class="action-btn btn-end" @click="subscribeActionPlan">
            <span class="action-icon">
              {{ fastingStatus === FastingStatus.active ? '🍽️' : '🔥' }}
            </span>
            {{ fastingStatusText.actionText }}
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
              {{ fastingStatistics?.currentWeekDays }}
            </view>
            <view class="stat-label">
              坚持天数
            </view>
          </view>
          <view class="stat-box">
            <view class="stat-value">
              {{ fastingStatistics?.currentWeekSuccessRate }}
            </view>
            <view class="stat-label">
              完成率
            </view>
          </view>
          <view class="stat-box">
            <view class="stat-value">
              {{ fastingStatistics?.totalFastingDuration }}
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
import { ACTION_PLAN_TEMPLATE_ID } from '@/constants';
import { FastingStatus } from '@/enums';
import { useFastingTimer } from '@/hooks/useFastingTimer';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useFastingStore } from '@/store/fasting';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';

defineOptions({
  name: 'Home'
});

const { safeAreaInsets } = useSafeArea();
const { userInfo } = storeToRefs(useUserStore());
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);
const fastingStore = useFastingStore();
const { fastingPlan, fastingRecord, fastingStatistics } = storeToRefs(fastingStore);

// 断食计时器
const {
  percent,
  remainingText,
  elapsedText,
  fastingStatusText,
  fastingStatus
} = useFastingTimer(fastingPlan, fastingRecord);

// wot-circle 渐变色配置
const gradientColor = computed(() => {
  return {
    '0%': themeClassName.value === 'theme-female' ? '#ff6b9d' : '#4195e1',
    '50%': themeClassName.value === 'theme-female' ? '#ff85a1' : '#667eea',
    '100%': themeClassName.value === 'theme-female' ? '#fff0f5' : '#e8f4ff'
  };
});

// 断食操作
const fastingActionMap = {
  // 断食中
  [FastingStatus.active]: async () => {
    const result = await fastingStore.updateFastingRecord(
      percent.value >= 100 ? FastingStatus.completed : FastingStatus.broken
    );

    if (result.code === 200) {
      uni.showToast({
        title: percent.value >= 100 ? '断食已完成' : '断食已中断',
        icon: 'success'
      });
    }
    else {
      uni.showToast({ title: '操作失败', icon: 'error' });
    }
  },
  // 未开始
  [FastingStatus.pending]: async () => {
    const result = await fastingStore.startFasting();
    if (result.code === 200) {
      uni.showToast({ title: '断食已开始', icon: 'success' });
    }
    else {
      uni.showToast({ title: '开始断食失败', icon: 'error' });
    }
  },
  // 已中断
  [FastingStatus.broken]: async () => {
    const result = await fastingStore.startFasting();
    if (result.code === 200) {
      uni.showToast({ title: '断食已开始', icon: 'success' });
    }
    else {
      uni.showToast({ title: '开始断食失败', icon: 'error' });
    }
  }
};

function subscribeActionPlan() {
  uni.requestSubscribeMessage({
    tmplIds: [ACTION_PLAN_TEMPLATE_ID],
    success: (res) => {
      if (res[ACTION_PLAN_TEMPLATE_ID] === 'reject') {
        uni.showModal({
          title: '订阅失败!',
          content: '您已设置不再询问，请前往设置开启订阅提醒!',
          confirmText: '去设置',
          success(modalRes) {
            if (modalRes.confirm) {
              openSetting();
            }
            else {
              uni.showToast({
                title: '您可能错过重要通知!',
                icon: 'none'
              });
            }
          }
        });
      }
      else {
        fastingActionMap[fastingStatus.value]?.();
      }
    },
    fail: (err) => {
      console.log(err);
    }
  });
}

function openSetting() {
  uni.openSetting({
    success(res) {
      console.log('设置界面返回：', res);
      if (res.subscriptionsSetting) {
        console.log('订阅消息授权状态：', res.subscriptionsSetting);
      }
    },
    fail(err) {
      console.error('打开设置失败：', err);
    }
  });
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
