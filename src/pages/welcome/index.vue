<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useThemeStore } from '@/store/theme';

const { safeAreaInsets } = useSafeArea();

// 主题管理
const themeStore = useThemeStore();
const { themeClassName } = storeToRefs(themeStore);
</script>

<template>
  <view class="welcome-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }" :class="themeClassName">
    <text>欢迎使用坚持有你</text>
  </view>
</template>

<style scoped lang="scss"></style>
