<template>
	<view class="container j-center p-x-16 b-b">
		<image class="backup_image" src="../../static/images/backupWallet.png" mode=""></image>
		<view class="f-w-600 f-18">备份你的钱包</view>
		<view class="text w-100">备份钱包: 导出<text class="c-009">[助记词]</text>并抄写到安全的地方,千万不要保存在网络上。然后尝试转入、转出小额资产开始使用。</view>
		<!-- 备份钱包 按钮 -->
		<btn-self class="w-100" text="备份钱包" :state="true" @btnClick="btnClick"></btn-self>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			btnClick() {//进入 备份助记词
				uni.navigateTo({
					url: '/pages/createWallet/copyMnemonic1'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.backup_image {
			width: 180upx;
			height: 200upx;
			margin: 160upx 0 60upx;
		}
		.text {
			margin: 40upx 0 100upx 0;
		}
	}
</style>
