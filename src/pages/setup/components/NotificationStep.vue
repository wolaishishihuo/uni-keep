<script setup lang="ts">
import { useSetupForm } from '../hooks/useSetupForm';

defineOptions({
  name: 'NotificationStep'
});

const { formData, updateFormData } = useSetupForm();

// 时间选项（分钟）
const timeOptions = [5, 10, 15, 20, 30, 45, 60];

/**
 * 更新开关状态
 */
function updateToggle(field: string, value: boolean) {
  updateFormData(field as any, value);
}

/**
 * 更新时间设置
 */
function updateTime(field: string, isIncrease: boolean) {
  const currentValue = (formData as any)[field];
  const currentIndex = timeOptions.indexOf(currentValue);

  let newIndex;
  if (isIncrease) {
    newIndex = currentIndex < timeOptions.length - 1 ? currentIndex + 1 : 0;
  }
  else {
    newIndex = currentIndex > 0 ? currentIndex - 1 : timeOptions.length - 1;
  }

  updateFormData(field as any, timeOptions[newIndex]);
}

/**
 * 格式化时间显示
 */
function formatTime(minutes: number): string {
  return `${minutes}分钟`;
}
</script>

<template>
  <view class="step-content">
    <view class="step-header">
      <view class="step-icon">
        ⏰
      </view>
      <text class="step-title">
        智能提醒设置
      </text>
    </view>

    <view class="form-section">
      <!-- 断食计划提醒设置 -->
      <view class="info-group">
        <text class="group-title">
          ⏱️ 断食计划提醒
        </text>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              断食开始提醒
            </view>
            <view class="toggle-desc">
              在每日断食时间开始前发送提醒
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.fastingStartNotify"
            @change="updateToggle('fastingStartNotify', $event.detail.value)"
          />
        </view>

        <view v-if="formData.fastingStartNotify" class="time-item">
          <view class="time-label">
            提前提醒时间
          </view>
          <view class="time-value">
            <view class="time-picker">
              <view
                class="arrow-btn"
                @tap="updateTime('fastingStartAdvanceMinutes', false)"
              >
                -
              </view>
              <input
                type="text"
                class="time-input"
                :value="formatTime(formData.fastingStartAdvanceMinutes)"
                readonly
              >
              <view
                class="arrow-btn"
                @tap="updateTime('fastingStartAdvanceMinutes', true)"
              >
                +
              </view>
            </view>
          </view>
        </view>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              进食窗口提醒
            </view>
            <view class="toggle-desc">
              在进食窗口开始前发送提醒
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.eatingWindowStartNotify"
            @change="updateToggle('eatingWindowStartNotify', $event.detail.value)"
          />
        </view>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              进食窗口结束提醒
            </view>
            <view class="toggle-desc">
              在进食窗口即将结束时发送提醒
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.eatingWindowEndNotify"
            @change="updateToggle('eatingWindowEndNotify', $event.detail.value)"
          />
        </view>

        <view v-if="formData.eatingWindowEndNotify" class="time-item">
          <view class="time-label">
            提前提醒时间
          </view>
          <view class="time-value">
            <view class="time-picker">
              <view
                class="arrow-btn"
                @tap="updateTime('eatingWindowAdvanceMinutes', false)"
              >
                -
              </view>
              <input
                type="text"
                class="time-input"
                :value="formatTime(formData.eatingWindowAdvanceMinutes)"
                readonly
              >
              <view
                class="arrow-btn"
                @tap="updateTime('eatingWindowAdvanceMinutes', true)"
              >
                +
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 成就与里程碑 -->
      <view class="info-group">
        <text class="group-title">
          🏆 成就与里程碑
        </text>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              成就解锁提醒
            </view>
            <view class="toggle-desc">
              当您达成成就或解锁新奖励时通知您
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.achievementNotify"
            @change="updateToggle('achievementNotify', $event.detail.value)"
          />
        </view>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              坚持里程碑提醒
            </view>
            <view class="toggle-desc">
              当您达成坚持天数里程碑时通知您
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.milestoneNotify"
            @change="updateToggle('milestoneNotify', $event.detail.value)"
          />
        </view>
      </view>

      <!-- 情侣互动提醒 -->
      <view class="info-group">
        <text class="group-title">
          ❤️ 情侣互动提醒
        </text>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              伙伴坚持状态提醒
            </view>
            <view class="toggle-desc">
              当您的伙伴开始或完成断食时通知您
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.partnerFastingNotify"
            @change="updateToggle('partnerFastingNotify', $event.detail.value)"
          />
        </view>

        <view class="notification-toggle">
          <view class="toggle-info">
            <view class="toggle-title">
              伙伴鼓励提醒
            </view>
            <view class="toggle-desc">
              当您的伙伴发送鼓励或表扬时通知您
            </view>
          </view>
          <switch
            class="uni-switch"
            :checked="formData.partnerEncourageNotify"
            @change="updateToggle('partnerEncourageNotify', $event.detail.value)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.step-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 50rpx;
}

.step-icon {
  width: 80rpx;
  height: 80rpx;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: 36rpx;
  margin-right: 30rpx;
}

.step-title {
  font-size: 48rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.form-section {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160rpx;
}

.info-group {
  background: white;
  border-radius: 30rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
}

.group-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 30rpx;
  display: block;
}

.notification-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-toggle:last-child {
  border-bottom: none;
}

.toggle-info {
  flex: 1;
  margin-right: 20rpx;
}

.toggle-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #262626;
  margin-bottom: 10rpx;
}

.toggle-desc {
  font-size: 26rpx;
  color: #595959;
  line-height: 1.4;
}

.uni-switch {
  transform: scale(0.9);
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.time-item:last-child {
  border-bottom: none;
}

.time-label {
  font-size: 28rpx;
  color: #262626;
}

.time-value {
  font-size: 28rpx;
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.time-picker {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.time-input {
  background: #f5f5f5;
  border: none;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
  width: 120rpx;
  text-align: center;
  font-size: 28rpx;
  color: var(--primary-color);
  font-weight: 500;
}

.arrow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  background: #e8f4ff;
  color: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  font-size: 24rpx;
  font-weight: bold;
  transition: all 0.3s ease;
}

.arrow-btn:active {
  transform: scale(0.95);
  background: var(--primary-color);
  color: white;
}
</style>
