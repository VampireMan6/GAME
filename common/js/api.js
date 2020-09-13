const BASE_URL = 'https://www.common-game.com/nos-iot/v1/noschain/';//链接口
const url = 'https://www.common-game.com';//链上访问接口
const url2 = 'http://reward.common-game.com/' //投票收益接口
const url3 = 'http://api.common-game.com/Api/' //更新 帮助中心 用户协议 等接口

//封装接口请求
const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		let message = options.message || ''; //显示加载提示
		if (message != '') {
			uni.showLoading({
				title: message,
				mask: true
			})
		};
		let data = options.data || {}; // 请求数据
		let headercookie = { "Content-Type": 'application/json' };
		
		uni.request({
			url: BASE_URL + options.url,
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
export default myRequest

export {
	url,
	url2,
	url3
}
