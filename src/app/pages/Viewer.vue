<template lang="html">
  <div class="container">
    <p v-if="!valid">Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <router-link :key="s" v-if="!valid" v-for="s in slideshows" :to="'/viewer/' + s" :s="s" class="slideshowlink">{{s}}</router-link>
    <img :src="imageSrc" v-if="containsImage" :class="{image: true, loading: loading}" :onload="loading = false">
    <video autoplay class="video" v-if="containsVideo" :src="videoSrc"></video>
    <iframe :src="iframeSrc" ref="iframe" class="iframe" v-if="containsIframe"></iframe>
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

      loading: true,

      id: this.$props.slideshowId,
      no: this.$props.slideNo,

      to: -1,

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
      this.customStyle = true
      this.applyStyle('$default')
    }
  },
  methods: {
    setType(type, type1){
      this.type = type;
      type1 = type1==undefined ? '' : type1
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

        // reset(should not happen unless improper use)
        if (slide == undefined){
          this.newSlide(0)
        }

        // mimetype settings
        var type = slide.mime.split('/')[0]
        if (slide.text != undefined){
          type += 'text'
        }
        this.setType(type, slide.mime.split('/')[1]);

        // next slide invokation
        const lastSlide = this.no == slideshow.slides.length - 1
        const nextSlide = lastSlide ? (slideshow.repeat ? 0 : -1) : this.no - 0 + 1
        console.log(`momentan: ${this.no}, nächste: ${nextSlide}`);
        let videoDurationControl = false
        if (slide.duration != 'auto'){
          this.to = setTimeout(() => {
            this.newSlide(nextSlide)
          }, ipcRenderer.sendSync('parse', slide.duration))
        } else {
          if (this.containsVideo){
            videoDurationControl = true
          } else {
            this.newSlide(nextSlide)
          }
        }

        this.applyStyle(slide.style)

        if (this.containsImage){
          while (document.getElementsByClassName('image')[0] == undefined)
            await this.$nextTick();
          let img = document.getElementsByClassName('image')[0]
          this.imageSrc = this.resolvePath(slide.url)
        }
        if (this.containsVideo){
          while (document.getElementsByClassName('video')[0] == undefined)
            await this.$nextTick();
          let vid = document.getElementsByClassName('video')[0]
          let iterations = 0
          if (slide.repeat == undefined)
            slide.repeat = 0
          vid.onended = () => {
            let stop = false
            if (iterations == slide.repeat){
              stop = true
              if (videoDurationControl){
                this.newSlide(nextSlide)
              }
            }
            iterations++;
            if (!stop)
              vid.play()
          }
          this.videoSrc = this.resolvePath(slide.url)
        }
        if (this.containsIframe){
          while (document.getElementsByClassName('iframe')[0] == undefined)
            await this.$nextTick();
          let vid = document.getElementsByClassName('iframe')[0]
          this.iframeSrc = this.resolvePath(slide.url)
        }
        if (this.containsText){
          const txt = this.resolvePath(slide.text)
          if (slide.text.startsWith('data:')){
            this.text = ipcRenderer.sendSync('getDataBody', slide.text)
          } else {
            fetch(this.resolvePath(slide.text)).then(response => {
              return response.text()
            }).then(text => {
              this.text = text
            }).catch(e => {
              console.log(e);
            })
          }
        }
      })
    },
    resolvePath(url){
      url = url == undefined ? '' : url
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')){
        return url;
      } else {
        return ipcRenderer.sendSync('getSafePath', this.id, this.no, url)
      }
    },
    displayLinks(){
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
        this.applyStyle('$empty')
      }).catch(err => {
        console.log(err);
      })
    },
    newSlide(slide){
      if (slide != -1)
        this.$router.push(`/viewer/${this.id}/${slide}`)
    },
    applyStyle(url){
      let link = document.getElementById('customStyle')
      if (url === '$default' || url === '' || url === undefined){
        link.href='C://users/coworking/documents/github/ozone/src/app/assets/default.css'
        return
      } else if (url === '$empty'){
        link.href='C://users/coworking/documents/github/ozone/src/app/assets/empty.css'
        return
      }
      link.href = this.resolvePath(url)
    }
  },
  beforeDestroy(){
    clearTimeout(this.to)
  }
}
</script>

<style lang="css" scoped>
</style>
