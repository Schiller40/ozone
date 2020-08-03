<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "emptySlideshow",
})
export default class EmptySlideshow extends Vue {
  mounted() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case "h":
          this.$router.push("/");
      }
    };
  }
  beforeDestroy() {
    document.onkeydown = () => {};
  }
}
</script>

<style scoped>
div {
  position: absolute;
  width: 100vw;
  height: 100vh;
  color: black;
  top: 0px;
  left: 0px;
}
</style>
