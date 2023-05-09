import axios from 'axios'
import backgroundEntity from '../class/background_entity'
import User_Info from '../class/user_info'

//测试background文件下载
export const get_background = (req: Number) => {
    return axios.get('/api/background/download' + req?.toString())
}

export const add_background_info = (req: backgroundEntity) => {
    return axios.post('/api/background/add_background_info', req)
}

export const get_all_background_info = (req: number) => {
    return axios.get('/api/background/get_all_background_info/' + req)
}

export const add_background_to_user = (req: User_Info) => {
    return axios.post('/api/background/add_background_to_user', req)
}