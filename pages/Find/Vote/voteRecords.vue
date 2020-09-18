<template>
	<view class="container p-16 b-b">
		<view class="b-F9F b-r-5 f-between j-center b-b m-b-10" style="padding: 32rpx 20rpx;" v-for="(item,i) in dataList" :key="i">
			<view class="j-center">
				<image class="image_30 b-r-50" :src="item.image" mode=""></image>
				<view class="m-l-10 column">
					<text class="f-13 f-w-600 m-b-8">{{item.bp_name}}</text>
					<text class="c-CCC f-13">{{item.create_time}}</text>
				</view>
			</view>
			<text class="f-13 f-w-600">{{parseFloat(item.ticket).toFixed(4)}}票</text>
		</view>
		<view v-show="noData" class="w-100 f-center f-13" style="margin-top: 80rpx;">这里什么都没有哦</view>
		<view v-show="noMore" class="w-100 f-center f-13">没有更多了</view>
	</view>
</template>

<script>
import { url2 } from '@/common/js/api'
	
	export default {
		onLoad() {
			let i = uni.getStorageSync('accountIndex');//账户下标选择
			let value = uni.getStorageSync('accountList');//账户列表
			this.account_name = value[i].account;
			
			let index = uni.getStorageSync('voteList');
			this.voteList = index;
			this.voteRecord();
		},
		data() {
			return {
				account_name: "",
				dataList: [],
				voteList: [],
				page: 1,
				noData: false,
				noMore: false,
			}
		},
		onReachBottom() {
			if(!this.noMore) {
				this.page ++;
				this.voteRecord();
			}
		},
		methods: {
			voteRecord() {
				uni.request({
					url: url2 + 'vote/details',
					method: 'POST',
					data: {
						"owner": this.account_name,
						"page": this.page,
						"limit": 30
					},
					success: (res) => {
						if(res.data.code == 200) {
							if(res.data.data.count == 0) {
								this.noData = true;
								return
							};
							this.dataList = [...this.dataList,...res.data.data.rows];
							if(this.dataList.length <= res.data.data.count) {
								this.noData = false;
								this.noMore = true;
							};
							this.dataList.forEach((item,i)=> {
								let index = this.voteList.findIndex(x=>x.names == item.bp_name);
								this.dataList[i].image = this.voteList[index].image;
							});
							this.dataList = this.dataList.reverse();
						}
					}
				});
			},
			
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		
	}
</style>
