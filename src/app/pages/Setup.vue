<template lang="html">
  <div class="setup">
    <transition :name='transitionName'>
      <router-view @ok="ok()" @cancel="cancel()" confirmButtonText="Weiter" cancelButtonText="Zurück" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'setup',
  data(){
    return {
      transitionName: 'ozone-setup-screen'
    }
  },
  mounted(){
    if (this.$route.path == '/setup')
      this.$router.push('/setup/lansettings')
  },
  methods: {
    ok(){
      this.transitionName = 'ozone-setup-screen'
      console.log('ok');
      switch(this.$route.path){
        case '/setup/lansettings':
          this.$router.push('/setup/devicesettings')
          break;
        case '/setup/devicesettings':
          this.$router.push('/setup/ozonenetworksettings')
          break;
        case '/setup/ozonenetworksettings':
          this.$router.push('/setup/setupcomplete')
          break;
      }
    },
    cancel(){
      this.transitionName = 'ozone-setup-screen-back'
      console.log('cancel')
      this.$router.go(-1)
    },
    // newData(key, data){
    //   switch(key){
    //     case 'deviceSettings':
    //       window.localStorage.setItem('', '')
    //       break;
    //   }
    // }
  }
}
</script>

<style lang="css" scoped>
.setup{
  background-image: url('../assets/Setup_Background.jpg');
  width: 100vw;
  height: 100vh;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Rubik;
}
</style>
