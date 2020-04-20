import Vue from 'vue'
import Router from 'vue-router'
import Viewer from '@/pages/Viewer.vue'
import Setup from '@/pages/Setup.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/viewer/:slideshowId/:slideNo',
      name: 'Viewer',
      component: Viewer,
      props: true
    },
    {
      path: '/viewer/:slideshowId',
      name: 'ViewerEmptyNoSlideNo',
      component: Viewer,
      props: true
    },
    {
      path: '/',
      alias: '/viewer',
      name: 'ViewerEmptyNoSlideshow',
      component: Viewer,
      props: {
        slideshowId: 'nA'
      }
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup
    }
  ]
})
