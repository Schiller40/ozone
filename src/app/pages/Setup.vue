<template lang="html">
  <div class="setup">
    <transition name='ozone-setup-screen'>
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'setup',
  data(){
    return {
    }
  },
  mounted(){
    this.$emit('setTransition', 'ozone-setup-screen')
    if (this.$route.path == '/setup')
      this.$router.push('/setup/lansettings')
  }
}
</script>

<style lang="css" scoped>
.setup{
  background-image: url('../assets/Setup_Background.jpg');
  width: 100vw;
  height: 100vh;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Rubik;
}
</style>
