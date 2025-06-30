<route lang="json5">
{
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '完善个人信息'
  }
}
</route>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';
import { toast } from '@/utils/toast';

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
const timePickerValue = ref('08:00');
const currentTimeField = ref('');

// 格式化时间显示
function formatTimeDisplay(time: string) {
  if (!time)
    return '08:00';
  return time;
}

// 选择时间
function selectTime(field: string) {
  currentTimeField.value = field;
  timePickerValue.value = formData.value[field] || '08:00';
  showTimePicker.value = true;
}

// 时间确认
function onTimeConfirm({ value }) {
  if (value && currentTimeField.value) {
    formData.value[currentTimeField.value] = value;
  }
  showTimePicker.value = false;
}

// 时间取消
function onTimeCancel() {
  showTimePicker.value = false;
}

// 下一步
async function nextStep() {
  try {
    if (currentStep.value === 1) {
      if (!validateStep1())
        return;
      uni.vibrateShort({ type: 'light' });
      currentStep.value++;
    }
    else if (currentStep.value === 2) {
      uni.vibrateShort({ type: 'light' });
      currentStep.value++;
    }
    else {
      await completeSetup();
    }
  }
  catch (error) {
    console.error('步骤处理失败:', error);
    toast.error('操作失败，请重试');
  }
}

// 上一步
function prevStep() {
  if (currentStep.value > 1) {
    uni.vibrateShort({ type: 'light' });
    currentStep.value--;
  }
}

// 验证第一步
function validateStep1() {
  const { height, currentWeight, targetWeight } = formData.value;

  if (!height || Number(height) < 100 || Number(height) > 250) {
    toast.error('请输入有效的身高 (100-250cm)');
    return false;
  }

  if (!currentWeight || Number(currentWeight) < 20 || Number(currentWeight) > 500) {
    toast.error('请输入有效的当前体重 (20-500kg)');
    return false;
  }

  if (!targetWeight || Number(targetWeight) < 20 || Number(targetWeight) > 500) {
    toast.error('请输入有效的目标体重 (20-500kg)');
    return false;
  }

  if (Math.abs(Number(targetWeight) - Number(currentWeight)) < 0.1) {
    toast.error('目标体重应与当前体重有所不同');
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

    const success = await userStore.quickSetupProfile(setupData);

    if (success) {
      uni.vibrateShort({ type: 'heavy' });
      toast.success('设置完成！欢迎使用坚持有你');

      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 2000);
    }
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
  uni.showModal({
    title: '确认跳过设置',
    content: '跳过设置将无法使用完整功能，您可以随时在个人中心完善信息',
    cancelText: '继续设置',
    confirmText: '跳过',
    confirmColor: '#fa5151',
    success: (res) => {
      if (res.confirm) {
        uni.vibrateShort({ type: 'light' });
        uni.reLaunch({ url: '/pages/index/index' });
      }
    }
  });
}

// 计算BMI显示状态
const bmiStatus = computed(() => {
  const { height, currentWeight } = formData.value;
  if (!height || !currentWeight)
    return null;

  const h = Number(height) / 100;
  const w = Number(currentWeight);
  const bmi = w / (h * h);

  if (bmi < 18.5)
    return { text: '偏瘦', color: '#74b9ff' };
  if (bmi < 24)
    return { text: '正常', color: '#00b894' };
  if (bmi < 28)
    return { text: '超重', color: '#fdcb6e' };
  return { text: '肥胖', color: '#e17055' };
});

// 页面加载
onLoad(() => {
  console.log('设置引导页面加载完成');

  if (userInfo.value?.height && userInfo.value?.currentWeight && userInfo.value?.targetWeight) {
    toast.success('您已完成初始设置');
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' });
    }, 1000);
    return;
  }

  if (userInfo.value?.height) {
    formData.value.height = userInfo.value.height.toString();
  }
  if (userInfo.value?.currentWeight) {
    formData.value.currentWeight = userInfo.value.currentWeight.toString();
  }
  if (userInfo.value?.targetWeight) {
    formData.value.targetWeight = userInfo.value.targetWeight.toString();
  }
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

    <!-- 内容区域 -->
    <view class="content">
      <!-- 步骤1：身体数据 -->
      <view v-if="currentStep === 1" key="step1" class="step-content">
        <view class="step-header">
          <view class="step-icon">
            📊
          </view>
          <text class="step-title">
            身体数据
          </text>
        </view>

        <view class="form-section">
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

      <!-- 步骤2：提醒设置 -->
      <view v-if="currentStep === 2" key="step2" class="step-content">
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
            <wd-switch v-model="formData.enableNotification" active-color="#667eea" />
          </view>

          <view v-if="formData.enableNotification" class="time-settings">
            <view class="time-group">
              <text class="group-title">
                🍽 断食时间
              </text>
              <view class="time-item" @click="selectTime('fastingStart')">
                <text class="time-label">
                  开始时间
                </text>
                <text class="time-value">
                  {{ formatTimeDisplay(formData.fastingStart) }}
                </text>
              </view>
              <view class="time-item" @click="selectTime('fastingEnd')">
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
              <view class="time-item" @click="selectTime('weightRecord')">
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

      <!-- 步骤3：完成 -->
      <view v-if="currentStep === 3" key="step3" class="step-content">
        <view class="complete-section">
          <view class="success-icon">
            🎉
          </view>
          <text class="complete-title">
            设置完成！
          </text>
          <text class="complete-desc">
            您的专属健康计划已准备就绪
          </text>

          <view class="feature-preview">
            <view class="feature-item">
              <view class="feature-icon">
                📱
              </view>
              <text class="feature-text">
                个性化断食计时
              </text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                📈
              </view>
              <text class="feature-text">
                体重趋势分析
              </text>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                🏆
              </view>
              <text class="feature-text">
                成就徽章收集
              </text>
            </view>
          </view>
        </view>
      </view>
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
          :custom-style="currentStep === 1 ? 'flex: 1;' : 'flex: 2;'"
          :loading="saving"
          :disabled="saving"
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
    <wd-datetime-picker
      v-if="showTimePicker"
      v-model="timePickerValue"
      :show="showTimePicker"
      type="time"
      title="选择时间"
      @confirm="onTimeConfirm"
      @cancel="onTimeCancel"
    />
  </view>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
