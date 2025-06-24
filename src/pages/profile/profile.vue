<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的'
  }
}
</route>

<script lang="ts" setup>
import { useSafeArea } from '@/hooks/useSafeArea'

defineOptions({
  name: 'Profile',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea()

// 用户信息
const userInfo = ref({
  nickname: '小明',
  avatar: '/static/images/default-avatar.png',
  level: 5,
  continuousDays: 7,
  totalDays: 25,
  partner: '小红',
  isConnected: true,
})

// 成就数据
const achievements = ref([
  { icon: '🏆', title: '坚持达人', description: '连续坚持7天', unlocked: true },
  { icon: '💪', title: '减重英雄', description: '成功减重5kg', unlocked: true },
  { icon: '❤️', title: '情侣冠军', description: '与伴侣共同坚持30天', unlocked: false },
  { icon: '🌟', title: '完美主义', description: '100%完成率', unlocked: false },
])

// 菜单项
const menuSections = ref([
  {
    title: '数据统计',
    items: [
      {
        icon: '📊',
        title: '我的数据',
        description: '查看详细统计',
        route: '/pages/stats/overview',
      },
      { icon: '📈', title: '进度报告', description: '周月年度报告', route: '/pages/stats/report' },
      {
        icon: '🏆',
        title: '成就中心',
        description: '查看所有成就',
        route: '/pages/achievements/list',
      },
    ],
  },
  {
    title: '情侣互动',
    items: [
      { icon: '❤️', title: '情侣状态', description: '查看对方进度', route: '/pages/couple/status' },
      { icon: '🎯', title: '共同目标', description: '设置情侣目标', route: '/pages/couple/goals' },
      { icon: '💌', title: '互动记录', description: '鼓励与支持', route: '/pages/couple/messages' },
    ],
  },
  {
    title: '设置',
    items: [
      { icon: '⚙️', title: '应用设置', description: '通知提醒等', route: '/pages/settings/app' },
      {
        icon: '👤',
        title: '个人资料',
        description: '编辑个人信息',
        route: '/pages/settings/profile',
      },
      {
        icon: '🔒',
        title: '隐私设置',
        description: '数据与隐私',
        route: '/pages/settings/privacy',
      },
      { icon: '📞', title: '联系我们', description: '意见反馈', route: '/pages/settings/contact' },
    ],
  },
])

// 处理菜单点击
function handleMenuClick(route: string) {
  if (route) {
    uni.navigateTo({
      url: route,
      fail: () => {
        uni.showToast({ title: '功能开发中', icon: 'none' })
      },
    })
  }
  else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}

// 编辑资料
function editProfile() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

// 查看成就详情
function viewAchievement(achievement: any) {
  uni.showModal({
    title: achievement.title,
    content: achievement.description,
    showCancel: false,
  })
}

onLoad(() => {
  console.log('个人中心页面加载完成')
})
</script>

<template>
  <view class="profile-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="avatar-container" @click="editProfile">
          <image :src="userInfo.avatar" class="user-avatar" mode="aspectFill" />
          <view class="level-badge">
            Lv.{{ userInfo.level }}
          </view>
        </view>
        <view class="user-details">
          <text class="user-name">
            {{ userInfo.nickname }}
          </text>
          <text class="user-status">
            {{ userInfo.isConnected ? `与${userInfo.partner}携手坚持` : '单独坚持中' }}
          </text>
        </view>
        <view class="edit-btn" @click="editProfile">
          <text class="edit-icon">
            ✏️
          </text>
        </view>
      </view>

      <!-- 坚持统计 -->
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">
            {{ userInfo.continuousDays }}
          </text>
          <text class="stat-label">
            连续天数
          </text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">
            {{ userInfo.totalDays }}
          </text>
          <text class="stat-label">
            总坚持天数
          </text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">
            {{ Math.round((userInfo.continuousDays / userInfo.totalDays) * 100) }}%
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

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0 40rpx 40rpx;
}

.user-card {
  background: white;
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-container {
  position: relative;
  margin-right: 30rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid #4ecdc4;
}

.level-badge {
  position: absolute;
  bottom: -5rpx;
  right: -5rpx;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  font-size: 20rpx;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  font-weight: 600;
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.user-status {
  font-size: 26rpx;
  color: #666;
}

.edit-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f8f9fa;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 32rpx;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #4ecdc4;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.stat-divider {
  width: 1rpx;
  height: 40rpx;
  background: #eee;
  margin: 0 20rpx;
}

.achievement-section {
  background: white;
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.view-more {
  font-size: 26rpx;
  color: #4ecdc4;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.achievement-item {
  text-align: center;
  padding: 30rpx 15rpx;
  border-radius: 20rpx;
  background: #f8f9fa;
  opacity: 0.5;

  &.unlocked {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
    opacity: 1;
  }
}

.achievement-icon {
  display: block;
  font-size: 40rpx;
  margin-bottom: 15rpx;
}

.achievement-title {
  font-size: 22rpx;
  font-weight: 500;
}

.menu-section {
  margin-bottom: 40rpx;
}

.section-title-bar {
  margin-bottom: 20rpx;
}

.menu-list {
  background: white;
  border-radius: 30rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8f9fa;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-right: 25rpx;
  background: #f8f9fa;
}

.menu-content {
  flex: 1;
}

.menu-title {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.menu-description {
  font-size: 24rpx;
  color: #666;
}

.menu-arrow {
  font-size: 28rpx;
  color: #ccc;
  font-weight: bold;
}

.version-info {
  text-align: center;
  padding: 40rpx 0;
}

.version-text {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.copyright {
  font-size: 22rpx;
  color: #999;
}
</style>
