<script setup lang="ts">
import type { SetupFormData } from '../hooks/useSetupForm';

defineOptions({
  name: 'PersonalInfoStep'
});

defineProps<{
  formData: SetupFormData;
  bmiStatus: { text: string; color: string } | null;
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
</script>

<template>
  <view class="step-content">
    <view class="step-header">
      <view class="step-icon">
        👤
      </view>
      <text class="step-title">
        个人信息
      </text>
    </view>

    <view class="form-section scrollable">
      <!-- 基础信息分组 -->
      <view class="info-group">
        <view class="group-title">
          📝 基础信息
        </view>

        <view class="form-item">
          <text class="label">
            昵称
          </text>
          <wd-input
            :model-value="formData.nickname"
            placeholder="请输入您的昵称"
            :maxlength="20"
            @update:model-value="updateField('nickname', $event)"
          />
        </view>

        <view class="form-item">
          <text class="label">
            性别
          </text>
          <view class="gender-selector">
            <wd-radio-group
              :model-value="formData.gender"
              shape="button"
              @update:model-value="updateField('gender', $event)"
            >
              <wd-radio value="male">
                👨 男
              </wd-radio>
              <wd-radio value="female">
                👩 女
              </wd-radio>
            </wd-radio-group>
          </view>
        </view>

        <view class="form-item">
          <text class="label">
            出壳日 🥚
          </text>
          <wd-input
            :model-value="formData.birthday"
            placeholder="请选择出壳日"
            readonly
            @click="onTimeFieldClick('birthday')"
          />
        </view>
      </view>

      <!-- 身体数据分组 -->
      <view class="info-group">
        <view class="group-title">
          📊 身体数据
        </view>

        <view class="form-item">
          <text class="label">
            身高 (cm)
          </text>
          <wd-input
            :model-value="formData.height"
            type="number"
            placeholder="如：170"
            :maxlength="3"
            @update:model-value="updateField('height', $event)"
          />
        </view>

        <view class="form-item">
          <text class="label">
            当前体重 (kg)
          </text>
          <wd-input
            :model-value="formData.currentWeight"
            type="digit"
            placeholder="如：65.5"
            :maxlength="5"
            @update:model-value="updateField('currentWeight', $event)"
          />
        </view>

        <view class="form-item">
          <text class="label">
            目标体重 (kg)
          </text>
          <wd-input
            :model-value="formData.targetWeight"
            type="digit"
            placeholder="如：60.0"
            :maxlength="5"
            @update:model-value="updateField('targetWeight', $event)"
          />
        </view>

        <view v-if="bmiStatus" class="bmi-tip">
          <text class="bmi-label">
            BMI 状态：
          </text>
          <text class="bmi-value" :style="{ color: bmiStatus.color }">
            {{ bmiStatus.text }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.step-content {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
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
    font-size: 48rpx;
    font-weight: bold;
    color: var(--text-primary);
  }
}

.form-section {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  &.scrollable {
    max-height: calc(100vh - 400rpx);
  }
}

.info-group {
  padding: 30rpx;
  .group-title {
    font-size: 38rpx;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
}

.form-item {
  margin-bottom: 24rpx;

  .label {
    display: block;
    font-size: 32rpx;
    color: var(--text-secondary);
    margin-bottom: 12rpx;
  }
}

.gender-selector {
  display: flex;

  :deep(.wd-radio__label) {
    font-size: 28rpx;
  }
}

.bmi-tip {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 16rpx;
  background-color: var(--bg-color-light);
  border-radius: 8rpx;

  .bmi-label {
    font-size: 26rpx;
    color: var(--text-color);
    margin-right: 10rpx;
  }

  .bmi-value {
    font-size: 26rpx;
    font-weight: bold;
  }
}
</style>
