<template lang="html">
  <div class="wifi-network">
    <input type="radio" :id="network.ssid" name="wifinetwork" v-model="checked" :value="network.ssid">
    <label :for="network.ssid">{{network.ssid ? network.ssid : '(Ausgeblendetes Netzwerk)'}}</label>
    <p v-if="checked">Test</p>
  </div>
</template>

<script>
export default {
  name: 'wifiNetwork',
  props: [
    'network'
  ],
  data(){
    return{
      checked: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.wifi-network{
  padding: .7em;
  border-bottom: .1rem solid $black;
}
.wifi-network:last-child{
  border-bottom: none;
}

input{
  width: 0px;
  height: 0px;
  visibility: hidden;
  opacity: 0;
  position: absolute;
}

input:checked + label{
  font-weight: bold;
}
</style>
