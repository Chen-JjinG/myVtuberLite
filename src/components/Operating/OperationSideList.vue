<template class="realBody">
    <!-- <el-button type="primary" @click="openLoading"> As a service </el-button> -->
    <div style="height: 10px;"></div>
    <el-tooltip :content="'是否为纯色背景: ' + isPureColor" placement="top">
        <el-switch v-model="isPureColor" active-color="#13ce66" @change="colorChange" inactive-color="#ff4949"
            active-value="是" inactive-value="否">
        </el-switch>
    </el-tooltip>
    <div style="height: 10px;"></div>
    <div v-show="isPureColor == '是'">
        <ColorPicker v-model="color" @change="colorChange" />
    </div>
    <div v-show="isPureColor == '否'">
        <el-button class="change-background-button" type="primary" @click="colorChange">
            <svg-icon type="mdi" :path="mdiSwapHorizontal"></svg-icon>
            背景切换
        </el-button>
    </div>
    <div style="height: 30px;"></div>
    <el-popover placement="left" v-model:visible="visible">
        <div id="status" style="position: relative;padding: 0%;">

        </div>
        <template #reference>
            <el-button class="change-background-button" style="color: white;" @click="visible = true">
                <svg-icon type="mdi" :path="mdiChartHistogram"></svg-icon>
                性能
            </el-button>
        </template>
    </el-popover>
    <div style="height: 100px;"></div>
    <el-button class="change-target-button" type="primary" @click="targetChange('face')">
        <svg-icon type="mdi" :path="mdiEmoticonWink"></svg-icon>
        face
    </el-button>
    <div style="height: 10px;"></div>
    <el-button class="change-target-button" type="primary" @click="targetChange('full')">
        <svg-icon type="mdi" :path="mdiHuman"></svg-icon>
        full
    </el-button>
    <div style="height: 10px;"></div>
    <el-button class="change-target-button" type="primary" @click="targetChange('half')">
        <svg-icon type="mdi" :path="mdiAccount"></svg-icon>
        half
    </el-button>
    <div style="height: 100px;"></div>
    <el-tooltip class="item" effect="dark" content="切换模型" placement="top-start">
        <el-button class="change-model-button" @click="changeModel" circle>
            <svg-icon type="mdi" :path="mdiAccountSwitchOutline"></svg-icon>
        </el-button>
    </el-tooltip>

    <!-- <el-popconfirm icon="el-icon-info" iconColor="red" title="这是一段内容确定删除吗？" @confirm="confirmEvent" @cancel="cancelEvent">
        <template #reference>
            <el-button class="change-background-button" style="color: white;"></el-button>
        </template>
    </el-popconfirm> -->
    <div style="height: 10px;"></div>
    <div class="speeddial-circle-demo" style="position: fixed;bottom: 90px;right: 85px;z-index: 9;">
        <SpeedDial :model="items" :radius="120" direction="up-left" type="quarter-circle" buttonClass="p-button-success"
           />
    </div>
</template>
<style lang="scss" scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.change-target-button {
    width: 80%;
    background-color: gray;
    border: none;
}

.change-background-button {
    padding: 10px;
    font-size: small;
    width: 80%;
    background-color: rgb(39, 88, 234);
    border: none;
}

.change-model-button {
    width: 60px;
    height: 60px;
    background-color: rgb(239, 163, 32);
    border: none;
}
</style>
<script lang="ts" setup>
import {
    Check,
    Close,
    CameraFilled
} from '@element-plus/icons-vue'
import SpeedDial from 'primevue/speeddial';
import ColorPicker from 'primevue/colorpicker';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccount, mdiHuman, mdiEmoticonWink, mdiSwapHorizontal, mdiAccountSwitchOutline, mdiChartHistogram } from '@mdi/js';
import { ref, } from 'vue'
import LoadingEntity from '../../class/loading_entity'
import router from '../../router';
import { parse } from '@vue/compiler-dom';
import { Color } from 'three';
import { parseInt } from 'lodash';
import { ElLoading } from 'element-plus'
import { tr } from 'element-plus/es/locale';
// const props = defineProps({
//     cameraOperate: Boolean,
// })
const emit = defineEmits(['getPreviewPosition', 'cameraOperate', 'colorChange', 'backgroundChange', 'openLoading', 'changeTarget', 'changeModel'])
let visible = ref(false)
// let cameraVisible = ref(props.cameraOperate)
const items = ref([
    {
        label: '摄像头左下角',
        icon: 'pi pi-arrow-down-left',
        command: () => {
            emit('getPreviewPosition', "previewLeftBottom")
        }
    },
    {
        label: '摄像头右下角',
        icon: 'pi pi-arrow-down-right',
        command: () => {
            emit('getPreviewPosition', "previewRightBottom")
        }
    },
    {
        label: '摄像头左上角',
        icon: 'pi pi-arrow-up-left',
        command: () => {
            emit('getPreviewPosition', "previewLeftTop")
        }
    },
    {
        label: '摄像头右上角',
        icon: 'pi pi-arrow-up-right',
        command: () => {
            emit('getPreviewPosition', "previewRightTop")
        }
    },
    {
        label: '摄像头开关',
        icon: 'pi pi-camera',
        command: () => {
            emit('cameraOperate', true)
        }
    }
])
let color = ref('1976D2');
const isPureColor = ref('否')
const colorChange = () => {
    if (isPureColor.value == '是')
        emit('colorChange', color.value)
    else {
        console.log('background')
        emit('backgroundChange')
    }

}
function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += "," + str.charCodeAt(i).toString(16);
    }
    return val;
}

let openLoading = () => {
    emit('openLoading', { loadingBool: true, loadingText: "string" })
}

const targetChange = (target) => {
    emit('changeTarget', target)
}

const changeModel = () => {
    emit('changeModel')
}

</script>