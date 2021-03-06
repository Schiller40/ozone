import Vue from 'vue'
import Router from 'vue-router'
import RouterPrefetch from 'vue-router-prefetch'
import Viewer from '@/pages/Viewer.vue'
import Setup from '@/pages/Setup.vue'
import DevEntry from '@/pages/DevEntry.vue'
import LANSettings from '@/subpages/LANSettings.vue'
import DeviceSettings from '@/subpages/DeviceSettings.vue'
import OzoneNetworkSettings from '@/subpages/OzoneNetworkSettings.vue'
import SetupComplete from '@/subpages/SetupComplete.vue'
import SetupWelcome from '@/subpages/SetupWelcome.vue'
import SetupSelector from '@/subpages/SetupSelector.vue'
import SystemSettings from '@/subpages/SystemSettings.vue'

Vue.use(Router)
Vue.use(RouterPrefetch)

export default new Router({
  routes: [
    {
      path: '/viewer',
      name: 'Viewer',
      component: Viewer
    },
    {
      path: '/setup',
      alias: '/',
      name: 'Setup',
      component: Setup,
      children: [
        {
          path: 'welcome',
          alias: '',
          name: 'SetupWelcome',
          component: SetupWelcome
        },
        {
          path: 'setupcomplete',
          name: 'SetupComplete',
          component: SetupComplete
        },
        {
          path: 'selector',
          name: 'SetupSelector',
          component: SetupSelector
        },
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
        },
        {
          path: 'systemsettings',
          name: 'SystemSettings',
          component: SystemSettings
        }
      ]
    },
    {
      path: '/deventry',
      component: DevEntry
    }
  ]
})
