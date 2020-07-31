<template lang="html">
  <transition :name="transition.name" :mode="transition.mode">
    <router-view
      v-model="wrapperId"
      @setTransition="transition = $event"
      @showCurrentSlideshow="showPrioritizedSlideshow()"
      :key="$route.params.slideshowId"
    />
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
const { ipcRenderer } = window;
interface VisualStackElement {
  id: string;
  lastModified: number;
}
export interface Transition {
  name: string;
  mode?: string;
}

@Component({
  components: {},
})
export default class app extends Vue {
  wrapperId = "wrapper";
  transition: Transition = {
    name: "ozone-setup-screen",
    mode: "",
  };
  visualStack: VisualStackElement[] = [];

  mounted() {
    ipcRenderer.on(
      "addToVisualStack",
      (_event, id, lastModified, play = true) => {
        this.addToVisualStack(id, lastModified, play);
      }
    );
    ipcRenderer.on("removeFromVisualStack", (_event, id, play = true) => {
      this.removeFromVisualStack(id, play);
    });
  }

  showPrioritizedSlideshow() {
    if (
      this.visualStack.length == 0 ||
      this.$route.hash.indexOf("/viewer") === -1
    ) {
      if (this.visualStack.length == 0)
        this.$router.push("/viewer/emptyslideshow");
      return { changed: false, newId: null };
    }
    const prioritizedId = this.visualStack[this.visualStack.length - 1].id;
    if (!location.hash.includes(`/viewer/${prioritizedId}`)) {
      this.transition = { name: "", mode: "" };
      this.$router.push(`/viewer/${prioritizedId}/0`);
      return { changed: true, newId: prioritizedId };
    } else {
      return { changed: false, newId: prioritizedId };
    }
  }
  addToVisualStack(id: string, lastModified: number, play: boolean) {
    console.log(id);
    console.log(lastModified);
    console.log(play);
    if (
      typeof lastModified !== "number" ||
      typeof id !== "string" ||
      !id ||
      id.length != 21
    ) {
      console.log("invalid id provided or priority is NaN");
      return false;
    }
    this.visualStack = this.visualStack.filter((vse) => vse.id !== id);
    this.visualStack.push({ id, lastModified });
    this.visualStack = this.visualStack.sort((a, b) =>
      a.lastModified > b.lastModified ? 1 : -1
    );
    if (play) {
      const show = this.showPrioritizedSlideshow();
      if (show.changed) {
        console.log(`showing ${show.newId}`);
      } else {
        console.log(`added ${id} to the visual stack but it's not prioritized`);
      }
    }
    return true;
  }
  removeFromVisualStack(id: string, play: boolean) {
    const len = this.visualStack.length;
    this.visualStack = this.visualStack.filter((vse) => vse.id !== id);
    if (play) {
      const show = this.showPrioritizedSlideshow();
      if (show.changed) {
        console.log(`removed ${id} and showing ${show.newId} now`);
      } else {
        console.log(
          `removed ${id} from the visual stack but wasn't prioritized`
        );
      }
    }
    if (len === this.visualStack.length + 1) return true;
    return false;
  }
}
</script>

<style lang="css" scoped></style>
