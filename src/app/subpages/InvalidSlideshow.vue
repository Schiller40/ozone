<template lang="html">
  <div class="">
    <p>Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <router-link class="slideshowlink" :key="s" v-for="s in slideshows" :to="'/viewer/' + s" :s="s">{{s}}</router-link>
  </div>
</template>

<script>
export default {
  name: 'invalidSlides',
  data(){
    return{
      slideshows: []
    }
  },
  mounted(){
    ipcRenderer.invoke('getAvailableSlideshows').then(result => {
      this.slideshows = result.success
      if (result.err != []){
        result.err.forEach((item, i) => {
          console.log(item);
        });
        ;
      }
      this.valid = true
      this.valid = false
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style lang="css" scoped>

p{
  color:white
}

.slideshowlink{
  color: white;
  display: block;
}

</style>
