<template lang="html">
  <div class="setupSelector">
    <h1 style="grid-column: span 2">Einstellungen</h1>
    <router-link to="/setup/lansettings"><img svg-inline src="@/assets/wifi.svg"><p>WLAN</p></router-link>
    <router-link to="/setup/devicesettings"><img svg-inline src="@/assets/device.svg"><p>Gerät</p></router-link>
    <router-link to="/setup/ozonenetworksettings"><img svg-inline src="@/assets/ozoneNetwork.svg"><p>Ozone-Netzwerk</p></router-link>
    <router-link to="/setup/systemsettings"><img svg-inline src="../assets/system.svg"><p>System</p></router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class SetupSelector extends Vue {
  mounted() {
    this.$emit("settransition", "ozone-setup-screen");
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.setupSelector {
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 0fr;
  grid-gap: 1rem;
}

h1 {
  text-align: center;
}

a {
  text-decoration: none;
  text-align: center;
  display: grid;
  grid-template-rows: 50% 50%;
  color: black;
  position: relative;
}

a p {
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
}

a svg {
  height: 7rem;
  width: auto;
  margin: 1rem auto;
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
