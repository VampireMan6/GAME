import { url3 } from './api.js'

//封装接口请求
const myRequest1 = (options) => {
	return new Promise((resolve, reject) => {
		let message = options.message || ''; //显示加载提示
		if (message != '') {
			uni.showLoading({
				title: message,
				mask: true
			})
		}
		let data = options.data || {}; // 请求数据
		let headercookie = { "Content-Type": 'application/json' };

		uni.request({
			url: url3 + options.url,
			method: options.method || 'POST',
			header: { "Content-Type": 'application/json' },
			data: data || {},
			success: (res) => {
				if (message != '') {
					uni.hideLoading()
				};
				if (res.statusCode === 200) {
					resolve(res)
				}else {
					uni.showToast({
						title: '网络请求失败',
						icon: 'none',
						duration: 2000
					})
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络异常，请检查网络后重新尝试',
					duration: 2000,
					icon: "none"
				})
				reject(err)
			}
		})
	})
}
export default myRequest1

