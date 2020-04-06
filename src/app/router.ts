import Vue from 'vue'
import Router from 'vue-router'
// import Viewer from './pages/Viewer.vue'
// import Viewer from '@/pages/Viewer.vue'
// import Viewer from 'pages/Viewer.vue'
import Viewer from 'C://users/coworking/documents/github/ozone/src/app/pages/Viewer.vue'
// import Viewer from '/src/app/pages/Viewer.vue'
// import Viewer from 'src/app/pages/Viewer.vue'
import Setup from 'C://users/coworking/documents/github/ozone/src/app/pages/Setup.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/viewer/:id',
      name: 'Viewer',
      component: Viewer
    },
    {
      path: '/',
      name: 'Viewer',
      component: Viewer,
      props: {
        id: 'nA'
      }
    },
    {
      path: '/viewer',
      name: 'Viewer',
      component: Viewer,
      props: {
        id: 'nA'
      }
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup
    }
  ]
})
