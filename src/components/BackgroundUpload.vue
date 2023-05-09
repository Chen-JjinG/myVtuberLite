<template>
    <el-container>
        <el-header><el-steps :space="200" simple :active="active" finish-status="success">
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
            </el-steps></el-header>
        <el-main>
            <div v-if="active == 0">
                <el-form ref="form" :model="background_entity_willupdate" label-width="80px">
                    <el-form-item label="背景名称">
                        <el-input v-model="background_entity_willupdate.background_name"></el-input>
                    </el-form-item>
                    <el-form-item label="作者名称">
                        <el-input v-model="background_entity_willupdate.upload_user_name"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="完成时间">
                        <el-date-picker v-background="background_entity_willupdate.upload_date" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="背景描述">
                        <el-input type="textarea" v-model="background_entity_willupdate.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="active == 1">
                <el-upload class="upload-demo" drag ref="uploadFile" action='#' :http-request="httpRequestForPreview"
                    :on-exceed="handleExceed" :limit="1" :show-file-list="false" :auto-upload="true" style="width: 100%;">

                    <!-- <img v-if="bannerUrl" :src="bannerUrl" class="avatar" /> -->
                    <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                    <div class="el-upload__text">将jpg文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
            <div v-if="active == 2">
                <h1>上传成功！</h1>
                <CircleCheck style="width:50px;color: green;"></CircleCheck>
            </div>
        </el-main>
        <el-footer><el-button style="margin-top: 12px;" @click="next" v-show="active == 0">下一步</el-button></el-footer>
    </el-container>
</template>
  
<script lang="ts" setup>
import { List, Search, Upload, CircleCheck } from '@element-plus/icons-vue';
import { ElMessage, UploadFile, UploadRawFile } from 'element-plus';
import { onUnmounted, reactive, ref } from 'vue';
import backgroundEntity from '../class/background_entity';
import { background_img_upload } from '../http/fileServer'
import { add_background_info } from '../http/backgroundServer'

const emit = defineEmits(['refreshList'])

const upload = ref()
const uploadFile = ref();
const state = reactive({
    bannerUrl: '',
    fileList: [],
    fileName: '',
})
const active = ref(0)
let background_id
let fileList = ref()
let background_entity_willupdate = ref(new backgroundEntity)
background_entity_willupdate.value.upload_user_id = Number(sessionStorage.getItem("token"))
const next = async () => {
    if (active.value == 0) {
        await background_info_add()
    }
    if (active.value++ > 2) active.value = 0
}

const background_info_add = async () => {
    background_id = (await add_background_info(background_entity_willupdate.value)).data.data
    console.log(background_id)
}

const handleExceed = (files: File[], fileList: UploadFile[]) => {
    if (state.fileList.length >= 1) {
        ElMessage.error('只能上传一个文件')
        return;
    }
}

// const beforeUpload = (file: UploadRawFile) => {
//     const type = ['image/jpg']
//     if (type.indexOf(file.type) === -1) {
//         ElMessage.error('上传的文件必须是JPG!')
//         return false
//     }
//     else if (file.size / 1024 / 1024 > 2) {
//         ElMessage.error('图片大小不能超过2MB!')
//         return false
//     }
//     return true
// }


const httpRequestForPreview = (option: any) => {
    let param = new FormData();
    param.append('file', option.file);
    background_img_upload(param, background_id).then((res: any) => {
        console.log(res)
        if (res && res.data.status === 'success') {
            ElMessage.success('上传成功！');
        } else {
            if (res && res.data.message) {
                ElMessage.error(res.message);
            } else {
                ElMessage.error('上传失败！');
            }
        }
    })
    active.value += 1
}

onUnmounted(() => {
    emit('refreshList')
})

</script>