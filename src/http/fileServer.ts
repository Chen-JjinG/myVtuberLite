import axios from 'axios'

//测试model文件上传
export const model_upload = (req: FormData, model_id: number) => {
    return axios.post('/api/file/upload_model/' + model_id, req)
}

//model预览图上传
export const model_preview_upload = (req: FormData, model_id: number) => {
    return axios.post('/api/file/upload_model_preview/' + model_id, req)
}

//background背景上传
export const background_img_upload = (req: FormData, background_id: number) => {
    return axios.post('/api/file/upload_background_img/' + background_id, req)
}
