<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  // v-model 绑定值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 标签文本
  label: {
    type: String,
    default: ''
  },
  // 输入框类型
  type: {
    type: String,
    default: 'text'
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请输入'
  },
  // 错误提示
  error: {
    type: String,
    default: ''
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false
  },
  // 只读状态
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

// 生成唯一ID
const id = computed(() => `input-${Math.random().toString(36).substring(2, 9)}`);

// 输入事件处理
function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

// 失去焦点事件
function onBlur(e: Event) {
  emit('blur', e);
}

// 获得焦点事件
function onFocus(e: Event) {
  emit('focus', e);
}
</script>

<template>
  <div class="form-item" :class="{ 'form-item-error': error }">
    <label v-if="label" class="label" :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        class="input"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      >
      <slot name="suffix" />
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  &-error {
    .input {
      border-color: #ff4d4f;
    }
  }
}

.label {
  display: block;
  font-size: 0.95rem;
  color: #595959;
  margin-bottom: 8px;
  font-weight: normal;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: var(--primary-color, #4195e1);
    box-shadow: 0 0 0 2px rgba(65, 149, 225, 0.2);
  }

  &:disabled, &[readonly] {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: #a0a0a0;
  }
}

.error-message {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #ff4d4f;
}
</style>
