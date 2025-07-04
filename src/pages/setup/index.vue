<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '完善个人信息'
  }
}
</route>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import MessageDisplay from '@/components/message-display/index.vue';
import TimePicker from '@/components/time-picker/index.vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTimePicker } from '@/hooks/useTimePicker';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';

// 引入拆分后的组件
import CompletionStep from './components/CompletionStep.vue';
import FastingPlanStep from './components/FastingPlanStep.vue';
import NotificationStep from './components/NotificationStep.vue';
import PersonalInfoStep from './components/PersonalInfoStep.vue';

// 引入拆分后的hooks
import { useSetupForm } from './hooks/useSetupForm';
import { useStepNavigation } from './hooks/useStepNavigation';

defineOptions({
  name: 'Setup'
});

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);

// 用户状态管理
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 表单数据管理
const {
  formData,
  saving,
  bmiStatus,
  messages,
  initFormData,
  updateFormData,
  validateStep,
  saveUserProfile
} = useSetupForm();

// 步骤导航逻辑
const {
  currentStep,
  totalSteps,
  canMoveNext,
  nextStep,
  prevStep,
  skipSetup
} = useStepNavigation(4, validateStep, saveUserProfile);

// 时间选择器逻辑
const { showTimePicker, currentField, openTimePicker: selectTime, onTimeConfirm, onTimeCancel } = useTimePicker(formData);

// 处理字段更新
function handleUpdateField(field, value) {
  updateFormData(field, value);
}

// 断食计划选择处理
function handlePlanSelect(planId) {
  updateFormData('fastingPlanId', planId);
}

// 页面加载
onLoad(() => {
  initFormData(userInfo.value);
});
</script>

<template>
  <view
    class="setup-container"
    :style="{ paddingTop: `${safeAreaInsets?.top || 0}px`, height: `calc(100vh - ${safeAreaInsets?.top || 0}px)` }"
    :class="themeClassName"
  >
    <!-- 顶部区域 -->
    <view class="header">
      <text class="welcome-text">
        欢迎使用坚持有你
      </text>
      <text class="subtitle">
        完善信息，为您量身定制健康计划
      </text>

      <!-- 简单进度条 -->
      <view class="progress-area">
        <view class="progress-steps">
          <view
            v-for="step in totalSteps"
            :key="step"
            class="step-line"
            :class="{ completed: step <= currentStep }"
          />
        </view>
        <text class="step-text">
          {{ currentStep }}/{{ totalSteps }}
        </text>
      </view>
    </view>

    <!-- 消息提示区域 -->
    <MessageDisplay :messages="messages" />

    <!-- 内容区域 -->
    <view class="content">
      <!-- 步骤1：个人信息 -->
      <PersonalInfoStep
        v-show="currentStep === 1"
        :form-data="formData"
        :bmi-status="bmiStatus"
        @select-time="selectTime"
        @update:field="handleUpdateField"
      />

      <!-- 步骤2：断食计划 -->
      <FastingPlanStep
        v-show="currentStep === 2"
        :form-data="formData"
        @select-plan="handlePlanSelect"
      />

      <!-- 步骤3：提醒设置 -->
      <NotificationStep
        v-show="currentStep === 3"
        :form-data="formData"
        @select-time="selectTime"
        @update:field="handleUpdateField"
      />

      <!-- 步骤4：完成 -->
      <CompletionStep
        v-show="currentStep === 4"
      />
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <view class="button-row">
        <wd-button
          v-if="currentStep > 1"
          type="info"
          size="large"
          plain
          custom-style="flex: 1; margin-right: 12rpx;"
          @click="prevStep"
        >
          上一步
        </wd-button>

        <wd-button
          type="primary"
          size="large"
          custom-style="flex: 1;"
          :loading="saving"
          :disabled="saving || !canMoveNext"
          @click="nextStep"
        >
          {{ currentStep === totalSteps ? (saving ? '设置中...' : '开始体验') : '下一步' }}
        </wd-button>
      </view>

      <view v-if="currentStep === 1" class="skip-area">
        <text class="skip-link" @click="skipSetup">
          暂时跳过
        </text>
      </view>
    </view>

    <!-- 时间选择器 -->
    <TimePicker
      v-if="showTimePicker"
      v-model="formData[currentField]"
      :show="showTimePicker"
      :type="currentField === 'birthday' ? 'date' : 'time'"
      :title="currentField === 'birthday' ? '选择出壳日' : '选择时间'"
      @update:show="showTimePicker = $event"
      @confirm="onTimeConfirm"
      @cancel="onTimeCancel"
    />
  </view>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
