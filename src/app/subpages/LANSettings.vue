<template lang="html">
  <div class="lan-settings">
    <h1>Netzwerk</h1>
    <p>Bitte richten Sie eine Netzwerkverbindung ein, um Ozone nutzen zu können.</p>
    <br />
    <button type="button" name="button" class="cancelButton" @click="$emit('cancel')">{{ cancelButtonText }}</button>
    <button type="button" name="button" ref="confirmButton" class="confirmButton" @click="confirmPressed">
      {{ confirmButtonText }}
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
const { ipcRenderer } = window;

@Component({
  name: "lanSettings",
})
export default class LANSettings extends Vue {
  @Prop({ default: "Abbrechen" })
  cancelButtonText: string;
  @Prop({ default: "Anwenden" })
  confirmButtonText: string;

  confirmPressed() {
    if (ipcRenderer.sendSync("isNetworkConnected")) {
      this.$emit("ok");
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
