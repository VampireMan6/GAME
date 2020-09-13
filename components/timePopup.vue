<template>
	<view :class="mantleState?'bottom_true':''" class="data_select w-100 fixed p-x-16 b-b z-999 transition">
		<view class="column j-center b-w w-100 b-r-5">
			<view class="f-end w-100">
				<view class="delect b-07A column f-end" @tap="cancel">
					<image class="image" src="../static/images/delect_1.png" mode=""></image>
				</view>
			</view>
			<!-- 年份选择 -->
			<view class="j-center m-b-30">
				<image class="image_left" src="../static/images/wallet_13.png" mode="" @tap="year_select('last')"></image>
				<view class="f-18" style="margin: 0 30upx;">{{year}} 年</view>
				<image class="image_left" src="../static/images/wallet_12.png" mode="" @tap="year_select('next')"></image>
			</view>
			<!-- 月份选择 -->
			<view class="f-w w-100" @touchmove.stop.prevent="moveHandle">
				<view class="m-b-10 relative f-center" v-for="(item,i) in dataMonth" :key="i" @tap="month_select(i)" style="width: 25%;margin-bottom: 50upx;">
					<view v-if="i == tabClick" class="absolute b-009 b-r-50 z-1" style="width: 36upx;height: 36upx;top: 12upx;left: 80upx;"></view>
					<view :class="i <= month? 'c-1F1': 'c-CCC'" class="relative z-999">{{item}}月</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			mantleState: {
				type: Boolean,
				default: false
			},
			year: {
				type: Number,
				default: 0
			},
			month: {
				type: Number,
				default: 0
			},
			tabClick: {
				type: Number,
				default: 0
			},
			dataMonth: {
				type: Array,
				default() {
					return []
				}
			}
		},
		methods: {
			cancel() {//弹出层取消
				this.$emit("cancel")
			},
			month_select(i) {//月份选择
				this.$emit("month_select",i)
			},
			year_select(options) {//年份选择
				this.$emit("year_select",options)
			},
			moveHandle() {
				
			}
		}
	}
</script>

<style scoped lang="scss">
	view {
		display: flex;
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
</style>
