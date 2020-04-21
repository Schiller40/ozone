<template lang="html">
  <div class="viewer-container">
    <p v-if="!valid">Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <router-link :key="s" v-if="!valid" v-for="s in slideshows" :to="'/viewer/' + s" :s="s" class="slideshowlink">{{s}}</router-link>
    <img :src="imageSrc" v-if="containsImage">
    <video :src="videoSrc" autoplay v-if="containsVideo"></video>
    <p v-if="containsText" class="text">{{text}}</p>
  </div>
</template>

<script>

export default {
  name: 'Viewer',
  props: [
    'slideshowId',
    'slideNo'
  ],
  data(){
    return{
      valid: false,
      type: '',
      containsText: true,
      text: '',
      containsImage: false,
      imageSrc: '',
      containsVideo: false,
      videoSrc: '',
      containsIframe: false,
      iframeSrc: '',

      id: this.$props.slideshowId,
      no: this.$props.slideNo,

      slideshows: []
    }
  },
  mounted(){
    this.valid = this.id != undefined && this.id != 'nA';
    if(this.no == undefined){
      this.no = 0
    }
    if (this.valid){
      this.display();
    } else if (this.id == 'nA' || this.id == undefined){
      this.displayLinks();
    }
  },
  methods: {
    setType(type){
      this.type = type;
      this.containsImage = type.includes('img') || type.includes('image');
      this.containsText = type.includes('text');
      this.containsIframe = type.includes('iframe') || type.includes('html');
      this.containsVideo = type.includes('video');
    },
    async display(){
      try{
        const slideshow = await ipcRenderer.invoke('getSlideshow', this.id)
        const slide = slideshow.slides[this.no]
        var type = slide.mime.split('/')[0]
        if (slide.text != undefined){
          type += 'text'
        }
        console.log(type);
        this.setType(type);
        if (this.containsImage){
          const array = await ipcRenderer.invoke('getResource', this.id, this.no, slide.url)
          /*console.log(array);
          const base64data = btoa(String.fromCharCode.apply(null, array));
          console.log(base64data);
          this.imageSrc = 'data:image/png;base64,' + base64data;*/
          this.imageSrc = array
        }
        if (this.containsVideo){

        }
        if (this.containsIframe){

        }
        if (this.containsText){
          if (slide.text.startsWith('$')){
            this.text = slide.text.substring(1)
          } else {

          }
        }
      } catch (e){
        console.log(e);
      }
    },
    displayLinks(){
      ipcRenderer.invoke('getAvailableSlideshows').then(result => {
        this.slideshows = result
        this.valid = true
        this.valid = false
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style lang="css" scoped>
.viewer-container{
  background-color: black;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: white;
}
.slideshowlink{
  color: white;
  display: block;
}

.text{
  font-family: Arial;
  margin: 0px;
  color: white;
  font-size: 8rem;
  text-align: center;
}
</style>
