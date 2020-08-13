<template lang="html">
  <div class="systemSettings">
    <h1>Systemeinstellungen</h1>
    <button>Herunterfahren</button>
    <button>Neu starten</button>
    <button>Zurücksetzen</button>
    <br />
    <button type="button" name="button" class="ozoneButton green" @click="$emit('cancel')">
      {{ cancelButtonText }}
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class SetupSelector extends Vue {
  @Prop({ default: "Abbrechen" })
  cancelButtonText: string;
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
