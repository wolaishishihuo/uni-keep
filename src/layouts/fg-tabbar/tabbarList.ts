/**
 * tabbar 选择的策略，更详细的介绍见 tabbar.md 文件
 * 0: 'NATIVE_TABBAR'
 * 2: 'FULL_CUSTOM_TABBAR'
 * 1: 'HALF_CUSTOM_TABBAR'
 * 3: 'NO_TABBAR'
 *
 * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 不会更新导致错误
 */

// TODO：通过这里切换使用tabbar的策略
export const selectedTabbarStrategy = 0;

// 0 和 1 时，需要tabbar缓存
export const cacheTabbarEnable = selectedTabbarStrategy < 2;

// selectedTabbarStrategy==0 时，需要填 iconPath 和 selectedIconPath
// selectedTabbarStrategy==1 or 2 时，需要填 icon 和 iconType
// selectedTabbarStrategy==3 时，tabbarList 不生效
export const tabbarList = [
  {
    iconPath: 'static/tabbar/home.png',
    selectedIconPath: 'static/tabbar/homeHL.png',
    pagePath: 'pages/index/index',
    text: '首页',
    icon: 'home',
    iconType: 'uiLib'
  },
  {
    iconPath: 'static/tabbar/fasting.png',
    selectedIconPath: 'static/tabbar/fastingHL.png',
    pagePath: 'pages/fasting/fasting',
    text: '断食',
    icon: 'clock',
    iconType: 'uiLib'
  },
  {
    iconPath: 'static/tabbar/weight.png',
    selectedIconPath: 'static/tabbar/weightHL.png',
    pagePath: 'pages/weight/weight',
    text: '体重',
    icon: 'chart-trend',
    iconType: 'uiLib'
  },
  {
    iconPath: 'static/tabbar/personal.png',
    selectedIconPath: 'static/tabbar/personalHL.png',
    pagePath: 'pages/profile/profile',
    text: '我的',
    icon: 'user',
    iconType: 'uiLib'
  }
];

const _tabbar = {
  color: '#999999',
  selectedColor: '#4ecdc4',
  backgroundColor: '#F8F8F8',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: tabbarList.map((item) => {
    // 当使用原生 tabBar (strategy=0) 时，移除自定义字段，只保留微信小程序支持的字段
    const { icon, iconType, ...validFields } = item;
    return validFields;
  })
};

// 0和1 需要显示底部的tabbar的各种配置，以利用缓存
export const tabBar = cacheTabbarEnable ? _tabbar : undefined;
