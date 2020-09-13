<template>
	<view class="container j-center p-x-16 b-b">
		<view class="f-w-600 f-18 text_top">抄写下你的钱包助记词</view>
		<view class="c-999" style="margin-bottom: 70upx;">助记词用于恢复钱包或者重置钱包密码,将它准确的抄写到纸上,并存放在只有你知道的安全的地方。</view>
		<!-- 助记词列表 -->
		<view class="b-b" style="height: 420upx;padding: 30upx 0;">
			<view class="f-w">
				<view v-for="(item,i) in dataList" :key="i">
					<view class="text_copy">{{item}}</view>
				</view>
			</view>
		</view>
		<view style="margin-bottom: 70upx;"></view>
		<!-- 下一步 按钮 -->
		<btn-self class="w-100" text="下一步" :state="true" @btnClick="btnClick"></btn-self>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: ['excite','tumble','tumble','transformers','tumble','excite'],
			}
		},
		methods: {
			btnClick() {//进入 
				uni.navigateTo({
					url: '/pages/createWallet/copyMnemonic2'
				})
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.text_top {
			margin: 120upx 0 40upx;
		}
	}
</style>
