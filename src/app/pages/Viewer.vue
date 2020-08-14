<template lang="html">
  <div class="wrapper" :id="wrapperId">
    <transition :name="transition.name" :mode="transition.mode">
      <EmptySlideshow v-if="!prioritizedId" />
      <InvalidSlideshow v-else-if="prioritizedId.length != 21" />
      <Slideshow v-else :id="prioritizedId" :key="prioritizedId" @settransition="transition = $event"/>
    </transition>
  </div>
</template>

<script lang="ts">
import InvalidSlideshow from "@/pages/InvalidSlideshow.vue";
import EmptySlideshow from "@/pages/EmptySlideshow.vue";
import Slideshow from "@/pages/Slideshow.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Transition } from "../app.vue";

@Component({
  components: {
    InvalidSlideshow,
    EmptySlideshow,
    Slideshow,
  },
  name: "viewer",
})
export default class Viewer extends Vue {
  wrapperId = "wrapper";
  transition: Transition = {
    name: "",
    mode: "",
  };

  @Prop()
  prioritizedId: string;
}
</script>

<style lang="css" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: black;
}
</style>
