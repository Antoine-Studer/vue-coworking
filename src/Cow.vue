<template>
  <div id="vue-cow">
    <CowHeader/>
    <CowInfos/>
    <CowButtons/>
    <CowBuildingsSeats/>
    <CowBuildingsRoomsVue/>
    <CowFooter/>
    
  </div>
</template>

<script>

import CowHeader from './components/CowHeader.vue'
import CowFooter from './components/CowFooter.vue'
import CowInfos from './components/CowInfos.vue'
import CowBuildingsSeats from './components/CowBuildingsSeats.vue'
import CowButtons from './components/CowButtons.vue'
import CowBuildingsRoomsVue from './components/CowBuildingsRooms.vue'
export default {
  name: 'App',
  components: { CowHeader, CowFooter, CowInfos, CowBuildingsSeats, CowButtons, CowBuildingsRoomsVue},

}
</script>

<style>
html {
  background-color: gray;
}
#vue-cow {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  color: white;
}
@media screen and (min-width: 2048px) {
  #vue-cow {
    width: 2048px;
    margin: 0 auto;
  }
}
</style>