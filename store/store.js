import Vue from 'vue'
import Vuex from 'vuex'
import myRequest from '../common/js/api.js'

Vue.use(Vuex)
const store = new Vuex.Store({
	state:{//全局保存的值
		accountList: [],//账户列表
		addressList: [],//转账地址列表
		coinDataList: [],//币种列表
		accountIndex: "",//账号下标
	},
	getters:{//只是用来装饰state中的值，不能去改变state中的值
		
	},
	mutations:{//唯一能更改state中的值
		
	},
	actions:{//异步地 调用 mutations 去更改state中的对应值
		setUserInfo(context) {
			myRequest({
				url: 'user'
			})
			.then(res => {
				context.commit('getUserInfo', res.data.data);
			})
			.catch(err => {
				
			})
		},
		setCoinInfo(context) {
			myRequest({
				url: 'user/coins'
			})
			.then(res => {
				 context.commit('getCoinList', res.data.data)
			})
			.catch(err => {
				
			})
		},
	}
})
export default store