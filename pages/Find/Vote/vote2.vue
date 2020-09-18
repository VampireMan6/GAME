<template>
	<view class="container">
		<view class="column fixed z-999 w-100 b-b">
			<!-- 顶部状态栏 -->
			<view class="b-w" :style="{ height: statusBarH + 'px' }"></view>
			<view class="w-100 f-between j-center b-w b-b" style="height: 88upx;padding-right: 32upx;">
				<view style="width: 100rpx;" @tap="back"><i class="uni-btn-icon c-1F1" style="font-size: 27px;"></i></view>
				<view class="f-16 c-1F1 flex_1 f-center" style="font-weight: 700;">投票</view>
				<view class="f-13" @tap="enterNode">投票记录</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="column b-b" style="padding-bottom: 68rpx;" :style="{ height: scrolleight + 'px',marginTop: content_top + 'px'}">
			<!-- 顶部 -->
			<view class="p-x-16 b-b m-b-40">
				<view class="relative w-100 top">
					<image class="absolute z-1 w-100 h-100" src="../../../static/images/wallet_bck.png" mode=""></image>
					<view class="absolute z-555 w-100 h-100 column b-b" style="padding: 60upx 40upx 0;">
						<view class="w-100 f-center f-18 m-b-8" style="color: #99D4D4;">总投出票数</view>
						<view class="c-w w-100 f-center m-b-10 f-13 m-b-20" style="color: #99D4D4;">(总投出票数=当前已抵押资源+新抵押的资源)</view>
						<view class="w-100 f-center f-13 c-w" style="font-size: 60upx;">{{totle_number}}</view>
					</view>
				</view>
			</view>
			<!-- 内容 -->
			<view class="p-x-16 b-b contain m-b-30">
				<view class="b-F9F column w-100 h-100 vote b-b c-CCC">
					<view class="f-between w-100 m-b-30">
						<view>当前已抵押资源(GAME)</view>
						<view class="c-1F1 f-w-600">{{staked_number}}</view>
					</view>
					<view class="w-100">
						<view class="flex_1">新增抵押资源(GAME)</view>
						<view class="flex_1 f-end border-1" :class="state?'border-2':''">
							<input type="number" class="f-13 c-1F1 w-100" v-model="votetext" style="text-align: left;" placeholder="请输入抵押数量" placeholder-class="f-13 c-CCC">
						</view>
					</view>
				</view>
			</view>
			<view class="p-x-16 b-b m-b-40">
				<view class="b-F9F b-b w-100" style="padding: 30upx 20upx;">
					<image class="b-r-50" style="width: 40upx;height: 40upx;" :src="dataMessage.image" mode=""></image>
					<view class="flex_1 column m-l-10">
						<view class="f-w-600 f-13 m-b-8">
							<view>{{dataMessage.name}}</view>
							<view class="m-l-10">{{dataMessage.names}}</view>
						</view>
						<view class="f-between f-w-600 f-13 m-b-8">{{dataMessage.describe}}</view>
						<!-- <view class="f-10 c-CCC" style="margin-bottom: 30upx;">eoscannonchn</view> -->
						<view class="f-between f-10 c-CCC">
							<view class="j-center">
								<image style="width: 12upx;height: 14upx;" src="../../../static/images/find_11.png" mode=""></image>
								<view class="m-l-5">{{dataMessage.loaction}}</view>
							</view>
							<view class="j-center">
								<image style="width: 16upx;height: 16upx;" src="../../../static/images/find_10.png" mode=""></image>
								<view class="m-l-5">{{dataMessage.proportion}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 提交 按钮 -->
			<view class="p-x-16 b-b">
				<btn-self class="w-100" text="提交" :state="true" @btnClick="btnClick"></btn-self>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { Api,JsonRpc } from 'eosjs'
	import { url,url2 } from '@/common/js/api'
	import {JsSignatureProvider} from 'eosjs/dist/eosjs-jssig'
	import { TextDecoder, TextEncoder } from 'text-encoding'
	// import fetch from 'node-fetch';
	// const rpc = new JsonRpc('http://8.210.114.177:8080');
	
	export default {
		onLoad() {
			try {
				let res = uni.getSystemInfoSync();
				this.statusBarH = res.statusBarHeight;
				this.scrolleight = res.windowHeight - this.statusBarH - uni.upx2px(88);
				this.content_top = this.statusBarH + uni.upx2px(88);
			} catch (e) {
				// error
			};
			let index = uni.getStorageSync('staked');//当前已抵押的资源
			this.staked_number = index;
			let value = uni.getStorageSync('voteproducerList');//投票数据
			this.dataMessage = value;
			let index1 = uni.getStorageSync('accountIndex');//账户下标选择
			let value1 = uni.getStorageSync('accountList');//账户列表
			this.account_name = value1[index1].account;
			this.privateKey = value1[index1].privateKey;
			let index2 = uni.getStorageSync('gameCoinNumber');//可抵押的数量
			this.gameNumber = index2;
			
		},
		data() {
			return {
				statusBarH: 0,
				scrolleight: 500,
				content_top: 44,
				votetext: "",
				staked_number: 0,
				dataMessage: [],
				account_name: "",
				privateKey: "",
				gameNumber: 0,
				button_state: false
			}
		},
		computed: {
			state() {
				if(this.votetext) {
					return true
				}else {
					return false
				}
			},
			totle_number() {
				if(this.votetext == "") {
					return this.staked_number
				}else {
					return parseFloat(this.staked_number) + parseFloat(this.votetext);
				}
			}
		},
		methods: {
			btnClick() {
				if(!this.button_state) {
					this.button_state = true;
					if(this.totle_number == 0) {
						uni.showToast({
							title: "请先抵押资源后再投票",
							icon: 'none',
							mask: true
						});
						this.button_state = false;
						return;
					};
					if(parseFloat(this.votetext) > 0) {//若有新的抵押，先抵押再投票
						if(parseFloat(this.votetext)> parseFloat(this.gameNumber)) {
							uni.showToast({
								title: "已超出可抵押的范围，请重新输入",
								icon: 'none'
							});
							this.button_state = false;
							return;
						};
						this.Delegate()//抵押
					}else {
						this.voteproducer();//投票
					}
				}
			},
			back() {//返回
				uni.navigateBack({})
			},
			async Delegate() {
				let res = await this.$myRequest({
					url: 'Delegate',
					data: {
						account: this.account_name,
						quantity: this.votetext*10000,
						walletPrivateKey: this.privateKey
					}
				});
				if(res.data.StatusCode == 200) {
					uni.setStorage({//保存账号下已抵押或能投票的数量
						key: 'staked',
						data: this.totle_number
					});
					this.voteproducer();//抵押成功后再开启投票
				}else {
					console.log(res)
					uni.showToast({
						title: "抵押失败",
						icon: "none",
						mask:true
					});
				}
			},
			async voteproducer() {
				uni.showLoading({
					title: "投票中,请耐心等待",
					mask: true
				});
				const priv = this.privateKey;
				const signatureProvider = new JsSignatureProvider([priv]);
				const rpc = new JsonRpc(url);
				const api = new Api({rpc,signatureProvider,textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
				const result = await api.transact({
					"actions": [{
						"name": "voteproducer",
						"account": "eosio",
						"authorization": [{
							"actor": this.account_name,
							"permission": "active"
						}],
						"data": {
							"producers": [this.dataMessage.names],
							"proxy": "",
							"voter": this.account_name
						}
					}]
				}, {
					blocksBehind: 3, // 顶部区块之前的某区块信息作为引用数据，这是TAPoS的概念。
					expireSeconds: 30, // 延迟时间设置，自动计算当前区块时间加上延迟时间，得到截止时间。
					sign: true,
					broadcast: true
				});
				uni.hideLoading();
				this.button_state = false
				if(result) {
					this.toupiao();
				}else {
					uni.showToast({
						title: "投票失败",
						mask: true
					});
				}
			},
			toupiao() {
				uni.request({
					url: url2 + 'vote/submit',
					method: 'POST',
					data: {
						"owner": this.account_name,
						"bp_name": this.dataMessage.names,
						"ticket": this.totle_number
					},
					success: (res) => {
						if(res.data.code == 200) {
							uni.showToast({
								title: "投票完成",
								mask: true
							});
							uni.setStorage({//保存账号的节点投票
								key: 'producers',
								data: [this.dataMessage.names]
							});
							setTimeout(()=> {
								uni.navigateBack({});
							},1000)
						}
					}
				});
			},
			enterNode() {
				uni.navigateTo({
					url: '/pages/Find/Vote/voteRecords'
				})
			}
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
			// margin-top: 32upx;
		}
		.contain {
			height: 292upx;
			.vote {
				padding: 70upx 20upx;
				.border-1 {
					border-bottom: 2upx solid #CCCCCC;
				}
				.border-2 {
					border-bottom: 2upx solid #009494;
				}
			}
		}
		.fixeds {
			bottom: 68upx;
			left: 0;
			right: 0;
		}
	}
</style>
