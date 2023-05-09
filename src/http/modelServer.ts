import axios from 'axios'
import ModelEntity from '../class/model_entity'
import User_Info from '../class/user_info'

//测试model文件下载
export const get_model = (req: Number) => {
    return axios.get('/api/model/download' + req?.toString())
}

export const add_model_info = (req: ModelEntity) => {
    return axios.post('/api/model/add_model_info', req)
}

export const get_all_model_info = (req: number) => {
    return axios.get('/api/model/get_all_model_info/' + req)
}

export const add_model_to_user = (req: User_Info) => {
    return axios.post('/api/model/add_model_to_user', req)
}