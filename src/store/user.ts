import type { IUserInfoVo } from '@/api/login.typings';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getWxAuth
} from '@/api/login';
import { toast } from '@/utils/toast';

// 初始化用户信息
const initialUserInfo: IUserInfoVo = {
  id: 0,
  username: '游客',
  avatar: '/static/images/default-avatar.png',
  token: '',
  level: 1,
  continuousDays: 0,
  totalDays: 0,
  partner: '',
  isConnected: false
};

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息状态
    const userInfo = ref<IUserInfoVo>({ ...initialUserInfo });

    // 微信用户信息
    const wxUserInfo = ref<UniApp.GetUserProfileRes | null>(null);

    // 是否登录
    const isLoggedIn = computed(() => {
      return userInfo.value.token !== '';
    });

    // 设置用户信息
    const setUserInfo = (val: IUserInfoVo) => {
      userInfo.value = val;
    };

    // 微信授权登录
    const wxLogin = async () => {
      try {
        // 1. 获取微信授权
        const wxAuthRes = await getWxAuth();
        console.log('微信授权结果:', wxAuthRes);
        // 2. 获取微信登录凭证
        // console.log('获取微信登录凭证');
        // const wxCodeRes = await getWxCode();
        // console.log('微信登录code:', wxCodeRes.code);
        // // 2. 获取用户信息授权
        // console.log('开始微信用户信息授权');
        // const wxInfo = await getWxUserInfo();
        // wxUserInfo.value = wxInfo;

        // 3. 临时设置微信用户信息到userInfo
        // setUserInfo({
        //   id: 0,
        //   username: wxInfo.userInfo.nickName,
        //   avatar: wxInfo.userInfo.avatarUrl,
        //   token: '',
        //   level: 1,
        //   continuousDays: 0,
        //   totalDays: 0,
        //   partner: '',
        //   isConnected: false
        // });

        // toast.success('微信授权成功');
        // return { wxInfo, code: wxCodeRes.code };
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
      setUserInfo,
      wxLogin,
      isLoggedIn
    };
  },
  {
    persist: true
  }
);
