<script setup lang="ts">
import type { TimePickerType } from './types';
import { computed, ref, watch } from 'vue';

// Props 接口
interface Props {
  modelValue?: string;
  show?: boolean;
  type?: TimePickerType;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  minHour?: number;
  maxHour?: number;
  minMinute?: number;
  maxMinute?: number;
  formatter?: (type: string, value: string) => string;
  filter?: (type: string, values: number[]) => number[];
}

// Emits 接口
interface Emits {
  'update:modelValue': [value: string];
  'update:show': [show: boolean];
  'confirm': [value: string];
  'cancel': [];
  'change': [value: string];
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 'time',
  title: '请选择',
  confirmText: '确定',
  cancelText: '取消',
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59
});

const emit = defineEmits<Emits>();

// 内部状态
const innerValue = ref(props.modelValue || '08:00');
const visible = computed({
  get: () => props.show,
  set: value => emit('update:show', value)
});

// 监听外部值变化，更新内部值
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      innerValue.value = newValue;
    }
  },
  { immediate: true }
);

// 监听内部值变化，触发 change 事件
watch(
  () => innerValue.value,
  (newValue) => {
    emit('change', newValue);
  }
);

// 确认选择
function onConfirm() {
  emit('update:modelValue', innerValue.value);
  emit('confirm', innerValue.value);
  visible.value = false;
}

// 取消选择
function onCancel() {
  // 恢复到原始值
  innerValue.value = props.modelValue || '08:00';
  emit('cancel');
  visible.value = false;
}

// 打开选择器
function open(initialValue?: string) {
  if (initialValue !== undefined) {
    innerValue.value = initialValue;
  }
  visible.value = true;
}

// 关闭选择器
function close() {
  visible.value = false;
}

// 暴露方法给父组件
defineExpose({
  open,
  close
});
</script>

<template>
  <wd-popup
    v-model="visible"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="onCancel"
  >
    <view class="time-picker-container">
      <view class="time-picker-header">
        <text class="time-picker-cancel" @click="onCancel">
          {{ cancelText }}
        </text>
        <text class="time-picker-title">
          {{ title }}
        </text>
        <text class="time-picker-confirm" @click="onConfirm">
          {{ confirmText }}
        </text>
      </view>
      <wd-datetime-picker-view
        v-model="innerValue"
        :type="type"
        :min-hour="minHour"
        :max-hour="maxHour"
        :min-minute="minMinute"
        :max-minute="maxMinute"
        :formatter="formatter"
        :filter="filter"
      />
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.time-picker-container {
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.time-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  background: #f8f9fa;
  border-bottom: 2rpx solid #e9ecef;
}

.time-picker-cancel,
.time-picker-confirm {
  font-size: 32rpx;
  color: #667eea;
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;

  &:active {
    opacity: 0.7;
    background: rgba(102, 126, 234, 0.1);
  }
}

.time-picker-cancel {
  color: #6c757d;

  &:active {
    background: rgba(108, 117, 125, 0.1);
  }
}

.time-picker-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  flex: 1;
  text-align: center;
}

// 深色主题适配
.theme-dark {
  .time-picker-container {
    background: #2d3748;
  }

  .time-picker-header {
    background: #1a202c;
    border-bottom-color: #4a5568;
  }

  .time-picker-title {
    color: #e2e8f0;
  }

  .time-picker-cancel {
    color: #a0aec0;
  }

  .time-picker-confirm {
    color: #81e6d9;
  }
}
</style>
