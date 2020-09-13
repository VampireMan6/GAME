<template>
	<view class="container b-b">
		<scroll-view scroll-y="true" :style="{ height: scrolleight + 'px'}">
			<view class="column b-b" style="padding: 32upx 32upx 0 32upx;">
				<view class="b-b column c-w b-r-5 b-009 scroll_item" v-for="(item,i) in dataAccountList" :key="i">
					<view class="m-b-8">{{item.account}}</view>
					<!-- <view>{{item.name}}</view> -->
				</view>
			</view>
		</scroll-view>
		<!-- 底部按钮 -->
		<view class="button f-18 fixed w-100 p-x-16 b-b b-w c-w">
			<view class="flex_1 relative" style="height: 110upx;" @tap="createWallte">
				<image class="image absolute z-1" src="../../static/images/wallet_8.png" mode=""></image>
				<view class="absolute z-555 w-100 h-100 j-center f-center">创建钱包</view>
			</view>
			<view class="flex_1 relative" style="height: 110upx;" @tap="importWallte">
				<image class="image absolute z-1" src="../../static/images/wallet_9.png" mode=""></image>
				<view class="absolute z-555 w-100 h-100 j-center f-center">导入钱包</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			try {
			    let res = uni.getSystemInfoSync();
					this.scrolleight = res.windowHeight - uni.upx2px(168);
			}catch (e) {
			    // error
			};
			let value = uni.getStorageSync('accountList');//账户列表
			this.dataAccountList = value;
		},
		data() {
			return {
				dataAccountList: [],
				scrolleight: 500,
				
			}
		},
		methods: {
			createWallte() {//创建钱包
				uni.navigateTo({
					url: '/pages/createWallet/createWallet'
				})
			},
			importWallte() {//导入钱包
				uni.navigateTo({
					url: '/pages/Wallet/importWallet'
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
		.scroll_item {
			padding: 20upx 30upx;
			margin-bottom: 30upx;
		}
		.button {
			bottom: 0;
			left: 0;
			height: 168upx;
			.image {
				width: 350upx;
				height: 100upx;
			}
		}
	}
</style>
