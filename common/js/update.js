import { _toast } from '@/common/js/funs' 
import { url3 } from './api.js'

console.log(url3)
// const check = () => {
// 	plus.runtime.getProperty(plus.runtime.appid, function(info) {
// 		let device = "";
// 		try {
// 		    const res = uni.getSystemInfoSync();
// 		   device = res.platform;
// 		} catch (e) {
		   
// 		};
// 		uni.request({
// 			url: 'http://8.210.111.105:30010/Api/update',
// 			method: 'POST',
// 			data: {
// 				ver: info.version
// 			},
// 			success: (res) => {
// 				if(res.statusCode == 200 ) {
// 					if(res.data.status == 1) {
// 						if(res.data.data.MustUpdate) {//必须更新
// 							uni.showModal({
// 								title: "发现新版本,请更新APP",
// 								content: res.data.data.Tip,
// 								showCancel: false,
// 								success: (e) => {
// 									if (e.confirm) {
// 										let device = "";
// 										try {
// 										    const res = uni.getSystemInfoSync();
// 										   device = res.platform;
// 										} catch (e) {
										   
// 										};
// 										if(device.toLowerCase() == 'ios') {//苹果
// 											plus.runtime.openURL(res.data.data.IOS)
// 										}else {
// 											plus.nativeUI.showWaiting("正在下载更新文件...");
// 											uni.downloadFile({
// 												url: res.data.data.Android,
// 												success: result => {
// 													plus.nativeUI.closeWaiting();
// 													if(result.statusCode === 200){
// 														 plus.nativeUI.showWaiting("正在安裝更新文件...");
// 														 plus.runtime.install(result.tempFilePath, { force: true }, () => {
// 															 plus.nativeUI.closeWaiting();
// 															 plus.nativeUI.alert("应用更新完成！即将重启",function(){
// 															     plus.runtime.restart();
// 															 });
// 														 }, () => { plus.nativeUI.closeWaiting(); _toast('更新失败'); })
// 													}else{
// 														_toast('下载失败');
// 													}
// 												},
// 											fail: err => { plus.nativeUI.closeWaiting(); _toast('下载失败'); }
// 											})
// 										}
// 									}
// 								}
// 							})
// 						}
// 					}else {
// 						_toast('当前版本无需更新')
// 					}
// 				}else {
// 					_toast('网络异常，请检查网络后重新尝试')
// 				}
// 			},
// 			fail: (err) => {
				
// 			}
// 		})
// 	})
// }

// export default {
// 	check
// }



const check = function(change) {
	change = change || function() {};
	plus.runtime.getProperty(plus.runtime.appid, function(info) {
		console.log( info.version)
		uni.request({
			url: url3 + "update?ver=" + info.version,
			method: 'POST',
			data: {},
			success: function(data) {
				let item = data.data;
				if (item.status == 1) {

					if (plus.os.name.toLowerCase() == "ios") {
						if (item.data.IOS.length == 0) {
							return;
						}
					} else {
						if (item.data.Android.length == 0) {
							return;
						}
					}
					var buttons = ["更新", "取消"];
					if (item.data.MustUpdate) {
						buttons = ["更新"];
					}
					plus.nativeUI.confirm(item.data.Tip, function(ev) {
						if (ev.index == 0) {
							install(item, change);
						}
					}, "发现新版,是否立即更新", buttons);
				}
			}
		})
	});
}
const toast = function(title) {
	uni.showToast({
		title: title,
		icon: 'none',
		duration:1500
	});
}
const install = function(item, change) {
	plus.nativeUI.showWaiting("更新中...");
	let url = item.data.Android;
	if (plus.os.name.toLowerCase() == "ios") {
		url = item.data.IOS;
		// if (item.data.NeedInstall) {
		// 	plus.runtime.openURL(url, function() {
		// 		toast('启动外部浏览器错误');
		// 	});
		// 	return;
		// }
	}
	var dtask = plus.downloader.createDownload(url, {},
		function(d, status) {
			if (status == 200) {
				plus.nativeUI.closeWaiting();
				toast("正在准备环境，请稍后！");
				setTimeout(function() {
					var path = d.filename; //下载apk
					console.log(path)
					//plus.runtime.install()
					plus.runtime.install(path, {
						force: true
					}, function() {
						uni.hideToast();
						plus.nativeUI.alert("更新成功,将重启", function() {
							plus.runtime.restart();
						});
					}, function(ttt) {
						toast("更新失败");
					}); // 自动安装apk文件
				}, 100);
			} else {
				plus.nativeUI.alert('资源包下载失败:' + status);
			}
		});

	dtask.addEventListener("statechanged", function(download, status) {
		if (change) {
			if (download.downloadedSize < download.totalSize) {
				let perfect = (download.downloadedSize * 100) / download.totalSize;
				change(perfect);
			} else {
				change(100);
			}
		}
	});
	dtask.start();
};

export default {
	check
}
