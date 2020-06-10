import Vue from 'vue'
import Router from 'vue-router'
import RouterPrefetch from 'vue-router-prefetch'
import Viewer from '@/pages/Viewer.vue'
import ShowSlide from '@/subpages/ShowSlide.vue'
import Setup from '@/pages/Setup.vue'
import DevEntry from '@/pages/DevEntry.vue'
import LANSettings from '@/subpages/LANSettings.vue'
import DeviceSettings from '@/subpages/DeviceSettings.vue'
import OzoneNetworkSettings from '@/subpages/OzoneNetworkSettings.vue'
import SetupComplete from '@/subpages/SetupComplete.vue'

Vue.use(Router)
Vue.use(RouterPrefetch)

export default new Router({
  routes: [
    {
      path: '/viewer',
      name: 'Viewer',
      component: Viewer,
      children: [
        {
          path: ':slideshowId/:slideNo',
          name: 'ShowSlide',
          component: ShowSlide,
          props: true,
          beforeEnter: (_to, from, next) => {
            console.log("test");
            
            if(from.fullPath.startsWith('/setup')) return
            next()
          }
        },
        {
          path: ':slideshowId',
          name: 'ShowSlideEmptyNoSlideNo',
          component: ShowSlide,
          props: true,
          beforeEnter: (_to, from, next) => {
            if(from.fullPath.startsWith('/setup')) return
            next()
          }
        }
      ]
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
      path: '/',
      alias: '/deventry',
      component: DevEntry
    }
  ]
})
