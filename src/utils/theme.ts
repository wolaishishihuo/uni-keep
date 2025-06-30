import { pages } from '@/pages.json';

// 从 pages.json 读取配置（可以考虑做成配置文件）
const TABBAR_PAGES = pages.filter(page => page.layout === 'tabbar').map(page => page.path);

function isCurrentPageTabBar() {
  const pages = getCurrentPages();
  if (pages.length === 0)
    return false;

  const currentRoute = pages[pages.length - 1].route;
  return TABBAR_PAGES.includes(currentRoute);
}

// 注入小程序环境的全局样式
export function applyThemeToMiniProgram(primaryColor: string) {
  if (typeof document !== 'undefined')
    return;

  if (isCurrentPageTabBar()) {
    uni.setTabBarStyle({
      color: '#000000',
      selectedColor: primaryColor,
      backgroundColor: '#ffffff',
      borderStyle: 'black'
    });
    console.log('小程序主题色已应用:', primaryColor);
  }
}

// 在页面展示时应用主题
export function applyThemeOnPageShow(primaryColor: string) {
  // 各平台小程序可能需要不同处理
  const platform = uni.getSystemInfoSync().platform;
  console.log(`当前平台: ${platform}, 应用主题色: ${primaryColor}`);
}
