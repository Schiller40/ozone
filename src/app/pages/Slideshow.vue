<template>
  <div class="wrapper" :id="`wrapper-${slideno}`">
    <transition :name="transition.name" :mode="transition.mode">
      <router-view
        :slide="slideshow.slides[slideno]"
        @finished="nextSlide()"
        v-if="slideshow"
        :key="$route.params.slideno"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { request } from "graphql-request";
import { Transition } from "../app.vue";
import parse from "parse-duration";

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
})
export default class Slideshow extends Vue {
  slideshowid: string = this.$route.params.slideshowid;
  slideshow: SlideshowObject = null;

  get slideno() {
    return parseInt(this.$route.params.slideno);
  }
  timeout: number = null;

  transition: Transition = {
    name: "",
    mode: "",
  };

  async mounted() {
    const query =
      "query getSlideshow ($id:String!){slideshow(id:$id) {slides {url, mime, repeat, text, duration, transition {name, mode}}, repeat}}";
    const variables = {
      id: this.slideshowid,
    };

    request("http://127.0.0.1:5230/graphql", query, variables)
      .then((response) => {
        this.slideshow = response.slideshow;
        console.log(this.slideshow);
        this.timeout = window.setTimeout(
          this.nextSlide,
          parse("" + this.slideshow.slides[this.slideno].duration)
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
      this.$router.push(`/viewer/${this.slideshowid}/${nextSlideNo}`);
      clearTimeout(this.timeout);
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
    this.$router.push(`/viewer/${this.slideshowid}/${lastSlideNo}`);
    clearTimeout(this.timeout);
    this.timeout = window.setTimeout(
      this.nextSlide,
      parse("" + this.slideshow.slides[lastSlideNo].duration)
    );
  }

  applyStyle() {
    let link = document.getElementById("customStyle") as HTMLLinkElement;
    link.href = `http://127.0.0.1:5230/transfer/${this.slideshowid}/style.css`;
  }

  beforeDestroy() {
    clearTimeout(this.timeout);
  }
}
</script>

<style></style>
