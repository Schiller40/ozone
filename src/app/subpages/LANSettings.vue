<template lang="html">
  <div class="lan-settings">
    <h1>Netzwerk</h1>
    <p>Bitte richten Sie eine Netzwerkverbindung ein, um Ozone nutzen zu können.</p><br>
    <WiFiNetworks />
  </div>
</template>

<script>
import WiFiNetworks from '@/components/WiFiNetworks.vue'
export default {
  name: 'wifiSettings',
  components:{
    WiFiNetworks
  }
}
</script>

<style lang="css" scoped>
.lan-settings{
  position: absolute;
  width: 60rem;
  max-width: 80%;
  background-color: #fff9;
  height: 50rem;
  max-height: 80%;
  overflow: auto;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-sizing: border-box;
}

h1{
  margin: 0px;
}
</style>
