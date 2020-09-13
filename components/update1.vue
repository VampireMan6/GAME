<template>
	<view class="container">
		<view class="view">
			<text style="font-size: 36rpx;font-weight: 600;margin-bottom: 40rpx;text-align: center;">发现新版,是否立即更新</text>
			<text style="font-size: 26rpx;margin-bottom: 20rpx;text-align: center;">{{updateData.data.Tip}}</text>
			<view class="f-between w-100" style="width: 100%;flex-direction: row;justify-content: space-between;align-items: flex-end;">
				<text style="flex: 1;justify-content: center;align-items: center;font-size: 30rpx;display: flex;text-align: center;" v-if="show" @tap="even(1)">取消</text>
				<text style="flex: 1;justify-content: center;align-items: center;font-size: 30rpx;display: flex;text-align: center;"  class="flex_1 j-center f-center" @tap="even(2)">更新</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			updateData: {
				type: Object,
				default() {
					return []
				}
			},
		},
		data() {
			return {
				
			}
		},
		methods: {
			even(i) {
				this.$emit('evenUpdate',i)
			}
		}, 
		computed: {
			show() {
				if(this.updateData.status == 1) {
					return false;
				}else {
					return true;
				}
			}
		} 
	}
</script>

<style scoped>
	.container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0,.5);
		z-index: 999;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.view {
		border-radius: 16rpx;
		width: 600rpx;
		padding: 32rpx;
		/* box-sizing: border-box; */
		background-color: #FFFFFF;
		flex-direction: column;
		justify-content: center;
	}
</style>
