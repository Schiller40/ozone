import '@/assets/master.scss';
import '../../docs/animations.scss';
import Vue from 'vue';
import App from '@/app.vue';
import router from '@/router';


new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
