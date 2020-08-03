<template>
  <p :ref="`text-${no + 1}`" class="text" :id="`text-${no + 1}`">
    {{ parsedText }}
  </p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "ShowText",
})
export default class ShowText extends Vue {
  @Prop()
  no: number;
  @Prop()
  text: string;
  @Prop()
  id: string;

  parsedText: string = "";

  mounted() {
    let address =
      this.text.startsWith("http://") ||
      this.text.startsWith("https://") ||
      this.text.startsWith("data:text/plain")
        ? ""
        : `http://127.0.0.1:5230/transfer/${this.id}/${this.no}/`;
    address += this.text;
    fetch(address).then(async (response) => {
      this.parsedText = await response.text();
    });
  }
}
</script>

<style></style>
