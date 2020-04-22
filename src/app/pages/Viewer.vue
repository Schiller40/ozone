<template lang="html">
  <div class="viewer-container">
    <p v-if="!valid">Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <router-link :key="s" v-if="!valid" v-for="s in slideshows" :to="'/viewer/' + s" :s="s" class="slideshowlink">{{s}}</router-link>
    <img :src="imageSrc" :class="{image: true, verMax: verMax, horMax: horMax, center: center, stretch: stretch}">
    <video autoplay :class="{video: true, verMax: verMax, horMax: horMax, center: center, stretch: stretch}" v-if="containsVideo">
      <source :src="videoSrc">
    </video>
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
      containsText: false,
      text: '',
      containsImage: false,
      imageSrc: '',
      containsVideo: false,
      videoSrc: '',
      containsIframe: false,
      iframeSrc: '',

      verMax: false,
      horMax: false,
      center: false,
      stretch: false,

      slide: {},

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
        let slide = slideshow.slides[this.no]
        var type = slide.mime.split('/')[0]
        if (slide.text != undefined){
          type += 'text'
        }
        this.setType(type);
        if (this.containsImage){
          const img = document.getElementsByClassName('image')[0]
          img.onload = () => {
            if (slide.style == undefined){
              slide.style = ''
            }
            if (slide.style.includes('$center'))
              this.center = true;
            else if (slide.style.includes('$stretch'))
              this.stretch = true;
            else if (slide.style.includes('$contain') || slide.style == undefined || slide.style == ''){
              if (img.naturalWidth / window.innerWidth > img.naturalHeight / window.innerHeight){
                this.verMax = true;
              } else {
                this.horMax = true;
              }
            } else if (slide.style.includes('$cover')){
              if (img.naturalWidth / window.innerWidth < img.naturalHeight / window.innerHeight){
                this.verMax = true;
              } else {
                this.horMax = true;
              }
            }
          }
          if (!slide.url.startsWith('http://') && !slide.url.startsWith('https://')){
            const array = await ipcRenderer.invoke('getResource', this.id, this.no, slide.url)
            this.imageSrc = URL.createObjectURL(new Blob([array]))
          } else {
            this.imageSrc = slide.url;
          }
        }
        if (this.containsVideo){
          const vid = document.getElementsByClassName('video')
          console.log(vid[0]);
          console.log(vid);
          vid[0].onloadstart = () => {
            if (slide.style == undefined){
              slide.style = ''
            }
            if (slide.style.includes('$center'))
              this.center = true;
            else if (slide.style.includes('$stretch'))
              this.stretch = true;
            else if (slide.style.includes('$contain') || slide.style == undefined || slide.style == ''){
              if (vid.videoWidth / window.innerWidth > vid.videoHeight / window.innerHeight){
                this.verMax = true;
              } else {
                this.horMax = true;
              }
            } else if (slide.style.includes('$cover')){
              if (vid.videoWidth / window.innerWidth < vid.videoHeight / window.innerHeight){
                this.verMax = true;
              } else {
                this.horMax = true;
              }
            }
          }
          if (!slide.url.startsWith('http://') && !slide.url.startsWith('https://')){
            const array = await ipcRenderer.invoke('getResource', this.id, this.no, slide.url)
            this.videoSrc = URL.createObjectURL(new Blob([array]))
          } else {
            this.videoSrc = slide.url;
          }
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
    },
  }
}
</script>

<style lang="css" scoped>
*{
  color: white;
}

.viewer-container{
  background-color: black;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: white;
  position: relative;
}
.slideshowlink{
  color: white;
  display: block;
}

.image{
  position: absolute;
}

.text{
  font-family: Arial;
  margin: 0px;
  color: white;
  font-size: 8rem;
  text-align: center;
  position: absolute;
}

.stretch{
  width: 100%;
  height: 100%;
}

.center{
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.verMax{
  position: absolute;
  width: 100%;
  height: auto;
  top: 50%;
  transform: translateY(-50%);
}
.horMax{
  position: absolute;
  height: 100%;
  width: auto;
  left: 50%;
  transform: translate(-50%);
}
</style>
