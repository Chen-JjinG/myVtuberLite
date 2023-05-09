<template>
    <div>
        <TopNaviMenu :active-index-form-page="activeIndex"></TopNaviMenu>
    </div>
    <div class="showcase">
        <video src="../assets/homeBcakgroundVideo.mp4" muted loop autoplay></video>

        <div class="overlay"></div>

        <div class="text">
            <h2>Virtual-Human</h2>
            <h3>全新的虚拟人解决方案</h3>
            <p>本系统主要通过人体姿态与人脸识别技术为虚拟人进行直播与表演提供一个低成本的方案
                同时简化虚拟人相关资源获取的途径，让用户可以更快上手 !</p>
            <a href="#" @click="pushtoStudio">JOIN NOW!</a>
        </div>
    </div>
</template>  
<script lang="ts" setup>
import TopNaviMenu from '../components/TopNaviMenu.vue';
import router from '../router';

const activeIndex = '0'
const pushtoStudio = () => router.push({ name: "studio" })
</script>
<style src="../css/homeStyle.css"></style>