import '@/assets/master.css';
import Vue from 'vue';
import App from '@/app.vue';
import router from '@/router';


new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
