<template>
    <el-menu style="height: 50px;" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
        <el-menu-item index="0" @click="pushToHome">
            <!-- <el-image :src="logourl" :fit="'contain'" /> -->
            <div style="height: 100px;width: 100px;overflow:hidden;padding: 2px;">  
                <img style="width: 100%;height: 100%;object-fit:contain;" src="../assets/LogoMakr-7ppifX.png" />
            </div>
            
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1" @click="pushToStudio">VitrualHuman-Studio</el-menu-item>
        <el-sub-menu index="2">
            <template #title>Content-Share</template>
            <el-menu-item index="2-1" @click="pushToModelContentShare">Vitrual-Model</el-menu-item>
            <el-menu-item index="2-2" @click="pushToBackgroundContentShare">Vitrual-Background</el-menu-item>
            <!-- 
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
                <template #title>item four</template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
                <el-menu-item index="2-4-2">item two</el-menu-item>
                <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu> -->
        </el-sub-menu>
        <div class="flex-grow" />
    </el-menu>
</template>
  
<script lang="ts" setup>
import {
    Loading,
    Check,
    Close,
    CameraFilled
} from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus';
import { ref } from 'vue'
import router from '../router';
import StudioPage from '../views/StudioPage.vue';

const logourl='src/assets/LogoMakr-8Mnxjc.png'

const props = defineProps({
    activeIndexFormPage: String
})

const activeIndex = ref(props.activeIndexFormPage)
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const pushToStudio = () => {
    router.push({ name: "studio" })
    activeIndex.value = '1'
}
const pushToHome = () => {
    router.push({ name: "home" })
    activeIndex.value = '0'
}
const pushToModelContentShare = () => {
    router.push({ name: "modelContentShare" })
    activeIndex.value = '2-1'
}

const pushToBackgroundContentShare = () => {
    router.push({ name: "backgroundContentShare" })
    activeIndex.value = '2-1'
}
</script>
  
<style>
.flex-grow {
    flex-grow: 1;
}
</style>
  