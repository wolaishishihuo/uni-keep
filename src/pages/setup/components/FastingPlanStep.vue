<script setup lang="ts">
import { computed } from 'vue';
import { useFastingPlan } from '../hooks/useFastingPlan';
import { useSetupForm } from '../hooks/useSetupForm';

defineOptions({
  name: 'FastingPlanStep'
});

const { formData } = useSetupForm();

// 使用断食计划hook获取数据
const { fastingPlans } = useFastingPlan();

// 计算当前选中的计划详情
const currentPlan = computed(() =>
  fastingPlans.value.find(plan => plan.id === formData.fastingPlanId)
);

// 选择计划
function selectPlan(planId: string) {
  formData.fastingPlanId = planId;
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
      <view class="section-title">
        选择断食计划
      </view>

      <view class="plans-container">
        <view
          v-for="plan in fastingPlans"
          :key="plan.id"
          class="plan-card"
          :class="{ selected: formData.fastingPlanId === plan.id }"
          @click="selectPlan(plan.id)"
        >
          <view class="plan-header">
            <view class="plan-name">
              {{ plan.name }}
            </view>
            <view class="plan-difficulty">
              <view
                v-for="n in 3"
                :key="n"
                class="difficulty-dot"
                :class="{ active: plan.difficulty >= n }"
              />
            </view>
          </view>
          <view class="plan-details">
            <view class="plan-info">
              <view class="info-label">
                断食时长
              </view>
              <view class="info-value">
                {{ plan.fastingHours }}小时
              </view>
            </view>
            <view class="plan-info">
              <view class="info-label">
                进食窗口
              </view>
              <view class="info-value">
                {{ plan.eatingHours }}小时
              </view>
            </view>
            <view class="plan-info">
              <view class="info-label">
                推荐难度
              </view>
              <view class="info-value">
                {{ plan.difficulty === 1 ? '简单' : plan.difficulty === 2 ? '中等' : '较难' }}
              </view>
            </view>
          </view>
          <view class="plan-description">
            {{ plan.description }}
          </view>
          <view v-if="formData.fastingPlanId === plan.id" class="plan-checkmark">
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
.section-title {
  font-size: 32rpx;
  color: var(--text-color);
  margin-bottom: 30rpx;
  display: block;
  font-weight: bold;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.plan-card {
  position: relative;
  background: var(--card-bg-color, #fff);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.05);
  padding: 24rpx;
  margin-bottom: 0;
  cursor: pointer;
  border: 2rpx solid transparent;
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;

  &.selected {
    border: 2rpx solid var(--primary-color);
    background: var(--primary-color-light, #f0f6ff);
    box-shadow: 0 8rpx 25rpx rgba(0,0,0,0.10);
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15rpx;

    .plan-name {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-color, #262626);
    }

    .plan-difficulty {
      display: flex;
      gap: 6rpx;

      .difficulty-dot {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #e0e0e0;
        &.active {
          background: var(--primary-color);
        }
      }
    }
  }

  .plan-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15rpx;

    .plan-info {
      text-align: center;
      .info-label {
        font-size: 22rpx;
        color: var(--text-color-secondary, #888);
        margin-bottom: 4rpx;
      }
      .info-value {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--primary-color);
      }
    }
  }

  .plan-description {
    font-size: 24rpx;
    color: #595959;
    line-height: 1.5;
  }

  .plan-checkmark {
    position: absolute;
    top: -10rpx;
    right: 20rpx;
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background: var(--primary-color);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    font-weight: bold;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.10);
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
