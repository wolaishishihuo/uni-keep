<script setup lang="ts">
import type { SetupFormData } from '../hooks/useSetupForm';
import { computed } from 'vue';
import { useFastingPlan } from '../hooks/useFastingPlan';

defineOptions({
  name: 'FastingPlanStep'
});

const props = defineProps<{
  formData: SetupFormData;
}>();

const emit = defineEmits<{
  'select-plan': [planId: string];
}>();

// 使用断食计划hook获取数据
const { fastingPlans } = useFastingPlan();

// 计算当前选中的计划详情
const currentPlan = computed(() =>
  fastingPlans.value.find(plan => plan.id === props.formData.fastingPlanId)
);

// 选择计划
function selectPlan(planId: string) {
  emit('select-plan', planId);
}
</script>

<template>
  <view class="step-content">
    <view class="step-header">
      <view class="step-icon">
        🍽️
      </view>
      <text class="step-title">
        断食计划
      </text>
    </view>

    <view class="form-section">
      <text class="section-title">
        选择适合您的断食方案
      </text>

      <view class="plan-list">
        <view
          v-for="plan in fastingPlans"
          :key="plan.id"
          class="plan-item"
          :class="{ active: formData.fastingPlanId === plan.id }"
          @click="selectPlan(plan.id)"
        >
          <view class="plan-icon">
            {{ plan.icon }}
          </view>
          <view class="plan-info">
            <text class="plan-name">
              {{ plan.name }}
            </text>
            <text class="plan-desc">
              {{ plan.pattern }}
            </text>
          </view>
          <view v-if="formData.fastingPlanId === plan.id" class="plan-check">
            ✓
          </view>
        </view>
      </view>

      <view v-if="currentPlan" class="plan-detail">
        <text class="detail-title">
          方案详情
        </text>
        <text class="detail-desc">
          {{ currentPlan.description }}
        </text>

        <view class="time-pattern">
          <view class="time-item">
            <text class="time-label">
              断食时长
            </text>
            <text class="time-value">
              {{ currentPlan.fastingHours }}小时
            </text>
          </view>
          <view class="time-item">
            <text class="time-label">
              进食时长
            </text>
            <text class="time-value">
              {{ currentPlan.eatingHours }}小时
            </text>
          </view>
        </view>

        <view class="plan-benefits">
          <text class="benefits-title">
            健康益处
          </text>
          <view v-for="(benefit, idx) in currentPlan.benefits" :key="idx" class="benefit-item">
            <text class="benefit-dot">
              •
            </text>
            <text class="benefit-text">
              {{ benefit }}
            </text>
          </view>
        </view>

        <view class="plan-suitable">
          <text class="suitable-title">
            适合人群
          </text>
          <text class="suitable-text">
            {{ currentPlan.suitable }}
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

.section-title {
  font-size: 30rpx;
  color: var(--text-color);
  margin-bottom: 30rpx;
  display: block;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.plan-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: var(--card-bg-color);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;

  &.active {
    background-color: var(--primary-color-light);
    border: 2rpx solid var(--primary-color);
  }

  .plan-icon {
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

  .plan-info {
    flex: 1;

    .plan-name {
      font-size: 30rpx;
      font-weight: bold;
      color: var(--text-color);
      margin-bottom: 6rpx;
      display: block;
    }

    .plan-desc {
      font-size: 24rpx;
      color: var(--text-color-secondary);
      display: block;
    }
  }

  .plan-check {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
  }
}

.plan-detail {
  padding: 30rpx;
  background-color: var(--card-bg-color);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;

  .detail-title {
    font-size: 30rpx;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 16rpx;
    display: block;
  }

  .detail-desc {
    font-size: 28rpx;
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: 24rpx;
    display: block;
  }
}

.time-pattern {
  display: flex;
  margin-bottom: 30rpx;
  gap: 20rpx;

  .time-item {
    flex: 1;
    padding: 20rpx;
    background-color: var(--bg-color-light);
    border-radius: 12rpx;
    text-align: center;

    .time-label {
      font-size: 24rpx;
      color: var(--text-color-secondary);
      margin-bottom: 10rpx;
      display: block;
    }

    .time-value {
      font-size: 32rpx;
      font-weight: bold;
      color: var(--primary-color);
      display: block;
    }
  }
}

.plan-benefits, .plan-suitable {
  margin-bottom: 24rpx;

  .benefits-title, .suitable-title {
    font-size: 28rpx;
    font-weight: bold;
    color: var(--text-color);
    margin-bottom: 12rpx;
    display: block;
  }

  .benefit-item {
    display: flex;
    margin-bottom: 8rpx;

    .benefit-dot {
      font-size: 24rpx;
      color: var(--primary-color);
      margin-right: 10rpx;
      line-height: 1.5;
    }

    .benefit-text {
      font-size: 26rpx;
      color: var(--text-color);
      line-height: 1.5;
    }
  }

  .suitable-text {
    font-size: 26rpx;
    color: var(--text-color);
    line-height: 1.5;
    display: block;
  }
}
</style>
