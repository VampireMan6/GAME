<template>
	<view class="container p-16 b-b">
		<!-- 自治社区 -->
		<view class="m-b-20 j-center">
			<image class="image_15" src="../../static/images/find_1.png" mode=""></image>
			<view class="m-l-10" style="align-items: flex-end;">
				<view class="f-w-600">自治社区</view>
				<!-- <view class="f-13 c-CCC m-l-5">community management</view> -->
			</view>
		</view>
		<view class="backimage relative m-b-30">
			<image class="w-100 h-100 absolute z-1 b-r-5" src="../../static/images/find_4.png" mode=""></image>
			<view class="absolute p-x-10 b-b z-555 w-100 h-100 f-between j-center">
				<view class="column">
					<view class="c-w m-b-8">投票中心</view>
					<view class="f-13" style="color: #A7B9F1;">参与投票</view>
				</view>
				<view class="b-w j-center f-center f-w-600" style="width: 160upx;height: 70upx;border-radius: 50upx;color: #145AE3;" @tap="enter('vote')">
					立即参与
				</view>
			</view>
		</view>
		<!-- TOOL -->
		<view class="j-center m-b-20">
			<image class="image_15" src="../../static/images/find_2.png" mode=""></image>
			<view class="m-l-10 f-w-600">TOOL</view>
		</view>
		<view class="backimage relative m-b-30">
			<image class="w-100 h-100 absolute z-1 b-r-5" src="../../static/images/find_5.png" mode=""></image>
			<view class="absolute p-x-10 b-b z-555 w-100 h-100 f-between j-center">
				<view class="c-w">一键发币</view>
				<view class="b-w j-center f-center f-w-600" style="width: 160upx;height: 70upx;border-radius: 50upx;color: #F37121;" @tap="enter('onekey')">
					立即参与
				</view>
			</view>
		</view>
		<!-- DAPP -->
		<view v-if="dataList.length !== 0" class="j-center m-b-20">
			<image class="image_15" src="../../static/images/find_3.png" mode=""></image>
			<view class="m-l-10 f-w-600">DAPP</view>
		</view>
		<view class="backimage relative m-b-30" v-for="(item,i) in dataList" :key="i">
			<image class="w-100 h-100 absolute z-1 b-r-5" src="../../static/images/find_6.png" mode=""></image>
			<!-- <image class="w-100 h-100 absolute z-1 b-r-5" :src="item.main_image" mode=""></image> -->
			<view class="absolute p-x-10 b-b z-555 w-100 h-100 f-between j-center">
				<view class="column">
					<view class="c-w m-b-8">{{item.name}}</view>
					<view class="f-13 c-w">{{item.introduction}}</view>
				</view>
				<view class="b-w j-center f-center f-w-600" style="width: 160upx;height: 70upx;border-radius: 50upx;color: #037C62;" @tap="enterDapp(i)">
					立即参与
				</view>
			</view>
		</view>
		<uni-popup ref="tipPop1" type="bottom">
			<view class="w-100 b-b column b-w" style="height: 500rpx;padding: 32upx;border-radius: 24rpx 24rpx 0 0;">
				<image class="image_15 m-b-20" src="../../static/images/delect_0.png" @tap="close"></image>
				<view class="column w-100 m-b-30">
					<view class="w-100 f-center c-1F1 m-b-20">您正在访问第三方DApp</view>
					<text class="w-100 f-13" >你在第三方DApp上的使用行为将适用该第三方DApp的《用户协议》和《隐私政策》，由{{text}}直接并单独向你承担责任。</text>
				</view>
				<btn-self text="确认" class="w-100" :state="true" @btnClick="btnClick"></btn-self>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	// const globalEvent = weex.requireModule('globalEvent');
	
	export default {
		onLoad() {
			this.getMessage();
		},
		onShow() {
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			let value = uni.getStorageSync('accountList');//账户列表
			this.account_name = value[index].account;
			let number = uni.getStorageSync('gameCoinNumber');//账户game币数量
			this.gameNumber = number;
		},
		components: {
			uniPopup
		},
		data() {
			return {
				dataList: [],
				text: "",
				data: "",
				account_name: "",
				gameNumber: 0
			}
		},
		methods: {
			async getMessage() {
				let res = await this.$myRequest1({
					url: 'GetDapp',
					method: "POST"
				})
				if(res.statusCode == 200) {
					this.dataList = res.data.data;
					console.log(this.dataList)
				}
			},
			enter(options) {
				if(options == "vote") {
					uni.navigateTo({
						url: '/pages/Find/Vote/vote'
					})
				}else if(options == 'onekey') {
					if(parseFloat(this.gameNumber) < 10) {
						uni.showToast({
							title: "该账户GAME币余额不足,无法发币哦",
							icon: "none",
							mask: true
						})
					}else {
						uni.navigateTo({
							url: '/pages/Find/Onekey/onekey'
						})
					}
				}
			},
			enterDapp(i) {
				this.text = this.dataList[i].name;
				this.$refs.tipPop1.open();
				this.data = this.dataList[i].url;
			},
			close() {
				this.$refs.tipPop1.close();
			},
			btnClick() {
				let url = this.data + '?address=' +  this.account_name;
				uni.navigateTo({
					url: ('/pages/Find/web-view?url=' + url)
				});
				this.$refs.tipPop1.close();
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.backimage {
			height: 160upx;
		}
	}
	.choose-pop {
		width: 750upx;
		background-color: #F5F9FC;
		border-radius: 12upx;
		padding: 32upx;
	}
	.pop-close-v {
		width: 50upx;
		height: 50upx;
		align-items: center;
		justify-content: center;
	}
	
	.pop-close {
		width: 26upx;
		height: 26upx;
		margin-bottom: 20upx;
	}
	.pop-content {
		background-color: #FFFFFF;
		border-radius: 8upx;
		padding: 50upx 40upx;
		margin-bottom: 20upx;
		align-items: center;
	}
	.pop-title {
		margin-bottom: 30upx;
	}
</style>
