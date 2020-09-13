import Vue from 'vue'
import App from './App'
import mantle from './components/mantle.vue' //蒙版样式全局引入
import btnSelf from './components/btnSelf.vue' //按钮样式
import myRequest from './common/js/api.js' //封装请求接口
import myRequest1 from './common/js/api1.js' //封装请求接口


//全局组件
Vue.component('mantle',mantle)
Vue.component('btnSelf',btnSelf)


Vue.prototype.$myRequest = myRequest
Vue.prototype.$myRequest1 = myRequest1


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
   ...App
})
app.$mount()
