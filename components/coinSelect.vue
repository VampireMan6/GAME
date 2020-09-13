<template>
	<view class="b-F9F f-between j-center b-b b-r-5" style="padding: 24upx 20upx;" @tap="select">
		<view class="j-center">
			<!-- <image class="image_30 b-r-50" src="'../static/images/' + image + '.png'" mode=""></image> -->
			<image v-if="select_text == 'GAME'" class="image_30 b-r-50" src="../static/images/wallet_1.png" mode=""></image>
			<image v-else class="image_30 b-r-50" src="../static/images/wallet_0.png" mode=""></image>
			<view class="f-w-600 m-l-10">{{select_text}}</view>
		</view>
		<!-- <picker mode="selector" :range="dataList" @change="select_type">
			<image class="" style="width: 42upx;height: 42upx;" src="../static/images/wallet_16.png" mode=""></image>
		</picker> -->
		<image :class="mantleState?'is-rotate':''" style="width: 42upx;height: 42upx;" class="transition" src="../static/images/wallet_16.png" mode=""></image>
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
			select_text: {
				type: String,
				default: ""
			},
			mantleState: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			select() {
				this.$emit('select')
			}
		}
	}
</script>

<style scoped>
	view {
		display: flex;
	}
	.is-rotate {
	  transform: rotate(90deg);
	}
</style>
