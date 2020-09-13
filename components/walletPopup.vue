<template>
	<view :class="mantleState?'bottom_true':''" class="popup p-x-16 b-b fixed z-999 w-100 transition">
		<view class="h-100 b-w w-100 b-b view column">
			<view class="column p-x-16 b-b" style="height: 100upx;margin-top: -100upx;">
				<view class="j-center f-between">
					<image class="image_15" src="../static/images/delect_0.png" mode="" @tap="cancel"></image>
					<view class="c-b f-w-600">选择钱包</view>
					<view class="c-009 f-w-600" @tap="enterManage">管理</view>
				</view>
				<view style="height: 60upx;"></view>
			</view>
			<scroll-view class="h-100 column" scroll-y="true" >
				<view class="column p-x-16 b-b">
					<view class="f-between j-center b-b b-r-5 b-009 scroll_item" v-for="(item,i) in dataList" :key="i" @tap="selectWallet(i)">
						<view class="column c-w">
							<view class="m-b-8">{{item.account}}</view>
						</view>
						<image v-if="i == tabClick" class="image_15" src="../static/images/wallet_7.png" mode=""></image>
						<view v-else class="image_15 b-w b-r-50"></view>
					</view>
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
		methods: {
			cancel() {
				this.$emit("cancel")
			},
			enterManage() {
				this.$emit('enterManage')
			},
			selectWallet(i) {
				this.$emit('selectWallet',i)
			}
		}
	}
</script>

<style lang="scss" scoped>
	view {
		display: flex;
	}
	.popup {
		height: 50vh;
		bottom: -50vh;
		.view {
			border-radius: 10upx 10upx 0 0;
			padding: 140upx 0 40upx;
			.scroll_item {
				padding: 20upx 30upx;
				margin-bottom: 30upx;
			}
		}
	}
	.bottom_true {
		bottom: 0;
	}
</style>
