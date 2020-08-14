<template lang="html">
  <div class="systemSettings">
    <h1>Systemeinstellungen</h1>
    <button class="ozoneButton green" @click="shutdown()">{{shutdownText}}</button>
    <button class="ozoneButton green" @click="reboot()">{{rebootText}}</button>
    <button class="ozoneButton red" @click="reset()">Zurücksetzen</button>
    <br />
    <button type="button" name="button" class="ozoneButton red" @click="$emit('cancel')">Zurück zur Übersicht</button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

const { ipcRenderer } = window;

@Component
export default class SetupSelector extends Vue {
  shutdownText = "Herunterfahren";
  shutdownTimeout = -1;

  rebootText = "Neu starten";
  rebootTimeout = -1;

  shutdown() {
    if (this.shutdownTimeout === -1) {
      let timeout = 11;
      this.shutdownTimeout = window.setInterval(() => {
        if (timeout) {
          if (timeout % 2 == 0) {
            this.shutdownText = timeout.toString();
          } else {
            this.shutdownText = "Abbrechen";
          }
          timeout--;
        } else {
          this.shutdownText = "Wird heruntergefahren...";
          ipcRenderer.invoke("shutdown");
        }
      }, 1000);
    } else {
      window.clearInterval(this.shutdownTimeout);
      this.shutdownTimeout = -1;
      this.shutdownText = "Herunterfahren";
    }
  }
  reboot() {
    if (this.rebootTimeout === -1) {
      let timeout = 11;
      this.rebootTimeout = window.setInterval(() => {
        if (timeout) {
          if (timeout % 2 == 0) {
            this.rebootText = timeout.toString();
          } else {
            this.rebootText = "Abbrechen";
          }
          timeout--;
        } else {
          ipcRenderer.invoke("reboot");
        }
      }, 1000);
    } else {
      window.clearInterval(this.rebootTimeout);
      this.rebootTimeout = -1;
      this.rebootText = "Neu starten";
    }
  }
  reset() {
    console.log("(absolutely not) resetting this device");
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.systemSettings {
  position: absolute;
  width: 60rem;
  max-width: 80%;
  background-color: #fff9;
  height: 50rem;
  max-height: 80%;
  overflow: auto;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-sizing: border-box;
}

h1 {
  text-align: center;
}
</style>
