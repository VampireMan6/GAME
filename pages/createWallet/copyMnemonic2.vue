<template>
	<view class="container">
		<view class="p-x-16 b-b column flex j-center">
			<view class="f-w-600 f-18 text_top">确认你的钱包助记词</view>
			<view class="c-999 m-b-20">请按顺序点击助记词,以确认你的备份助记词正确。</view>
			<!-- 确认钱包助记词 -->
			<view class="true_copy b-b w-100" style="background-color: #f9f9f9;">
				<view class="flex f-w">
					<view class="relative" v-for="(item,i) in dataListSelect" :key="i">
						<view class="text_copy relative z-1">{{item}}</view>
						<image class="delect_image absolute z-555" src="../../static/images/delect_0.png" mode="" @tap="delect_copy(i)"></image>
					</view>
				</view>
			</view>
			<!-- 助记词列表 -->
			<view class="true_copy b-b w-100" style="padding: 60upx 0 0 0 !important;">
				<view class="flex f-w">
					<view v-for="(item,i) in dataList" :key="i" @tap="add_copy(i)">
						<view class="text_copy">{{item}}</view>
					</view>
				</view>
			</view>
			<view style="margin-bottom: 60upx;"></view>
			<!-- 确认 按钮 -->
			<btn-self class="w-100" text="确认" :state="state" @btnClick="btnClick('next')"></btn-self>
			<view style="height: 174upx;"></view>
		</view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<!-- 弹出层 -->
		<view :class="mantleState?'bottom_true':''" class="flex popup fixed z-999 w-100 p-x-16 b-b transition" @touchmove.stop.prevent="moveHandle">
			<view class="flex column h-100 b-r-5 b-w popup_view b-b j-center">
				<view style="margin-bottom: 60upx;">你备份的助记词顺序验证正确,是否从GAME移除该助记词。</view>
				<!-- 确定 按钮 -->
				<btn-self class="w-100" text="确定" :state="state" @btnClick="btnClick('sure')"></btn-self>
				<view class="c-009 f-18" style="margin-top: 60upx;" @tap="cancel">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: ['excite','tumble','tumble','transformers','tumble','excite'],
				dataListSelect: [],
				mantleState: false,
			}
		},
		computed: {
			state() {
				if (this.dataList.length == 0) {
					return true
				}else {
					return false
				}
			}
		},
		methods: {
			add_copy(i) {//选择 助记词
				this.dataListSelect.push(this.dataList[i]);
				this.dataList.splice(i,1);
			},
			delect_copy(i) {//移除 助记词
				this.dataList.push(this.dataListSelect[i]);
				this.dataListSelect.splice(i,1);
			},
			btnClick(options) {//确认
				if(this.state && options == 'next') {
					this.mantleState = true;//蒙层显示
				};
				if(options == 'sure') {//进入钱包
					uni.reLaunch({
						url: '/pages/Wallet/wallet'
					})
				}
			},
			cancel() {//取消
				this.mantleState = false;
			},
			moveHandle() {
				
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.text_top {
			margin: 120upx 0 40upx;
		}
		.true_copy {
			height: 420upx;
			border-radius: 10upx;
			padding: 30upx 20upx;
			.delect_image {
				width: 36upx;
				height: 36upx;
				top: -10upx;
				right: 20upx;
			}
		}
		.popup {
			height: 500upx;
			bottom: -500upx;
			.popup_view {
				padding: 80upx 40upx 0;
			}
		}
		.bottom_true {
			bottom: 68upx;
		}
	}
</style>
