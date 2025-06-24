<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人中心'
  }
}
</route>

<script lang="ts" setup>
import { useSafeArea } from '@/hooks/useSafeArea'

defineOptions({
  name: 'Profile',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = useSafeArea()

onLoad(() => {
  console.log('项目作者:', safeAreaInsets)
})

// 用户信息
const userInfo = ref({
  nickname: '小明',
  avatar: '/static/images/default-avatar.png',
  partnerName: '小红',
  daysTogether: 15,
})

// 成就数据
const achievements = ref({
  personal: { current: 12, total: 20 },
  couple: { current: 5, total: 10 },
})

// 菜单项
const menuSections = ref([
  {
    title: '🏆 成就中心',
    items: [
      {
        icon: '🏅',
        label: '我的成就',
        value: `${achievements.value.personal.current}/${achievements.value.personal.total}`,
        path: '/pages-sub/achievements/personal',
      },
      {
        icon: '💕',
        label: '情侣成就',
        value: `${achievements.value.couple.current}/${achievements.value.couple.total}`,
        path: '/pages-sub/achievements/couple',
      },
    ],
  },
  {
    title: '💕 情侣空间',
    items: [
      { icon: '📊', label: '数据对比', value: '', path: '/pages-sub/couple/comparison' },
      { icon: '💬', label: '互动记录', value: '', path: '/pages-sub/couple/interaction' },
    ],
  },
  {
    title: '⚙️ 设置',
    items: [
      { icon: '🔔', label: '提醒设置', value: '', path: '/pages-sub/settings/notification' },
      { icon: '👤', label: '个人资料', value: '', path: '/pages-sub/settings/profile' },
    ],
  },
])

// 点击菜单项
function handleMenuClick(item: any) {
  console.log('点击菜单:', item.label)
  // TODO: 实现页面跳转
  // uni.navigateTo({ url: item.path })
}
</script>

<template>
  <view
    class="profile-page min-h-screen bg-gray-50"
    :style="{ marginTop: `${safeAreaInsets?.top}px` }"
  >
    <!-- 用户头像信息区域 -->
    <view class="profile-header from-blue-400 to-purple-500 bg-gradient-to-br px-6 py-8 text-white">
      <view class="flex flex-col items-center">
        <image
          :src="userInfo.avatar"
          class="mb-3 h-20 w-20 border-4 border-white/30 rounded-full"
          mode="aspectFill"
        />
        <text class="mb-1 text-xl font-semibold">
          {{ userInfo.nickname }}
          {{ safeAreaInsets }}
        </text>
        <text class="text-sm opacity-90">
          与{{ userInfo.partnerName }}共同坚持 {{ userInfo.daysTogether }} 天
        </text>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="px-4 py-4">
      <view v-for="section in menuSections" :key="section.title" class="mb-6">
        <!-- 分组标题 -->
        <view class="mb-3 px-2 text-base text-gray-700 font-semibold">
          {{ section.title }}
        </view>

        <!-- 菜单项列表 -->
        <view class="overflow-hidden rounded-xl bg-white shadow-sm">
          <view
            v-for="item in section.items"
            :key="item.label"
            class="flex items-center justify-between border-b border-gray-100 px-4 py-4 last:border-b-0 active:bg-gray-50"
            @tap="handleMenuClick(item)"
          >
            <view class="flex flex-1 items-center">
              <text class="mr-3 text-lg">
                {{ item.icon }}
              </text>
              <text class="text-gray-800 font-medium">
                {{ item.label }}
              </text>
            </view>

            <view class="flex items-center">
              <text v-if="item.value" class="mr-2 text-sm text-gray-500">
                {{ item.value }}
              </text>
              <text class="text-lg text-gray-400">
                ›
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位，避免被 tabbar 遮挡 -->
    <view class="h-20" />
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  .profile-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
