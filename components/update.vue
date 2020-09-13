<template>
	<view class="container j-center f-center">
		<view class="view column j-center">
			<text class="f-18 f-w-600 m-b-20">发现新版,是否立即更新</text>
			<view class="f-13 m-b-10">{{updateData.data.Tip}}</view>
			<view class="f-between w-100" style="align-items: flex-end;">
				<view class="flex_1 j-center f-center" v-if="show" @tap="even(1)">取消</view>
				<view class="flex_1 j-center f-center" @tap="even(2)">更新</view>
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
	}
	.view {
		border-radius: 16rpx;
		width: 600rpx;
		padding: 32rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}
</style>
