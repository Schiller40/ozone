<template lang="html">
  <div class="network-settings">
    <h1>Ozone-Netzwerkeinstellungen</h1>
    <p>
      Bitte geben Sie hier die Anmeldedaten für das Ozone-Netzwerk ein, um sich mit dem
      Ozone-Netzwerk zu verbinden.
    </p>
    <div class="gridTwo">
      <input
        type="text"
        class="ozoneTextInput"
        required
        id="networkNameInput"
        ref="networkNameInput"
        placeholder="Name des Ozone-Netzwerks"
      />
      <input
        type="password"
        class="ozoneTextInput"
        required
        id="passwordInput"
        ref="passwordInput"
        placeholder="Passwort"
        maxlength="128"
      />
    </div>
    <p class="errorText" ref="errorText"></p>
    <br />
    <button type="button" name="button" class="ozoneButton red" @click="$emit('cancel')">
      {{ initialSetup ? 'Zurück' : 'Zurück zur Übersicht' }}
    </button>
    <button
      type="button"
      name="button"
      ref="confirmButton"
      class="ozoneButton green"
      @click="confirmPressed()"
    >
      {{ initialSetup ? 'Weiter' : 'Anwenden' }}
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
const { ipcRenderer } = window;

@Component({
  name: "OzoneNetworkSettings",
})
export default class OzoneNetworkSettings extends Vue {
  @Prop()
  initialSetup: boolean;

  errorText: string = "";

  confirmPressed() {
    this.checkToken()
      .then((result: string) => {
        if (result === "ok") {
          this.$emit("ok");
          return;
        }
        (this.$refs.errorText as HTMLParagraphElement).innerHTML = result;
        throw "";
      })
      .catch((err: Error) => {
        (this.$refs.confirmButton as HTMLButtonElement).classList.add(
          "animate__shakeX"
        );

        setTimeout(() => {
          (this.$refs.confirmButton as HTMLButtonElement).classList.remove(
            "animate__shakeX"
          );
        }, 1000);
      });
  }

  async checkToken() {
    const network = {
      name: (this.$refs.networkNameInput as HTMLInputElement).value,
      password: (this.$refs.passwordInput as HTMLInputElement).value,
    };
    const result = await ipcRenderer.invoke("setOzoneNetwork", network);
    if (result !== "ok") return result;
    const response = await fetch("http://127.0.0.1:5230/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(network),
    });
    if (response.status === 200) return "ok";
    throw new Error("failed to set cookie");
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.network-settings {
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
  margin: 0px;
}

.gridTwo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
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

.errorText {
  color: red;
  font-weight: bold;
}
</style>
