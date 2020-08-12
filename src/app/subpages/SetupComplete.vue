<template lang="html">
  <div class="device-settings">
    <h1>Setup abgeschlossen!</h1>
    <router-link to="/viewer">
      <button type="button" class="buttonCenter" name="finish">
        Setup schließen.
      </button>
    </router-link>
    <h2>Nächste Schritte</h2>
    <p>
      Sie können jetzt über Superflare weitere Geräte hinzufügen oder Präsentationen erstellen und
      auf die Geräte spielen. Starten Sie dazu, falls noch nicht geschehen, die Superflare-Anwendung
      und wählen Sie "Neue Präsentation".
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class SetupComplete extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.device-settings {
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
  margin-top: 7rem;
}

a {
  text-decoration: none;
}

.buttonCenter {
  margin: 5rem auto 3rem auto;
  display: block;
  padding: 0.6rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 0.4rem;
  background-color: $green;
  color: $white;
}
</style>
