<template lang="html">
  <div class="devEntry">
    <router-link to="/viewer">Viewer</router-link>
    <router-link to="/setup">Setup</router-link>
  </div>
</template>

<script>
export default {
  name: 'devEntry'
}
</script>

<style lang="css" scoped>
.devEntry{
  position: absolute;
  background-color: black;
  width: 100vw;
  height: 100vh;
}
a{
  color: white;
  margin: 0rem 1rem;
  padding: 1rem 0rem 0rem 0rem;
  display: block;
  font-size: 2rem;
  text-align: center;
  font-family: Rubik, sans-serif;
}
</style>
