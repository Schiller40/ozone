<template lang="html">
  <div class="viewer-container">
    <p v-if="!valid">Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <router-link :key="s" v-if="!valid" v-for="s in slideshows" :to="'/viewer/' + s" :s="s" class="slideshowlink">{{s}}</router-link>
    <img :src="imageSrc" ref="image" v-if="containsImage" :class="{image: true, verMax: verMax, horMax: horMax, center: center, stretch: stretch}">
    <video autoplay ref="video" :class="{video: true, verMax: verMax, horMax: horMax, center: center, stretch: stretch}" v-if="containsVideo" :src="videoSrc"></video>
    <iframe :src="iframeSrc" ref="iframe" :class="{iframe: true, stretch: stretch}" v-if="containsIframe"></iframe>
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
      containsVideo: true,
      videoSrc: '',
      containsIframe: false,
      iframeSrc: '',

      verMax: false,
      horMax: false,
      center: false,
      stretch: false,

      customStyle: false,

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
    setType(type, type1){
      this.type = type;
      this.containsImage = type.includes('img') || type.includes('image');
      this.containsText = (type.includes('text') && !type1.includes('html') && !type.includes('iframe')) || type.includes('texttext');
      this.containsIframe = type.includes('iframe') || type1.includes('html');
      this.containsVideo = type.includes('video');
    },
    display(){
      fetch(`file:///${ipcRenderer.sendSync('getSlideshowDirectory')}/${this.id}/slideshow.json`).then(response => {
        return response.json()
      }).then(async data => {
        const slideshow = data
        let slide = slideshow.slides[this.no]

        var type = slide.mime.split('/')[0]
        if (slide.text != undefined){
          type += 'text'
        }
        this.setType(type, slide.mime.split('/')[1]);

        if (slide.style == undefined){
          slide.style = ''
        }
        const styles = slide.style.split('|')

        let customStyle = undefined;
        for (let s of styles){
          if (!s.includes('$') && slide.style != ''){
            customStyle = s
            this.customStyle = true
          }
        }

        if (this.containsImage){
          while (document.getElementsByClassName('image')[0] == undefined)
            await this.$nextTick();
          let img = document.getElementsByClassName('image')[0]
          img.onload = () => {
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
          this.imageSrc = this.resolvePath(slide.url)
        }
        if (this.containsVideo){
          while (document.getElementsByClassName('video')[0] == undefined)
            await this.$nextTick();
          let vid = document.getElementsByClassName('video')[0]
          vid.onloadstart = () => {
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
              if (vid.videoHeight / window.innerWidth < vid.videoWidth / window.innerHeight){
                this.verMax = true;
              } else {
                this.horMax = true;
              }
            }
          }
          this.videoSrc = this.resolvePath(slide.url)
        }
        if (this.containsIframe){
          while (document.getElementsByClassName('iframe')[0] == undefined)
            await this.$nextTick();
          let vid = document.getElementsByClassName('iframe')[0]
          if (slide.style.includes('$center'))
            this.center = true;
          else if (slide.style.includes('$contain') || slide.style == undefined || slide.style == '' || slide.style.includes('$cover') || slide.style.includes('$stretch')){
            this.stretch = true
          }
          this.iframeSrc = this.resolvePath(slide.url)
        }
        if (this.containsText){
          if (slide.text.startsWith('$')){
            this.text = slide.text.substring(1)
          } else {
            fetch(this.resolvePath(slide.text)).then(response => {
              return response.text()
            }).then(text => {
              this.text = text
            })
          }
        }
        if (customStyle != undefined){
          let link = document.createElement('link')
          link.href = ipcRenderer.sendSync('getSafePath', this.id, this.no, customStyle)
          link.type = 'text/css'
          link.rel = 'stylesheet'
          document.getElementsByTagName('head')[0].appendChild(link)
        }
      })
    },
    resolvePath(url){
      if (url.startsWith('http://') || url.startsWith('https://')){
        return url;
      } else {
        return ipcRenderer.sendSync('getSafePath', this.id, this.no, url)
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
  },
  beforeDestroy(){
    if (this.customStyle){
      const link = document.getElementsByTagName('link')[0]
      link.parentNode.removeChild(link)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
