<template lang="html">
  <div class="setup">

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
  }
}
</script>

<style lang="css" scoped>
</style>
