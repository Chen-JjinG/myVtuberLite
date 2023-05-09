<!-- <template>
    <div style="position: fixed;top: 0px;z-index: -9;">
        <Main3Dscence></Main3Dscence>
    </div>
    <el-row :gutter="10" style="">
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
            <div class="grid-content ep-bg-purple" />
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
            <div class="grid-content ep-bg-purple-light">
                <img src="../../source/images/loginBackground.png" />
            </div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
            <div class="grid-content ep-bg-purple">
                <div style="width: 10cm;">
                    <el-card class="box-card">
                        <template #header>
                            <el-row :gutter="20">
                                <el-col :span="6">
                                    <div>
                                        <span style="font-size:large;font-weight:bold">登录</span>
                                    </div>
                                </el-col>
                                <el-col :span="5"></el-col>
                                <el-col :span="13">
                                    <span v-show="!isSignUp">还没有账号？<el-button @click="handleSignUp()" type="primary"
                                            link>现在注册</el-button></span>
                                    <span v-show="isSignUp">已有账号？<el-button @click="handleSignUp()" type="primary"
                                            link>现在登录</el-button></span>
                                </el-col>
                            </el-row>
                        </template>
                        <div v-show="!isSignUp">
                            <LoginVue></LoginVue>
                        </div>
                        <div v-show="isSignUp">
                            <SignupVue></SignupVue>
                        </div>
                    </el-card>
                </div>
            </div>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
            <div class="grid-content ep-bg-purple-light" />
        </el-col>
    </el-row>

</template>   -->
<template>
    <div class="background">
        <img src="../assets/loginimage/wallhaven-3lkpjy.png" style="width: 100%;height: 100%;object-fit: cover;" alt="">
    </div>
    <div class="loginContainer" style="width: 10cm;">
        <el-card class="box-card">

            <div v-show="!isSignUp" style="width: 100%;">
                <el-row>
                    <el-col :span="6">
                      
                    </el-col>
                    <el-col :span="4.5">
                        <div style="height: 60px;width: 60px;overflow:hidden;padding: 2px;">
                            <img style="width: 100%;height: 100%;object-fit:contain;" src="../assets/LogoMakr-7xsjty.png" />
                        </div>
                    </el-col>
                    <el-col :span="4.5">
                        <div>
                            <div style="font-weight: bolder;font-size: 30px;margin-top: 5px;">Virtual-</div>
                            <div style="font-weight: bolder;font-size: 30px;color: #4fdb9d;margin-top: 5px;">Human</div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        
                    </el-col>
                </el-row>


            </div>
            <br />
            <div v-show="!isSignUp">
                <LoginVue></LoginVue>
            </div>
            <div v-show="isSignUp">
                <SignupVue></SignupVue>
            </div>
            <!-- <el-divider /> -->
            <div style="position: absolute;bottom: 0.5cm;left: 30%;">
                <span v-show="!isSignUp">还没有账号？<el-button @click="handleSignUp()" type="primary"
                        link>现在注册</el-button></span>
                <span v-show="isSignUp">已有账号？<el-button @click="handleSignUp()" type="primary" link>现在登录</el-button></span>
            </div>
        </el-card>
    </div>
</template>  
<style lang="scss">
.background {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
}

.loginContainer {
    position: absolute;
    top: 20%;
    right: 20%;
}

.box-card {
    height: 12cm;
}
</style>
<script lang="ts" setup>
import Main3Dscence from '../3Dpage/main3Dscence.vue';
import LoginVue from '../components/Login/Login.vue';
import SignupVue from '../components/Login/signup.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { method } from 'lodash';
import { index } from '../http/userServer'



// const isSignUp = computed(() => isSignUpHelper);
const loadindex = async () => {
    console.log(await index())
}

//在页面一开始加载时就调用的生命周期函数
onMounted(async () => {
    // await loadindex()
})

let isSignUp = ref(false);

const activeIndex = ref('1')
const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const handleSignUp = () => {
    isSignUp.value = !isSignUp.value
}

</script>
