var axios = require('axios')

//设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

//请求前拦截
axios.interceptors.request.use(
    config => {
        if(config.method === 'post') {
            if(config.data instanceof Object) {
                config.data = JSON.stringify((config.data))
            } else {
                config.data = JSON.stringify((JSON.parse(config.data)))
            }
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
//请求返回拦截
axios.interceptors.response.use(
    response => {
        if (response.data.code === 200) {
            return response.data
        } else {
            return response.data
        }
    },
    error => {
        if (error.response) {
            if (error.response.status === 400) {
                return '资源未找到，请联系管理员'
            } else if (error.response.status === 404) {
                return '资源未找到，请联系管理员'
            } else if (error.response.status === 500) {
                return '服务器错误，请联系管理员'
            }
        }
        return error.data
    }
)

export default axios