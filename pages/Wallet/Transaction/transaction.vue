<template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll" :style="{ height: scrolleight + 'px'}" @scrolltolower="scrollEvent">
			<!-- 顶部余额 -->
			<view class="p-x-16 b-b m-b-40">
				<view class="relative w-100 top">
					<image class="absolute z-1 w-100 h-100" src="../../../static/images/wallet_bck.png" mode=""></image>
					<view class="absolute z-555 w-100 column b-b" style="padding: 40upx;">
						<view class="w-100 f-center f-18 m-b-20" style="color: #99D4D4;">余额（{{coin_text}}）</view>
						<view class="c-w w-100 f-center m-b-10" style="font-size: 60upx;">{{number}}</view>
						<!-- <view class="c-w w-100 f-center f-13" style="color: #99D4D4;">≈523.00CNY</view>	 -->
					</view>
				</view>
			</view>
			<!-- 转入转出记录 -->
			<view class="column item p-x-16 b-b" v-for="(item,i) in dataList" :key="i" @tap="enter(i)">
				<view class="item_content column">
					<view class="f-w-600 f-between m-b-8">
						<!-- <view v-if="item.action_trace.act.name == 'undelegatebw'">赎回资源</view> -->
						<view v-if="item.action_trace.act.name == 'delegatebw'">抵押资源</view>
						<view v-if="item.action_trace.act.name == 'transfer'">
							<view v-if="item.action_trace.act.data.to == account_name">转入</view>
							<view v-else-if="item.action_trace.act.data.to == 'game.saving'">转账手续费</view>
							<view v-else>转出</view>
						</view>
						<view v-if="item.action_trace.act.name == 'transfernm'">
							<view v-if="item.action_trace.act.data.to == 'game.saving'">转账手续费</view>
							<view v-else-if="item.action_trace.act.data.to == 'eosio.stake'">抵押资源</view>
							<view v-else-if="item.action_trace.act.data.to == account_name">转入</view>
							<view v-else>转出</view>
						</view>

						<!-- <view v-if="item.action_trace.act.name == 'undelegatebw'">{{item.action_trace.act.data.unstake_cpu_quantity}}</view> -->
						<view v-if="item.action_trace.act.name == 'delegatebw'">{{item.action_trace.act.data.stake_cpu_quantity}}</view>
						<view v-if="item.action_trace.act.name == 'transfer'">{{item.action_trace.act.data.quantity}}</view>
						<view v-if="item.action_trace.act.name == 'transfernm'">{{item.action_trace.act.data.quantity}}</view>
					</view>
					<view class="f-between" style="font-size: 22upx;">
						<view class="c-CCC">{{item.block_time}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部按钮 -->
		<view class="button f-18 fixed w-100 p-x-16 b-b b-w c-w">
			<view class="flex_1 relative" style="height: 110upx;" @tap="into">
				<image class="image absolute z-1" src="../../../static/images/wallet_8.png" mode=""></image>
				<view class="absolute z-555 w-100 h-100 j-center f-center">
					<image class="" style="width: 44upx;height: 44upx;" src="../../../static/images/wallet_11.png" mode=""></image>
					<view class="m-l-5">转入</view>
				</view>
			</view>
			<view class="flex_1 relative" style="height: 110upx;" @tap="out">
				<image class="image absolute z-1" src="../../../static/images/wallet_9.png" mode=""></image>
				<view class="absolute z-555 w-100 h-100 j-center f-center">
					<image class="" style="width: 44upx;height: 44upx;" src="../../../static/images/wallet_10.png" mode=""></image>
					<view class="m-l-5">转出</view>
				</view>
			</view>
		</view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<!-- 弹出层 -->
		<time-popup :mantleState="mantleState" :year="year" :month="month" :dataMonth="dataMonth" :tabClick="tabClick"
		 @cancel="cancel" @year_select="year_select" @month_select="month_select"></time-popup>
	</view>
</template>

<script>
	import {
		dataTime
	} from '@/common/js/getTime.js'
	import timePopup from '@/components/timePopup.vue'
	import {
		url
	} from '@/common/js/api.js'

	export default {
		onLoad(options) {
			uni.showLoading({
				title: "加载中...",
				mask: true
			})
			this.index = options.index;
			try {
				let res = uni.getSystemInfoSync();
				this.scrolleight = res.windowHeight - uni.upx2px(168);
			} catch (e) {
				// error
			};
			let time = dataTime();
			this.nowYear = time[0];
			this.nowMonth = time[1];
			this.year = time[0];
			this.month = time[1];
			this.tabClick = this.month;
			var myDate = new Date();
		},
		onShow() {
			let lists = uni.getStorageSync('transactionDetail');
			let value = uni.getStorageSync('coinDataList');
			this.coinDataList = value;
			this.coinDataList = this.coinDataList.filter(x => {
				return x.state == true;
			});
			this.number = this.coinDataList[this.index].number;
			this.coin_text = this.coinDataList[this.index].name;
			let index = uni.getStorageSync('accountIndex'); //账户下标选择
			let accountList = uni.getStorageSync('accountList'); //账户列表
			this.account_name = accountList[index].account;
			this.funs();
		},
		onNavigationBarButtonTap(e) { //日期选择
			if (e.index == 0) {
				this.mantleState = true;
			}
		},
		data() {
			return {
				index: 0,
				coinDataList: [],
				account_name: "",
				coin_text: "",
				number: 0,
				scrolleight: 500,
				dataList: [],
				mantleState: false,
				year: "",
				nowYear: "",
				month: "",
				nowMonth: "",
				dataMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				tabClick: 0,
				offset: 5000,
				show: false,
				shows: false,
				isget: false
			}
		},
		components: {
			timePopup
		},
		methods: {
			JsonRpc2: function(method, params) {
				return new Promise((resolve, reject) => {
					uni.request({
						method: "POST",
						url: url + "/v1/history/" + method, //仅为示例，并非真实接口地址。
						data: JSON.stringify(params),
						dataType: "json",
						success: (res) => {
							resolve(res.data);
						},
						error: (err) => {
							reject(err);
						}
					})
				})
			},
			funs: async function() {
				let data = await this.JsonRpc2("get_actions", {
					"pos": -1,
					"offset": -this.offset,
					"account_name": this.account_name
				});
				this.dataList = data.actions;
				let lists = [];
				this.dataList.forEach((item, indexs) => { //判断区分 抵押 赎回 交易 交易手续费
					if (item.action_trace.act.name !== 'voteproducer') {
						if (item.action_trace.act.name == 'delegatebw' && item.action_trace.act.data.stake_cpu_quantity.split(' ')[1] ==
							this.coin_text) { //抵押
							lists.push(item);
						};
						// if(item.action_trace.act.name == 'undelegatebw' && item.action_trace.act.data.unstake_cpu_quantity.split(' ')[1] == this.coin_text) {
						// 	lists.push(item);
						// };
						if (item.action_trace.act.name == 'transfer' && item.action_trace.act.data.quantity.split(' ')[1] == this.coin_text) {
							lists.push(item);
						};
						if (item.action_trace.act.name == 'transfernm' && item.action_trace.act.data.quantity.split(' ')[1] == this.coin_text) {
							lists.push(item);
						};
					};
				});
				this.dataList = lists;
				let list = [];
				if (this.coin_text == 'GAME') {
					let blockList = [];
					let blockList1 = [];
					let blockList2 = [];
					let copyList = [];
					let copyList2 = [];
					this.dataList.forEach((item,index) => {
						let i = blockList.findIndex(x => x === item.block_num);
						if(i == -1) {//区块不同 
							copyList = [];
							blockList1 = [];
							blockList2 = [];
							copyList2 = [];
							blockList2.push(item);
							blockList.push(item.block_num);
							list.push(this.dataList[index]);
						}else {//区块相同下 添加进 copylist
							copyList.push(item);
							copyList.forEach((item2,index2)=> {
								let i2 = blockList1.findIndex(x => x == item2.action_trace.act.data.to);
								if(i2 == -1) {
									blockList1.push(item2.action_trace.act.data.to);
									copyList2.push(item2);
								};
							});
							let addList = [];
							copyList2.forEach((item3,index3)=> {
								blockList2.forEach((item)=> {
									addList.push(item.action_trace.act.data.to)
								}) 
								let i3 = addList.findIndex((x=> x == item3.action_trace.act.data.to));
								if(i3 == -1) {
									list.push(item3);
									blockList2.push(item3)
								}
							})
						}
					});
					// list = this.dataList;
				} else {
					let blockList = [];
					this.dataList.forEach((item, index) => { //筛选过滤
						let i = blockList.findIndex(x => x === item.block_num);
						if (i == -1) { //不存在的
							blockList.push(item.block_num);
							list.push(this.dataList[index])
						}
					})
				};
				list.forEach((item, index) => { //时间换算 + 8h
					let time = item.block_time.slice(0, 19).split("T")[0] + " " + item.block_time.slice(0, 19).split("T")[1];
					let eosFormatTime2 = function(time) {
						let time1 = time.split(' ')[0];
						let arrTime = time.split(' ')[1].split(':');
						let time2 = arrTime.slice(1, arrTime.length).join(':');
						let h = parseInt(arrTime[0]) + 8;
						let newH = ((h < 24) ? h : (h % 24)).toString();
						return time1 + ' ' + newH + ':' + time2;
					};
					list[index].block_time = eosFormatTime2(time);
				});
				this.dataList = list.reverse();
				uni.hideLoading()
			},
			scrollEvent(e) {
				this.offset += 5000;
				this.funs();
			},
			cancel() { //取消蒙层
				this.mantleState = false;
			},
			month_select(options) { //月份选择
				if (this.year == this.nowYear) { //同一年 月份日期不能大于现在的日期
					if (options <= this.nowMonth) {
						this.tabClick = options;
						// console.log(this.year,this.tabClick+1);
						this.mantleState = false;
					} else {
						// console.log("月份超出了")
					}
				} else { //不是同一年
					this.tabClick = options
					console.log(this.year, this.tabClick + 1);
					this.mantleState = false;
				};
			},
			year_select(options) { //年份选择
				if (options == 'last') { //减一年 先减一年，再判断年份，若年份小于当期年份，月份就都变成可选中状态
					this.year--;
					if (this.year < this.nowYear) {
						this.month = 11
					}
				} else { //加一年  先判断 若是当前年份 不可增加，若不是 加一年,再判断加一年后 是否等于当前年份 若是 月份就变可选择的
					if (this.year !== this.nowYear) {
						this.year++;
						if (this.year == this.nowYear) {
							this.month = this.nowMonth;
							this.tabClick = this.nowMonth;
						}
					}
				}
			},
			enter(i) { //进入 交易详情
				// let id = this.dataList[i].action_trace.trx_id;
				uni.setStorage({
					key: 'transactionDetail',
					data: this.dataList[i]
				});
				uni.navigateTo({
					url: ('/pages/Wallet/Transaction/transactionDetail?name=' + this.coin_text)
				});
			},
			into() { //进入 转入
				uni.navigateTo({
					url: '/pages/Wallet/Transaction/into?index=' + this.index
				})
			},
			out() { //进入 转出
				uni.navigateTo({
					url: '/pages/Wallet/Transaction/out?state=0' + '&index=' + this.index
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
		.scroll {
			.top {
				height: 342upx;
				margin-top: 32upx;
			}

			.item {
				margin-bottom: 30upx;

				.item_content {
					background-color: #F9F9F9;
					border-radius: 10upx;
					padding: 12upx 20upx;
				}
			}
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
