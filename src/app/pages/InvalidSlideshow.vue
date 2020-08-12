<template lang="html">
  <div class="">
    <p>Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
  name: "invalidSlideshow",
})
export default class InvalidSlideshow extends Vue {
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

<style lang="css" scoped>
p {
  color: white;
}

.slideshowlink {
  color: white;
  display: block;
}
</style>
