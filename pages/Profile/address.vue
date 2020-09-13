<template>
	<view class="container">
		<scroll-view class="column" scroll-y="true" :style="{height:scrollHeight+'px'}">
			<view style="height: 32upx;"></view>
			<view v-if="!show" class="column p-x-16 b-b">
				<view class="b-F9F f-between j-center b-b b-r-5 w-100 m-b-20" style="padding: 24upx 20upx;" v-for="(item,i) in addressList" :key="i" @tap="selectAddress(i)">
					<view class="j-center">
						<image v-if="item.name == 'GAME'" class="image_30 b-r-50" src="../../static/images/wallet_1.png" mode=""></image>
						<image v-else class="image_30 b-r-50" src="../../static/images/wallet_0.png" mode=""></image>
						<view class="column m-l-10">
							<view class="f-w-600 c-CCC">{{item.address_name}}</view>
							<view class="f-w-600 f-13 ">{{item.address}}</view>
						</view>
					</view>
					<view class="f-10 c-CCC j-center f-center" style="background-color: #F8F8F8;width: 70upx;height: 40upx;" @tap.stop="delect(i)">删除</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="show" class="w-100 fixed">
			<image class="image relative z-1" src="../../static/images/pro_11.png" mode=""></image>
			<view class="absolute z-555 f-13 c-b f-center" style="top: 378upx;left: 0;right: 0;">暂无数据</view>
		</view>
		<!-- 新增地址 按钮 -->
		<view :class="show?'button_top':'button_bottom'" class="button fixed p-x-16 b-b" style="z-index: 888;height: 168upx;">
			<btn-self text="新增地址" class="w-100" :state="true" @btnClick="btnClick"></btn-self>
		</view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<!-- 弹出层 -->
		<view :class="mantleState?'bottom_true':''" class="flex popup fixed z-999 w-100 p-x-16 b-b transition" @touchmove.stop.prevent="moveHandle">
			<view class="flex column w-100 h-100 b-r-5 b-w popup_view b-b j-center">
				<view style="margin-bottom: 60upx;" class="m-b-40 f-w-600">你确定删除地址吗？</view>
				<view class="w-100 j-center f-center">
					<view @tap="popupEvent(1)">取消</view>
					<view class="j-center f-center b-009 c-w" style="width: 200upx;height: 100upx;border-radius: 50upx;margin-left: 156upx;" @tap="popupEvent(2)">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		onLoad() {
			try {
				let res = uni.getSystemInfoSync();
				this.scrollHeight = res.windowHeight - uni.upx2px(168);
			}catch (e) {
				// error
			};
		},
		onShow() {
			let value = uni.getStorageSync('addressList');//判断是否有账户地址列表存在
			if(value) {//存在
				this.show = false;
				this.addressList = value;
			};
		},
		data() {
			return {
				show: true,
				scrollHeight: 500,
				addressList: [],
				mantleState: false,
				tabClick: 0,
				address: {},
			}
		},
		methods: {
			btnClick() {
				uni.navigateTo({//新增地址
					url: '/pages/Profile/newAddress'
				})
			},
			delect(i) {
				this.mantleState = true;
				this.tabClick = i;
			},
			cancel() {//取消
				this.mantleState = false;
			},
			popupEvent(i) {
				if(i == 1) {
					this.mantleState = false;
				}else {
					this.mantleState = false;
					this.addressList.splice(this.tabClick,1);
					if(this.addressList.length == 0) {
						this.show = true;
						uni.removeStorage({
							key: 'addressList'
						});
					}else {
						uni.setStorage({//保存新增地址信息
							key: 'addressList',
							data: this.addressList
						});
					}
				}
			},
			selectAddress(i) {
				let value = uni.getStorageSync('outCoin');
				if(value) {
					this.address = value;
					this.address.address = this.addressList[i].address;
					uni.setStorage({//保存转出币填写的信息
						key: 'outCoin',
						data: this.address
					});
					uni.navigateBack({})
				}
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
		.popup {
			height: 360upx;
			bottom: -360upx;
			.popup_view {
				padding: 80upx 0 0;
			}
		}
		.bottom_true {
			bottom: 68upx;
		}
	}
</style>
