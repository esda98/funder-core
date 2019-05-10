import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router';
import './css/reset.css';
import './css/element-variables.scss';
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
// @ts-ignore
import locale from 'element-ui/lib/locale/lang/en'


Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
