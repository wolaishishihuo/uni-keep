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
            v-model="formData.nickname"
            placeholder="请输入您的昵称"
            :maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="label">
            性别
          </text>
          <view class="gender-selector">
            <view class="buttons w-full gap-20rpx flex-row!">
              <button class="btn p-0! font-400!" :class="{ 'btn-primary': formData.gender === 'male' }" @click="formData.gender = 'male'">
                👨 男
              </button>
              <button class="btn p-0! font-400!" :class="{ 'btn-primary': formData.gender === 'female' }" @click="formData.gender = 'female'">
                👩 女
              </button>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="label">
            出壳日 🥚
          </text>
          <wd-input
            v-model="formData.birthday"
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
            v-model="formData.height"
            type="number"
            placeholder="如：170"
            :maxlength="3"
          />
        </view>

        <view class="form-item">
          <text class="label">
            当前体重 (kg)
          </text>
          <wd-input
            v-model="formData.currentWeight"
            type="digit"
            placeholder="如：65.5"
            :maxlength="5"
          />
        </view>

        <view class="form-item">
          <text class="label">
            目标体重 (kg)
          </text>
          <wd-input
            v-model="formData.targetWeight"
            type="digit"
            placeholder="如：60.0"
            :maxlength="5"
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

<script setup lang="ts">
import { useSetupForm } from '../hooks/useSetupForm';

defineOptions({
  name: 'PersonalInfoStep'
});

defineProps<{
  bmiStatus: { text: string; color: string } | null;
}>();
const emit = defineEmits<{
  'select-time': [field: string];
}>();

const { formData } = useSetupForm();

// 点击时间字段，打开时间选择器
function onTimeFieldClick(field: string) {
  emit('select-time', field);
}
</script>

<style lang="scss" scoped>
.info-group {
  .group-title {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
}

.form-item {
  margin-bottom: 24rpx;

  .label {
    display: block;
    font-size: 28rpx;
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
