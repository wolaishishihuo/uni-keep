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

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
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
const { themeColor, themeClassName, themeName } = storeToRefs(themeStore);
const userStore = useUserStore();
const { userInfo, isLoggedIn } = storeToRefs(userStore);

// 授权弹框控制
const showAuthModal = ref(false);

// 成就数据
const achievements = ref([
  { icon: '🏆', title: '坚持达人', description: '连续坚持7天', unlocked: true },
  { icon: '💪', title: '减重英雄', description: '成功减重5kg', unlocked: true },
  { icon: '❤️', title: '情侣冠军', description: '与伴侣共同坚持30天', unlocked: false },
  { icon: '🌟', title: '完美主义', description: '100%完成率', unlocked: false }
]);

// 菜单项
const menuSections = computed(() => [
  {
    title: '数据统计',
    items: [
      {
        icon: '📊',
        title: '我的数据',
        description: '查看详细统计',
        route: '/pages/stats/overview'
      },
      { icon: '📈', title: '进度报告', description: '周月年度报告', route: '/pages/stats/report' },
      {
        icon: '🏆',
        title: '成就中心',
        description: '查看所有成就',
        route: '/pages/achievements/list'
      }
    ]
  },
  {
    title: '情侣互动',
    items: [
      { icon: '❤️', title: '情侣状态', description: '查看对方进度', route: '/pages/couple/status' },
      { icon: '🎯', title: '共同目标', description: '设置情侣目标', route: '/pages/couple/goals' },
      { icon: '💌', title: '互动记录', description: '鼓励与支持', route: '/pages/couple/messages' }
    ]
  },
  {
    title: '设置',
    items: [
      { icon: '⚙️', title: '应用设置', description: '通知提醒等', route: '/pages/settings/app' },
      {
        icon: '👤',
        title: '个人资料',
        description: '编辑个人信息',
        route: '/pages/profile/edit/edit'
      },
      {
        icon: '🔒',
        title: '隐私设置',
        description: '数据与隐私',
        route: '/pages/settings/privacy'
      },
      { icon: '📞', title: '联系我们', description: '意见反馈', route: '/pages/settings/contact' }
    ]
  }
]);

// 处理菜单点击
function handleMenuClick(route?: string, action?: string) {
  if (action === 'theme') {
    handleThemeToggle();
    return;
  }

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

// 切换主题
function handleThemeToggle() {
  themeStore.toggleGenderTheme();
}

// 处理登录
function handleLogin() {
  uni.navigateTo({ url: '/pages/login/index' });
}

// 查看成就详情
function viewAchievement(achievement: any) {
  uni.showModal({
    title: achievement.title,
    content: achievement.description,
    showCancel: false
  });
}

// 处理授权确认
function handleAuthConfirm() {
  console.log('用户授权确认');
  userStore.wxLogin();
}

// 处理授权取消
function handleAuthCancel() {
  console.log('用户取消授权');
  showAuthModal.value = false;
}

// 关闭授权弹框
function closeAuthModal() {
  showAuthModal.value = false;
}

onLoad(() => {
  console.log('个人中心页面加载完成');
});
</script>

<template>
  <view class="profile-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="avatar-container">
          <image :src="userInfo.avatar" class="user-avatar" mode="aspectFill" />
        </view>
        <view class="user-details">
          <view v-if="!isLoggedIn" class="login-btn" @click="handleLogin">
            <text class="login-icon">
              登录/注册
            </text>
          </view>
          <view v-else>
            <text class="user-name">
              {{ userInfo.nickname }}
            </text>
            <text class="user-status">
              {{ userInfo.coupleId ? `与${userInfo.coupleId}携手坚持` : '独自坚持中' }}
            </text>
          </view>
        </view>
        <view class="user-actions">
          <view class="theme-btn" @click="handleThemeToggle">
            <text class="theme-icon" :style="{ color: themeColor }">
              🎨
            </text>
          </view>
        </view>
      </view>

      <!-- 坚持统计 -->
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">
            {{ userInfo.currentWeight }}
          </text>
          <text class="stat-label">
            连续天数
          </text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">
            {{ userInfo.targetWeight }}
          </text>
          <text class="stat-label">
            总坚持天数
          </text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">
            {{ Math.round((userInfo.currentWeight / userInfo.targetWeight) * 100) || 0 }}%
          </text>
          <text class="stat-label">
            成功率
          </text>
        </view>
      </view>
    </view>

    <!-- 成就展示 -->
    <view class="achievement-section">
      <view class="section-header">
        <text class="section-title">
          最新成就
        </text>
        <text class="view-more" @click="handleMenuClick('/pages/achievements/list')">
          查看全部
        </text>
      </view>
      <view class="achievement-grid">
        <view
          v-for="(achievement, index) in achievements.slice(0, 4)"
          :key="index"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
          @click="viewAchievement(achievement)"
        >
          <text class="achievement-icon">
            {{ achievement.icon }}
          </text>
          <text class="achievement-title">
            {{ achievement.title }}
          </text>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view v-for="section in menuSections" :key="section.title" class="menu-section">
      <view class="section-title-bar">
        <text class="section-title">
          {{ section.title }}
        </text>
      </view>
      <view class="menu-list">
        <view
          v-for="item in section.items"
          :key="item.title"
          class="menu-item"
          @click="handleMenuClick(item.route)"
        >
          <view class="menu-left">
            <view class="menu-icon">
              {{ item.icon }}
            </view>
            <view class="menu-content">
              <text class="menu-title">
                {{ item.title }}
              </text>
              <text class="menu-description">
                {{ item.description }}
              </text>
            </view>
          </view>
          <view class="menu-arrow">
            >
          </view>
        </view>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">
        坚持有你 v1.0.0
      </text>
      <text class="copyright">
        © 2024 健康管理应用
      </text>
    </view>
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
