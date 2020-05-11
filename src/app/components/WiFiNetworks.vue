<template lang="html">
  <div class="wifi-networks">
    <p class="noNetworksAvailable">Keine Netzwerke gefunden</p>
  </div>
</template>

<script>
export default {
  data(){
    return{
      networks: null,
      searching: false,
      connected: false,
      connectedNetworks: null
    }
  },
  mounted(){
    ipcRenderer.invoke('getCurrentWiFiConnections').then(connections => {
      console.log(connections);
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style lang="css" scoped>
.wifi-networks{
  overflow: auto;
  width: 100%;
  max-height: 25rem;
}

.noNetworksAvailable{
  font-weight: bold;
  text-align: center;
  margin-top: 2rem;
}
</style>
