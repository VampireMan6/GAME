<template>
	<view class="container p-16 b-b">
		<!-- 顶部 -->
		<view class="m-b-30">
			<view class="relative w-100 top">
				<image class="absolute z-1 w-100 h-100" src="../../static/images/wallet_bck.png" mode=""></image>
				<view class="absolute z-555 w-100 column b-b" style="padding-top: 90upx;">
					<view class="w-100 f-center f-18 m-b-20" style="color: #99D4D4;">已抵押资源(GAME)</view>
					<view class="c-w w-100 f-center m-b-10" style="font-size: 60upx;">{{staked_number}}</view>
				</view>
			</view>
		</view>
		<!-- 抵押资源、赎回资源 -->
		<view class="b-F9F b-b column m-b-30" style="padding: 50upx 40upx;">
			<view class="top_nav j-center w-100 f-center f-18 f-w-600 m-b-20">
				<view v-for="(item,i) in dataList" :key="i" @tap="selectTab(i)">
					<view :class="i == tabClick?'b-009':'b-w'" class="absolute z-1 b-r-50" style="width: 34upx;height: 34upx;"></view>
					<view :class="i == tabClick?'c-1F1':'c-CCC'" class="relative z-999" style="margin: 6upx 0 0 10upx;">{{item}}</view>
				</view>
			</view>
			<view class="">
				<view class="f-18 f-w-600">GAME</view>
				<view class="flex_1 column m-l-10">
					<view class="j-center">
						<input class="flex_1" type="text" v-model="number" :placeholder="textList1[tabClick]" placeholder-class="c-CCC f-15">
						<image v-if="number" class="image_15" src="../../static/images/delect_0.png" mode="" @tap="delect"></image>
					</view>
					<view v-if="red_text" style="height: 2upx;margin-top: 10upx;" class="w-100 b-DE1"></view>
					<view v-else :class="allSelect?'b-009':'b-CCC'" style="height: 2upx;margin-top: 10upx;" class="w-100"></view>
					<view style="height: 80upx;color: #DE1313;padding-top: 10upx;" class="f-10 b-b">
						<view v-if="red_text">{{textList2[tabClick]}}</view>
					</view>
				</view>
			</view>
			<!-- 提交 按钮 -->
			<btn-self text="提交" :state="allSelect" @btnClick="btnClick"></btn-self>
		</view>
		<!-- 注意 -->
		<view class="column">
			<view class="f-13" style="margin-bottom: 36upx;">注意:</view>
			<view class="j-center m-b-10">
				<view class="c-w b-r-50 b-CCC f-10 j-center f-center" style="width: 26upx;height: 26upx;">1</view>
				<view class="f-13 c-CCC m-l-5">1GAME可兑1票。</view>
			</view>
			<view class="j-center">
				<view class="c-w b-r-50 b-CCC f-10 f-center j-center" style="width: 26upx;height: 26upx;">2</view>
				<view class="f-13 c-CCC m-l-5">您可以在任何时候赎回资源，但会有3天的等待期。</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			let value1 = uni.getStorageSync('accountIndex');//账户下标选择
			let value2 = uni.getStorageSync('accountList');//账户列表
			this.account_name = value2[value1].account;
			this.privateKey = value2[value1].privateKey;
			this.staked_number = uni.getStorageSync('staked');//账户已抵押的数量
			// this.unstaking = uni.getStorageSync('unstaking');//账户能赎回的数量
			this.coin_number = uni.getStorageSync('gameCoinNumber');//账户能抵押的数量
			this.textList1[0] = "最多可抵押" + this.coin_number + "GAME";
			this.textList1[1] = "最多可赎回" + this.staked_number + "GAME";
		},
		data() {
			return {
				dataList: ['抵押资源','赎回资源'],
				textList1: ['',''],
				textList2: ['已超出可抵押的范围，请重新输入。','已超出可赎回的范围，请重新输入。'],
				tabClick: 0,
				number: "",
				staked_number: 0,
				unstaking: 0,
				coin_number: 0,
				account_name: "",//账户
				privateKey: "",//账户私钥
				button_state: false,
			}
		},
		computed: {
			allSelect() {
				if(this.number) {
					return true
				}else {
					return false
				}
			},
			red_text() {
				if(this.tabClick == 0) {
					if(this.number > parseFloat(this.coin_number)) {
						return true
					}else {
						return false
					}
				}else {
					if(this.number > parseFloat(this.staked_number)) {
						return true
					}else {
						return false
					}
				}
			}
		},
		methods: {
			selectTab(i) {//导航栏选择
				this.tabClick = i;
			},
			delect() {
				this.number = "";
			},
			moveHandle() {
				
			},
			async Delegate() {//抵押
				let res = await this.$myRequest({
					url: 'Delegate',
					data: {
						account: this.account_name,
						quantity: this.number*10000,
						walletPrivateKey: this.privateKey
					}
				});
				if(res.data.StatusCode == 200) {
					this.button_state = false;
					uni.showToast({
						title: "抵押成功",
						icon: "none",
						mask:true
					});
					setTimeout(()=> {
						uni.navigateBack({})
					},1200)
				}else {
					this.button_state = false;
					uni.showToast({
						title: "请输入正确的格式，只能保留小数点后四位小数",
						icon: "none",
						mask:true
					});
				}
			},
			async UnDelegate() {//赎回
				let res = await this.$myRequest({
					url: 'UnDelegate',
					data: {
						account: this.account_name,
						quantity: this.number*10000,
						walletPrivateKey: this.privateKey
					}
				});
				if(res.data.StatusCode == 200) {
					this.button_state = false;
					uni.showToast({
						title: "赎回成功",
						icon: "none",
						mask:true
					});
					setTimeout(()=> {
						uni.navigateBack({})
					},1200)
				}else {
					this.button_state = false;
					uni.showToast({
						title: "请输入正确的格式，只能保留小数点后四位哦",
						icon: "none",
						mask:true
					});
				}
			},
			btnClick() {
				if(this.allSelect) {
					if(this.number.split('.').length !== 1 && this.number.split('.')[1].length >= 5) {
						uni.showToast({
							title: "填写的小数位不能大于4",
							icon: 'none'
						});
						return
					};
					if(this.tabClick == 0) {//抵押
						if(this.red_text) {
							uni.showToast({
								title: "已超出可抵押的范围，请重新输入",
								icon: 'none'
							});
							return;
						};
						if(this.number == 0) {
							uni.showToast({
								title: "抵押数量不能为0",
								icon: 'none'
							});
							return;
						};
						if(!this.button_state) {
							this.button_state = true;
							this.Delegate();
						}
					}else {//赎回
						if(this.red_text) {
							uni.showToast({
								title: "已超出可赎回的范围，请重新输入",
								icon: 'none'
							});
							return;
						};
						if(this.number == 0) {
							uni.showToast({
								title: "赎回数量不能为0",
								icon: 'none'
							});
							return;
						};
						if(!this.button_state) {
							this.button_state = true;
							this.UnDelegate();
						}
					}
				}
			}
			
			
		},
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.top {
			height: 342upx;
			margin-top: 32upx;
		}
		.top_nav :nth-child(2) {
			margin-left: 40upx;
		}
	}
</style>
