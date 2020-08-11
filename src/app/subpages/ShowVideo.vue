<template>
  <video
    class="video"
    :id="`video-${no + 1}`"
    :src="src"
    :alt="src"
    autoplay
    :ref="`video-${no + 1}`"
  ></video>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "ShowVideo",
})
export default class ShowVideo extends Vue {
  @Prop({ default: "error" })
  url: string;
  @Prop()
  no: number;
  @Prop()
  repeat: number;
  @Prop()
  id: string;

  iterations: number = 0;

  mounted() {
    let vid = this.$refs[`video-${this.no + 1}`] as HTMLVideoElement;
    vid.onended = () => {
      console.log("video ended");
      if (this.iterations !== this.repeat) vid.play();
      else {
        this.$emit("playedAllIterations");
      }
    };
  }

  get src(): string {
    return this.url.startsWith("http://") ||
      this.url.startsWith("https://") ||
      this.url.startsWith("data:text/plain")
      ? this.url
      : `http://127.0.0.1:5230/transfer/${this.id}/${this.no}/${this.url}`;
  }
}
</script>

<style></style>
