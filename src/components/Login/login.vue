<template>
    <el-input v-model="user_info.mobile" placeholder="电话" />
    <br /><br />
    <el-input v-model="user_info.password" type="password" placeholder="密码" show-password />
    <br /><br />
    <el-button type="primary" class="loginButton" @click="user_login" circle>
        <el-icon>
            <Right />
        </el-icon>
    </el-button>
</template>
<style lang="scss">
.loginButton {
    position: absolute;
    right: -40px;
    bottom: 2cm;
    width: 80px;
    height: 80px;
}
</style>
<script lang="ts" setup>
import { Ref, ref } from 'vue';
import User_Info from '../../class/user_info';
import { login } from '../../http/userServer';
import router from '../../router';
//Work at outside
// const user_info: Ref<User_Info> = ref<User_Info>({
//     user_name: "",
//     user_id: 0,
//     password: "1234",
//     mobile: "189278973",
//     email: "",
//     head_img: "",
//     remark: "",
//     model_list: "",
// })
//Work at home
//@ts-ignore
// const user_info: Ref<User_Info> = ref<User_Info>({
//     user_name: "",
//     user_id: 0,
//     password: "12345",
//     mobile: "18244934428",
//     email: "",
//     head_img: "",
//     remark: "",
//     model_list: "",
//     background_list:"",
// })
const user_info: Ref<User_Info> = ref<User_Info>({
    user_name: "",
    user_id: 0,
    password: "",
    mobile: "",
    email: "",
    head_img: "",
    remark: "",
    model_list: "",
    background_list:"",
})
let is_login
const user_login = async () => {
    //console.log("i am in")
    try {
        //await login(user_info.value)
        const login_data = (await login(user_info.value)).data
        is_login = login_data.data
        let token = login_data.token
        let login_msg = login_data.message
        if (is_login == 1) {
            sessionStorage.removeItem("token")
            sessionStorage.setItem("token", token)
            // console.log(JSON.stringify(user_info))
            //let user = sessionStorage.getItem("token")
            //if (user != null) {
            // 将JSON格式的对象解析为js对象
            //console.log(JSON.parse(user))
            //console.log(user)
            // console.log(JSON.parse(user)._value)
            // console.log(JSON.parse(user)._value)
            //}
            router.push({ name: "home" })
        } else {
            alert(login_msg)
        }
    } catch (error) {
        console.log(error)
    }

}

const userName = ref("");
const passWord = ref("");
</script>