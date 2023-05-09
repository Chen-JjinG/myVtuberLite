<template>
    <div class="loading" v-show="isLoaing">
        <div class="loading-content">
            <div style="width: 100%;" v-text="loadingText"></div>
            <el-icon class="is-loading" :size="40" style="width: 100%;margin: 10px;">
                <Loading />
            </el-icon>
        </div>
    </div>
</template>
<style lang="scss">
.loading {
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    right: 0;
    width: 100%;
    min-height: 100vh;
    padding: 0 40vw;
    display: flex;
    align-items: center;
    z-index: 10;
    transition: 0.5s;
}

.loading-content {
    padding: 10vh;
    display: flex;
    color: aqua;
    font-weight: bold;
    flex-direction: column;
    font-size: 20px;
    align-items: center;
}
</style>
<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue';
import { ref, } from 'vue'
const props = defineProps({
    isLoaing: Boolean,
    // background_color: Object
})
const loadingText = ref('....')
const isLoaing = ref()
const changeVisible = (loadingBool, loadingString) => {
    isLoaing.value = loadingBool
    loadingText.value = loadingString
}

defineExpose({
    changeVisible,
})
</script>