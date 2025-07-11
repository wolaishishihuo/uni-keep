<route lang="json5">
{
  layout: 'tabbar',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的'
  }
}
</route>

<template>
  <view class="profile-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <image :src="userProfile.avatar || '/static/images/avatar.jpg'" class="avatar-img" mode="aspectFill" />
      </view>
      <view class="user-info-main">
        <view class="user-name">
          {{ userProfile.nickname || '未登录用户' }}
        </view>
        <view class="user-bio">
          {{ userProfile.signature }}
        </view>
        <view class="user-stats">
          <view class="user-stat">
            断食天数<span class="stat-value">{{ userProfile.fastingDays }}</span>
          </view>
          <view class="user-stat">
            成就<span class="stat-value">{{ achievements.filter(a => a.unlocked).length }}</span>
          </view>
        </view>
        <button class="edit-profile" @click="handleMenuClick('/pages/profile/edit/edit')">
          编辑资料
        </button>
      </view>
    </view>

    <!-- 健康数据概览 -->
    <view class="health-summary">
      <view class="summary-title">
        健康数据
      </view>
      <view class="summary-grid">
        <view class="summary-item">
          <view class="summary-icon">
            ⚖️
          </view>
          <view class="summary-label">
            当前体重
          </view>
          <view class="summary-value">
            {{ userProfile.currentWeight || '--' }}<span class="summary-unit">kg</span>
          </view>
        </view>
        <view class="summary-item">
          <view class="summary-icon">
            📏
          </view>
          <view class="summary-label">
            BMI指数
          </view>
          <view class="summary-value">
            {{ userProfile.bmi }}
          </view>
        </view>
        <view class="summary-item">
          <view class="summary-icon">
            🔥
          </view>
          <view class="summary-label">
            连续断食
          </view>
          <view class="summary-value">
            {{ userProfile.continuousFasting }}<span class="summary-unit">天</span>
          </view>
        </view>
        <view class="summary-item">
          <view class="summary-icon">
            🎯
          </view>
          <view class="summary-label">
            目标达成
          </view>
          <view class="summary-value">
            {{ userProfile.targetRate }}<span class="summary-unit">%</span>
          </view>
        </view>
      </view>
    </view>

    <!-- 伴侣信息卡片 -->
    <view class="couple-card">
      <view class="couple-title">
        我的伴侣
      </view>
      <view class="couple-info">
        <view class="couple-avatar">
          <image :src="userProfile.coupleAvatar" class="avatar-img" mode="aspectFill" />
        </view>
        <view class="couple-details">
          <view class="couple-name">
            {{ userProfile.coupleName }}
          </view>
          <view class="couple-status">
            {{ userProfile.coupleStatus }}
          </view>
        </view>
        <view class="couple-message" @click="handleMenuClick('/pages/couple/messages')">
          💬
        </view>
      </view>
    </view>

    <!-- 成就与徽章 -->
    <view class="achievements">
      <view class="achievements-title">
        <text>我的成就</text>
        <text class="view-all" @click="handleMenuClick('/pages/achievements/list')">
          查看全部
        </text>
      </view>
      <view class="badges-grid">
        <view v-for="(achievement, idx) in achievements.slice(0, 6)" :key="idx" class="badge">
          <view class="badge-icon" :class="[getBadgeLevel(idx, achievement.unlocked)]">
            {{ achievement.icon }}
            <view v-if="achievement.unlocked" class="badge-check">
              ✓
            </view>
          </view>
          <view class="badge-name">
            {{ achievement.title }}
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view v-for="item in menuSections[0].items" :key="item.title" class="menu-item" @click="handleMenuClick(item.route)">
        <view class="menu-icon">
          {{ item.icon }}
        </view>
        <view class="menu-text">
          {{ item.title }}
        </view>
        <view class="menu-arrow">
          ›
        </view>
      </view>
      <view v-for="item in menuSections[1].items" :key="item.title" class="menu-item" @click="handleMenuClick(item.route)">
        <view class="menu-icon">
          {{ item.icon }}
        </view>
        <view class="menu-text">
          {{ item.title }}
        </view>
        <view class="menu-arrow">
          ›
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';

defineOptions({
  name: 'Profile'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 成就数据
const achievements = ref([
  { icon: '🏆', title: '坚持达人', description: '连续坚持7天', unlocked: true },
  { icon: '💪', title: '减重英雄', description: '成功减重5kg', unlocked: true },
  { icon: '❤️', title: '情侣冠军', description: '与伴侣共同坚持30天', unlocked: false },
  { icon: '🌟', title: '完美主义', description: '100%完成率', unlocked: false }
]);

// 菜单项
const menuSections = [
  {
    title: '数据统计',
    items: [
      {
        icon: '📊',
        title: '健康数据分析',
        description: '查看详细数据',
        route: '/pages/stats/overview'
      },
      {
        icon: '🏆',
        title: '成就中心',
        description: '查看所有成就',
        route: '/pages/achievements/list'
      }
    ]
  },
  {
    title: '设置',
    items: [
      { icon: '⚙️', title: '断食计划设置', description: '通知提醒等', route: '/pages/settings/app' },
      {
        icon: '🔒',
        title: '隐私设置',
        description: '数据与隐私',
        route: '/pages/settings/privacy'
      },
      { icon: '📞', title: '联系我们', description: '意见反馈', route: '/pages/settings/contact' }
    ]
  }
];

const userProfile = computed(() => {
  return {
    ...userInfo.value,
    signature: '健康生活，从现在开始', // 个人简介
    fastingDays: 32, // 断食天数
    bmi: 23.7, // BMI指数
    continuousFasting: 12, // 连续断食天数
    targetRate: 68, // 目标达成率
    coupleAvatar: '/static/images/default-avatar.png', // 伴侣头像
    coupleName: '李小红', // 伴侣昵称
    coupleStatus: '正在断食中 · 还剩4小时' // 伴侣状态
  };
});

// 徽章等级样式辅助
function getBadgeLevel(idx: number, unlocked: boolean) {
  if (!unlocked)
    return 'badge-locked';
  if (idx === 0)
    return 'badge-gold';
  if (idx === 1)
    return 'badge-silver';
  if (idx === 2)
    return 'badge-bronze';
  return '';
}

// 处理菜单点击
function handleMenuClick(route?: string, action?: string) {
  if (route) {
    uni.navigateTo({
      url: route,
      fail: () => {
        uni.showToast({ title: '功能开发中', icon: 'none' });
      }
    });
  }
  else {
    uni.showToast({ title: '功能开发中', icon: 'none' });
  }
}

onLoad(() => {
  console.log('个人中心页面加载完成');
});
</script>

<style lang="scss">
@import './index.scss';
</style>
