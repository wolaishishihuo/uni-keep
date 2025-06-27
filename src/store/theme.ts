import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { applyThemeToMiniProgram } from '@/utils/theme';

// 主题配置
const THEME_CONFIG = {
  male: {
    name: '清新蓝',
    className: 'theme-male',
    color: '#4195e1'
  },
  female: {
    name: '少女粉',
    className: 'theme-female',
    color: '#ff6b9d'
  }
} as const;

type GenderTheme = keyof typeof THEME_CONFIG;

// 从缓存获取性别主题
function getCachedGenderTheme(): GenderTheme {
  const savedGender = uni.getStorageSync('genderTheme');
  return (savedGender && savedGender in THEME_CONFIG) ? savedGender : 'male';
}

// 缓存性别主题
function setCachedGenderTheme(gender: GenderTheme) {
  uni.setStorageSync('genderTheme', gender);
}

export const useThemeStore = defineStore('theme', () => {
  // 当前性别主题
  const genderTheme = ref<GenderTheme>(getCachedGenderTheme());

  // 计算属性：主题信息
  const themeInfo = computed(() => THEME_CONFIG[genderTheme.value]);

  // 计算属性：主题类名
  const themeClassName = computed(() => themeInfo.value.className);

  // 计算属性：主题颜色
  const themeColor = computed(() => themeInfo.value.color);

  // 计算属性：主题名称
  const themeName = computed(() => themeInfo.value.name);

  // 应用主题类名到页面根元素
  const applyThemeClass = () => {
    // #ifdef H5
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      // 移除所有主题类名
      Object.values(THEME_CONFIG).forEach((config) => {
        html.classList.remove(config.className);
      });
      // 添加当前主题类名
      html.classList.add(themeClassName.value);
    }
    // #endif

    // #ifdef MP-WEIXIN
    // 小程序端通过全局类名处理
    applyThemeToMiniProgram(themeColor.value);
    // #endif
  };

  // 设置性别主题
  const setGenderTheme = (gender: GenderTheme) => {
    genderTheme.value = gender;
    setCachedGenderTheme(gender);

    // 应用主题
    applyThemeClass();

    // 显示切换提示
    uni.showToast({
      title: `已切换至${THEME_CONFIG[gender].name}主题`,
      icon: 'none',
      duration: 1500
    });
  };

  // 切换性别主题（在男女主题间切换）
  const toggleGenderTheme = () => {
    const newGender = genderTheme.value === 'male' ? 'female' : 'male';
    setGenderTheme(newGender);
  };

  // 初始化主题
  const initTheme = () => {
    console.log('初始化主题:', genderTheme.value);
    applyThemeClass();
  };

  // 检查是否为指定性别主题
  const isGenderTheme = (gender: GenderTheme) => {
    return genderTheme.value === gender;
  };

  // 检查是否为男性主题
  const isMaleTheme = computed(() => genderTheme.value === 'male');

  // 检查是否为女性主题
  const isFemaleTheme = computed(() => genderTheme.value === 'female');

  return {
    // 状态
    genderTheme,

    // 计算属性
    themeInfo,
    themeClassName,
    themeColor,
    themeName,
    isMaleTheme,
    isFemaleTheme,

    // 方法
    setGenderTheme,
    toggleGenderTheme,
    initTheme,
    isGenderTheme,

    // 常量
    THEME_CONFIG
  };
});
