module.exports = {
	showLoadinig(title){//加载状态
		uni.showLoading({
			title,
			mask:true
		})
	},
	hideLoading(){//隐藏
		uni.hideLoading()
	},
	_toast(title){//提示弹框
		uni.showToast({
			title,
			icon:"none",
			duration: 1000,
			mask: true
		})
	},
	navigateTo(url) {//跳转
		uni.navigateTo({
			url: url
		})
	},
	navigateBack(page) {//返回前 page 页面
		uni.navigateBack({
			delta: page || 1
		})
	},
	/**
	 * 判断手机号码的正则表达式
	 * @param {String} 内容
	 */
	checkMobile(sMobile) {
		if(!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(sMobile))) {
			return false;
		} else {
			return true;
		};
	},
	/**
	 * 判断邮箱的正则表达式
	 * @param {String} 内容
	 */
	checkEmail(Email) {
		if(!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(Email))) {
			return false;
		} else {
			return true;
		};
	},
	/**
	 * 验证密码，必须8-20字母和数字组成
	 * @param {String} 内容
	 */
	_checkPwd(pwd) {
		if(!(/^[0-9A-Za-z]{8,20}$/.test(pwd))) {
			return false;
		} else {
			return true;
		}
	},
	/**
	 * 电话号码中间用*代替
	 * @param {String} 内容
	 */
	_phoneMethod(cellValue){
		if (Number(cellValue) && String(cellValue).length === 11) {
	        var mobile = String(cellValue);
	        var reg = /^(\d{3})\d{4}(\d{4})$/;
	        return mobile.replace(reg, '$1****$2');
	    } else {
	        return cellValue;
	    };
	},
	/**
	 * 下一天
	 * @param {String} 内容
	 */
	_nextday(e){
		var date = new Date()
		date.setDate(date.getDate()+e);  
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + '-' + m + '-' + d;
	},
	/**
	 * 乘法
	 */
	_accMul(arg1, arg2) { //乘法
	if(arg1&&arg2){
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch(e) {}
		try {
			m += s2.split(".")[1].length
		} catch(e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	}
	},
	_accDiv(arg1, arg2) { //除法
		var t1=0,t2=0,r1,r2;
		try{t1=arg1.toString().split(".")[1].length}catch(e){}
		try{t2=arg2.toString().split(".")[1].length}catch(e){}
		r1 = Number(arg1.toString().replace(".",""));
		r2 = Number(arg2.toString().replace(".",""));
		return (r1/r2) * Math.pow(10,t2-t1);
	},
	_install(item){ //安装新版本
		plus.nativeUI.showWaiting("更新中...");
		// if(item.UpdateType == 3){
		// 	var url = item.DownloadUrl
		// }else{
		// 	var url = item.UpdateUrl;
		// }
		var url = item.url;
		// if (plus.os.name.toLowerCase() == "ios") {
		// 	url = item.UpdateUrl;
		// 	if (item.install) {
		// 		plus.runtime.openURL(url, function() {
		// 			plus.nativeUI.toast("启动外部浏览器错误", {
		// 				verticalAlign: 'center'
		// 			});
		// 		});
		// 		return;
		// 	}
		// }
		let self = this;
		var dtask = plus.downloader.createDownload(url, {},
			function(d, status) {
				plus.nativeUI.closeWaiting();
				if (status == 200) {
					self._toast("正在准备环境，请稍后！");
					setTimeout(function() {
						var path = d.filename; //下载apk
						//plus.runtime.install()
						plus.runtime.install(path, {
							force: true
						}, function() {
							var str = '更新成功,请手动重启';
							if (plus.os.name.toLowerCase() == 'ios') {
								str = '更新成功，将自动重启';
							}
							plus.nativeUI.alert(str, function() {
								if (plus.os.name.toLowerCase() == 'ios') {
									plus.runtime.restart();
								} else {
									plus.runtime.quit();
								}
							});
						}, function(ttt) {
							plus.nativeUI.toast("更新失败", {
								verticalAlign: 'center'
							});
						}); // 自动安装apk文件
					}, 100);
				} else {
					plus.nativeUI.alert('资源包下载失败:' + status);
				}
		});
		dtask.start();
	},
}
