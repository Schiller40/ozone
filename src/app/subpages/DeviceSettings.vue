<template lang="html">
  <div class="device-settings">
    <h1>Geräteeinstellungen</h1>
    <p>Bitte geben Sie hier Informationen zu diesem Gerät ein. Die Infos sind nur zur späteren Orientierung und können jederzeit geändert werden.</p>
    <div class="gridTwo">
      <input type="text" class="ozoneTextInput" required id="deviceNameInput" ref="deviceNameInput" placeholder="Gerätename">
      <input type="text" class="ozoneTextInput" required id="deviceLocationInput" ref="deviceLocationInput" placeholder="Ort des Geräts">
    </div><br><br>
    <button type="button" name="button" class="cancelButton" @click="$emit('cancel')">{{cancelButtonText}}</button>
    <button type="button" name="button" ref="confirmButton" class="confirmButton" @click="confirmPressed">{{confirmButtonText}}</button>
  </div>
</template>

<script>
export default {
  name: 'deviceSettings',
  props: {
    cancelButtonText:{ type: String, default:'Abbrechen' },
    confirmButtonText:{ type: String, default: 'Anwenden' }
  },
  mounted(){
    this.$refs.deviceLocationInput.value = window.localStorage.getItem('deviceLocation')
    this.$refs.deviceNameInput.value = window.localStorage.getItem('deviceName')
  },
  methods: {
    confirmPressed(){
      if (this.$refs.deviceNameInput.value && this.$refs.deviceLocationInput.value){
        window.localStorage.setItem('deviceName', this.$refs.deviceNameInput.value)
        window.localStorage.setItem('deviceLocation', this.$refs.deviceLocationInput.value)
        this.$emit('ok')
      } else {
        this.$refs.confirmButton.classList.add('animate__shakeX')
        setTimeout(() => {
          this.$refs.confirmButton.classList.remove('animate__shakeX')
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.device-settings{
  position: absolute;
  width: 60rem;
  max-width: 80%;
  background-color: #fff9;
  height: 50rem;
  max-height: 80%;
  overflow: auto;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-sizing: border-box;
}

h1{
  margin: 0px;
}

.confirmButton, .cancelButton{
  padding: $default-padding;
  background-color: $green;
  color: $white;
  border: none;
  border-radius: $default-padding;
}
.cancelButton{
  background-color: $red;
}

.gridTwo{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}


@keyframes shakeX {
  from, to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%, 30%, 50%, 70%, 90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%, 40%, 60%, 80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}
.animate__shakeX {
  animation-name: shakeX;
  animation-duration: 1s;
}
</style>
