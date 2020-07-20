<template lang="html">
  <div class="slide" :id="`slide-${parseInt(no) + 1}`">
    <img
      class="image"
      :id="`image-${parseInt(no) + 1}`"
      v-if="containsImage"
      :src="imageSrc"
      v-show="loaded"
      @load="loaded = true"
      draggable="false"
    />
    <video class="video" :id="`video-${parseInt(no) + 1}`" v-if="containsVideo" :src="videoSrc" autoplay></video>
    <iframe
      class="iframe"
      :id="`iframe-${parseInt(no) + 1}`"
      v-if="containsIframe"
      :src="iframeSrc"
      :onerror="console.log('unable to show iframe')"
    ></iframe>
    <p class="text" :id="`text-${parseInt(no) + 1}`" v-if="containsText">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'showSlide',
  props: {
    slideshowId: { type: String },
    slideNo: { type: String }
  },
  data() {
    return {
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

      console,

      transition: {
        name: '',
        mode: ''
      }
    }
  },
  async mounted() {
    if (this.no == undefined) {
      this.no = 0
    }
    this.$emit('input', `wrapper-${this.no - 0 + 1}`)
    fetch(`file:///${await ipcRenderer.invoke('getSlideshowDirectory')}/${this.id}/slideshow.json`)
      .then(response => {
        return response.json()
      })
      .then(async slideshow => {
        let slide = slideshow.slides[this.no]

        // reset(should not happen unless improper use)
        if (slide == undefined || slide == {}) {
          this.newSlide(0)
        }

        // mimetype settings
        let type = slide.mime.split('/')[0]
        if (slide.text != undefined) {
          type += 'text'
        }
        this.setType(type, slide.mime.split('/')[1])

        // next slide invokation
        const lastSlide = this.no == slideshow.slides.length - 1
        const nextSlideNo = lastSlide ? (slideshow.repeat ? 0 : -1) : this.no - 0 + 1
        const nextSlide = slideshow.slides[nextSlideNo]
        const previousSlideNo = this.no == 0 ? slideshow.slides.length - 1 : this.no - 1
        console.log(`momentan: ${this.no}, nächste: ${nextSlideNo}`)
        let videoDurationControl = false
        if (slide.duration != 'auto') {
          this.to = setTimeout(() => {
            this.newSlide(nextSlideNo)
          }, ipcRenderer.sendSync('parse', slide.duration))
        } else {
          if (this.containsVideo) {
            videoDurationControl = true
          } else {
            this.newSlide(nextSlideNo)
          }
        }

        // // preload/prefetch
        // try {
        //   await Promise.resolve();
        //   if (nextSlide.mime != "text/plain") {
        //     let l = document.createElement("link");
        //     l.rel = "prefetch";
        //     l.as = "image";
        //     l.href = await this.resolvePath(nextSlide.url, nextSlideNo);
        //     document.getElementById(`slide-${this.no - 0 + 1}`).appendChild(l);
        //     if (nextSlide.text != undefined) {
        //       let l2 = document.createElement("link");
        //       l2.rel = "prefetch";
        //       l2.href = await this.resolvePath(nextSlide.text, nextSlideNo);
        //       document
        //         .getElementById(`slide-${this.no - 0 + 1}`)
        //         .appendChild(l2);
        //     }
        //   } else if (nextSlide.text != undefined) {
        //     let l2 = document.createElement("link");
        //     l2.rel = "prefetch";
        //     l2.href = await this.resolvePath(nextSlide.text, nextSlideNo);
        //     document.getElementById(`slide-${this.no - 0 + 1}`).appendChild(l2);
        //   }
        // } catch (e) {
        //   console.log(e);
        // }

        // next slide transition
        let trans = slideshow.slides[nextSlideNo].transition
        if (trans == undefined) {
          trans = { name: '', mode: '' }
        }
        if (trans.mode != 'out-in' && trans.mode != 'in-out') {
          trans.mode = ''
        }
        this.transition = trans

        this.applyStyle()

        if (this.containsImage) {
          this.imageSrc = await this.resolvePath(slide.url)
        } else if (this.containsVideo) {
          await Promise.resolve()
          let vid = document.getElementById(`video-${this.no - 0 + 1}`)
          let iterations = 0
          if (slide.repeat == undefined) slide.repeat = 0
          vid.onended = () => {
            let stop = false
            if (iterations == slide.repeat) {
              stop = true
              if (videoDurationControl) {
                this.newSlide(nextSlideNo)
              }
            }
            iterations++
            if (!stop) vid.play()
          }
          this.videoSrc = await this.resolvePath(slide.url)
        } else if (this.containsIframe) {
          this.iframeSrc = await this.resolvePath(slide.url)
        }
        if (this.containsText) {
          if (slide.text.startsWith('data:')) {
            this.text = ipcRenderer.sendSync('getDataBody', slide.text)
          } else {
            fetch(await this.resolvePath(slide.text))
              .then(response => {
                return response.text()
              })
              .then(text => {
                this.text = text
              })
              .catch(e => {
                console.log(e)
              })
          }
        }
        document.onkeydown = e => {
          if (e.key == 'ArrowRight') {
            this.newSlide(nextSlideNo)
          } else if (e.key == 'ArrowLeft') {
            this.newSlide(previousSlideNo)
          } else if (e.key == 'h') {
            this.$router.push('/')
          } else if (e.key == 'a') {
            this.newSlide(previousSlideNo, false)
          } else if (e.key == 'd') {
            this.newSlide(nextSlideNo, false)
          }
        }
      })
  },
  methods: {
    setType(type, type1) {
      this.type = type
      type1 = type1 == undefined ? '' : type1
      this.containsImage = type.includes('img') || type.includes('image')
      this.containsText =
        (type.includes('text') && !type1.includes('html') && !type.includes('iframe')) || type.includes('texttext')
      this.containsIframe = type.includes('iframe') || type1.includes('html')
      this.containsVideo = type.includes('video')
    },
    async resolvePath(url, slide = this.no) {
      url = url == undefined ? '' : url
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url
      } else {
        return await ipcRenderer.invoke('getSafePath', this.id, slide, url)
      }
    },
    newSlide(slide, transition = true) {
      if (slide != -1) {
        this.$emit('setTransition', transition ? this.transition : {})
        this.$router.push(`/viewer/${this.id}/${slide}`)
      }
    },
    async applyStyle() {
      let link = document.getElementById('customStyle')
      let newLink = `${await ipcRenderer.invoke('getSlideshowDirectory')}/${this.id}/style.css`
      newLink = 'file:///' + newLink.replace(/\\/g, '/')
      const l = link.href.replace(/\\/g, '/')
      if (l != newLink) {
        link.href = newLink
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.to)
  }
}
</script>

<style lang="css" scoped></style>
