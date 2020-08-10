<template>
  <div class="networkslist">
    <WiFiNetwork v-for="network in networks" :network="network" :key="network.ssid" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
// import WiFiNetwork from "./WiFiNetwork.vue";

export interface Network {
  ssid: string
  quality: number
  security: string
}

@Component({
  name: 'WiFiNetworksList',
  components: {
    WiFiNetwork
  }
})
export default class WiFiNetworksList extends Vue {
  scanTimeout: number
  networks: Network[] = []

  mounted() {
    const { ipcRenderer } = window
    this.scanTimeout = window.setTimeout(() => {
      ipcRenderer.invoke('getWiFiNetworks').then((newNetworks: Network[]) => {
        this.networks = newNetworks.sort((a, b) => (a.quality > b.quality ? -1 : 1))
      })
    }, 5000)
  }
  beforeDestroy() {
    window.clearTimeout(this.scanTimeout)
  }
}
</script>

<style></style>
