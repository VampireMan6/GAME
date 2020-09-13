<template>
	<view class="container p-16 b-b">
		<!-- 币种选择 -->
		<coin-select :select_text="select_text" :mantleState="mantleStates" @select="selectCoin"></coin-select>
		<view class="column j-center" style="margin-top: 100upx;">
			<view class="c-CCC m-b-20">扫二维码，转入{{coinName}}</view>
			<!-- <view class="m-b-30">
				<canvas style="width: 260upx;height: 260upx;" canvas-id="couponQrcode"></canvas>
			</view> -->
			<image :src="images" style="width: 260upx;height: 260upx;" mode=""></image>
			<view class="c-CCC m-b-10">钱包地址</view>
			<view class="copy_text b-F9F w-100 m-b-50 j-center">
				<view class="left b-b flex_1" style="word-wrap:word-break;word-break:break-all;">{{text}}</view>
				<!-- <input disabled="true" class="flex_1 b-b" style="padding: 0 0 0 40upx;" type="text" :placeholder="text" placeholder-class="c-1F1 f-15"> -->
				<view class="b-009 copy j-center f-center f-18 c-w" @tap="copy">复制</view>
			</view>
			<view class="f-18 c-009" @tap="setup">设置收款金额</view>
		</view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState1" @cancel="cancel"></mantle>
		<!-- 弹出层 -->
		<view :class="mantleState1?'bottom_true':''" class="popup fixed p-x-16 z-999 b-b transition">
			<view class="w-100 h-100 column j-center content b-b b-w b-r-5">
				<view class="c-b f-w-600" style="margin-bottom: 70upx;">设置收款金额</view>
				<input class="w-100" v-model="moneyText" style="margin-bottom: 10upx;" placeholder="请输入收款金额" placeholder-class="c-CCC f-15"
				 type="text">
				<view :class="state?'b-009':'b-CCC'" class="border_1_CCC w-100 b-CCC" style="margin-bottom: 70upx;"></view>
				<!-- 确定 按钮 -->
				<btn-self class="w-100" text="确定" :state="state" @btnClick="btnClick"></btn-self>
				<view class="f-18 c-009" style="margin-top: 54upx;" @tap="cancel">取消</view>
			</view>
		</view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState2" @cancel="cancel"></mantle>
		<!-- 弹出层 -->
		<coin-list-popup :dataList="dataList" :mantleState="mantleState2" @cancel="cancel" :tabClick="tabClick" @select="select"></coin-list-popup>
	</view>
</template>

<script>
	import coinSelect from '@/components/coinSelect.vue'
	import coinListPopup from '@/components/coinListPopup.vue'
	import QR from "@/common/js/wxqrcode.js"
	
	export default {
		onLoad(options) {
			this.index = options.index;
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			let value = uni.getStorageSync('accountList');//账户列表
			this.text = value[index].account;
			let money = uni.getStorageSync('amountCollect');//账户收款金额
			if(money) {
				uni.removeStorage({
					key: 'amountCollect'
				})
			};
			let coinList = uni.getStorageSync('coinDataList');//账户下币的列表
			this.dataList = coinList.filter(x=> {
				return x.state == true;
			});
			this.select_text = this.dataList[this.index].name;
			this.images =  QR.createQrCodeImg(this.text +','+ this.moneyText +',' + this.select_text, { size: parseInt(260) });
		},
		data() {
			return {
				select_text: "请选择币种",
				mantleState1: false,
				mantleState2: false,
				moneyText: 0,
				dataList: [],
				tabClick: 999,
				text: "",
				coinName:"币种",
				index: 0,//选择转入的币种下标
				images: "",
				coin_image: ""
			}
		},
		components: {
			coinSelect,
			coinListPopup
		},
		computed: {
			state() {
				if (this.moneyText) {
					return true
				} else {
					return false
				}
			},
			mantleStates() {
				if (this.mantleState1 == true || this.mantleState2 == true) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			cancel() { //取消蒙层
				this.mantleState1 = false;
				this.mantleState2 = false;
			},
			setup() { //设置金额
				this.mantleState1 = true;
			},
			selectCoin() { //币种选择
				this.mantleState2 = true;
			},
			select(i) {
				this.tabClick = i;
				this.select_text = this.dataList[i].name;
				this.coinName = this.dataList[i].name;
				this.cancel();
				// this.couponQrCode();
				this.images =  QR.createQrCodeImg(this.text +','+ this.moneyText +',' + this.select_text, { size: parseInt(260) })
			},
			copy() {
				uni.setClipboardData({
					data: this.text,
					success: ()=> {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				});
			},
			btnClick() {
				if(this.state) {
					uni.setStorage({//保存收款金额
						key: 'amountCollect',
						data: this.moneyText
					});
					this.mantleState1 = false;
					// this.couponQrCode();
					this.images =  QR.createQrCodeImg(this.text +','+ this.moneyText +',' + this.select_text, { size: parseInt(260) })
				}
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}

	.container {
		.copy_text {
			height: 100upx;
			border-radius: 50upx;

			.copy {
				width: 150upx;
				height: 100upx;
				border-radius: 0 50upx 50upx 0;
			}

			.left {
				padding: 14upx 40upx;
				width: 540upx;
			}
		}

		.popup {
			bottom: -520upx;
			left: 0;
			right: 0;
			height: 520upx;

			.content {
				padding: 40upx;
			}
		}

		.bottom_true {
			bottom: 68upx;
		}
	}
</style>
