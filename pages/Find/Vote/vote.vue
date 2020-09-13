<template>
	<view class="container">
		<view class="column fixed z-999 w-100 b-b">
			<!-- 顶部状态栏 -->
			<view class="b-w" :style="{ height: statusBarH + 'px' }"></view>
			<view class="w-100 f-between j-center b-w b-b" style="height: 88upx;padding-right: 32upx;">
				<view style="width: 100rpx;" @tap="back"><i class="uni-btn-icon c-1F1" style="font-size: 27px;"></i></view>
				<view class="f-16 c-1F1 flex_1 f-center" style="font-weight: 700;">节点投票</view>
				<view class="f-13" @tap="enterNode">节点管理</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="column b-b" style="padding-bottom: 68rpx;" :style="{ height: scrolleight + 'px',marginTop: content_top + 'px'}">
			<!-- 顶部 -->
			<view class="p-x-16 b-b m-b-40">
				<view class="relative w-100 top">
					<image class="absolute z-1 w-100 h-100" src="../../../static/images/wallet_bck.png" mode=""></image>
					<view class="absolute z-555 w-100 h-100 column b-b" style="padding: 32upx 40upx;">
						<view class="w-100 f-end m-b-8">
							<image @tap="show" :src="'../../../static/images/' + eyes + '.png'" mode="" style="width: 32upx;height: 20upx;"></image>
						</view>
						<view class="w-100 f-center f-18 m-b-20" style="color: #99D4D4;">总收益资产(GAME)</view>
						<view v-if="shows" class="c-w w-100 f-center m-b-10" style="font-size: 60upx;">{{profit_number}}</view>
						<view v-else class="c-w w-100 f-center m-b-10" style="font-size: 60upx;">******</view>
					</view>
				</view>
			</view>
			<!-- 推荐排序、得票率 -->
			<view class="f-between j-center content p-x-16 b-b m-b-20">
				<view class="flex_1 j-center">
					<image class="image1" src="../../../static/images/find_8.png" mode=""></image>
					<view class="j-center" v-for="(item,i) in dataList" :key="i" @tap="select(i)">
						<view :class="i == tabClick?'f-18':'f-15'" class="">{{item}}</view>
						<view v-if="i == 0" class="b-CCC" style="width: 2upx;height: 30upx;margin: 0 20upx;"></view>
					</view>
				</view>
				<view class="search f-between j-center b-b">
					<view class="j-center flex_1">
						<image class="image2" src="../../../static/images/find_9.png" mode=""></image>
						<input class="flex_1 f-13 m-l-10" confirm-type="search" @input="searchtext"  @confirm="search"
						 v-model="search_text" type="text" placeholder="搜索" placeholder-class="f-13 c-CCC">
					</view>
					<image v-if="search_text" style="width: 24upx;height: 24upx;" src="../../../static/images/delect_0.png" mode="" @tap="delect"></image>
				</view>
			</view>
			<!-- 列表 -->
			<view class="p-x-16 b-b column list" v-for="(item,i) in data1" :key="i">
				<view class="b-F9F b-r-5 h-100 item b-b">
					<image class="image3 b-r-50" :src="item.image" mode=""></image>
					<view class="flex_1 f-between j-center">
						<view class="flex_1 column m-l-10">
							<view class="m-b-8">
								<view class="f-w-600 f-13">{{item.name}}</view>
								<view class="f-w-600 f-13 m-l-10">{{item.names}}</view>
							</view>
							<view class="f-w-600 f-13 m-b-8">{{item.describe}}</view>
							<view>
								<view class="j-center">
									<image style="width: 16upx;height: 16upx;" src="../../../static/images/find_10.png" mode=""></image>
									<view class="f-10 c-CCC m-l-5">{{item.proportion}}%</view>
								</view>
								<view class="j-center" style="margin-left: 50upx;">
									<image style="width: 16upx;height: 16upx;" src="../../../static/images/find_11.png" mode=""></image>
									<view class="f-10 c-CCC m-l-5">{{item.loaction}}</view>
								</view>
							</view>
						</view>
						<view v-if="producers == item.names" class="b-7FC c-w j-center f-center m-l-10" style="width: 120upx;height: 70upx;border-radius: 50upx;" @tap="enter(i)">已投</view>
						<view v-else class="b-009 c-w j-center f-center m-l-10" style="width: 120upx;height: 70upx;border-radius: 50upx;" @tap="enter(i)">投票</view>
					</view>
				</view>
			</view>
			<view v-if="nothing" class="relative w-100 f-center" style="margin-top: 40upx;">
				<image class="image absolute z-1" style="width: 522upx;height: 676upx;" src="../../../static/images/pro_11.png" mode=""></image>
				<view class="absolute z-555 f-13 c-b f-center" style="top:240upx;left: 0;right: 0;">暂无数据</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { url2 } from '@/common/js/api.js'
	
	export default {
		onLoad() {
			try {
				let res = uni.getSystemInfoSync();
				this.statusBarH = res.statusBarHeight;
				this.scrolleight = res.windowHeight - this.statusBarH - uni.upx2px(88);
				this.content_top = this.statusBarH + uni.upx2px(88);
			} catch (e) {
				// error
			};
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			let value = uni.getStorageSync('accountList');//账户列表
			this.account_name = value[index].account;
			this.getProfit();
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.getVoteList();
		},
		onShow() {
			let index = uni.getStorageSync('producers');//当前投票的数据
			this.producers = index[0];
			let value = uni.getStorageSync('setUpNodeMes');
			if(value) {
				this.producers = index[0];
				this.dataListVote = [];
				this.dataListVote1 = [];
				this.data1 = [];
				this.data2 = [];
				this.data3 = [];
				this.getProfit();
				this.getVoteList();
				uni.removeStorage({
					key: 'setUpNodeMes'
				})
			}
		},
		data() {
			return {
				statusBarH: 0,
				scrolleight: 500,
				content_top: 44,
				dataList: ['推荐排序', '得票率'],
				tabClick: 0,
				dataListVote: [],//总的列表数
				dataListVote1:[],//返回数据全的列表
				eyes: "find_7",
				shows: true,
				data1: [],//动态显示的列表
				data2: [],//数据处理后该显示的列表数
				data3: [],//得票率对比的列表
				search_text: "",
				producers: [],//已投票列表
				nothing: false,
				account_name: "",
				profit_number: 0,
			}
		},
		methods: {
			getProfit() {//投票收益
				uni.request({
					url: url2 + 'owner/amount',
					method: 'POST',
					data: {
						"owner": this.account_name
					},
					success: (res) => {
						console.log(res)
						if(res.data.code == 200) {
							this.profit_number = parseFloat(res.data.data.total).toFixed(4);
						}
					}
				});
			},
			async getVoteList() {//超级节点信息
				let res = await this.$myRequest({
					url: 'getProducers',
					method: "GET"
				});
				if(res.data.StatusCode == 200) {
					let total_producer_vote_weight = res.data.Data.total_producer_vote_weight;
					this.dataListVote = res.data.Data.rows;
					this.dataListVote.forEach((item,index)=> {
						item.proportion = (item.total_votes/total_producer_vote_weight*100).toFixed(5)
					});
					this.getVoteList1();
				}else {
					uni.hideLoading()
				}
			},
			async getVoteList1() {//所有节点信息
				let res = await this.$myRequest({
					url: 'getTotalNodes',
					method: "GET"
				});
				if(res.data.StatusCode == 200) {
					this.dataListVote1 = res.data.Data;
					let list = [];
					list = res.data.Data;
					// console.log(list)
					list.forEach((item,index)=> {
						this.dataListVote1[index].json = JSON.parse(item.json);
					});
					this.dataListVote.forEach((item,i)=> {
						let index = this.dataListVote1.findIndex(x=> x.owner == item.owner);
						if(index !== -1) {
							this.data1.push(this.dataListVote[i]);
							this.data1[i].loaction = this.dataListVote1[index].json.org.location.name || '暂无';
							this.data1[i].image = this.dataListVote1[index].json.org.branding.logo_256;
							this.data1[i].name = this.dataListVote1[index].json.producer_account_name;
							this.data1[i].names = this.dataListVote1[index].owner;
							this.data1[i].describe = this.dataListVote1[index].json.org.candidate_name;
						}else {
							this.data1.push(this.dataListVote[i]);
							this.data1[i].loaction = "暂无";
							this.data1[i].image = '../../../static/images/vote_logo.png';
							this.data1[i].name = "暂无";
							this.data1[i].describe = "暂无";
							this.data1[i].names = this.dataListVote[i].owner;
						}
					});
					uni.setStorage({
						key: 'voteList',
						data: this.data1
					});
					this.data2 = JSON.parse(JSON.stringify(this.data1));
					this.data3 = JSON.parse(JSON.stringify(this.data1));
					uni.hideLoading()
				}else {
					uni.hideLoading()
				}
			},
			show() {
				if (this.shows) {
					this.eyes = "find_12";
				} else {
					this.eyes = "find_7";
				};
				this.shows = !this.shows;
			},
			select(i) {
				this.search_text = "";
				this.tabClick = i;
				console.log(this.tabClick)
				if(i == 0) {
					this.data1 = this.data2;
				}else {
					let list = [];
					let list1 = [];
					this.data3.forEach((item,index)=> {
						list.push(item.proportion)
					});
					list.sort(function(a,b){
						return b - a
					});
					list.forEach((item,i)=> {
						let index = this.data3.findIndex(x=> x.proportion == item);
						list1.push(this.data3[index])
					});
					this.data1 = list1;
				}
			},
			enter(i) {
				uni.setStorage({//保存进入的投票对象
					key: 'voteproducerList',
					data: this.data1[i]
				});
				uni.navigateTo({
					url: '/pages/Find/Vote/vote2'
				})
			},
			search(e) {
				let str = e.detail.value;
				str.indexOf("2") != -1;
				let list = [];
				this.data1.forEach((item,index)=> {
					if(item.names.indexOf(str) !== -1) {
						list.push(this.data1[index])
					}
				});
				this.data1 = list;
			},
			delect() {
				this.search_text = "";
				this.data1 = this.data2;
			},
			searchtext(e) {
				if(e.detail.value == "") {
					this.data1 = this.data2;
				}
			},
			back() {//返回
				uni.navigateBack({})
			},
			enterNode() {//进入 节点管理
				uni.setStorage({
					key: 'nodeList',
					data: this.data2
				})
				uni.navigateTo({
					url: '/pages/Find/Vote/myNode'
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
		.top {
			height: 342upx;
			margin-top: 32upx;
		}

		.content {
			.image1 {
				width: 30upx;
				height: 24upx;
				margin-right: 20upx;
			}

			.search {
				width: 280upx;
				height: 50upx;
				background-color: #F9F9F9;
				border-radius: 50upx;
				padding: 0 20upx;

				.image2 {
					width: 24upx;
					height: 24upx;
				}
			}
		}

		.list {
			height: 190upx;
			margin-bottom: 30upx;

			.item {
				.image3 {
					width: 40upx;
					height: 40upx;
				}

				padding: 30upx 20upx;
			}
		}
	}
</style>
