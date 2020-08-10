<template lang="html">
  <div class="lan-settings">
    <h1>Netzwerk</h1>
    <p v-if="isConnected">
      Sie sind mit einem Netzwerk verbunden. Drücken Sie weiter, wenn Sie kein WLAN-Netzwerk
      wechseln/hinzufügen möchten.
    </p>
    <p v-else>Bitte richten Sie eine Netzwerkverbindung ein, um Ozone nutzen zu können.</p>
    <form class="gridThree">
      <input
        type="text"
        class="ozoneTextInput"
        id="deviceNameInput"
        ref="deviceNameInput"
        placeholder="SSID"
      />
      <input
        type="password"
        class="ozoneTextInput"
        id="wifiPasswordInput"
        ref="wifiPasswordInput"
        placeholder="Netzwerkpasswort"
      />
      <button type="submit" class="ozoneButton green">Verbinden</button>
    </form>
    <br />
    <br />
    <button type="button" name="button" class="cancelButton" @click="$emit('cancel')">
      {{ cancelButtonText }}
    </button>
    <button ref="confirmButton" class="confirmButton" @click="confirmPressed">
      {{ confirmButtonText }}
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
// import WiFiNetworksList from './LANSettingsPage/WiFiNetworksList.vue'
const { ipcRenderer } = window

@Component({
  name: 'lanSettings',
  components: {
    // WiFiNetworksList
  }
})
export default class LANSettings extends Vue {
  @Prop({ default: 'Abbrechen' })
  cancelButtonText: string
  @Prop({ default: 'Anwenden' })
  confirmButtonText: string

  connectedInterval: number
  isConnected: boolean = false

  mounted() {
    this.connectedInterval = window.setInterval(() => {
      this.isConnected = ipcRenderer.sendSync('isNetworkConnected')
    }, 1000)
  }
  beforeDestroy() {
    window.clearInterval(this.connectedInterval)
  }

  confirmPressed() {
    if (this.isConnected) {
      this.$emit('ok')
    } else {
      ;(this.$refs.confirmButton as HTMLElement).classList.add('animate__shakeX')
      setTimeout(() => {
        ;(this.$refs.confirmButton as HTMLElement).classList.remove('animate__shakeX')
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.lan-settings {
  position: absolute;
  width: 60rem;
  max-width: 80%;
  background-color: #fffa;
  height: 50rem;
  max-height: 80%;
  overflow: auto;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

h1 {
  margin: 0px;
}

.gridThree {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  grid-gap: 1rem;
}

.confirmButton,
.cancelButton {
  padding: $default-padding;
  background-color: $green;
  color: $white;
  border: none;
  border-radius: $default-padding;
}
.cancelButton {
  background-color: $red;
}

@keyframes shakeX {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}
.animate__shakeX {
  animation-name: shakeX;
  animation-duration: 1s;
}
</style>
