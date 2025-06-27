<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/store/theme';
import FgTabbar from './fg-tabbar/fg-tabbar.vue';

// 主题管理
const themeStore = useThemeStore();
const { primaryColor } = storeToRefs(themeStore);

// 动态主题变量
const themeVars = computed<ConfigProviderThemeVars>(() => ({
  colorTheme: primaryColor.value,
  tabbarItemActiveColor: primaryColor.value,
  tabbarItemInactiveColor: '#999999'
}));
</script>

<template>
  <wd-config-provider :theme-vars="themeVars">
    <slot />
    <FgTabbar />
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>
