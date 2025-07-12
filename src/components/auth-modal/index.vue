<template>
  <wd-popup
    v-model="showModal"
    position="center"
    :close-on-click-modal="false"
    custom-style="border-radius: 16px; overflow: hidden;"
  >
    <view class="auth-modal">
      <!-- 标题 -->
      <view class="modal-header">
        <view class="app-icon">
          <text class="iconfont icon-jianchi text-[var(--primary-color)] text-2xl!" />
        </view>
        <view class="modal-title">
          服务授权
        </view>
      </view>

      <!-- 授权政策文本 -->
      <view class="policy-content">
        <view class="policy-text">
          <text class="policy-title">
            为了给您提供更好的服务，我们需要获取以下权限：
          </text>

          <view class="policy-list">
            <view class="policy-item">
              <text class="policy-dot">
                •
              </text>
              <text class="policy-desc">
                获取您的微信登录凭证，用于账号登录验证
              </text>
            </view>
            <view class="policy-item">
              <text class="policy-dot">
                •
              </text>
              <text class="policy-desc">
                记录您的使用数据，为您提供个性化服务
              </text>
            </view>
            <view class="policy-item">
              <text class="policy-dot">
                •
              </text>
              <text class="policy-desc">
                保存您的偏好设置，优化使用体验
              </text>
            </view>
          </view>

          <view class="policy-notice">
            <text class="notice-text">
              我们承诺严格保护您的隐私信息，不会向第三方泄露您的个人数据。
            </text>
          </view>
        </view>

        <!-- 用户协议 -->
        <view class="agreement-section">
          <wd-checkbox v-model="agreed" shape="square">
            <text class="agreement-text">
              我已阅读并同意
              <text class="link-text" @click="viewPrivacy">
                《隐私政策》
              </text>
              和
              <text class="link-text" @click="viewTerms">
                《用户协议》
              </text>
            </text>
          </wd-checkbox>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="modal-actions">
        <wd-button
          type="info"
          size="large"
          plain
          @click="handleCancel"
        >
          暂不使用
        </wd-button>
        <wd-button
          type="primary"
          size="large"
          :disabled="!agreed"
          @click="handleConfirm"
        >
          同意并继续
        </wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  confirm: [];
  cancel: [];
}>();

// 是否同意协议
const agreed = ref(false);

const showModal = computed({
  get() {
    return props.modelValue;
  },
  set() {
    emit('close');
  }
});

// 查看隐私政策
function viewPrivacy() {
  uni.navigateTo({
    url: '/pages/legal/privacy',
    fail: () => {
      uni.showToast({
        title: '隐私政策页面开发中',
        icon: 'none'
      });
    }
  });
}

// 查看用户协议
function viewTerms() {
  uni.navigateTo({
    url: '/pages/legal/terms',
    fail: () => {
      uni.showToast({
        title: '用户协议页面开发中',
        icon: 'none'
      });
    }
  });
}

// 取消授权
function handleCancel() {
  showModal.value = false;
  agreed.value = false;
  emit('cancel');
}

// 确认授权
function handleConfirm() {
  if (!agreed.value) {
    uni.showToast({
      title: '请先同意用户协议',
      icon: 'none'
    });
    return;
  }

  showModal.value = false;
  emit('confirm');
}
</script>

<style lang="scss" scoped>
.auth-modal {
  width: 640rpx;
  background: white;
  padding: 0;
}

.modal-header {
  padding: 60rpx 40rpx 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #f5f5f5;
}

.app-icon {
  margin-bottom: 20rpx;
}

.logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.policy-content {
  padding: 40rpx;
}

.policy-text {
  margin-bottom: 30rpx;
}

.policy-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.policy-list {
  margin-bottom: 24rpx;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.policy-dot {
  font-size: 28rpx;
  color: #007aff;
  margin-right: 12rpx;
  margin-top: 2rpx;
  font-weight: bold;
}

.policy-desc {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.policy-notice {
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border-left: 6rpx solid #007aff;
}

.notice-text {
  font-size: 24rpx;
  color: #555;
  line-height: 1.6;
}

.agreement-section {
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}

.agreement-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  margin-left: 10rpx;
}

.link-text {
  color: #007aff;
  text-decoration: underline;
}

.modal-actions {
  padding: 20rpx 40rpx 40rpx;
  display: flex;
  gap: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}
</style>
