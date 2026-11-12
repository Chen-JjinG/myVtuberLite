<style src="../3Dpage/css/camera.css"/>
<template>
    <div>
        <TopNaviMenu :active-index-form-page="activeIndex"></TopNaviMenu>
    </div>
    <Loding ref="_Loding" :isLoaing="isLoaing"></Loding>
    <div class="common-layout">
        <el-container>
            <el-aside width="0">
                <div class="card flex justify-content-center" style="width: 0;margin: 0%;padding: 0%;">
                    <Sidebar v-model:visible="sidebar_visible" style="width: 190px;">
                        <div v-for="num in modelList" :key="num">
                            <div style="margin: 10px; cursor: pointer;" @click="select_vrm(num)">
                                <el-image :src="modelPreview(num)"
                                    style="width: 128px; height: 128px; border-radius: 50%;" :fit="'cover'"></el-image>
                                <div style="text-align: center; font-size: 12px;">{{ modelLabel(num) }}</div>
                            </div>
                        </div>
                    </Sidebar>
                    <Sidebar v-model:visible="sidebar_background_visible" style="width: 190px;">
                        <div v-for="num in backgroundList" :key="num">
                            <div style="margin: 10px; cursor: pointer;" @click="backgroundChange(num)">
                                <el-image :src="backgroundPreview(num)"
                                    style="width: 128px; height: 128px; border-radius: 50%;"
                                    :fit="'cover'"></el-image>
                                <div style="text-align: center; font-size: 12px;">{{ backgroundLabel(num) }}</div>
                            </div>
                        </div>
                    </Sidebar>
                </div>
            </el-aside>
            <el-main style="padding:0%;position: relative;">
                <div v-show="ifCameraOpen" :class="preview">
                    <video class="input_video"></video>
                    <canvas class="guides"></canvas>
                </div>
                <main3Dscence @openLoading="openLoading" ref="_3Dscene" :background_color="background_color"
                    :vrm_fileid="the_selected_vrm_fileid" :vrm_url="selectedVrmUrl" :key="isUpdateChild">
                </main3Dscence>
            </el-main>
            <el-aside width="100px">
                <OperationSideList @changeTarget="changeTarget" @openLoading="openLoading" @colorChange="colorChange"
                    @background-change="showBackground" @getPreviewPosition="getPreviewPosition"
                    @cameraOperate="cameraOperate" @change-model="changeModel">
                </OperationSideList>
            </el-aside>
        </el-container>
    </div>
</template>  

<script lang="ts" setup>
import SpeedDial from 'primevue/speeddial';
import Main3Dscence from '../3Dpage/main3Dscence.vue';
import Loding from '../components/Loding.vue';
import OperationSideList from '../components/Operating/OperationSideList.vue';
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { own_model, own_background } from '../http/userServer'
import { bundledBackground, bundledBackgroundUrl, bundledModelUrl, bundledModels } from '../utils/assetUrl'
import localModelThumb from '../assets/LogoMakr-7ppifX.png'
import { List } from 'lodash';
import router from '../router';
import { Color } from 'three/src/math/Color';
import Sidebar from 'primevue/sidebar';
import { ElLoading } from 'element-plus';

const activeIndex = '1'

const isLoaing = ref(false)
const _3Dscene = ref()
const _Loding = ref()
const sidebar_visible = ref(false)
const sidebar_background_visible = ref(false)
// let background_color = ref(new Color(0x40E0D0))
let background_color = ref();
let background_url = ref(bundledBackgroundUrl());
const remoteLibrary = ref(false)
//选取模型文件的id。1 = 内置 Miku2，2 = 内置 Miku。
let the_selected_vrm_fileid = ref<Number>(1)

//let background_color = ref(new Color(0x40E0D0))
const colorChange = (hexColor) => {
    let colorHex = new Color()
    colorHex.setHex(parseInt(hexColor, 16))
    // background_color.value = '#' + hexColor
    _3Dscene.value.changeBackground(true, colorHex)
    // background_color.value = colorHex
    // console.log(background_color.value)
}

const backgroundChange = (num) => {
    if (remoteLibrary.value) {
        background_url.value = '/api/file/download/' + num.toString() + '/' + '1'
    } else {
        background_url.value = bundledBackgroundUrl()
    }
    _3Dscene.value.changeBackground(false, background_url.value)
}

const modelPreview = (num) => {
    if (remoteLibrary.value) return '/api/file/download/' + num.toString() + '/' + '3'
    return localModelThumb
}

const backgroundPreview = (num) => {
    if (remoteLibrary.value) return '/api/file/download/' + num.toString() + '/' + '1'
    return bundledBackgroundUrl()
}

const modelLabel = (num) => {
    if (!remoteLibrary.value) {
        return bundledModels.find((model) => model.id === Number(num))?.name ?? String(num)
    }
    return String(num)
}

const backgroundLabel = (num) => {
    if (!remoteLibrary.value && Number(num) === bundledBackground.id) return bundledBackground.name
    return String(num)
}

const selectedVrmUrl = computed(() => {
    const id = Number(the_selected_vrm_fileid.value)
    if (remoteLibrary.value) return '/api/file/download/' + id + '/0'
    return bundledModelUrl(id)
})

const changeModel = () => {
    sidebar_visible.value = !sidebar_visible.value
}

const showBackground = () => {
    sidebar_background_visible.value = !sidebar_background_visible.value
}

const changeTarget = (target) => {
    console.log(target)
    _3Dscene.value.changeTarget(target)
}

const openLoading = (loadingArguments) => {
    // isLoaing.value = !isLoaing.value
    console.log(loadingArguments.loadingBool)
    _Loding.value.changeVisible(loadingArguments.loadingBool, loadingArguments.loadingText)
    // _3Dscene.value.init()
    console.log('yeah')
}

// console.log(background_color.value.getHex())

let preview = ref("previewRightTop")
let ifCameraOpen = ref(false)
let isChooseModel = ref(false)
const getPreviewPosition = (positon) => {
    preview.value = positon
    console.log(preview.value)
}
const cameraOperate = () => {
    console.log(ifCameraOpen.value)
    ifCameraOpen.value = !ifCameraOpen.value
    console.log(ifCameraOpen.value)
}

const url =
    'https://img0.baidu.com/it/u=3960025128,1503098433&fm=253&fmt=auto&app=138&f=JPEG?w=405&h=405'

let modelList = ref<number[]>(bundledModels.map((model) => model.id))
let backgroundList = ref<number[]>([bundledBackground.id])
onMounted(async () => {
    let token = sessionStorage.getItem("token")
    if (token == null) return
    try {
        const models = (await own_model(Number(token))).data?.model_list
        const backgrounds = (await own_background(Number(token))).data?.background_list
        if (Array.isArray(models) && models.length) modelList.value = models
        if (Array.isArray(backgrounds) && backgrounds.length) backgroundList.value = backgrounds
        remoteLibrary.value = true
    } catch (error) {
        console.warn(error)
    }
})

let _3DscenePosition = ref()

//控制子组件刷新
let isUpdateChild = ref(true)

const select_vrm = (num) => {
    console.log(num)
    the_selected_vrm_fileid.value = num
    isUpdateChild.value = !isUpdateChild.value
    // the_selected_vrm_fileid =
}

onUnmounted(() => {
    location.reload()
})
</script>
