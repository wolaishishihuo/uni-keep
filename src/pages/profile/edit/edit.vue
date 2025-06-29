<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人资料',

  }
}
</route>

<script lang="ts" setup>
import type { Gender } from '@/models/user';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/store/theme';
import { useUserStore } from '@/store/user';

defineOptions({
  name: 'ProfileEdit'
});

// 用户信息管理
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 主题管理
const themeStore = useThemeStore();
const { themeColor, themeClassName } = storeToRefs(themeStore);

// 头像选择回调
function onChooseAvatar(e: any) {
  const { avatarUrl } = e.detail;
  if (avatarUrl) {
    // 更新用户头像
    const updatedUserInfo = {
      ...userInfo.value,
      avatar: avatarUrl
    };
    userStore.setUserInfo(updatedUserInfo);

    uni.showToast({
      title: '头像更新成功',
      icon: 'success'
    });
  }
}

// 头像选择错误处理
function onChooseAvatarError(e: any) {
  console.log('头像选择错误:', e);
  const { errMsg } = e.detail;

  if (errMsg.includes('cancel')) {
    return;
  }

  uni.showToast({
    title: '头像选择失败，请重试',
    icon: 'none'
  });
}

// 获取用户信息回调 - 微信小程序 getUserInfo
function onGetUserInfo(e: any) {
  console.log('获取用户信息回调:', e);
  // const wxUserInfo = e.userInfo;
  // if (wxUserInfo && wxUserInfo.nickName) {
  //   // 更新用户昵称
  //   const updatedUserInfo = {
  //     ...userInfo.value,
  //     nickname: wxUserInfo.nickName
  //   };
  //   userStore.setUserInfo(updatedUserInfo);

  //   uni.showToast({
  //     title: '昵称更新成功',
  //     icon: 'success'
  //   });
  // }
}

// 编辑性别
function editGender() {
  uni.showActionSheet({
    itemList: ['👨 男', '👩 女'],
    success: (res) => {
      const gender: Gender = res.tapIndex === 0 ? 'male' : 'female';
      const updatedUserInfo = {
        ...userInfo.value,
        gender
      };
      userStore.setUserInfo(updatedUserInfo);
      uni.showToast({ title: '性别更新成功', icon: 'success' });
    }
  });
}

// 编辑身高
function editHeight() {
  uni.showModal({
    title: '修改身高',
    editable: true,
    placeholderText: '请输入身高(cm)',
    success: (res) => {
      if (res.confirm && res.content) {
        const height = Number(res.content);
        if (height >= 100 && height <= 250) {
          const updatedUserInfo = {
            ...userInfo.value,
            height
          };
          userStore.setUserInfo(updatedUserInfo);
          uni.showToast({ title: '身高更新成功', icon: 'success' });
        }
        else {
          uni.showToast({ title: '请输入有效的身高(100-250cm)', icon: 'none' });
        }
      }
    }
  });
}

// 编辑当前体重
function editCurrentWeight() {
  uni.showModal({
    title: '修改当前体重',
    editable: true,
    placeholderText: '请输入当前体重(kg)',
    success: (res) => {
      if (res.confirm && res.content) {
        const weight = Number(res.content);
        if (weight >= 20 && weight <= 500) {
          const updatedUserInfo = {
            ...userInfo.value,
            currentWeight: weight
          };
          userStore.setUserInfo(updatedUserInfo);
          uni.showToast({ title: '体重更新成功', icon: 'success' });
        }
        else {
          uni.showToast({ title: '请输入有效的体重(20-500kg)', icon: 'none' });
        }
      }
    }
  });
}

// 编辑目标体重
function editTargetWeight() {
  uni.showModal({
    title: '修改目标体重',
    editable: true,
    placeholderText: '请输入目标体重(kg)',
    success: (res) => {
      if (res.confirm && res.content) {
        const weight = Number(res.content);
        if (weight >= 20 && weight <= 500) {
          const updatedUserInfo = {
            ...userInfo.value,
            targetWeight: weight
          };
          userStore.setUserInfo(updatedUserInfo);
          uni.showToast({ title: '目标体重更新成功', icon: 'success' });
        }
        else {
          uni.showToast({ title: '请输入有效的目标体重(20-500kg)', icon: 'none' });
        }
      }
    }
  });
}

onLoad(() => {
  console.log('个人资料页面加载完成');
});
</script>

<template>
  <view class="profile-container" :class="themeClassName">
    <!-- 头像 -->
    <wd-cell-group>
      <wd-cell title="头像" is-link>
        <wd-button
          type="default"
          size="small"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
          @error="onChooseAvatarError"
        >
          <image
            :src="userInfo.avatar || '/static/images/default-avatar.png'"
            class="avatar-image"
            mode="aspectFill"
          />
        </wd-button>
      </wd-cell>
    </wd-cell-group>

    <!-- 基本信息 -->
    <wd-cell-group>
      <wd-cell title="用户名" is-link>
        <input v-model="userInfo.nickname" type="nickname" size="large">
      </wd-cell>

      <wd-cell title="性别" is-link @click="editGender">
        <template #value>
          <text class="cell-value">
            {{ userInfo.gender === 'female' ? '女' : '男' }}
          </text>
        </template>
      </wd-cell>
    </wd-cell-group>

    <!-- 身体数据 -->
    <wd-cell-group>
      <wd-cell title="身高" is-link @click="editHeight">
        <template #value>
          <text class="cell-value">
            {{ userInfo.height ? `${userInfo.height}cm` : '未设置' }}
          </text>
        </template>
      </wd-cell>

      <wd-cell title="当前体重" is-link @click="editCurrentWeight">
        <template #value>
          <text class="cell-value">
            {{ userInfo.currentWeight ? `${userInfo.currentWeight}kg` : '未设置' }}
          </text>
        </template>
      </wd-cell>

      <wd-cell title="目标体重" is-link @click="editTargetWeight">
        <template #value>
          <text class="cell-value">
            {{ userInfo.targetWeight ? `${userInfo.targetWeight}kg` : '未设置' }}
          </text>
        </template>
      </wd-cell>
    </wd-cell-group>
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
