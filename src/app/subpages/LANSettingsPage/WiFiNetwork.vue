<template>
  <div>
    {{ network.name }}
    <p v-if="isSecure">
      <input type="password" placeholder="Passwort" v-model="password" />
    </p>
    <button @click="connect()">Verbinden</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Network } from './WiFiNetworksList.vue'
const { ipcRenderer } = window

@Component({
  name: 'WiFiNetwork'
})
export default class WiFiNetwork extends Vue {
  @Prop()
  network: Network

  password: string

  get isSecure() {
    if (
      this.network.security.indexOf('WPA') > -1 ||
      this.network.security.indexOf('WEP') > -1 ||
      this.network.security.indexOf('CCMP') > -1
    )
      return true
    return false
  }

  connect() {
    ipcRenderer.invoke('connectWiFi', this.network.ssid, this.password)
  }
}
</script>

<style></style>
