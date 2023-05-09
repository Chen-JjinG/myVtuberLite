<template>
    <el-card class="custom-card">
      <div class="custom-card-mask">
        1111111
      </div>
      <div class="custom-card-content">
        aaaaaaaaaaa
      </div>
    </el-card>
  </template>
  
  <style lang="scss">
  .custom-card {
    position: relative;
  }
  
  .custom-card-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,rgba(255,255,255,0.2),rgba(255,255,255,0.2),v-bind(getRandomColor()));
    // background: linear-gradient(to right,#22c3e3, #555);
    opacity: 0.6;
    z-index: 1;
  }
  
  .custom-card-content {
    position: relative;
    z-index: 2;
  }
  </style>
  
  <script lang="ts" setup>

      // 随机生成一个 6 位的十六进制颜色值
      function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        console.log(color)
        return "#"+color;
      }
  </script>
  