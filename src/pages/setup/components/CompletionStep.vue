<script setup lang="ts">
defineOptions({
  name: 'CompletionStep'
});
</script>

<template>
  <view class="step-content">
    <view class="complete-section">
      <view class="success-icon">
        🎉
      </view>
      <text class="complete-title">
        设置完成！
      </text>
      <text class="complete-desc">
        您的专属健康计划已准备就绪
      </text>

      <view class="feature-preview">
        <view class="feature-item">
          <view class="feature-icon">
            📱
          </view>
          <text class="feature-text">
            个性化断食计时
          </text>
        </view>
        <view class="feature-item">
          <view class="feature-icon">
            📈
          </view>
          <text class="feature-text">
            体重趋势分析
          </text>
        </view>
        <view class="feature-item">
          <view class="feature-icon">
            🏆
          </view>
          <text class="feature-text">
            成就徽章收集
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
}

.complete-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40rpx;
  max-width: 600rpx;
}

.success-icon {
  font-size: 100rpx;
  margin-bottom: 40rpx;
  animation: bounce 1s infinite alternate ease-in-out;
}

.complete-title {
  font-size: 48rpx;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 20rpx;
}

.complete-desc {
  font-size: 32rpx;
  color: var(--text-color-secondary);
  margin-bottom: 60rpx;
}

.feature-preview {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  width: 100%;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: var(--bg-gradient);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .feature-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-light);
    border-radius: 50%;
  }

  .feature-text {
    font-size: 28rpx;
    color: var(--text-color);
    font-weight: bold;
  }
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20rpx);
  }
}
</style>
