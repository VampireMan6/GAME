<template>
	<view class="container">
		<scroll-view class="column" scroll-y="true" :style="{height:scrollHeight+'px'}">
			<view style="height: 32upx;"></view>
			<view v-if="dataList.length !== 0" class="column p-x-16 b-b">
				<view class="f-between b-F9F" style="padding: 30rpx 20rpx;margin-bottom: 30rpx;" v-for="(item,i) in dataList" :key="i" @tap="enter(i)">
					<image v-if="item.image" class="image_30  b-r-50" :src="item.image" mode=""></image>
					<image v-else class="image_30 b-r-50" src="../../../static/images/vote_logo.png" mode=""></image>
					<view class="flex_1 column m-l-10">
						<view class="f-13 f-w-600">{{item.name}}</view>
						<view class="c-CCC f-13 m-b-10">{{item.names}}</view>
						<text class="f-18 f-w-600 m-b-10">2<text class="c-CCC f-15" style="font-weight: 400;">(节点账户)</text>:8 <text class="c-CCC f-15" style="font-weight: 400;">(投票账户)</text> </text>
						<view class="f-between c-CCC f-10">
							<view class="j-center">
								<image style="width: 12upx;height: 16upx;" src="../../../static/images/node_1.png" mode=""></image>
								<view class="m-l-5">{{item.loaction}}</view>
							</view>
							<view class="j-center">
								<image style="width: 16rpx;height: 16upx;" src="../../../static/images/node_2.png" mode=""></image>
								<view class="m-l-5">{{item.proportion}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="dataList.length == 0" class="w-100 fixed">
			<image class="image relative z-1" src="../../../static/images/pro_11.png" mode=""></image>
			<view class="absolute z-555 f-13 c-b f-center" style="top: 378upx;left: 0;right: 0;">暂无节点</view>
		</view>
		<view :class="dataList.length == 0?'button_top':'button_bottom'" class="button fixed b-w p-x-16 b-b" style="z-index: 888;height: 168upx;">
			<btn-self text="导入节点" class="w-100" :state="true" @btnClick="btnClick"></btn-self>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			try {
				let res = uni.getSystemInfoSync();
				this.scrollHeight = res.windowHeight - uni.upx2px(168) ;
			}catch (e) {
				// error
			};
		},
		onShow() {
			let myNodeList = uni.getStorageSync('myNodeList');//我的节点列表
			if(myNodeList) {
				this.dataList = myNodeList;
			}
		},
		data() {
			return {
				scrollHeight: 500,
				dataList: []
			}
		},
		methods: {
			btnClick() {
				uni.navigateTo({
					url: '/pages/Find/Vote/importNode'
				})
			},
			enter(i) {
				let names = this.dataList[i].names;
				uni.navigateTo({
					url: '/pages/Find/Vote/myNodeDetail?index=' + i + '&names=' + names
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
		.image {
			width: 522upx;
			height: 676upx;
			top: 120upx;
			margin: 0 auto;
		}
		.button {
			left: 0;
			right: 0;
		}
		.button_top {
			top: 762upx;
		}
		.button_bottom {
			bottom: 0;
		}
	}
</style>
