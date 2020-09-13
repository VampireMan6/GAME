<template>
	<view class="container p-16 b-b">
		<view class="f-between j-center" style="margin-bottom: 50upx;" v-for="(item,i) in dataList" :key="i" @tap="enter(i)">
			<view class="j-center">
				<image class="image_30" :src="'../../../static/images/pro_'+ (i+8) +'.png'" mode=""></image>
				<view class="c-b m-l-10">{{item}}</view>
			</view>
			<view class="j-center">
				<view v-if="i == 0" class="c-b">{{account_name}}</view>
				<image v-if="i == 1 || i == 2" style="width: 24upx;height: 24upx;" class="m-l-5" src="../../../static/images/pro_7.png" mode=""></image>
			</view>
		</view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<view :class="mantleState?'bottom_true':''" class="data_select w-100 fixed p-x-16 b-b z-999 transition">
			<view class="column j-center b-w w-100 b-r-5 b-b" style="padding: 40upx;">
				<view style="margin-bottom: 70upx;" class="m-b-40 f-w-600">{{text1}}</view>
				<view class="j-center w-100 m-b-8">
					<input type="text" :password="psw_password" class="flex_1" v-model="psw" placeholder="请输入您的密码" placeholder-class="f-15 c-CCC">
					<view class="j-center"v-if="psw">
						<image class="image_delect" style="" @tap="delect" src="../../../static/images/delect_0.png" mode=""></image>
						<view class="border m-l-10"></view>
						<image class="eyes_image eyes_image m-l-10" @tap="hide_show" :src="'../../../static/images/'+ psw_eyes_name +'.png'"></image>
					</view>
				</view>
				<view class="border_1_CCC m-b-8" :class="psw?'b-009':'b-CCC'"></view>
				<view style="height: 90upx;" class="w-100">
					<view class="c-DE1 f-10" v-if="psw_sure">{{tips_psw}}</view>
				</view>
				<view class="w-100 j-center f-center">
					<view class="c-009 f-18" @tap="cancel1">取消</view>
					<view v-if="copy" class="j-center f-center b-009 c-w f-18" :class="psw?'b-009':'b-7FC'" 
					style="width: 200upx;height: 100upx;border-radius: 50upx;margin-left: 156upx;" @tap="sure(1)">确定</view>
					<view v-else class="j-center f-center b-009 c-w f-18 b-009"
						style="width: 200upx;height: 100upx;border-radius: 50upx;margin-left: 156upx;" @tap="sure(2)">复制</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			if(index) {
				this.tabClick = index;
			};
			let value = uni.getStorageSync('accountList');//账户列表
			this.dataAccountList = value;
			this.account_name = value[this.tabClick].account;
			this.tips_psw = value[this.tabClick].tips_psw;
			uni.setNavigationBarTitle({
				title: this.account_name
			})
		},
		data() {
			return {
				dataList: ['钱包名称','修改密码','导出私钥'],
				tabClick: 0,
				dataAccountList: [],
				account_name: "",
				mantleState: false,
				psw_eyes_name: "eyes_0",
				psw_password: true,
				psw: "",
				psw_sure: false,
				text1: "请输入密码",
				text2: "确定",
				copy: true,
				tips_psw: "",//密码错误提示
			}
		},
		methods: {
			enter(i) {
				if(i == 1) {//进入修改密码
					uni.navigateTo({
						url: '/pages/Profile/Manage/psw'
					})
				}else if( i == 2) {
					this.mantleState = true;
				}
			},
			cancel() {//弹出层取消
				this.mantleState = false;
			},
			hide_show() {//显示隐藏
				if(this.psw_password) {
					this.psw_eyes_name = "eyes_1";
				}else {
					this.psw_eyes_name = "eyes_0";
				}
				this.psw_password = !this.psw_password;
			},
			sure(i) {
				if(i == 1) {
					if(this.psw == this.dataAccountList[this.tabClick].psw) {
						this.psw_sure = false;
						this.text1 = "导出成功";
						this.psw = this.dataAccountList[this.tabClick].privateKey;
						this.copy = false;
						this.psw_password = false;
						this.dataAccountList[this.tabClick].isPreserve = true;
						uni.setStorage({//保存账号信息
							key: 'accountList',
							data: this.dataAccountList
						});
					}else {
						this.tips_psw = this.tips_psw || "密码错误"
						this.psw_sure = true;
					}
				}else {
					uni.setClipboardData({
						data: this.psw,
						success:()=> {
							uni.showToast({
								title: '复制成功',
								icon: 'none',
								duration: 1000,
								mask: 'true'
							});
							this.mantleState = false;
							this.copy = true;
							this.psw = "";
							this.text1 = "请输入密码";
						}
					});
				}
			},
			cancel1() {
				this.psw = "";
				this.psw_sure = false;
				this.mantleState = false;
				this.copy = true;
			},
			delect() {
				this.psw = "";
				this.psw_sure = false;
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.data_select {
			bottom: -416upx;
			left: 0;
			right: 0;
			height: 416upx;
			.delect {
				width: 50upx;
				height: 60upx;
				.image {
					width: 20upx;
					height: 20upx;
				}
			}
			.image_left {
				width: 50upx;
				height: 50upx;
			}
		}
		.bottom_true {
			bottom: 46upx;
		}
	}
</style>
