import axios from 'axios'
import User_Info from '../class/user_info'

//用index测试一下
export const index = () => {
    return axios.get('/api/user/index')
}

//添加用户
export const add = (req: User_Info) => {
    return axios.post('/api/user/add', req)
}

//用户登录
export const login = (req: User_Info) => {
    return axios.post('/api/user/login', req)
}

//查找用户模型
export const own_model = (req: Number) => {
    return axios.get('/api/user/own_model/' + req?.toString())
}

//查找用户模型
export const own_background = (req: Number) => {
    return axios.get('/api/user/own_background/' + req?.toString())
}