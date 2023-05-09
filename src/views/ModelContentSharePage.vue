<template>
    <div>
        <TopNaviMenu :active-index-form-page="activeIndex"></TopNaviMenu>
    </div>
    <el-container>
        <el-header style="display: flex;">
            <div style="margin-top: 15px;width: 100%;align-items: center;">
                <el-input placeholder="请输入内容" v-model="search_key" style="width: 40%;height: 3em;"
                    class="input-with-select">
                    <template #append>
                        <el-button icon="Search" @click="search"></el-button>
                    </template>
                </el-input>
            </div>
            <div style="margin-top: 15px;position: absolute;right: 30px;">
                <el-button style="height: 3em;width: 6em;" type="primary" icon="Upload" @click="uploadContent = true">上传
                </el-button>
            </div>

        </el-header>
        <el-main>
            <el-scrollbar height="80vh">
                <el-row align="middle">
                    <el-col :lg="{ span: 8 }" v-for="model_info in model_list" :key="model_info.model_id" :offset="0"
                        class="card-col-wb">
                        <el-card @click="openDetail(model_info)" :body-style="{ padding: '0px' }" shadow="hover"
                            style="margin: 20px 30px;">
                            <div class="card">
                                <el-image :src="'/api/file/download/' + model_info.model_id.toString() + '/' + '3'"
                                    class="image" style="width: 100%; height: 200px" :fit="'cover'" />
                                <div class="card-text">
                                    <span v-text="model_info.model_name"></span>
                                </div>
                                <!-- <div class="custom-card-mask">
                                    <span v-text="model_info.model_name"></span>
                                </div> -->
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- <div v-for="model_info in model_list" :key="model_info.model_id">
                    <el-card style="margin: 20px 30px;">
                        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                            class="image" />
                        <div style="padding: 14px;">
                            <span v-text="model_info.model_name"></span>
                            <div class="bottom">
                                <time class="time">{{ model_info.upload_date }}</time>
                                <el-button type="text" class="button">操作按钮</el-button>
                            </div>
                        </div>
                    </el-card>
                </div> -->
            </el-scrollbar>
            <el-dialog v-model="centerDialogVisible" style="min-width: 600px;" v-bind="current_model_entity"
                destroy-on-close>

                <div class="dialog-content">
                    <el-image :src="'/api/file/download/' + current_model_entity.model_id.toString() + '/' + '3'"
                        class="image" style="width: 100%; height: 400px" :fit="'cover'" />
                    <div class="dialog-content-text">
                        <div class="text-name" v-text="current_model_entity.model_name"></div>

                        <div style="color: white;font-size: medium;font-weight: bold;margin-top: 20px;">
                            <span>作者：</span>
                            <span v-text="current_model_entity.upload_user_name"></span>
                        </div>
                        <div style="color: white;font-size: medium;font-weight: bold;margin-top: 5px;">
                            <span>上传日期：</span>
                            <span v-text="current_model_entity.upload_date"></span>
                        </div>

                        <div style="height: 50px;"></div>
                        <div style="margin: 10px;">
                            <h4 style="color: black;" v-text="current_model_entity.remark"></h4>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="save_model">保 存</el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog v-model="uploadContent" style="min-width: 600px;" v-bind="current_model_entity" destroy-on-close>
                <ModelUpload @refresh-list="refreshList"></ModelUpload>
            </el-dialog>
        </el-main>
    </el-container>
</template>
<style lang="scss">
.card {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: aquamarine;
    padding: 0%;
    height: 100%;
}

.card-text {
    position: absolute;
    right: 10%;
    font-size: xxx-large;
    font-weight: bolder;
    z-index: 9;
}

.custom-card-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, v-bind(getRandomColor()));
    // background: linear-gradient(to right,#22c3e3, #555);
    opacity: 0.6;
    z-index: 1;
}


.dialog-content {
    display: flex;

}

.dialog-content-text {
    background-color: grey;
    min-width: 300px;
    margin: 0px 0px 0px 20px;
    padding: 20px;
}

.text-name {
    color: black;
    margin-top: 0.5em;
    font-size: 4em;
}
</style>
<script lang="ts" setup>
import ModelUpload from '../components/ModelUpload.vue';
import TopNaviMenu from '../components/TopNaviMenu.vue';
import { List, Search, Upload, CircleCheck } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import ModelEntity from '../class/model_entity';
import { fill, filter } from 'lodash';
import { add_model_to_user, get_all_model_info } from '../http/modelServer'
import User_Info from '../class/user_info';

const activeIndex = "2-1"
let search_key = ref('')
let current_model_entity = ref()
const centerDialogVisible = ref(false)
const uploadContent = ref(false)
//模拟数据
// let model_entity: ModelEntity = { model_id: 1, model_name: "NOtMiku", model_url: "", remark: "这是一个独特的模型，独立于其他的模型，首先你先别管这是一个什么模型，总而言之这是一个很好的模型，是模型高手的模型", upload_date: new Date("2002 - 01 - 02"), upload_user_id: 1, upload_user_name: "Chenj", preview_image_id: 1 }
// let model_list = ref([
//     model_entity,
// ])
// for (let i: number = 0; i < 10; i++) {
//     model_list.value.push({ model_id: 1, model_name: "Miku", model_url: "", remark: "这是一长串的备注，说实话，不知道要说点什么，但是感觉不说点什么的话就要被说点什么了", upload_date: new Date("2002 - 01 - 02"), upload_user_id: 1, upload_user_name: "Chenj", preview_image_id: 1 })
// }

// let model_init_list: ModelEntity[] = []
// for (let item in model_list.value) {
//     model_init_list.push(model_list.value[item])
// }

// 随机生成一个 6 位的十六进制颜色值
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color)
    return "#" + color;
}

//从后端请求数据
let model_init_list: ModelEntity[] = []
let model_list = ref(model_init_list)

const load_modelData = async (descend) => {
    console.log("loading...")
    let json_list: ModelEntity[] = (await get_all_model_info(descend)).data.data
    for (let item in json_list) {
        console.log(json_list[item])
        model_list.value.push(json_list[item])
    }
}

const search = () => {
    model_list.value = model_init_list.filter((m) => {
        return m.model_name.includes(search_key.value)
    });
    // console.log(c)
}

const openDetail = (model_info: ModelEntity) => {
    console.log(model_info)
    centerDialogVisible.value = true
    current_model_entity.value = model_info
}

const save_model = async () => {
    let user_info: User_Info = new User_Info()
    user_info.user_id = Number(sessionStorage.getItem("token"))
    user_info.model_list = current_model_entity.value.model_id
    let res = (await add_model_to_user(user_info))
    console.log(res.data)
    alert(res.data.message)
    centerDialogVisible.value = false
}

const refreshList = async () => {
    model_list.value.splice(0, model_list.value.length)
    load_modelData(0)
}

onMounted(() => {
    load_modelData(0)
})
</script>