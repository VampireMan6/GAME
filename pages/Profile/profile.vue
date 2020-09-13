<template>
	<view class="container">
		<view :style="{ height: statusBarHeight + 'px' }"></view>
		<!-- 顶部 -->
		<view class="p-x-16 b-b" style="margin: 40rpx 0 80rpx;">
			<view class="relative w-100 top">
				<image class="absolute z-1 w-100 h-100" src="../../static/images/wallet_bck.png" mode=""></image>
				<view class="absolute z-555 w-100 h-100 column b-b" style="padding: 90upx 0;">
					<view class="w-100 f-center m-b-20">
						<view class="f-18" style="color: #99D4D4;">GAME</view>
					</view>
					<view class="c-w w-100 f-center" style="font-size: 60upx;">{{number}}</view>
				</view>
			</view>
		</view>
		<!-- 管理钱包、添加钱包 -->
		<view class="p-x-16 b-b" style="height: 100upx;margin-bottom: 50upx;">
			<view class="relative flex_1 h-100 j-center" @tap="wallet('manage')">
				<image class="w-100 h-100 absolute z-1" src="../../static/images/pro_5.png" mode=""></image>
				<view class="absolute z-555 f-18 f-w-600 h-100 j-center" style="right: 40upx;">管理钱包</view>
			</view>
			<view class="flex_1 relative h-100 j-center" style="margin-left: 46upx;" @tap="wallet('add')">
				<image class="w-100 h-100 absolute z-1" src="../../static/images/pro_6.png" mode=""></image>
				<view class="absolute z-555 f-18 f-w-600 h-100 j-center" style="right: 40upx;">添加钱包</view>
			</view>
		</view>
		<!-- 选项 -->
		<view class="f-between j-center p-x-16 b-b" style="margin-bottom: 50upx;" v-for="(item,i) in dataList" :key="i" @tap="enter(i)">
			<view class="j-center">
				<image class="image_30" :src="'../../static/images/pro_'+ i +'.png'" mode=""></image>
				<view class="c-b m-l-10">{{item}}</view>
			</view>
			<view class="j-center">
				<view v-if="i == 4" class="c-CCC">当前版本{{version}}</view>
				<image style="width: 24upx;height: 24upx;" class="m-l-5" src="../../static/images/pro_7.png" mode=""></image>
			</view>
		</view>
		<update v-if="updataStatus" :updateData="updateData" @evenUpdate="evenUpdate"></update>
	</view>
</template>

<script>
	import update from '@/components/update.vue'
	import { _toast } from '@/common/js/funs' 
	import { url3 } from '@/common/js/api.js'
	
	export default {
		onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			// #ifdef APP-PLUS
			this.update();
			// #endif
		},
		onShow() {
			// #ifdef APP-PLUS
			let self = this;
			plus.runtime.getProperty(plus.runtime.appid, function(info) {
				self.version = info.version;
			})
			// #endif
			let index = uni.getStorageSync('gameCoinNumber');
			this.number = index;
		},
		components: {
			update
		},
		data() {
			return {
				statusBarHeight: "",
				dataList: ['地址簿','帮助中心','用户协议','关于我们','检查更新'],
				urlList: ['address','help','agreement','aboutUs'],
				nameList: ['','helpcenter','uagreement','aboutwe'],
				account_name: "",//账户名称
				number: 10,
				version: "",
				updateState: false,
				versionNew: 0,
				updataStatus: false,
				updateData: {}
			}
		},
		methods: {
			wallet(options) {
				if(options == 'manage') {
					uni.navigateTo({//钱包管理
						url: '/pages/Profile/Manage/manage'
					})
				}else {//添加钱包
					uni.navigateTo({
						url: '/pages/createWallet/createWallet'
					})
				}
			},
			enter(i) {
				if(i == 0) {
					uni.navigateTo({
						url: '/pages/Profile/' + this.urlList[i]
					})
				}else if( i !== 4 ) {
					uni.navigateTo({
						url: ('/pages/Profile/' + this.urlList[i] + '?name=' + this.nameList[i])
					})
				}else {
					// #ifdef APP-PLUS
					this.update('update');
					// #endif
				}
			},
			update(options) {
				plus.runtime.getProperty(plus.runtime.appid, (info)=> {
					let self = this;
					uni.request({
						url: url3 + "update?ver=" + info.version,
						method: 'POST',
						data: {},
						success: (data)=> {
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
								};
								this.updataStatus = true;
								this.updateData = item;
							}else {
								this.updataStatus = false;
								if(options == 'update') {
									_toast('当前已是最新版本');
								}
							}
						}
					})
				})
			},
			evenUpdate(i) {
				if(i == 1) {
					this.updataStatus = false;
				}else {
					this.updataEven();
				}
			},
			updataEven() {
				let url = this.updateData.data.Android;
				if (plus.os.name.toLowerCase() == "ios") {
					url = this.updateData.data.IOS;
				};
				plus.nativeUI.showWaiting("正在下载更新文件...");
				uni.downloadFile({
					url: url,
					success: result => {
						plus.nativeUI.closeWaiting();
						if(result.statusCode === 200){
							 plus.nativeUI.showWaiting("正在安裝更新文件...");
							 plus.runtime.install(result.tempFilePath, { force: true }, () => {
								 plus.nativeUI.closeWaiting();
								 plus.nativeUI.alert("应用更新完成！即将重启",function(){
								    plus.runtime.restart();
								 });
							 }, () => { plus.nativeUI.closeWaiting(); _toast('更新失败'); })
						}else{
							_toast('下载失败');
						}
					},
					fail: err => { plus.nativeUI.closeWaiting(); _toast('下载失败'); }
				})
			},
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.top {
			height: 342upx;
		}
	}
</style>
