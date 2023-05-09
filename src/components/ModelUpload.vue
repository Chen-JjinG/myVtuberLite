<template>
    <el-container>
        <el-header><el-steps :space="200" simple :active="active" finish-status="success">
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3"></el-step>
            </el-steps></el-header>
        <el-main>
            <div v-if="active == 0">
                <el-form ref="form" :model="model_entity_willupdate" label-width="80px">
                    <el-form-item label="模型名称">
                        <el-input v-model="model_entity_willupdate.model_name"></el-input>
                    </el-form-item>
                    <el-form-item label="作者名称">
                        <el-input v-model="model_entity_willupdate.upload_user_name"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="完成时间">
                        <el-date-picker v-model="model_entity_willupdate.upload_date" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="模型描述">
                        <el-input type="textarea" v-model="model_entity_willupdate.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="active == 1">
                <el-upload class="upload-demo" drag ref="uploadFile" action='#' :http-request="httpRequest"
                    :on-exceed="handleExceed" :limit="1" :show-file-list="false" :auto-upload="true" style="width: 100%;">

                    <!-- <img v-if="bannerUrl" :src="bannerUrl" class="avatar" /> -->
                    <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                    <div class="el-upload__text">将vrm文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <!-- <el-upload class="upload-demo" ref="upload" action="api/file/upload_model" :file-list="fileList"
                    :auto-upload="false" :on-success="handleSuccess" :before-upload="handleSuccess">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传服务端</el-button>
                </el-upload> -->
            </div>
            <div v-if="active == 2">
                <el-upload class="upload-demo" drag ref="uploadFile" action='#' :http-request="httpRequestForPreview"
                    :on-exceed="handleExceed" :limit="1" :show-file-list="false" :auto-upload="true"
                    :before-upload="beforeUpload" style="width: 100%;">

                    <!-- <img v-if="bannerUrl" :src="bannerUrl" class="avatar" /> -->
                    <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                    <div class="el-upload__text">将png文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
            <div v-if="active == 3">
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
import ModelEntity from '../class/model_entity';
import { model_upload, model_preview_upload } from '../http/fileServer'
import { add_model_info } from '../http/modelServer'

const emit = defineEmits(['refreshList'])

const upload = ref()
const uploadFile = ref();
const state = reactive({
    bannerUrl: '',
    fileList: [],
    fileName: '',
})
const active = ref(0)
let model_id
let fileList = ref()
let model_entity_willupdate = ref(new ModelEntity)
model_entity_willupdate.value.upload_user_id = Number(sessionStorage.getItem("token"))
const next = async () => {
    if (active.value == 0) {
        await model_info_add()
    }
    if (active.value++ > 2) active.value = 0
}

const model_info_add = async () => {
    model_id = (await add_model_info(model_entity_willupdate.value)).data.data
    console.log(model_id)
}

const handleExceed = (files: File[], fileList: UploadFile[]) => {
    if (state.fileList.length >= 1) {
        ElMessage.error('只能上传一个文件')
        return;
    }
}

const beforeUpload = (file: UploadRawFile) => {
    const type = ['image/png']
    if (type.indexOf(file.type) === -1) {
        ElMessage.error('上传的文件必须是PNG!')
        return false
    }
    else if (file.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB!')
        return false
    }
    return true
}

const httpRequest = (option: any) => {
    let param = new FormData();
    param.append('file', option.file);
    model_upload(param, model_id).then((res: any) => {
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

const httpRequestForPreview = (option: any) => {
    let param = new FormData();
    param.append('file', option.file);
    model_preview_upload(param, model_id).then((res: any) => {
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