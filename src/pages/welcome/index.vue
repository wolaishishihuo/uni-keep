<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '欢迎使用'
  }
}
</route>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';

const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);

// 页面跳转
function navigateTo(url: string) {
  uni.navigateTo({ url });
}
</script>

<template>
  <view
    class="welcome-container"
    :class="themeClassName"
  >
    <!-- 顶部欢迎区域 -->
    <view class="welcome-header">
      <view class="app-logo">
        坚持有你
      </view>
      <view class="app-tagline">
        与伴侣一起健康生活
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="welcome-content">
      <view class="welcome-title">
        健康断食，从此刻开始
      </view>

      <view class="features-list">
        <view class="feature-item">
          <view class="feature-icon">
            ⏱️
          </view>
          <view class="feature-info">
            <view class="feature-title">
              科学断食计划
            </view>
            <view class="feature-desc">
              提供16:8和18:6两种间歇性断食方案，科学健康
            </view>
          </view>
        </view>
        <view class="feature-item">
          <view class="feature-icon">
            👫
          </view>
          <view class="feature-info">
            <view class="feature-title">
              情侣共同坚持
            </view>
            <view class="feature-desc">
              与伴侣一起制定计划，互相监督，共同成长
            </view>
          </view>
        </view>
        <view class="feature-item">
          <view class="feature-icon">
            🏆
          </view>
          <view class="feature-info">
            <view class="feature-title">
              成就与奖励
            </view>
            <view class="feature-desc">
              解锁成就，获取奖励，让坚持更有动力
            </view>
          </view>
        </view>
      </view>

      <view class="buttons">
        <button class="btn btn-primary" @tap="navigateTo('/pages/setup/index')">
          开始使用
        </button>
        <button class="btn btn-secondary">
          了解更多
        </button>
      </view>

      <view class="social-login">
        <view class="social-btn">
          W
        </view>
        <view class="social-btn">
          Q
        </view>
        <view class="social-btn">
          A
        </view>
      </view>

      <view class="footer-text">
        开始使用即表示您同意我们的《用户协议》和《隐私政策》
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@import "./index.scss";
</style>
