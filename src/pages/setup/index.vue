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
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';
import { useSetupForm } from './hooks/useSetupForm';

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

// 设置表单逻辑
const {
  currentStep,
  totalSteps,
  saving,
  formData,
  bmiStatus,
  nextStep,
  prevStep,
  skipSetup,
  initFormData,
  messages,
  hideMessage
} = useSetupForm();

const { showTimePicker, currentField, openTimePicker: selectTime, onTimeConfirm, onTimeCancel } = useTimePicker(formData);

// 格式化时间显示
function formatTimeDisplay(time: string) {
  if (!time)
    return '08:00';
  // 如果是日期时间格式，提取时间部分
  if (time.includes(' ')) {
    return time.split(' ')[1]?.substring(0, 5) || '08:00';
  }
  return time;
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
    <MessageDisplay :messages="messages" @close="hideMessage" />

    <!-- 内容区域 -->
    <view class="content">
      <!-- 步骤1：个人信息 -->
      <view v-if="currentStep === 1" key="step1" class="step-content">
        <view class="step-header">
          <view class="step-icon">
            👤
          </view>
          <text class="step-title">
            个人信息
          </text>
        </view>

        <view class="form-section" :class="{ scrollable: currentStep === 1 }">
          <!-- 基础信息分组 -->
          <view class="info-group">
            <text class="group-title">
              📝 基础信息
            </text>

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
                <wd-radio-group v-model="formData.gender" shape="button">
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
                出壳日 🥚 {{ formData.birthday }}
              </text>
              <wd-input
                v-model="formData.birthday"
                placeholder="请选择出壳日"
                readonly
                @click="selectTime('birthday')"
              />
            </view>
          </view>

          <!-- 身体数据分组 -->
          <view class="info-group">
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
