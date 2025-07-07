import { VueQueryPlugin } from '@tanstack/vue-query';
import { createSSRApp } from 'vue';
import App from './App.vue';
import { prototypeInterceptor, requestInterceptor, routeInterceptor } from './interceptors';

import store from './store';
import 'virtual:uno.css';
import '@/style/index.scss';
import '@/style/iconfont/iconfont.css';
import '@/style/reset.scss';

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  app.use(routeInterceptor);
  app.use(requestInterceptor);
  app.use(prototypeInterceptor);
  app.use(VueQueryPlugin);

  return {
    app
  };
}
