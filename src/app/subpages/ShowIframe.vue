<template>
  <iframe class="iframe" :id="`iframe-${no + 1}`" :src="src"></iframe>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
  name: "ShowIframe",
})
export default class ShowIframe extends Vue {
  @Prop()
  no: number;
  @Prop({ default: "" })
  url: string;

  get src(): string {
    return this.url.startsWith("http://") ||
      this.url.startsWith("https://") ||
      this.url.startsWith("data:text/plain")
      ? this.url
      : `http://127.0.0.1:5230/transfer/${this.$route.params.slideshowid}/${this.no}/${this.url}`;
  }
}
</script>

<style></style>
