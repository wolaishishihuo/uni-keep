import type { UserProfile } from '@/models/user';
import { defineStore } from 'pinia';
import {
  getWxCode,
  getWxUserInfo,
  login,
  updateInfo
} from '@/api/login';
import { toast } from '@/utils/toast';
import { isNewUser, isUserProfileComplete, validateUserUpdateData } from '@/utils/userProfile';
import { useThemeStore } from './theme';

// 初始化用户信息
const initialUserInfo: UserProfile = {
  id: '0',
  wxOpenId: '',
  nickname: '游客',
  avatar: '/static/images/default-avatar.png',
  height: 0,
  targetWeight: 0,
  currentWeight: 0,
  gender: 'male',
  coupleId: '',
  createdAt: '',
  updatedAt: ''
};

export const useUserStore = defineStore(
  'user',
  () => {
    const themeStore = useThemeStore();

    // 用户信息状态
    const userInfo = ref<UserProfile>({ ...initialUserInfo });

    // 微信用户信息
    const wxUserInfo = ref<UniApp.GetUserProfileRes | null>(null);

    const token = ref('');

    // 是否登录
    const isLoggedIn = computed(() => {
      return token.value !== '';
    });

    // 是否为新用户
    const isNewUserFlag = computed(() => {
      return isNewUser(userInfo.value);
    });

    // 用户信息是否完整
    const isProfileComplete = computed(() => {
      return isUserProfileComplete(userInfo.value);
    });

    // 设置用户信息
    const setUserInfo = (val: UserProfile) => {
      userInfo.value = val;
    };

    // 清除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...initialUserInfo };
      token.value = '';
    };

    // 批量更新用户信息
    const updateUserInfo = async (updateData: Partial<UserProfile>) => {
      try {
        // 验证数据
        const validation = validateUserUpdateData(updateData);
        if (!validation.valid) {
          toast.error(validation.message!);
          return false;
        }

        // 先更新本地状态
        const newUserInfo = {
          ...userInfo.value,
          ...updateData
        };
        setUserInfo(newUserInfo);

        // 调用API更新到服务器
        await updateInfo(newUserInfo);

        toast.success('信息更新成功');
        return true;
      }
      catch (error) {
        console.error('更新用户信息失败:', error);
        toast.error('更新失败，请重试');
        return false;
      }
    };

    // 快速设置用户信息（用于新用户引导）
    const quickSetupProfile = async (setupData: {
      height: number;
      currentWeight: number;
      targetWeight: number;
      reminderSettings?: any;
    }) => {
      try {
        const { reminderSettings, ...profileData } = setupData;

        // 更新用户基础信息
        const success = await updateUserInfo(profileData);

        if (success && reminderSettings) {
          // 保存提醒设置到本地存储
          uni.setStorageSync('user_reminder_settings', reminderSettings);
        }

        return success;
      }
      catch (error) {
        console.error('快速设置失败:', error);
        toast.error('设置失败，请重试');
        return false;
      }
    };

    // 处理登录后的页面导航
    const handlePostLoginNavigation = () => {
      if (isNewUser(userInfo.value) || !isUserProfileComplete(userInfo.value)) {
        console.log('用户信息不完整，跳转到设置页面');
        uni.reLaunch({
          url: '/pages/setup/index'
        });
      }
      else {
        // 用户信息完整 → 跳转到首页
        console.log('用户信息完整，跳转到首页');
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    };

    // 微信授权登录
    const wxLogin = async () => {
      try {
        toast.info('微信授权登录中...');
        // 1. 获取微信登录凭证
        // console.log('获取微信登录凭证');
        const wxCodeRes = await getWxCode();
        console.log('微信登录code:', wxCodeRes.code);
        // // 2. 获取用户信息授权
        // console.log('开始微信用户信息授权');
        const wxInfo = await getWxUserInfo();
        wxUserInfo.value = wxInfo;
        console.log('微信用户信息:', wxInfo);

        // 3. 登录
        const { data } = await login({
          code: wxCodeRes.code
        });

        console.log('登录结果:', {
          token: data.token,
          userInfo: data.userInfo
        });
        // 3. 临时设置微信用户信息到userInfo
        setUserInfo(data.userInfo);
        token.value = data.token;

        // 4. 设置主题色
        themeStore.setGenderTheme(userInfo.value.gender || 'male');
        toast.success('授权登录成功!');

        // 5. 根据用户信息完整性决定跳转页面
        handlePostLoginNavigation();
      }
      catch (error) {
        console.error('微信授权失败', error);
        toast.error('微信授权失败');
        throw error;
      }
    };

    return {
      userInfo,
      wxUserInfo,
      isLoggedIn,
      isNewUserFlag,
      isProfileComplete,
      token,
      setUserInfo,
      updateUserInfo,
      quickSetupProfile,
      wxLogin,
      handlePostLoginNavigation,
      clearUserInfo
    };
  },
  {
    persist: {
      key: 'user',
      paths: ['userInfo', 'token'],
      storage: localStorage
    }
  }
);
