<template>
  <div class="wrapper" :id="`wrapper-${slideno}`">
    <transition :name="transition.name" :mode="transition.mode">
      <Slide
        :slide="slideshow.slides[slideno]"
        @finished="nextSlide()"
        v-if="slideshow"
        :slideno="slideno"
        :slideshowid="id"
        :key="slideno"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { request } from "graphql-request";
import { Transition } from "../app.vue";
import parse from "parse-duration";
import Slide from "@/pages/Slide.vue";

export interface SlideshowObject {
  slides: SlideObject[];
  repeat: boolean;
}
export interface SlideObject {
  name: string;
  url?: string;
  duration: string | number;
  mime: string;
  transition?: Transition;
  repeat?: number;
  text?: string;
}

@Component({
  name: "Slideshow",
  components: {
    Slide,
  },
})
export default class Slideshow extends Vue {
  // slideshowid: string = this.$route.params.slideshowid;
  slideshow: SlideshowObject = null;

  // get slideno() {
  //   return parseInt(this.$route.params.slideno);
  // }
  timeout: number = null;
  slideno: number = 0;

  @Prop()
  id: string;

  transition: Transition = {
    name: "",
    mode: "",
  };

  async mounted() {
    console.log("timeout mounted");
    const query =
      "query getSlideshow ($id:String!){slideshow(id:$id) {slides {url, mime, repeat, text, duration, transition {name, mode}, name}, repeat}}";
    const variables = {
      id: this.id,
    };

    request("http://127.0.0.1:5230/graphql", query, variables)
      .then((response) => {
        this.slideshow = response.slideshow;
        console.log(this.slideshow);
        this.timeout = window.setTimeout(
          this.nextSlide,
          parse("" + this.slideshow.slides[this.slideno || 0].duration)
        );
      })
      .catch((e) => {
        console.log(e);
      });

    this.applyStyle();

    document.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          this.nextSlide(false, true);
          break;
        case "ArrowLeft":
          this.lastSlide();
          break;
        case "a":
          this.lastSlide(true);
          break;
        case "d":
          this.nextSlide(true, true);
          break;
        case "h":
          this.$router.push("/");
      }
    };
  }

  nextSlide(skipTransition: boolean = false, forceRepeat: boolean = false) {
    let nextSlideNo = this.slideno + 1;
    if (nextSlideNo >= this.slideshow.slides.length) nextSlideNo = 0;
    console.log(
      `nextSlide triggered. Current slide: ${this.slideno}, next slide: ${nextSlideNo}`
    );
    if (this.slideshow.repeat || nextSlideNo != 0 || forceRepeat) {
      if (skipTransition) this.transition.name = "";
      else {
        this.transition.name =
          this.slideshow.slides[nextSlideNo].transition?.name || "";
        this.transition.mode =
          this.slideshow.slides[nextSlideNo].transition?.mode || "";
      }
      // this.$router.push(`/viewer/${this.slideshowid}/${nextSlideNo}`);
      this.slideno = nextSlideNo;
      window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(
        this.nextSlide,
        parse("" + this.slideshow.slides[nextSlideNo].duration)
      );
    }
  }

  lastSlide(skipTransition: boolean = false) {
    let lastSlideNo = this.slideno - 1;
    if (lastSlideNo < 0) lastSlideNo = this.slideshow.slides.length - 1;
    if (skipTransition) this.transition.name = "";
    else {
      this.transition.name =
        this.slideshow.slides[lastSlideNo].transition?.name || "";
      this.transition.mode =
        this.slideshow.slides[lastSlideNo].transition?.mode || "";
    }
    this.slideno = lastSlideNo;
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(
      this.nextSlide,
      parse("" + this.slideshow.slides[lastSlideNo].duration)
    );
  }

  applyStyle() {
    let link = document.getElementById("customStyle") as HTMLLinkElement;
    link.href = `http://127.0.0.1:5230/transfer/${this.id}/style.css`;
  }

  beforeDestroy() {
    console.log("timeout destroyed");
    window.clearTimeout(this.timeout);
    document.onkeydown = () => {};
  }
}
</script>

<style></style>
