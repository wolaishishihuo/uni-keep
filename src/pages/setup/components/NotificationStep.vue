<script setup lang="ts">
import { parseTimeString } from '@/utils/time';
import { useFastingPlan } from '../hooks/useFastingPlan';
import { useSetupForm } from '../hooks/useSetupForm';

defineOptions({
  name: 'NotificationStep'
});
const emit = defineEmits<{
  'select-time': [field: string];
}>();

const { formData } = useSetupForm();
const { fastingPlans } = useFastingPlan();

const currentPlan = computed(() =>
  fastingPlans.value.find(plan => plan.id === formData.fastingPlanId)
);

// 时间选项（分钟）
const timeOptions = [5, 10, 15, 20, 30, 45, 60];

/**
 * 更新时间设置
 */
function updateTime(field: string, isIncrease: boolean) {
  const currentValue = formData[field];
  const currentIndex = timeOptions.indexOf(currentValue);

  let newIndex;
  if (isIncrease) {
    newIndex = currentIndex < timeOptions.length - 1 ? currentIndex + 1 : 0;
  }
  else {
    newIndex = currentIndex > 0 ? currentIndex - 1 : timeOptions.length - 1;
  }

  formData[field] = timeOptions[newIndex];
}

/**
 * 格式化时间显示
 */
function formatTime(minutes: number): string {
  return `${minutes}分钟`;
}

// 进食结束时间
const eatingEndTime = computed(() => {
  const start = formData.eatingStartTime;
  if (!start || !currentPlan.value)
    return '';
  const { hours: h, minutes: m } = parseTimeString(start);
  let endHour = h + currentPlan.value.eatingHours;
  if (endHour >= 24)
    endHour -= 24;
  return `${endHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
});

// 点击时间字段，打开时间选择器
function onTimeFieldClick(field: string) {
  emit('select-time', field);
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

    <view class="overflow-y-auto">
      <!-- 进食时间设置 -->
      <view class="card">
        <text class="section-title">
          ⏱️ 进食时间设置
        </text>
        <view class="setting-row">
          <view class="setting-title">
            进食开始时间
          </view>
          <view class="time-picker text-[var(--primary-color)]" @tap="onTimeFieldClick('eatingStartTime')">
            {{ formData.eatingStartTime }}
          </view>
        </view>
        <view class="setting-row">
          <view class="setting-title">
            进食结束时间
          </view>
          <view class="time-picker">
            {{ eatingEndTime }} (自动计算)
          </view>
        </view>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              进食窗口
            </view>
          </view>
          {{ currentPlan?.eatingHours }}小时
        </view>
      </view>

      <!-- 断食计划提醒 -->
      <view class="card">
        <text class="section-title">
          ⏱️ 断食计划提醒
        </text>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              断食开始提醒
            </view>
            <view class="setting-desc">
              在每日断食时间开始前发送提醒
            </view>
          </view>
          <wd-switch v-model="formData.fastingStartNotify" />
        </view>
        <view v-if="formData.fastingStartNotify" class="setting-row">
          <view class="setting-title">
            提前提醒时间
          </view>
          <view class="time-picker">
            <view class="arrow-btn" @tap="updateTime('fastingStartAdvanceMinutes', false)">
              -
            </view>
            <input type="text" class="time-input" :value="formatTime(formData.fastingStartAdvanceMinutes)" readonly>
            <view class="arrow-btn" @tap="updateTime('fastingStartAdvanceMinutes', true)">
              +
            </view>
          </view>
        </view>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              进食窗口提醒
            </view>
            <view class="setting-desc">
              在进食窗口开始前发送提醒
            </view>
          </view>
          <wd-switch v-model="formData.eatingWindowStartNotify" />
        </view>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              进食窗口结束提醒
            </view>
            <view class="setting-desc">
              在进食窗口即将结束时发送提醒
            </view>
          </view>
          <wd-switch v-model="formData.eatingWindowEndNotify" />
        </view>
        <view v-if="formData.eatingWindowEndNotify" class="setting-row">
          <view class="setting-title">
            提前提醒时间
          </view>
          <view class="time-picker">
            <view class="arrow-btn" @tap="updateTime('eatingWindowAdvanceMinutes', false)">
              -
            </view>
            <input type="text" class="time-input" :value="formatTime(formData.eatingWindowAdvanceMinutes)" readonly>
            <view class="arrow-btn" @tap="updateTime('eatingWindowAdvanceMinutes', true)">
              +
            </view>
          </view>
        </view>
      </view>

      <!-- 成就与里程碑 -->
      <view class="card">
        <text class="section-title">
          🏆 成就与里程碑
        </text>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              成就解锁提醒
            </view>
            <view class="setting-desc">
              当您达成成就或解锁新奖励时通知您
            </view>
          </view>
          <wd-switch v-model="formData.achievementNotify" />
        </view>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              坚持里程碑提醒
            </view>
            <view class="setting-desc">
              当您达成坚持天数里程碑时通知您
            </view>
          </view>
          <wd-switch v-model="formData.milestoneNotify" />
        </view>
      </view>

      <!-- 情侣互动提醒 -->
      <view class="card">
        <text class="section-title">
          ❤️ 情侣互动提醒
        </text>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              伙伴坚持状态提醒
            </view>
            <view class="setting-desc">
              当您的伙伴开始或完成断食时通知您
            </view>
          </view>
          <wd-switch v-model="formData.partnerFastingNotify" />
        </view>
        <view class="setting-row">
          <view>
            <view class="setting-title">
              伙伴鼓励提醒
            </view>
            <view class="setting-desc">
              当您的伙伴发送鼓励或表扬时通知您
            </view>
          </view>
          <wd-switch v-model="formData.partnerEncourageNotify" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
$card-radius: 30rpx;
$card-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
$spacing-lg: 40rpx;

.step-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 50rpx;
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
}

.form-section {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160rpx;
}

.card {
  background: #fff;
  border-radius: $card-radius;
  box-shadow: $card-shadow;
  padding: 30rpx;
  margin-bottom: $spacing-lg;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 30rpx;
  display: block;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  .setting-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #262626;
    margin-bottom: 10rpx;
  }
  .setting-desc {
    font-size: 26rpx;
    color: #595959;
    line-height: 1.4;
  }
}

.time-picker {
  display: flex;
  gap: 16rpx;
  align-items: center;
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
    &:active {
      transform: scale(0.95);
      background: var(--primary-color);
      color: white;
    }
  }
  .time-input {
    background: #f5f5f5;
    border: none;
    padding: 5rpx 10rpx;
    border-radius: 10rpx;
    width: 120rpx;
    text-align: center;
    font-size: 28rpx;
    color: var(--primary-color);
    font-weight: 500;
  }
}
</style>
