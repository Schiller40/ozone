import Vue from 'vue'
import Router from 'vue-router'
import Viewer from '@/pages/Viewer.vue'
import Setup from '@/pages/Setup.vue'
import DevEntry from '@/pages/DevEntry.vue'
import WiFiSettings from '@/components/WiFiSettings.vue'
import DeviceSettings from '@/components/DeviceSettings.vue'
import OzoneNetworkSettings from '@/components/OzoneNetworkSettings.vue'

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
      path: '/viewer',
      name: 'ViewerEmptyNoSlideshow',
      component: Viewer,
      props: {
        slideshowId: 'nA'
      }
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup,
      children: [
        {
          path: 'wifisettings',
          name: 'WiFiSettings',
          component: WiFiSettings
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
