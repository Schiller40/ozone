import Vue from 'vue'
import Router from 'vue-router'
import Viewer from '@/pages/Viewer.vue'
import ShowSlide from '@/subpages/ShowSlide.vue'
import Setup from '@/pages/Setup.vue'
import DevEntry from '@/pages/DevEntry.vue'
import LANSettings from '@/subpages/LANSettings.vue'
import DeviceSettings from '@/subpages/DeviceSettings.vue'
import OzoneNetworkSettings from '@/subpages/OzoneNetworkSettings.vue'

Vue.use(Router)

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
          props: true
        },
        {
          path: ':slideshowId',
          name: 'ShowSlideEmptyNoSlideNo',
          component: ShowSlide,
          props: true
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
