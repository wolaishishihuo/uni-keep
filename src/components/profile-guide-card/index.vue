<script setup lang="ts">
import type { UserProfile } from '@/models/user';
import { computed, ref } from 'vue';

interface Props {
  userInfo: UserProfile;
  showCard?: boolean;
}

interface Emits {
  (e: 'dismiss'): void;
  (e: 'quick-setup'): void;
  (e: 'go-profile'): void;
}

const props = withDefaults(defineProps<Props>(), {
  showCard: true
});

const emit = defineEmits<Emits>();

// 内部显示状态
const dismissed = ref(false);

// 检查必填信息完整性
const isProfileComplete = computed(() => {
  const { height, currentWeight, targetWeight } = props.userInfo;
  return !!(height && currentWeight && targetWeight);
});

// 是否显示卡片
const show = computed(() => {
  return props.showCard && !dismissed.value && !isProfileComplete.value;
});

// 计算完成进度
const progressPercent = computed(() => {
  const { height, currentWeight, targetWeight, nickname } = props.userInfo;
  let completed = 0;
  const total = 4; // 昵称、身高、当前体重、目标体重

  if (nickname && nickname !== '游客')
    completed++;
  if (height && height > 0)
    completed++;
  if (currentWeight && currentWeight > 0)
    completed++;
  if (targetWeight && targetWeight > 0)
    completed++;

  return Math.round((completed / total) * 100);
});

// 缺少的项目文本
const missingItemsText = computed(() => {
  const missing = [];
  const { height, currentWeight, targetWeight, nickname } = props.userInfo;

  if (!nickname || nickname === '游客')
    missing.push('昵称');
  if (!height || height <= 0)
    missing.push('身高');
  if (!currentWeight || currentWeight <= 0)
    missing.push('当前体重');
  if (!targetWeight || targetWeight <= 0)
    missing.push('目标体重');

  return missing.join('、');
});

// 关闭卡片
function dismissCard() {
  dismissed.value = true;
  emit('dismiss');

  // 7天后重新显示
  const dismissTime = Date.now();
  uni.setStorageSync('profile_guide_dismiss_time', dismissTime);
}

// 快速设置
function openQuickSetup() {
  emit('quick-setup');
}

// 跳转到个人资料页面
function goToProfile() {
  emit('go-profile');
}

// 检查是否应该重新显示（7天后）
function checkShouldShow() {
  const dismissTime = uni.getStorageSync('profile_guide_dismiss_time');
  if (dismissTime) {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (now - dismissTime < sevenDays) {
      dismissed.value = true;
    }
  }
}

// 初始化检查
checkShouldShow();
</script>

<template>
  <view v-if="show" class="profile-guide-card">
    <view class="card-content">
      <!-- 关闭按钮 -->
      <view class="close-btn" @click="dismissCard">
        <text class="close-icon">
          ✕
        </text>
      </view>

      <!-- 主要内容 -->
      <view class="guide-main">
        <view class="guide-icon">
          ⚙️
        </view>
        <view class="guide-text">
          <text class="guide-title">
            完善个人信息
          </text>
          <text class="guide-desc">
            设置身体数据，获得个性化体验
          </text>
        </view>
      </view>

      <!-- 进度指示 -->
      <view class="progress-section">
        <view class="progress-info">
          <text class="progress-label">
            完成度
          </text>
          <text class="progress-percent">
            {{ progressPercent }}%
          </text>
        </view>
        <view class="progress-bar">
          <view
            class="progress-fill"
            :style="{ width: `${progressPercent}%` }"
          />
        </view>
        <view class="missing-items">
          <text class="missing-text">
            缺少：{{ missingItemsText }}
          </text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <wd-button
          type="primary"
          size="small"
          custom-style="flex: 1; margin-right: 16rpx; height: 64rpx; border-radius: 32rpx;"
          @click="goToProfile"
        >
          去完善
        </wd-button>
        <wd-button
          type="info"
          size="small"
          plain
          custom-style="flex: 1; height: 64rpx; border-radius: 32rpx;"
          @click="openQuickSetup"
        >
          快速设置
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-guide-card {
  margin: 32rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  // 添加毛玻璃效果背景
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 24rpx;
    z-index: 0;
  }
}

.card-content {
  padding: 32rpx;
  position: relative;
  z-index: 1;
}

.close-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  .close-icon {
    color: white;
    font-size: 24rpx;
    font-weight: bold;
  }
}

.guide-main {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;

  .guide-icon {
    font-size: 48rpx;
    margin-right: 24rpx;
  }

  .guide-text {
    flex: 1;

    .guide-title {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: white;
      margin-bottom: 8rpx;
    }

    .guide-desc {
      display: block;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.progress-section {
  margin-bottom: 32rpx;

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .progress-label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }

    .progress-percent {
      font-size: 28rpx;
      font-weight: 600;
      color: white;
    }
  }

  .progress-bar {
    height: 8rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4rpx;
    margin-bottom: 16rpx;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4facfe, #00f2fe);
      border-radius: 4rpx;
      transition: width 0.3s ease;
    }
  }

  .missing-items {
    .missing-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.action-buttons {
  display: flex;
  gap: 16rpx;
}
</style>
