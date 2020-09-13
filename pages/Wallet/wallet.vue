<template>
	<view class="container">
		<!-- 顶部 -->
		<view class="column w-100 fixed nav_top">
			<!-- 顶部状态栏 -->
			<view :style="{ height: statusBarH + 'px' }"></view>
			<view class="w-100 f-between j-center p-x-16 b-b" style="height: 88upx;">
				<view class="j-center">
					<!-- <image class="image_30 b-r-50" src="../../static/images/wallet_1.png" mode=""></image> -->
					<view style="margin-left: 10upx;">GAME</view>
				</view>
				<view>
					<image class="image_30" src="../../static/images/wallet_2.png" mode="" @tap="select_wallet(1)"></image>
					<image class="image_30" style="margin-left: 30upx;" src="../../static/images/wallet_3.png" mode=""
					@tap="select_wallet(2)"></image>
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<scroll-view scroll-y="true" class="contain" :style="{ height: scrolleight + 'px',marginTop: content_top + 'px'}">
			<!-- 总资产 -->
			<view class="p-x-16 b-b">
				<view class="relative w-100 top m-b-20">
					<image class="absolute z-1 w-100 h-100" src="../../static/images/wallet_bck.png" mode=""></image>
					<view class="absolute z-555 w-100 h-100 column b-b" style="padding: 20rpx 40upx;">
						<view class="w-100 f-between" style="margin-bottom: 60rpx;">
							<view class="c-w">{{account_name}}</view>
							<image src="../../static/images/wallet_4.png" mode="" style="width: 40upx;height: 40upx;" @tap="enterWlallet"></image>
						</view>
						<view class="c-w w-100 f-center m-b-20" style="font-size: 60upx;">{{totle_number}} GAME</view>
						<view class="w-100 f-between" @tap="mortgage">
							<view class="column flex_1 j-center">
								<view class="m-b-8" style="color: #7FC9C9;font-size: 28rpx;">已抵押</view>
								<view class="c-w">{{staked.toFixed(4)}}</view>
							</view>
							<view class="column flex_1 j-center">
								<view class="m-b-8" style="color: #7FC9C9;font-size: 28rpx;">赎回中</view>
								<view class="c-w">{{unstaking.toFixed(4)}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 资产列表 -->
			<view class="p-x-16 b-b m-b-30">
				<view class="j-center f-between w-100">
					<view class="j-center">
						<image class="image_15" src="../../static/images/wallet_6.png" mode=""></image>
						<view class="m-l-10 f-w-600" style="align-items: flex-end;">
							<view>资产</view>
							<text class="c-CCC f-13 m-l-5" style="font-weight: 500;">property</text>
						</view>
					</view>
					<image class="image_30" src="../../static/images/wallet_5.png" mode="" @tap="enterCurrency"></image>
				</view>
			</view>
			<view class="list_data p-x-16 b-b m-b-20" v-for="(item,i) in dataList" :key="i" @tap="enterTransaction(i)">
				<view class="b-F9F b-r-5 f-between j-center w-100 p-x-10 b-b">
					<view class="j-center">
						<image v-if="item.name == 'GAME'" class="image_30 b-r-50" src="../../static/images/wallet_1.png" mode=""></image>
						<image v-else class="image_30 b-r-50" src="../../static/images/wallet_0.png" mode=""></image>
						<view class="f-w-600 m-l-5">{{item.name}}</view>
					</view>
					<view class="column">
						<view class="f-18 f-w-600">{{item.number}}</view>
					</view>
				</view>
			</view>
			<view style="height: 2upx;width: 100%;"></view>
		</scroll-view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<mantle v-if="!isPreserve" @cancel="cancel1"></mantle>
		<!-- 弹出层 -->
		<wallet-popup :dataList="dataAccountList" :mantleState="mantleState" :tabClick="tabClick" @cancel="cancel" @enterManage="enterManage" @selectWallet="selectWallet"></wallet-popup>
		<update v-if="updataStatus" :updateData="updateData" @evenUpdate="evenUpdate"></update>
		<view :class="!isPreserve?'bottom_true':''" class="data_select w-100 fixed p-x-16 b-b z-999 transition">
			<view class="column j-center b-w w-100 b-r-5 b-b" style="padding: 40upx;">
				<view class="f-16 f-w-600 m-b-20">安全提醒</view>
				<view class="m-b-10 w-100">当前账号暂未备份私钥，请务必备份私钥。</view>
				<view class="m-b-20">账户私钥可用于恢复身份下的钱包资产，防止忘记密码，手机丢失等情况导致资产损失。账户私钥一旦丢失、忘记，资产不可追回。</view>
				<view class="f-center w-100">
					<view class="b-F9F b-b b-r-5" style="padding: 20rpx 40rpx;" @tap="cancel1">稍后提醒</view>
					<view class="b-009 b-b b-r-5 c-w" style="padding: 20rpx 40rpx;margin-left: 60rpx;" @tap="enterBeifen">立即备份</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import walletPopup from '@/components/walletPopup.vue'
	import { url,url3 } from '@/common/js/api.js'
	import update from '@/components/update.vue'
	import { _toast } from '@/common/js/funs' 
	
	export default {
		onLoad() {
			try {
			    let res = uni.getSystemInfoSync();
					this.statusBarH = res.statusBarHeight;
					this.scrolleight = res.windowHeight - this.statusBarH - uni.upx2px(88);
					this.content_top = this.statusBarH + uni.upx2px(88);
					this.popHeight = res.windowHeight/2;
			}catch (e) {
			    // error
			};
			// #ifdef APP-PLUS
			this.update();
			// #endif
		},
		onShow() {
			this.getEvent();
			this.getMessage();
		},
		data() {
			return {
				statusBarH: 0,//状态栏高度
				scrolleight: 600,//屏幕高度
				content_top: 44,//内容距离顶部的高度
				mantleState: false,//选择钱包蒙层
				popHeight: 500,//弹出层高度
				tabClick: 0,//钱包默认选中的下标
				account_name: "",//账户名称
				totle_number: "",//总数量
				dataList: [],//币列表
				dataAccountList: [],//账户列表
				staked: 0,//已抵押的数量
				unstaking: 0,//能赎回的数量
				updataStatus: false,
				updataStatus1: false,
				updateData: {},
				isPreserve: true
			}
		},
		components: {
			walletPopup,
			update
		},
		methods: {
			update() {
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
					// if (item.data.NeedInstall) {
					// 	plus.runtime.openURL(url, function() {
					// 		toast('启动外部浏览器错误');
					// 	});
					// 	return;
					// }
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
			async getMessage() {
				let res = await this.$myRequest1({
					url: 'GetDapp',
					method: "POST"
				});
				if(res.statusCode == 200) {
					uni.setStorage({
						key: 'DappList',
						data: res.data.data
					});
				}
			},
			getEvent() {
				let index = uni.getStorageSync('accountIndex');//账户下标选择
				if(index) {
					this.tabClick = index;
				};
				let value = uni.getStorageSync('accountList');//账户列表
				this.dataAccountList = value;
				this.account_name = value[this.tabClick].account;
				if(!this.updataStatus) {
					this.isPreserve = value[this.tabClick].isPreserve;
				};
				this.getMyCoin();
				this.getTotalToken();
				this.getCurrencyBalance();
			},
			async getTotalToken() {//账户币的列表
				let res = await this.$myRequest({
					url: 'getTotalToken',
					method: "GET",
					data: {
						account: this.account_name
					}
				});
				let list = [];
				if(res.data.Data.Assets.length == 0) {
					let obj = {};
					obj.name = "GAME";
					obj.number = '0.0000';
					obj.state = true;
					list[0] = obj;
				}else {
					res.data.Data.Assets.forEach((item,index)=> {
						let str = item.split(" ");
						let obj = {};
						obj.name = str[1];
						obj.number = str[0];
						obj.state = true;
						list[index] = obj;
					})
				};
				this.dataList = list;
				let lists = uni.getStorageSync('coinDataList2');//账户下标选择
				// let onekey = uni.getStorageSync('onekey');
				if(lists && lists.index == this.tabClick) {
					let list = lists.dataList;
					this.dataList.forEach((item,i)=> {
						let index = list.findIndex(x=> x.name == item.name);
						if(index !== -1) {
							item.state = list[index].state;
						}
					});
					uni.setStorage({//保存账号下币的列表
						key: 'coinDataList',
						data: this.dataList
					});
				}else {
					uni.setStorage({//保存账号下币的列表
						key: 'coinDataList',
						data: this.dataList
					});
				};
				this.dataList = this.dataList.filter(x=> {
					return x.state == true;
				});
			},
			async getMyCoin() {//账户信息
				let res = await this.$myRequest({
					url: 'getAccount',
					method: "GET",
					data: {
						account: this.account_name
					}
				});
				if(res.data.StatusCode == 200) {
					this.staked = parseFloat(res.data.Data.self_delegated_bandwidth.cpu_weight.split(" ")[0]);
					if(res.data.Data.refund_request == null) {
						this.unstaking = 0.0000;
					}else {
						this.unstaking = parseFloat(res.data.Data.refund_request.cpu_amount.split(" ")[0]);
					};
					this.totle_number = (this.staked + this.unstaking + parseFloat(res.data.Data.core_liquid_balance.split(" ")[0])).toFixed(4);
					uni.setStorage({//保存账号下已抵押或能投票的数量
						key: 'staked',
						data: this.staked
					});
					uni.setStorage({//保存账号下能赎回的数量
						key: 'unstaking',
						data: this.unstaking
					});
					let producers = [];
					if(res.data.Data.voter_info.producers !== null) {
						producers = res.data.Data.voter_info.producers
					}
					uni.setStorage({//保存账号的节点投票
						key: 'producers',
						data: producers
					});
				}
			},
			async getCurrencyBalance() {//账户game余额
				let res = await this.$myRequest({
					url: 'getCurrencyBalance',
					method: "GET",
					data: {
						account: this.account_name,
						symbol: "GAME"
					}
				});
				if(res.data.StatusCode == 200) {
					if(res.data.Data == "") {
						uni.setStorage({//保存账号下game余额
							key: 'gameCoinNumber',
							data: "0.0000"
						});
					}else {
						uni.setStorage({//保存账号下game余额
							key: 'gameCoinNumber',
							data: res.data.Data[0].split(" ")[0]
						})
					}
				}
			},
			enterCurrency() {//进入币种管理
				uni.navigateTo({
					url: ('/pages/Wallet/currency?index=' + this.tabClick)
				})
			},
			mortgage() {//进入抵押资源
				uni.navigateTo({
					url: '/pages/Wallet/mortgage'
				})
			},
			select_wallet(i) {//钱包选择
				if(i == 1) {
					this.mantleState = true;
				}else {
					uni.navigateTo({
						url: '/pages/Wallet/Transaction/out?state=1'
					})
				}
			},
			enterWlallet() {
				uni.navigateTo({
					url: '/pages/Wallet/Transaction/into?index=0'
				})
			},
			cancel() {// 蒙层取消
				this.mantleState = false;
			},
			cancel1() {// 蒙层取消
				this.isPreserve = true;
			},
			enterBeifen() {
				uni.navigateTo({
					url: '/pages/Profile/Manage/manage'
				})
			},
			enterManage() {//进入 管理钱包
				// uni.setStorage({//保存账号下币的列表
				// 	key: 'coinDataList2',
				// 	data: this.dataList
				// });
				uni.navigateTo({
					url: '/pages/Wallet/manageWallet'
				});
				this.mantleState = false;
			},
			selectWallet(i) {//钱包选择
				this.tabClick = i;
				uni.setStorage({//保存账号下标信息
					key: 'accountIndex',
					data: this.tabClick
				});
				this.mantleState = false;
				this.dataList = [];
				this.getEvent();
			},
			enterTransaction(i) {//进入资产
				uni.navigateTo({
					url: ('/pages/Wallet/Transaction/transaction?index=' + i)
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
		.contain {
			.top {
				height: 342upx;
				margin-top: 32upx;
			}
			.list_data {
				height: 110upx;
			}
		}
		.data_select {
			bottom: -460upx;
			left: 0;
			right: 0;
			height: 460upx;
			.delect {
				width: 50upx;
				height: 60upx;
				.image {
					width: 20upx;
					height: 20upx;
				}
			}
			.image_left {
				width: 50upx;
				height: 50upx;
			}
		}
		.bottom_true {
			bottom: 46upx;
		}
	}
</style>
