<template lang="html">
  <div class="device-settings">
    <h1>Setup abgeschlossen!</h1>
    <router-link to="/deventry"><button type="button" class="buttonCenter" name="finish">Setup schließen.</button></router-link>
    <h2>Nächste Schritte</h2>
    <p>Sie können jetzt über Superflare weitere Geräte hinzufügen oder Präsentationen erstellen und auf die Geräte spielen. Starten Sie dazu, falls noch nicht geschehen, die Superflare-Anwendung und wählen Sie "Neue Präsentation".</p>
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
  },
  methods: {
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
  text-align: center;
  margin-top: 7rem;
}

a{
  text-decoration: none;
}

.buttonCenter{
  margin: 5rem auto 3rem auto;
  display: block;
  padding: .6rem;
  font-size: 1.5rem;
  border: none;
  border-radius: .4rem;
  background-color: $green;
  color: $white;
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
