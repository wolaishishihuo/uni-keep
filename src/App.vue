<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

onLaunch(() => {
  console.log('App Launch');
  // 检查登录状态
  const userStore = useUserStore();
  const isLoggedIn = !!userStore.token && userStore.isLoggedIn;

  if (!isLoggedIn) {
    // 未登录，跳转到登录页
    uni.reLaunch({
      url: '/pages/login/index'
    });
  }
});

onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
page,view,button,input,textarea,image,swiper,scroll-view {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
// 全局隐藏滚动条 - 小程序项目通用设置
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
