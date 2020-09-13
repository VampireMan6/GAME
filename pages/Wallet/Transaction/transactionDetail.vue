<template>
	<view class="container p-16 b-b">
		<view class="column j-center">
			<image class="image m-b-20" :src="'../../../static/images/'+ image + '.png'" mode=""></image>
			<view class="f-w-600 f-18 m-b-10">{{dataText[state]}}</view>
			<view class="f-10 c-CCC">{{data.block_time}}</view>
			<view :class="state?'m-b-50':'m-b-40'">
				<view  v-if="!state" class="f-13 c-999 m-t-10">待转入</view>
			</view>
		</view>
		<view class="column m-b-50">
			<view class="f-between m-b-30" v-for="(item,i) in dataList" :key="i">
				<view class="c-CCC" style="width: 160upx;">{{item.name}}</view>
				<view class="flex_1 column">
					<view v-if="i == 0">
						<view v-if="data.action_trace.act.name == 'transfer' || 'transfernm'" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.act.data.quantity}}</view>
						<view v-if="data.action_trace.act.name == 'delegatebw'" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.act.data.stake_cpu_quantity}}</view>
						<view v-if="data.action_trace.act.name == 'undelegatebw'" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.act.data.unstake_cpu_quantity}}</view>
					</view>
					<view v-if="i == 1">
						<view v-if="data.action_trace.act.name == 'transfer' || 'transfernm'" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{(data.action_trace.act.data.to || '') | viewtext1 }}</view>
						<view v-if="data.action_trace.act.name == 'undelegatebw' || 'delegatebw' " class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{(data.action_trace.act.data.receiver || '') | viewtext1 }}</view>
					</view>
					<view v-if="i == 2" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.act.data.from | viewtext1 }}</view>
					<view v-if="i == 3">
						<view v-if="data.action_trace.act.name == 'transfer' || 'transfernm'" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.act.data.memo}}</view>
						<view v-if="data.action_trace.act.name == 'delegatebw' || ''" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">无</view>
						<!-- <view v-else class="f-w-600" style="word-wrap:word-break;word-break:break-all;">无</view> -->
					</view>
					<view v-if="i == 4" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.trx_id}}</view>
					<view v-if="i == 5" class="f-w-600" style="word-wrap:word-break;word-break:break-all;">{{data.action_trace.block_num}}</view>
					<view v-if="i == 1 || i == 2 || i == 4" class="f-10 c-CCC j-center f-center" 
					style="width: 70upx;height: 40upx;background-color: #F8F8F8;border-radius: 50upx;margin-top: 10upx;" @tap="copy(i)">复制</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.name = options.name;
			let lists = uni.getStorageSync('transactionDetail');
			this.data = lists;
		},
		data() {
			return {
				dataList: [{name:'金额 :',message: ""},{name:'收款地址 :',message: ""},{name:'付款地址 :',message: ""},
				{name:'备注 :',message: ""},{name:'交易编号 :',message: ""},{name:'区块 :',message: ""}],
				dataText: ['交易失败','交易成功'],
				state: true,
				image: "wallet_14",
				id: "",
				time: "",
				name: "",
				data: [],
				memo: "",
				str: ""
			}
		},
		filters: {
			viewtext1(value) {
				return value.replace('eos','')
			}
		},
		methods: {
			copy(i) {
				if(i == 1) {
					if(this.data.action_trace.act.name == 'transfer') {
						this.str = this.data.action_trace.act.data.to;
					};
					if(this.data.action_trace.act.name == 'transfernm') {
						this.str = this.data.action_trace.act.data.to;
					};
					if(this.data.action_trace.act.name == 'undelegatebw') {
						this.str = this.data.action_trace.act.data.receiver;
					}
					if(this.data.action_trace.act.name == 'delegatebw' ) {
						this.str = this.data.action_trace.act.data.receiver;
					}
				}else if(i == 2) {
					this.str = this.data.action_trace.act.data.from;
				}else {
					this.str = this.data.action_trace.trx_id;
				}
				uni.setClipboardData({
					data: this.str,
					success: ()=> {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1000,
							mask: true
						});
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
		.image {
			width: 210upx;
			height: 190upx;
		}
	}
</style>
