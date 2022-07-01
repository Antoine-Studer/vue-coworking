<template>
  <div id="vue-cow">
    <CowHeader/>
    <CowFooter/>
  </div>
</template>

<script>

import CowHeader from './components/CowHeader.vue'
import CowFooter from './components/CowFooter.vue'
export default {
  name: 'App',
  components: { CowHeader, CowFooter }
}
</script>

<style>
#vue-cow {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}
@media screen and (min-width: 2048px) {
  #vue-cow {
    width: 2048px;
    margin: 0 auto;
  }
}
</style>
