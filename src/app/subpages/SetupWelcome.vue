<template lang="html">
  <div class="setupWelcome">
    <h1>Herzlich Willkommen</h1>
    <button type="button" class="buttonCenter" @click="$emit('ok')">
      Setup beginnen.
    </button>
    <h2>Über Ozone</h2>
    <p>
      Ozone ist die nächste Generation Präsentationssoftware. Konfigurieren Sie Ihre Präsentationen
      mit Superflare und laden Sie sie anschließend auf die Ozone-Geräte Ihrer Wahl. Ozone
      unterstützt automatisches Aufrufen der Präsentationen, dynamische Inhalte, die über einen
      externen Server geladen werden, und vieles mehr. Probieren Sie jetzt Ozone aus und bereichern
      Sie noch heute Ihre Ausstellfläche mit den Inhalten Ihrer Wahl. <br />Mehr Infos unter
      <a href="https://github.com/Schiller40/ozone">github.com/Schiller40/ozone</a>
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class SetupWelcome extends Vue {
  mounted() {}
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.setupWelcome {
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
