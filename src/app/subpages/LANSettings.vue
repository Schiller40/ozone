<template lang="html">
  <div class="lan-settings">
    <h1>Netzwerk</h1>
    <p v-if="currentConnection != null">
      Sie sind mit <b>{{currentConnection}}</b> verbunden. Sie können "Weiter" drücken, wenn das so richtig ist.
    </p>
    <p v-else>Bitte richten Sie eine Netzwerkverbindung ein, um Ozone nutzen zu können.</p>
    <form class="gridThree">
      <input
        type="text"
        class="ozoneTextInput"
        id="wifiSSIDInput"
        ref="wifiSSIDInput"
        placeholder="SSID"
        @input="$refs.connectToWiFiButton.innerHTML = 'Verbinden'"
      />
      <input
        type="password"
        class="ozoneTextInput"
        id="wifiPasswordInput"
        ref="wifiPasswordInput"
        placeholder="Netzwerkpasswort"
        @input="$refs.connectToWiFiButton.innerHTML = 'Verbinden'"
      />
      <button type="submit" class="ozoneButton green" @click="connectToWiFi" ref="connectToWiFiButton">Verbinden</button>
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
import { Vue, Prop, Component } from "vue-property-decorator";
// import WiFiNetworksList from './LANSettingsPage/WiFiNetworksList.vue'
const { ipcRenderer } = window;

@Component({
  name: "lanSettings",
  components: {
    // WiFiNetworksList
  },
})
export default class LANSettings extends Vue {
  @Prop({ default: "Abbrechen" })
  cancelButtonText: string;
  @Prop({ default: "Anwenden" })
  confirmButtonText: string;

  connectedInterval: number;
  currentConnection: string = null;

  mounted() {
    this.checkConnected();
    this.connectedInterval = window.setInterval(this.checkConnected, 1000);
  }
  beforeDestroy() {
    window.clearInterval(this.connectedInterval);
  }

  async checkConnected() {
    const isConnected = ipcRenderer.sendSync("isNetworkConnected");
    if (isConnected)
      this.currentConnection =
        (await ipcRenderer.invoke("getDefaultNetworkInterface")) === "LAN"
          ? "LAN"
          : (await ipcRenderer.invoke("getCurrentWiFiConnections"))[0].ssid;
    else this.currentConnection = null;
    return this.currentConnection;
  }

  connectToWiFi() {
    ipcRenderer
      .invoke("getCurrentWiFiConnections")
      .then((networks) => console.log(networks))
      .catch(() => {});
    (this.$refs.connectToWiFiButton as HTMLButtonElement).innerHTML =
      "Verbinden...";
    ipcRenderer
      .invoke(
        "connectWiFi",
        (this.$refs.wifiSSIDInput as HTMLInputElement).value,
        (this.$refs.wifiPasswordInput as HTMLInputElement).value
      )
      .then((result) => {
        (this.$refs.connectToWiFiButton as HTMLButtonElement).innerHTML =
          "Verbinden";
      })
      .catch((err) => {
        (this.$refs.connectToWiFiButton as HTMLButtonElement).innerHTML =
          "Fehler";
        console.log("error" + err);
      });
  }

  confirmPressed() {
    if (this.checkConnected()) {
      this.$emit("ok");
    } else {
      (this.$refs.confirmButton as HTMLElement).classList.add(
        "animate__shakeX"
      );
      setTimeout(() => {
        (this.$refs.confirmButton as HTMLElement).classList.remove(
          "animate__shakeX"
        );
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

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
