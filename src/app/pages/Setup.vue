<template lang="html">
  <div class="setup">
    <transition :name="transitionName">
      <router-view
        @ok="ok"
        @cancel="cancel"
        :initialSetup="initialSetup"
        @settransition="transitionName = $event"
      />
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: "setup",
  data() {
    return {
      transitionName: "ozone-setup-screen",
      initialSetup: true,
    };
  },
  mounted() {
    if (this.$route.path.indexOf("/selector") !== -1) {
      this.initialSetup = false;
    }
  },
  methods: {
    ok() {
      this.transitionName = "ozone-setup-screen";
      if (this.initialSetup)
        switch (this.$route.path) {
          case "/setup/welcome":
          case "/":
          case "/setup":
          case "/setup/":
            this.$router.push("/setup/lansettings");
            break;
          case "/setup/lansettings":
            this.$router.push("/setup/ozonenetworksettings");
            break;
          case "/setup/ozonenetworksettings":
            this.$router.push("/setup/devicesettings");
            break;
          case "/setup/devicesettings":
            this.$router.push("/setup/setupcomplete");
            break;
        }
      else this.$router.go(-1);
    },
    cancel() {
      this.transitionName = "ozone-setup-screen-back";
      console.log("cancel pressed");
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.setup {
  background-image: url("../assets/Setup_Background.jpg");
  background-position: center;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Rubik;
  position: absolute;
}
</style>
