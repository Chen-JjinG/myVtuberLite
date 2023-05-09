<template>
    <el-form ref="ruleFormRef" :label-width="0" :model="user_info" status-icon :rules="rules" class="demo-ruleForm">
        <el-form-item prop="user_name">
            <el-input v-model="user_info.user_name" placeholder="请输入用户名" :required="true" />
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="user_info.password" type="password" placeholder="请输入密码" show-password :required="true" />
        </el-form-item>
        <el-form-item>
            <el-input v-model="passWord_ForCheck" type="password" placeholder="请再次确认密码" show-password :required="true" />
        </el-form-item>
        <el-form-item prop="mobile">
            <el-input v-model="user_info.mobile" placeholder="请输入电话号码" :required="true" />
        </el-form-item>
        <el-form-item prop="email">
            <el-input v-model="user_info.email" placeholder="请输入邮箱" :required="true" />
        </el-form-item>
    </el-form>
    <el-button type="primary" @click="signup(ruleFormRef)">注册</el-button>
</template>
<script lang="ts" setup>
import { Ref, reactive, ref } from 'vue';
import User_Info from '../../class/user_info';
import { add } from '../../http/userServer'
import { FormInstance, FormRules } from 'element-plus';

//@ts-ignore
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
// const user_info:Ref<User_Info>=ref<User_Info>()

const ruleFormRef = ref<FormInstance>()
/* 手机号 */
var isMobileNumber = (rule, value, callback) => {
    if (!value) {
        return new Error('请输入电话号码')
    } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const isPhone = reg.test(value)
        value = Number(value) //转换为数字
        if (typeof value === 'number' && !isNaN(value)) {
            //判断是否为数字
            value = value.toString() //转换成字符串
            if (value.length < 0 || value.length > 12 || !isPhone) {
                //判断是否为11位手机号
                callback(new Error('手机号码格式不正确'))
            } else {
                callback()
            }
        } else {
            callback(new Error('请输入电话号码'))
        }
    }
}
/* 邮箱 */
var isEmail = (rule, value, callback) => {
    if (!value) {
        callback()
    } else {
        const reg =
            /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        const email = reg.test(value)
        if (!email) {
            callback(new Error('邮箱格式不正确'))
        } else {
            callback()
        }
    }
}


const rules = reactive<FormRules>({
    user_name: [
        { required: true, message: '用户名为必填项', trigger: 'blur' },
    ],
    password: [
        {
            required: true, message: '密码为必填项', trigger: 'blur'
        }
    ],
    password_forcheck: [
        {
            required: true, message: '必须输入第二次以确认密码', trigger: 'blur'
        },
    ],
    mobile: [
        { required: true, message: '电话为必填项', trigger: 'blur' },
        { validator: isMobileNumber, trigger: 'blur' }
    ],
    email: [
        { required: true, message: '邮箱为必填项', trigger: 'blur' },
        { validator: isEmail, trigger: 'blur' }
    ]
})

const passWord_ForCheck = ref<string>()


const signup = async (formEl: FormInstance | undefined) => {
    if (!formEl) { return }
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                if (user_info.value.password != passWord_ForCheck.value) {
                    alert('两次输入的密码不同')
                } else {
                    console.log(await add(user_info.value))
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('error submit!', fields)
        }
    })

}
// const userName = ref("");
// const passWord = ref("");
// const mobile = ref("")
// const email = ref("")
// const headImg = ref("")
// const remark = ref("")
</script>