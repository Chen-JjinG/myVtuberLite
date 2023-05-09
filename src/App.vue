<style lang="scss">
// background: url('../img/bg.jpg') repeat center top #826e79;
.html {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0%;
}

.body {
  margin: 0;
  padding: 0;
}
</style>
<template>
  <div class="html body">
    <router-view></router-view>
  </div>
</template>




<script setup lang="ts">
import Main3Dscence from './3Dpage/main3Dscence.vue';
import HelloWorld from './components/HelloWorld.vue'
</script>