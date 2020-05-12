<template lang="html">
  <div class="wifi-networks">
    <p style="vertical-align: middle;">Verfügbare WLAN-Netzwerke <img v-if="searching" svg-inline src="@/assets/wifi searching animation.svg"></p>
    <p class="noNetworksAvailable" v-if="networks && networks.length === 0">Keine WLAN-Netzwerke gefunden</p>
    <p class="errorMessage" v-if="error">{{error}}</p>
    <form class="networks" v-if="!error">
      <WiFiNetwork v-for="(network, index) of networks" :network="network" :key="`network-${index}`"/>
    </form>
  </div>
</template>

<script>
import WiFiNetwork from '@/components/WiFiNetwork.vue'
export default {
  data(){
    return{
      networks: null,
      searching: false,
      connected: null,
      connectedNetworks: null,
      error: null,

      iv: []
    }
  },
  components: {
    WiFiNetwork
  },
  mounted(){
    this.iv = setInterval(this.checkNetworks, 3000)
  },
  methods: {
    checkNetworks(){
      if (!this.searching){
        this.searching = true
        ipcRenderer.invoke('getWiFiNetworks').then(networks => {
          this.error = null;
          this.searching = false
          this.networks = networks
        }).catch(err => {
          this.networks = null
          this.searching = false
          this.error = err
        })
        ipcRenderer.invoke('getNetworkInterfaceDefault').then(iface => {
          this.connected = iface;
        })
      }
    }
  },
  beforeDestroyed(){
    clearInterval(this.iv)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.networks{
  overflow: auto;
  width: 100%;
  max-height: 25rem;
}

.noNetworksAvailable{
  font-weight: bold;
  text-align: center;
  margin-top: 2rem;
}

svg{
  width: 2em;
  height: 2em;
  transform: translate(.25em, -.4375em);
  position: absolute;
}

.errorMessage{
  color: $red;
}
</style>
