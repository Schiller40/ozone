<template lang="html">
  <div class="slide" :id="`slide-${parseInt(no) + 1}`">
    <p v-if="!valid">Keine oder invalide Präsentations-ID und/oder Foliennummer angegeben!</p>
    <router-link class="slideshowlink" v-if="!valid" :key="s" v-for="s in slideshows" :to="'/viewer/' + s" :s="s">{{s}}</router-link>
    <img class="image" :id="`image-${parseInt(no) + 1}`" v-if="containsImage" :src="imageSrc" v-show="loaded" @load="loaded = true" draggable="false">
    <video class="video" :id="`video-${parseInt(no) + 1}`" v-if="containsVideo" :src="videoSrc" autoplay></video>
    <iframe class="iframe" :id="`iframe-${parseInt(no) + 1}`" v-if="containsIframe" :src="iframeSrc"></iframe>
    <p class="text" :id="`text-${parseInt(no) + 1}`" v-if="containsText">{{text}}</p>
  </div>
</template>

<script>

export default {
  name: 'Viewer',
  props: {
    slideshowId: { type: String },
    slideNo: { type: String }
  },
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

      id: this.slideshowId,
      no: this.slideNo,

      to: -1,
      loaded: false,

      slideshows: [],

      transition: {
        name: '',
        mode: ''
      }
    }
  },
  mounted(){
    this.valid = this.id != undefined && this.id != 'nA';
    if(this.no == undefined){
      this.no = 0
    }
    if (this.valid){
      this.$emit('input', `wrapper-${this.no-0+1}`)
      this.display();
    } else if (this.id == 'nA' || this.id == undefined){
      this.displayLinks();
      this.applyStyle()
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
      }).then(async slideshow => {
        let slide = slideshow.slides[this.no]

        // reset(should not happen unless improper use)
        if (slide == undefined || slide == {}){
          this.newSlide(0)
        }

        // mimetype settings
        let type = slide.mime.split('/')[0]
        if (slide.text != undefined){
          type += 'text'
        }
        this.setType(type, slide.mime.split('/')[1]);

        // next slide invokation
        const lastSlide = this.no == slideshow.slides.length - 1
        const nextSlideNo = lastSlide ? (slideshow.repeat ? 0 : -1) : this.no - 0 + 1
        const nextSlide = slideshow.slides[nextSlideNo]
        console.log(`momentan: ${this.no}, nächste: ${nextSlideNo}`);
        let videoDurationControl = false
        if (slide.duration != 'auto'){
          this.to = setTimeout(() => {
            this.newSlide(nextSlideNo)
          }, ipcRenderer.sendSync('parse', slide.duration))
        } else {
          if (this.containsVideo){
            videoDurationControl = true
          } else {
            this.newSlide(nextSlideNo)
          }
        }

        // preload/prefetch
        try{
          await Promise.resolve()
          if (nextSlide.mime != 'text/plain'){
            let l = document.createElement('link')
            l.rel = 'prefetch'
            l.href = this.resolvePath(nextSlide.url, nextSlideNo)
            document.getElementById(`slide-${this.no - 0 + 1}`).appendChild(l)
            if (nextSlide.text != undefined){
              let l2 = document.createElement('link')
              l2.rel = 'prefetch'
              l2.href = this.resolvePath(nextSlide.text, nextSlideNo)
              document.getElementById(`slide-${this.no - 0 + 1}`).appendChild(l2)
            }
          } else if (nextSlide.text != undefined){
            let l2 = document.createElement('link')
            l2.rel = 'prefetch'
            l2.href = this.resolvePath(nextSlide.text, nextSlideNo)
            document.getElementById(`slide-${this.no - 0 + 1}`).appendChild(l2)
          }
        } catch (e){
          console.log(e);
        }


        // next slide transition
        let trans = slideshow.slides[nextSlideNo].transition
        if (trans == undefined){
          trans = {name: '', mode: ''}
        }
        if (trans.mode != 'out-in' && trans.mode != 'in-out'){
          trans.mode = ''
        }
        this.transition = trans

        this.applyStyle()

        if (this.containsImage){
          this.imageSrc = this.resolvePath(slide.url)
        }
        if (this.containsVideo){
          await Promise.resolve()
          let vid = document.getElementById(`video-${this.no - 0 + 1}`)
          let iterations = 0
          if (slide.repeat == undefined)
            slide.repeat = 0
          vid.onended = () => {
            let stop = false
            if (iterations == slide.repeat){
              stop = true
              if (videoDurationControl){
                this.newSlide(nextSlideNo)
              }
            }
            iterations++;
            if (!stop)
              vid.play()
          }
          this.videoSrc = this.resolvePath(slide.url)
        }
        if (this.containsIframe){
          this.iframeSrc = this.resolvePath(slide.url)
        }
        if (this.containsText){
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
    resolvePath(url, slide = this.no){
      url = url == undefined ? '' : url
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')){
        return url;
      } else {
        return ipcRenderer.sendSync('getSafePath', this.id, slide, url)
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
      }).catch(err => {
        console.log(err);
      })
    },
    newSlide(slide){
      if (slide != -1){
        this.$emit('setTransition', this.transition)
        this.$router.push(`/viewer/${this.id}/${slide}`)
      }
    },
    applyStyle(){
      let link = document.getElementById('customStyle')
      let newLink = this.valid ? `${ipcRenderer.sendSync('getSlideshowDirectory')}/${this.id}/style.css` : 'C://users/coworking/documents/github/ozone/src/app/assets/empty.css'
      newLink = 'file:///' + newLink.replace(/\\/g, '/')
      const l = link.href.replace(/\\/g, '/')
      if (l != newLink) {
        link.href = newLink
      }
    },
  },
  beforeDestroy(){
    clearTimeout(this.to)
  }
}
</script>

<style lang="css" scoped>
</style>
