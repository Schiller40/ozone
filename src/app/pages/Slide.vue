<template>
  <div class="slide" :id="`slide-${slideno + 1}`" :name="slide.name || false">
    <ShowImage
      v-if="containsImage"
      :url="slide.url"
      :no="slideno"
      :id="slideshowid"
    />
    <ShowIframe
      v-else-if="containsIframe"
      :url="slide.url"
      :no="slideno"
      :id="slideshowid"
    />
    <ShowVideo
      v-else-if="containsVideo"
      :url="slide.url"
      :no="slideno"
      :repeat="slide.repeat || 0"
      @playedAllIterations="playedAllIterations()"
      :id="slideshowid"
    />
    <ShowText
      v-if="containsText"
      :url="slide.text"
      :no="slideno"
      :id="slideshowid"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ShowImage from "../subpages/ShowImage.vue";
import ShowVideo from "../subpages/ShowImage.vue";
import ShowIframe from "../subpages/ShowIframe.vue";
import ShowText from "../subpages/ShowText.vue";
import { SlideObject } from "../pages/Slideshow.vue";

@Component({
  name: "Slide",
  components: {
    ShowImage,
    ShowIframe,
    ShowText,
    ShowVideo,
  },
})
export default class Slide extends Vue {
  @Prop()
  slide: SlideObject;

  @Prop()
  slideno: number;
  @Prop()
  slideshowid: string;

  // slideno: number = parseInt(this.$route.params.slideno);
  // slideshowid: string = this.$route.params.slideshowid;

  containsImage = false;
  containsVideo = false;
  containsIframe = false;
  containsText = false;

  mounted() {
    if (this.slide.mime.indexOf("image") !== -1) this.containsImage = true;
    else if (this.slide.mime.indexOf("video") !== -1) this.containsVideo = true;
    else if (this.slide.mime === "text/html") this.containsIframe = true;
    if (this.slide.mime === "text/plain" || this.slide.text)
      this.containsText = true;
  }

  playedAllIterations() {
    if (this.slide.duration === "auto") {
      this.$emit("finished");
    }
  }
}
</script>

<style lang="scss"></style>
