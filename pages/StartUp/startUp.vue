<template>
	<view class="container b-009">
		<view class="fixed image f-center w-100" style="bottom: 120upx;">
			<image style="width: 250upx;height: 202upx;" src="../../static/images/logo1.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		onReady() {
			setTimeout(()=> {
				let value = uni.getStorageSync('accountList');//判断账户列表
				if(value) {
					uni.switchTab({
						url: '/pages/Wallet/wallet'
					})
				}else {
					uni.navigateTo({
						url: ('/pages/createWallet/createWallet?state=1' )
					})
				}
			})
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		height: 100vh;
	}
</style>
