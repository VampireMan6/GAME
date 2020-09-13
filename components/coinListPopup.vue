<template>
	<view :class="mantleState?'bottom_true':''" class="fixed w-100 z-999 p-x-16 b-b popup transition">
		<view class="contain column b-w w-100 b-b b-r-5">
			<view class="w-100 f-end">
				<view class="image_30" style="align-items: flex-end;" @tap="cancel">
					<image class="image_15" src="../static/images/delect_1.png" mode=""></image>
				</view>
			</view>
			<view style="height: 40upx;"></view>
			<scroll-view scroll-y="true" class="column" style="height: 340upx;">
				<view class="j-center f-between p-x-16 b-b" style="margin-bottom: 50upx;" v-for="(item,i) in dataList" :key="i" @tap="select(i)">
					<view class="j-center">
						<image v-if="item.name == 'GAME'" class="image_30 b-r-50" src="../static/images/wallet_1.png" mode=""></image>
						<image v-else class="image_30 b-r-50" src="../static/images/wallet_0.png" mode=""></image>
						<view class="m-l-10">{{item.name}}</view>
					</view>
					<image v-if="i == tabClick" style="width: 36upx;height: 36upx;" src="../static/images/pro_12.png"></image>
					<view v-else style="width: 32upx;height: 32upx;border: 2upx solid #707070;" class="b-r-5 "></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default() {
					return []
				}
			},
			mantleState: {
				type: Boolean,
				default: false
			},
			tabClick: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			cancel() {
				this.$emit("cancel")
			},
			select(i) {
				this.$emit('select',i)
			}
		}
	}
</script>

<style scoped>
	view {
		display: flex;
	}
	.popup {
		height: 480upx;
		bottom: -480upx;
		left: 0;
		right: 0;
	}
	.bottom_true {
		bottom: 68upx;
	}
</style>
