<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录'
  }
}
</route>

<template>
  <view class="login-container">
    <!-- 登录背景 -->
    <view class="login-bg">
      <view class="logo-section">
        <view class="app-logo">
          <text class="iconfont icon-jianchi text-white text-6xl!" />
        </view>
        <view class="app-name">
          坚持有你
        </view>
        <view class="app-slogan">
          一起坚持，一起成长
        </view>
      </view>
    </view>

    <!-- 登录表单区域 -->
    <view class="login-form">
      <view class="form-title">
        欢迎使用坚持有你
      </view>

      <view class="form-subtitle">
        请选择登录方式
      </view>

      <!-- 登录按钮组 -->
      <view class="login-buttons">
        <!-- 微信授权登录 -->
        <wd-button
          class="custom-button"
          type="primary"
          size="large"
          custom-style="margin-bottom: 32rpx; background: #07c160; border-color: #07c160;"
          :loading="isWxLoading"
          @click="handleWxLogin"
        >
          <view class="login-btn-content">
            <text class="btn-icon">
              🔐
            </text>
            <text>微信授权登录</text>
          </view>
        </wd-button>

        <!-- 一键登录 -->
        <wd-button
          class="custom-button"
          type="info"
          size="large"
          plain
          @click="handleQuickLogin"
        >
          <view class="login-btn-content">
            <text class="btn-icon">
              📱
            </text>
            <text>一键登录</text>
          </view>
        </wd-button>
      </view>

      <!-- 登录协议 -->
      <view class="login-agreement">
        <text class="agreement-text">
          登录即表示同意
        </text>
        <text class="link-text" @click="viewPrivacy">
          《隐私政策》
        </text>
        <text class="agreement-text">
          和
        </text>
        <text class="link-text" @click="viewTerms">
          《用户协议》
        </text>
      </view>
    </view>

    <!-- 授权弹窗 -->
    <auth-modal
      v-model="showAuthModal"
      @confirm="handleAuthConfirm"
      @cancel="handleAuthCancel"
    />
  </view>
</template>

<script setup lang="ts">
import { useFastingStore, useUserStore } from '@/store';
import { toast } from '@/utils/toast';

const userStore = useUserStore();
const fastingStore = useFastingStore();

// 加载状态
const isWxLoading = ref(false);

// 授权弹窗显示状态
const showAuthModal = ref(false);

// 微信授权登录
function handleWxLogin() {
  showAuthModal.value = true;
}

// 一键登录（暂未实现）
function handleQuickLogin() {
  toast.info('一键登录功能开发中...');
}

// 授权确认
async function handleAuthConfirm() {
  try {
    isWxLoading.value = true;
    await userStore.wxLogin();

    if (userStore.userInfo.isSetup) {
      // 获取断食计划
      await fastingStore.fetchFastingData();

      // 获取未完成的断食记录
      await fastingStore.getUnfinishedRecord();
    }

    userStore.navigateAfterLogin();
  }
  catch (error) {
    console.error('登录失败:', error);
  }
  finally {
    isWxLoading.value = false;
  }
}

// 授权取消
function handleAuthCancel() {
  showAuthModal.value = false;
}

// 查看隐私政策
function viewPrivacy() {
  uni.navigateTo({
    url: '/pages/legal/privacy',
    fail: () => {
      toast.info('隐私政策页面开发中...');
    }
  });
}

// 查看用户协议
function viewTerms() {
  uni.navigateTo({
    url: '/pages/legal/terms',
    fail: () => {
      toast.info('用户协议页面开发中...');
    }
  });
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.login-bg {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 60rpx;
}

.logo-section {
  text-align: center;
  color: white;
}

.app-logo {
  margin-bottom: 40rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.app-slogan {
  font-size: 28rpx;
  opacity: 0.9;
}

.login-form {
  background: white;
  border-radius: 40rpx 40rpx 0 0;
  padding: 60rpx 60rpx 100rpx;
  box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 42rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20rpx;
}

.form-subtitle {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 80rpx;
}

.login-buttons {
  margin-bottom: 60rpx;
}

.login-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.login-agreement {
  text-align: center;
  font-size: 24rpx;
  color: #999;
}

.agreement-text {
  color: #999;
}

.link-text {
  color: #4195e1;
  text-decoration: underline;
}

/* 自定义样式 */
:deep(.custom-button) {
  height: 88rpx !important;
  border-radius: 44rpx !important;
  font-size: 32rpx !important;
}
</style>
