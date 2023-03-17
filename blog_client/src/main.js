import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from "axios";

axios.defaults.baseURL  = 'http://localhost:8080'; //内网
// axios.defaults.baseURL = 'http://sirling.com:8081'; //公网
// axios.defaults.baseURL = 'http://192.168.192.88:8080'; //组网

// 全局使用图标 1
import * as Icons from '@ant-design/icons-vue';

const app = createApp(App);
app.use(store).use(router).use(Antd).mount('#app')

// 全局使用图标 2
const icons = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}


/**
 * axios拦截器
 */
 axios.interceptors.request.use(function (config) {
    console.log('请求参数：', config);
    config.withCredentials = true
    const token = store.state.token
    token && (config.headers.Authentication = token)
    return config;
}, error => {
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    console.log('返回结果：', response);
    return response;
}, error => {
    // console.log('返回错误：', error);
    return Promise.reject(error);
});

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
 export const get = (url, ...params) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    })
  }
  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  export const post = (url, ...params) => {
    return new Promise((resolve, reject) => {
      axios //QS.stringify(params)关于这个函数会输出什么结果大家可以自行尝试一下，结果会让你惊喜，也可以自己单独传一个对象进去测试一下
        .post(url, QS.stringify(...params))
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    })
  }
 