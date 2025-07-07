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
  validateStep,
  saveUserProfile
} = useSetupForm();

// 步骤导航逻辑
const {
  currentStep,
  totalSteps,
  nextStep,
  prevStep
} = useStepNavigation(4, validateStep, saveUserProfile);

// 时间选择器逻辑
const { showTimePicker, currentField, openTimePicker: selectTime, onTimeConfirm, onTimeCancel } = useTimePicker(formData);

// 页面加载
onLoad(() => {
  initFormData(userInfo.value);
});
</script>

<template>
  <view
    class="setup-container"
    :style="{ paddingTop: `${safeAreaInsets?.top || 0}px` }"
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
      </view>
    </view>

    <!-- 消息提示区域 -->
    <MessageDisplay :messages="messages" />

    <!-- 内容区域 -->
    <view class="content">
      <!-- 步骤1：个人信息 -->
      <PersonalInfoStep
        v-show="currentStep === 1"
        :bmi-status="bmiStatus"
        @select-time="selectTime"
      />

      <!-- 步骤2：断食计划 -->
      <FastingPlanStep
        v-show="currentStep === 2"
      />

      <!-- 步骤3：提醒设置 -->
      <NotificationStep
        v-show="currentStep === 3"
        :form-data="formData"
        @select-time="selectTime"
      />

      <!-- 步骤4：完成 -->
      <CompletionStep
        v-show="currentStep === 4"
      />
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <view class="buttons flex-row">
        <button
          v-if="currentStep > 1"
          class="btn btn-secondary flex-1"
          @click="prevStep"
        >
          上一步
        </button>
        <button
          class="btn btn-primary flex-1"
          @click="nextStep"
        >
          {{ currentStep === totalSteps ? (saving ? '设置中...' : '开始体验') : '下一步' }}
        </button>
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
