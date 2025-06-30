<script setup lang="ts">
import { computed, ref } from 'vue';
import { toast } from '@/utils/toast';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'complete', data: any): void;
  (e: 'skip'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 显示状态
const show = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

// 步骤相关
const currentStep = ref(1);
const totalSteps = 3;
const saving = ref(false);

// 表单数据
const formData = ref({
  height: '',
  currentWeight: '',
  targetWeight: '',
  enableNotification: true,
  fastingStart: '08:00',
  fastingEnd: '18:00',
  weightRecord: '07:00'
});

// 时间选择器
const showTimePicker = ref(false);
const timePickerValue = ref('');
const currentTimeField = ref('');

// 选择时间
function selectTime(field: string) {
  currentTimeField.value = field;
  timePickerValue.value = formData.value[field];
  showTimePicker.value = true;
}

// 时间确认
function onTimeConfirm({ value }) {
  formData.value[currentTimeField.value] = value;
  showTimePicker.value = false;
}

// 下一步
async function nextStep() {
  if (currentStep.value === 1) {
    // 验证第一步
    if (!validateStep1())
      return;
    currentStep.value++;
  }
  else if (currentStep.value === 2) {
    currentStep.value++;
  }
  else {
    // 完成设置
    await completeSetup();
  }
}

// 上一步
function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

// 验证第一步
function validateStep1() {
  const { height, currentWeight, targetWeight } = formData.value;

  if (!height || Number(height) < 100 || Number(height) > 250) {
    toast.error('请输入有效的身高(100-250cm)');
    return false;
  }

  if (!currentWeight || Number(currentWeight) < 20 || Number(currentWeight) > 500) {
    toast.error('请输入有效的当前体重(20-500kg)');
    return false;
  }

  if (!targetWeight || Number(targetWeight) < 20 || Number(targetWeight) > 500) {
    toast.error('请输入有效的目标体重(20-500kg)');
    return false;
  }

  return true;
}

// 完成设置
async function completeSetup() {
  try {
    saving.value = true;

    const setupData = {
      height: Number(formData.value.height),
      currentWeight: Number(formData.value.currentWeight),
      targetWeight: Number(formData.value.targetWeight),
      reminderSettings: {
        enableNotification: formData.value.enableNotification,
        fastingStart: formData.value.fastingStart,
        fastingEnd: formData.value.fastingEnd,
        weightRecord: formData.value.weightRecord
      }
    };

    emit('complete', setupData);
    show.value = false;

    // 重置表单
    resetForm();
  }
  catch (error) {
    console.error('设置失败:', error);
    toast.error('设置失败，请重试');
  }
  finally {
    saving.value = false;
  }
}

// 跳过设置
function skipSetup() {
  emit('skip');
  show.value = false;
  resetForm();
}

// 重置表单
function resetForm() {
  currentStep.value = 1;
  formData.value = {
    height: '',
    currentWeight: '',
    targetWeight: '',
    enableNotification: true,
    fastingStart: '08:00',
    fastingEnd: '18:00',
    weightRecord: '07:00'
  };
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="center"
    custom-style="border-radius: 24rpx; width: 90%; max-width: 640rpx;"
    :close-on-click-modal="false"
  >
    <view class="quick-setup-modal">
      <!-- 头部 -->
      <view class="modal-header">
        <text class="modal-title">
          完善个人信息
        </text>
        <text class="modal-subtitle">
          设置基础信息，获得更好的体验
        </text>
        <view class="progress-bar">
          <view
            class="progress-fill"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          />
        </view>
        <text class="progress-text">
          {{ currentStep }}/{{ totalSteps }}
        </text>
      </view>

      <!-- 内容区域 -->
      <view class="modal-content">
        <!-- 第一步：身体数据 -->
        <view v-if="currentStep === 1" class="setup-step">
          <view class="step-title">
            📏 身体数据
          </view>
          <view class="input-group">
            <view class="input-item">
              <text class="label">
                身高 (cm)
              </text>
              <wd-input
                v-model="formData.height"
                type="number"
                placeholder="请输入身高"
                size="large"
              />
            </view>
            <view class="input-item">
              <text class="label">
                当前体重 (kg)
              </text>
              <wd-input
                v-model="formData.currentWeight"
                type="number"
                placeholder="请输入当前体重"
                size="large"
              />
            </view>
            <view class="input-item">
              <text class="label">
                目标体重 (kg)
              </text>
              <wd-input
                v-model="formData.targetWeight"
                type="number"
                placeholder="请输入目标体重"
                size="large"
              />
            </view>
          </view>
        </view>

        <!-- 第二步：提醒设置 -->
        <view v-if="currentStep === 2" class="setup-step">
          <view class="step-title">
            ⏰ 提醒设置
          </view>
          <view class="reminder-group">
            <view class="reminder-item">
              <text class="label">
                开启提醒
              </text>
              <wd-switch v-model="formData.enableNotification" />
            </view>
            <template v-if="formData.enableNotification">
              <view class="reminder-item">
                <text class="label">
                  断食开始提醒
                </text>
                <wd-input
                  v-model="formData.fastingStart"
                  placeholder="08:00"
                  size="large"
                  readonly
                  @click="selectTime('fastingStart')"
                />
              </view>
              <view class="reminder-item">
                <text class="label">
                  断食结束提醒
                </text>
                <wd-input
                  v-model="formData.fastingEnd"
                  placeholder="18:00"
                  size="large"
                  readonly
                  @click="selectTime('fastingEnd')"
                />
              </view>
              <view class="reminder-item">
                <text class="label">
                  体重记录提醒
                </text>
                <wd-input
                  v-model="formData.weightRecord"
                  placeholder="07:00"
                  size="large"
                  readonly
                  @click="selectTime('weightRecord')"
                />
              </view>
            </template>
          </view>
        </view>

        <!-- 第三步：完成 -->
        <view v-if="currentStep === 3" class="setup-step">
          <view class="step-title">
            🎉 设置完成
          </view>
          <view class="complete-content">
            <view class="complete-icon">
              ✨
            </view>
            <text class="complete-text">
              太棒了！你已经完成了基础设置
            </text>
            <text class="complete-desc">
              现在可以开始你的健康管理之旅
            </text>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="modal-footer">
        <wd-button
          v-if="currentStep > 1"
          type="info"
          size="large"
          plain
          custom-style="flex: 1; margin-right: 16rpx;"
          @click="prevStep"
        >
          上一步
        </wd-button>

        <wd-button
          type="primary"
          size="large"
          :custom-style="currentStep === 1 ? 'flex: 1;' : 'flex: 2;'"
          :loading="saving"
          @click="nextStep"
        >
          {{ currentStep === totalSteps ? '开始使用' : currentStep === 1 ? '下一步' : '下一步' }}
        </wd-button>

        <wd-button
          v-if="currentStep === 1"
          type="info"
          size="large"
          plain
          custom-style="margin-left: 16rpx;"
          @click="skipSetup"
        >
          跳过
        </wd-button>
      </view>

      <!-- 时间选择器 -->
      <wd-datetime-picker
        v-model="timePickerValue"
        :show="showTimePicker"
        type="time"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.quick-setup-modal {
  padding: 40rpx;
  background: white;
  border-radius: 24rpx;
}

.modal-header {
  text-align: center;
  margin-bottom: 40rpx;

  .modal-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .modal-subtitle {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 32rpx;
  }

  .progress-bar {
    height: 8rpx;
    background: #f5f5f5;
    border-radius: 4rpx;
    margin-bottom: 16rpx;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 4rpx;
      transition: width 0.3s ease;
    }
  }

  .progress-text {
    font-size: 24rpx;
    color: #999;
  }
}

.modal-content {
  margin-bottom: 40rpx;
}

.setup-step {
  .step-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 32rpx;
    text-align: center;
  }
}

.input-group {
  .input-item {
    margin-bottom: 32rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
    }
  }
}

.reminder-group {
  .reminder-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .label {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.complete-content {
  text-align: center;
  padding: 40rpx 0;

  .complete-icon {
    font-size: 80rpx;
    margin-bottom: 24rpx;
  }

  .complete-text {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
  }

  .complete-desc {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.modal-footer {
  display: flex;
  gap: 16rpx;
}
</style>
