<script setup lang="ts">
import type { SetupFormData } from '../hooks/useSetupForm';

defineOptions({
  name: 'NotificationStep'
});

const props = defineProps<{
  formData: SetupFormData;
}>();

const emit = defineEmits<{
  'select-time': [field: string];
  'update:field': [field: string, value: any];
}>();

// 更新字段值
function updateField(field: keyof SetupFormData, value: any) {
  emit('update:field', field, value);
}

// 点击时间字段，打开时间选择器
function onTimeFieldClick(field: string) {
  emit('select-time', field);
}

// 格式化时间显示
function formatTimeDisplay(time: string) {
  if (!time)
    return '08:00';
  // 如果是日期时间格式，提取时间部分
  if (time.includes(' ')) {
    return time.split(' ')[1]?.substring(0, 5) || '08:00';
  }
  return time;
}
</script>

<template>
  <view class="step-content">
    <view class="step-header">
      <view class="step-icon">
        ⏰
      </view>
      <text class="step-title">
        智能提醒
      </text>
    </view>

    <view class="form-section">
      <view class="notification-toggle">
        <view class="toggle-info">
          <text class="toggle-title">
            开启提醒通知
          </text>
          <text class="toggle-desc">
            帮您养成良好的断食和体重记录习惯
          </text>
        </view>
        <wd-switch
          :model-value="formData.enableNotification"
          active-color="var(--primary-color)"
          @update:model-value="updateField('enableNotification', $event)"
        />
      </view>

      <view v-if="formData.enableNotification" class="time-settings">
        <view class="time-group">
          <text class="group-title">
            🍽 断食时间
          </text>
          <view class="time-item" @click="onTimeFieldClick('fastingStart')">
            <text class="time-label">
              开始时间
            </text>
            <text class="time-value">
              {{ formatTimeDisplay(formData.fastingStart) }}
            </text>
          </view>
          <view class="time-item" @click="onTimeFieldClick('fastingEnd')">
            <text class="time-label">
              结束时间
            </text>
            <text class="time-value">
              {{ formatTimeDisplay(formData.fastingEnd) }}
            </text>
          </view>
        </view>

        <view class="time-group">
          <text class="group-title">
            ⚖️ 体重记录
          </text>
          <view class="time-item" @click="onTimeFieldClick('weightRecord')">
            <text class="time-label">
              提醒时间
            </text>
            <text class="time-value">
              {{ formatTimeDisplay(formData.weightRecord) }}
            </text>
          </view>
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
  padding: 0 30rpx;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;

  .step-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .step-title {
    font-size: 36rpx;
    font-weight: bold;
    color: var(--text-color);
  }
}

.form-section {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 40rpx;
}

.notification-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: var(--card-bg-color);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;

  .toggle-info {
    flex: 1;

    .toggle-title {
      font-size: 32rpx;
      font-weight: bold;
      color: var(--text-color);
      margin-bottom: 8rpx;
      display: block;
    }

    .toggle-desc {
      font-size: 26rpx;
      color: var(--text-color-secondary);
      display: block;
    }
  }
}

.time-settings {
  margin-top: 30rpx;
}

.time-group {
  padding: 30rpx;
  background-color: var(--card-bg-color);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;

  .group-title {
    font-size: 30rpx;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 20rpx;
    display: block;
  }
}

.time-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: var(--bg-color-light);
  border-radius: 12rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .time-label {
    font-size: 28rpx;
    color: var(--text-color);
  }

  .time-value {
    font-size: 30rpx;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>
