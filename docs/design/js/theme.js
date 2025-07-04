/**
 * 主题切换功能公共脚本
 * 用于管理"坚持有你"应用的主题切换
 */

// 主题类型定义
const THEME = {
  MALE: 'male',
  FEMALE: 'female'
};

// 主题管理类
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('app-theme') || THEME.MALE;
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeItems = document.querySelectorAll('.theme-item');
    this.body = document.body;

    // 初始化主题
    this.applyTheme();
    this.setupEventListeners();
  }

  // 设置事件监听
  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  // 切换主题
  toggleTheme() {
    this.currentTheme
      = this.currentTheme === THEME.MALE ? THEME.FEMALE : THEME.MALE;
    localStorage.setItem('app-theme', this.currentTheme);
    this.applyTheme();
  }

  // 应用主题
  applyTheme() {
    // 应用CSS变量
    if (this.currentTheme === THEME.FEMALE) {
      this.body.classList.add('theme-female-vars');
      if (this.themeItems && this.themeItems.length >= 2) {
        this.themeItems[0].classList.remove('active');
        this.themeItems[1].classList.add('active');
      }
      if (this.themeToggle)
        this.themeToggle.innerHTML = '🧔';
    }
    else {
      this.body.classList.remove('theme-female-vars');
      if (this.themeItems && this.themeItems.length >= 2) {
        this.themeItems[1].classList.remove('active');
        this.themeItems[0].classList.add('active');
      }
      if (this.themeToggle)
        this.themeToggle.innerHTML = '👩';
    }

    // 更新各种元素颜色
    this.updateElementColors();
  }

  // 更新元素颜色
  updateElementColors() {
    // 更新通用元素
    this.updateCommonElements();

    // 根据当前页面更新特定元素
    const pagePath = window.location.pathname;
    if (pagePath.includes('weight_record')) {
      this.updateWeightPageElements();
    }
    else if (pagePath.includes('home_screen')) {
      this.updateHomePageElements();
    }
    else if (pagePath.includes('fasting')) {
      this.updateFastingPageElements();
    }
    else if (pagePath.includes('profile')) {
      this.updateProfilePageElements();
    }
    else if (pagePath.includes('settings')) {
      this.updateSettingsPageElements();
    }
  }

  // 更新通用元素
  updateCommonElements() {
    // 更新按钮样式
    const backButton = document.querySelector('.back-to-index');
    const themeToggle = document.querySelector('.theme-toggle');

    if (backButton) {
      backButton.style.background = 'var(--primary-gradient)';
      backButton.style.boxShadow = '0 4px 15px var(--button-shadow)';
    }

    if (themeToggle) {
      themeToggle.style.color = 'var(--primary-color)';
      themeToggle.style.borderColor = 'var(--primary-color)';
    }
  }

  // 更新体重页面元素
  updateWeightPageElements() {
    // 更新图表颜色
    const selfPath = document.querySelector(
      'svg path[stroke="#4195e1"], svg path[stroke="#ff6b9d"]'
    );
    const partnerPath = document.querySelector(
      'svg path[stroke="#ff6b9d"], svg path[stroke="#4195e1"]'
    );
    const selfCircles = document.querySelectorAll(
      'svg circle[fill="#4195e1"], svg circle[fill="#ff6b9d"]'
    );
    const partnerCircles = document.querySelectorAll(
      'svg circle[fill="#ff6b9d"], svg circle[fill="#4195e1"]'
    );
    const legendSelf = document.querySelector('.legend-self');
    const legendPartner = document.querySelector('.legend-partner');

    if (this.currentTheme === THEME.FEMALE) {
      // 女性主题：自己是粉色，伴侣是蓝色
      if (selfPath)
        selfPath.setAttribute('stroke', '#ff6b9d');
      if (partnerPath)
        partnerPath.setAttribute('stroke', '#4195e1');
      selfCircles.forEach(circle => circle.setAttribute('fill', '#ff6b9d'));
      partnerCircles.forEach(circle =>
        circle.setAttribute('fill', '#4195e1')
      );
      if (legendSelf)
        legendSelf.style.background = '#ff6b9d';
      if (legendPartner)
        legendPartner.style.background = '#4195e1';
    }
    else {
      // 男性主题：自己是蓝色，伴侣是粉色
      if (selfPath)
        selfPath.setAttribute('stroke', '#4195e1');
      if (partnerPath)
        partnerPath.setAttribute('stroke', '#ff6b9d');
      selfCircles.forEach(circle => circle.setAttribute('fill', '#4195e1'));
      partnerCircles.forEach(circle =>
        circle.setAttribute('fill', '#ff6b9d')
      );
      if (legendSelf)
        legendSelf.style.background = '#4195e1';
      if (legendPartner)
        legendPartner.style.background = '#ff6b9d';
    }
  }

  // 更新主页元素
  updateHomePageElements() {
    const timerCircle = document.querySelector('.timer-circle');
    const progressCircle = document.querySelector('.progress-circle');
    const startButton = document.querySelector('.start-button');
    const fastingTypeLabel = document.querySelector('.fasting-type');
    const timerDisplay = document.querySelector('.timer-display');
    const fastingState = document.querySelector('.fasting-state');

    if (timerCircle)
      timerCircle.style.borderColor = 'var(--primary-color)';
    if (progressCircle)
      progressCircle.style.background = 'var(--primary-gradient)';
    if (startButton)
      startButton.style.background = 'var(--primary-gradient)';
    if (fastingTypeLabel)
      fastingTypeLabel.style.color = 'var(--primary-color)';
    if (timerDisplay)
      timerDisplay.style.color = 'var(--primary-color)';
    if (fastingState)
      fastingState.style.color = 'var(--primary-color)';
  }

  // 更新断食页面元素
  updateFastingPageElements() {
    const fastingTitle = document.querySelector('.fasting-title');
    const fastingCards = document.querySelectorAll('.fasting-card');
    const fastingCardTitles = document.querySelectorAll('.fasting-card-title');

    if (fastingTitle)
      fastingTitle.style.color = 'var(--primary-color)';
    fastingCards.forEach((card) => {
      card.style.borderColor = 'var(--primary-color)';
    });
    fastingCardTitles.forEach((title) => {
      title.style.color = 'var(--primary-color)';
    });
  }

  // 更新个人资料页面元素
  updateProfilePageElements() {
    const profileHeader = document.querySelector('.profile-header');
    const profileName = document.querySelector('.profile-name');
    const profileStats = document.querySelectorAll('.profile-stat-value');
    const achievementItems = document.querySelectorAll('.achievement-item');

    if (profileHeader)
      profileHeader.style.background = 'var(--primary-gradient)';
    if (profileName)
      profileName.style.color = 'var(--primary-color)';
    profileStats.forEach((stat) => {
      stat.style.color = 'var(--primary-color)';
    });
    achievementItems.forEach((item) => {
      item.style.borderColor = 'var(--primary-color)';
    });
  }

  // 更新设置页面元素
  updateSettingsPageElements() {
    const settingItems = document.querySelectorAll('.setting-item');
    const settingIcons = document.querySelectorAll('.setting-icon');

    settingItems.forEach((item) => {
      item.style.borderColor = 'var(--primary-color-light)';
    });
    settingIcons.forEach((icon) => {
      icon.style.color = 'var(--primary-color)';
    });
  }
}

// 当DOM加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});
