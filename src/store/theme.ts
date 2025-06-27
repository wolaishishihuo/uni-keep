import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDarkerColor, getLighterColor } from '@/utils/colorUtils';
import { applyThemeToMiniProgram } from '@/utils/theme';

// 主题配置
const THEME_CONFIG = {
  male: {
    color: '#4195e1', // 清新蓝
    name: '清新蓝'
  },
  female: {
    color: '#ff6b9d', // 少女粉
    name: '少女粉'
  }
} as const;

type Gender = keyof typeof THEME_CONFIG;

// 从缓存获取性别主题
function getGenderTheme(): Gender {
  const savedGender = uni.getStorageSync('genderTheme');
  return (savedGender && savedGender in THEME_CONFIG) ? savedGender : 'male';
}

// 从缓存获取主题色
function getThemeColor(): string {
  const gender = getGenderTheme();
  const savedColor = uni.getStorageSync('themeColor');
  return savedColor || THEME_CONFIG[gender].color;
}

// 保存主题色到缓存
function setThemeColorCache(color: string) {
  uni.setStorageSync('themeColor', color);
}

// 保存性别主题到缓存
function setGenderThemeCache(gender: Gender) {
  uni.setStorageSync('genderTheme', gender);
}

export const useThemeStore = defineStore('theme', () => {
  // 性别主题
  const gender = ref<Gender>(getGenderTheme());
  // 主题色
  const primaryColor = ref<string>(getThemeColor());

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color;
    setThemeColorCache(color);

    // 检测运行环境，区分处理
    if (typeof document !== 'undefined') {
    // H5环境
      document.documentElement.style.setProperty('--keep-primary', color);

      // 计算衍生色
      const lighterColor = getLighterColor(color, 0.8);
      const darkerColor = getDarkerColor(color, 0.8);
      document.documentElement.style.setProperty('--keep-primary-light', lighterColor);
      document.documentElement.style.setProperty('--keep-primary-dark', darkerColor);
    }
    else {
      // 小程序环境
      applyThemeToMiniProgram(color);
    }
  };

  // 设置性别主题
  const setGender = (newGender: Gender) => {
    gender.value = newGender;
    setGenderThemeCache(newGender);

    // 自动设置对应的主题色
    const themeColor = THEME_CONFIG[newGender].color;
    setPrimaryColor(themeColor);

    uni.showToast({
      title: `已切换至${THEME_CONFIG[newGender].name}主题`,
      icon: 'none',
      duration: 1500
    });
  };

  // 切换主题（在男女主题之间切换）
  const toggleTheme = () => {
    const newGender = gender.value === 'male' ? 'female' : 'male';
    setGender(newGender);
  };

  // 初始化，应用主题色
  const initTheme = () => {
    console.log('initTheme', primaryColor.value, gender.value);
    setPrimaryColor(primaryColor.value);
  };

  // 获取当前主题信息
  const getCurrentThemeInfo = () => {
    return {
      gender: gender.value,
      color: primaryColor.value,
      name: THEME_CONFIG[gender.value].name
    };
  };

  return {
    gender,
    primaryColor,
    setGender,
    setPrimaryColor,
    toggleTheme,
    initTheme,
    getCurrentThemeInfo,
    THEME_CONFIG
  };
});
