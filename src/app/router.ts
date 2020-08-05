import Vue from 'vue'
import Router from 'vue-router'
import RouterPrefetch from 'vue-router-prefetch'
import Viewer from '@/pages/Viewer.vue'
import Slideshow from '@/pages/Slideshow.vue'
import Slide from '@/pages/Slide.vue'
import Setup from '@/pages/Setup.vue'
import DevEntry from '@/pages/DevEntry.vue'
import LANSettings from '@/subpages/LANSettings.vue'
import DeviceSettings from '@/subpages/DeviceSettings.vue'
import OzoneNetworkSettings from '@/subpages/OzoneNetworkSettings.vue'
import SetupComplete from '@/subpages/SetupComplete.vue'
import InvalidSlideshow from '@/pages/InvalidSlideshow.vue'
import EmptySlideshow from '@/pages/EmptySlideshow.vue'

Vue.use(Router)
Vue.use(RouterPrefetch)

export default new Router({
  routes: [
    {
      path: '/viewer',
      // alias: ['/viewer/:slideshowid', '/viewer/*', '/viewer*', '/viewer'],
      name: 'Viewer',
      component: Viewer
      // children: [
      //   {
      //     path: 'invalidslideshow',
      //     name: 'InvalidSlideshow',
      //     component: InvalidSlideshow
      //   },
      //   {
      //     path: 'emptyslideshow',
      //     component: EmptySlideshow,
      //     name: 'emptyslideshow'
      //   },
      //   {
      //     path: ':slideshowid',
      //     name: 'Slideshow',
      //     component: Slideshow,
      //     props: true,
      //     beforeEnter: (to, _from, next) => {
      //       if (to.params.slideshowid.length !== 21) {
      //         next('/viewer/invalidslideshow')
      //         return
      //       }
      //       if (!to.params.slideno) {
      //         next(`/viewer/${to.params.slideshowid}/0`)
      //       }
      //       next()
      //     },
      // children: [
      //   {
      //     path: ':slideno',
      //     name: 'Slide',
      //     component: Slide,
      //     props: true
      //   }
      // ]
      //   }
      // ]
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup,
      children: [
        {
          path: 'lansettings',
          alias: '',
          name: 'LANSettings',
          component: LANSettings
        },
        {
          path: 'devicesettings',
          name: 'DeviceSettings',
          component: DeviceSettings
        },
        {
          path: 'ozonenetworksettings',
          name: 'OzoneNetworkSettings',
          component: OzoneNetworkSettings
        },
        {
          path: 'setupcomplete',
          name: 'SetupComplete',
          component: SetupComplete
        }
      ]
    },
    {
      path: '/deventry',
      alias: '/',
      component: DevEntry
    }
  ]
})
