<template>
	<view class="container p-16 b-b">
		<view class="f-between j-center item" v-for="(item,i) in dataList" :key="i">
			<view class="j-center">
				<image v-if="item.name == 'GAME'" class="image_30 b-r-50" :src="'../../static/images/' + 'wallet_1'+ '.png'" mode=""></image>
				<image v-else class="image_30 b-r-50" src="../../static/images/wallet_0.png" mode=""></image>
				<view class="f-w-600 m-l-5">{{item.name}}</view>
			</view>
			<switch color="#009494" :checked="item.state" @tap="select(i)" style="transform:scale(0.7);" />
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.tabClick = options.index;
			let index = uni.getStorageSync('coinDataList');
			if(index) {
				this.dataList = index
			}
		},
		data() {
			return {
				dataList: [],
				tabClick: "",
			}
		},
		methods: {
			// switchChange(e) {
			// 	console.log(e)
			// 	console.log(e.target.value)
			// },
			select(i) {
				this.dataList[i].state = !this.dataList[i].state
				uni.setStorage({//保存账号下币的列表
					key: 'coinDataList2',
					data: {
						dataList :this.dataList,
						index: this.tabClick
					}
				});
				
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.item {
			margin-bottom: 90upx;
		}
	}
</style>
