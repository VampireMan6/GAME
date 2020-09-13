<template>
	<view class="container">
		<scroll-view scroll-y="true" class="b-b" style="padding: 0 0;" :style="{ height: scrolleight + 'px' }">
			<view class="p-x-16 b-b">应用名称：{{appName}}</view>
			<view class="column p-16 b-b">
				<!-- 币种选择 -->
				<coin-select :select_text="select_text" :mantleState="mantleState" @select="selectCoin"></coin-select>
				<!-- 输入的金额 -->
				<view class="f-w-600" style="margin: 80upx 0 30upx;">{{select_text}}</view>
				<view class="j-center">
					<input class="w-100 flex_1" disabled="true" placeholder="输入的金额数量小数点保留4位" v-model="money" type="number" placeholder-class="c-15 c-CCC">
					<!-- <view class="j-center">
						<image class="image_15" src="../../../static/images/delect_0.png" mode="" @tap="delect('money')"></image>
					</view> -->
				</view>
				<view class="border_1_CCC" style="margin: 10upx 0;" :class="state_money?'b-009':'b-CCC'"></view>
				<view class="c-CCC f-13 m-b-30">余额：{{number}} {{select_text}}</view>
				<!-- 收款地址 -->
				<view class="f-w-600 j-center" style="margin-bottom: 30upx;">
					<view>收款地址</view>
					<!-- <image class="image_15 m-l-10" src="../../../static/images/wallet_17.png" mode="" @tap="selectAddress"></image> -->
				</view>
				<view class="j-center">
					<input class="w-100 flex_1" disabled="true" placeholder="请输入收款地址" v-model="address" maxlength="12" placeholder-class="c-15 c-CCC" type="text">
					<!-- <image v-if="state_address" class="image_15" src="../../../static/images/delect_0.png" mode="" @tap="delect('address')"></image> -->
				</view>
				<view class="border_1_CCC" style="margin: 10upx 0 60upx;" :class="state_address?'b-009':'b-CCC'"></view>
				<!-- 备注 -->
				<view class="f-w-600" style="margin-bottom: 30upx;">备注</view>
				<view class="j-center">
					<input class="w-100 flex_1" placeholder="选填" disabled="true" v-model="remarks" placeholder-class="c-15 c-CCC" type="text">
					<!-- <image v-if="state_remarks" class="image_15" src="../../../static/images/delect_0.png" mode="" @tap="delect('remarks')"></image> -->
				</view>
				<view class="border_1_CCC" style="margin: 10upx 0 60upx;" :class="state_remarks?'b-009':'b-CCC'"></view>
				 <!-- 下一步 按钮 -->
				 <btn-self class="w-100" text="确定" :state="state" @btnClick="btnClick"></btn-self>
			</view>
			 <!-- 蒙层 -->
			 <mantle v-if="mantleState" @cancel="cancel"></mantle>
			 <!-- 弹出层 -->
			 <coin-list-popup :dataList="dataList" :mantleState="selectCoinState" @cancel="cancel" :tabClick="tabClick" @select="select"></coin-list-popup>
		</scroll-view>
		<view :class="pswState?'bottom_true':''" class="data_select w-100 fixed p-x-16 b-b z-999 transition">
			<view class="column j-center b-w w-100 b-r-5 b-b" style="padding: 40upx;">
				<view style="margin-bottom: 70upx;" class="m-b-40 f-w-600">请输入密码</view>
				<view class="j-center w-100 m-b-8">
					<input type="text" :password="psw_password" class="flex_1" v-model="psw" placeholder="请输入您的密码" placeholder-class="f-15 c-CCC">
					<view class="j-center"v-if="psw">
						<image class="image_delect" style="" @tap="delect1" src="../../../static/images/delect_0.png" mode=""></image>
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
					<view class="j-center f-center b-009 c-w f-18" :class="psw?'b-009':'b-7FC'" 
					style="width: 200upx;height: 100upx;border-radius: 50upx;margin-left: 156upx;" @tap="sure">确定</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import coinSelect from '@/components/coinSelect.vue'
	import coinListPopup from '@/components/coinListPopup.vue'

	export default {
		onLoad(json) {
			let data = JSON.parse(json.data);
			this.appName = data.name;
			this.address = data.to;
			this.money = data.money;
			this.remarks = data.memo;
			try {
			    let res = uni.getSystemInfoSync();
					this.scrolleight = res.windowHeight;
			}catch (e) {
			    // error
			};
			let coinList = uni.getStorageSync('coinDataList');//账户下币的列表
			this.dataList = coinList;
			this.select_text = this.dataList[this.tabClick].name;
			this.number = this.dataList[this.tabClick].number;
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			let value = uni.getStorageSync('accountList');//账户列表
			this.accountPsw = value[index].psw;
			this.tips_psw = value[index].tips_psw;
			this.account_name = value[index].account;
			this.privateKey = value[index].privateKey;
		},
		data() {
			return {
				scrolleight: 500,
				select_text: "请选择币种",
				mantleState: false,
				money: "",
				address: "",
				remarks: "",
				state: true,
				dataList: [],
				tabClick: 0,
				number: 0,
				account_name: "",
				privateKey: "",
				open: false,
				coinName:"币种",
				selectCoinState: false,
				psw: "",
				pswState: false,
				psw_eyes_name: "eyes_0",
				psw_password: true,
				psw_sure: false,
				accountPsw: "",
				index:0,
				button_state: false,
				tips_psw: "",
				appName: "",
			}
		},
		components: {
			coinSelect,
			coinListPopup
		},
		computed: {
			state_money() {
				if (this.money) {
					return true;
				} else {
					return false;
				}
			},
			state_address() {
				if (this.address) {
					return true;
				} else {
					return false;
				}
			},
			state_remarks() {
				if (this.remarks) {
					return true;
				} else {
					return false;
				}
			}
		},
		methods: {
			// delect(options) {
			// 	if (options == 'money') {
			// 		this.money = "";
			// 	} else if (options == "address") {
			// 		this.address = "";
			// 	} else {
			// 		this.remarks = "";
			// 	}
			// },
			hide_show() {//显示隐藏
				if(this.psw_password) {
					this.psw_eyes_name = "eyes_1";
				}else {
					this.psw_eyes_name = "eyes_0";
				}
				this.psw_password = !this.psw_password;
			},
			delect1() {
				this.psw = "";
				this.psw_sure = false;
			},
			selectCoin() {//币种选择
				this.mantleState = true;
				this.selectCoinState = true;
			},
			cancel() {
				this.mantleState = false;
				this.selectCoinState = false;
				this.pswState = false;
			},
			cancel1() {
				this.psw = "";
				this.psw_sure = false;
				this.mantleState = false;
				this.pswState = false;
			},
			select(i) {
				this.tabClick = i;
				this.select_text = this.dataList[i].name;
				this.coinName = this.dataList[i].name;
				this.number = this.dataList[i].number;
				this.cancel();
			},
			btnClick() {//下一步
				if(this.select_text == "请选择币种") {
					uni.showToast({
						title: "请选择转出的币种",
						icon: 'none'
					});
					return
				};
				if(this.money == 0 || this.money.length == 0) {
					uni.showToast({
						title: "转账数量不能为空或为0",
						icon: 'none'
					});
					return
				};
				if((this.money).toString().split('.').length !== 1 && (this.money).toString().split('.')[1].length >= 5) {
					uni.showToast({
						title: "转出币种数量小数位不能大于4",
						icon: 'none'
					});
					return
				};
				if(parseFloat(this.money) > parseFloat(this.number)) {
					uni.showToast({
						title: "转出币种数量不能大于余额",
						icon: 'none'
					});
					return
				};
				// if(!(/^[a-z1-5]{12}$/.test(this.address)) || this.address[0] !== 'g') {
				// 	uni.showToast({
				// 		title: "收款地址格式不正确",
				// 		icon: 'none'
				// 	});
				// 	return
				// };
				if(this.address == this.account_name) {
					uni.showToast({
						title: "收付款地址一致，请更换地址",
						icon: 'none'
					});
					return
				};
				this.mantleState = true;
				this.pswState = true;
			},
			sure() {
				if(this.psw == this.accountPsw) {
					this.pswState = false;
					this.mantleState = false;
					this.psw = "";
					if(!this.button_state) {
						this.button_state = true;
						this.out();
					}
				}else {
					this.tips_psw = this.tips_psw || "密码错误";
					this.psw_sure = true;
				}
			},
			async out() {//转账
				let remarks = "";
				if(this.remarks == "") {
					remarks = "无"
				}else {
					remarks = this.remarks;
				};
				let res = await this.$myRequest({
					url: 'transfer',
					data: {
						from: this.account_name,
						to: this.address,
						quantity: this.money*10000,
						memo: remarks,
						tokenType: this.select_text,
						walletPrivateKey: this.privateKey
					}
				});
				if(res.data.StatusCode == 200) {
					this.button_state = false;
					uni.showToast({
						title: '转账成功',
						icon: 'none',
						duration: 1000,
						mask: true
					});
					this.dataList[this.tabClick].number = parseFloat(this.dataList[this.tabClick].number) - this.money;
					uni.setStorage({//保存账号下币的列表
						key: 'coinDataList',
						data: this.dataList
					});
					setTimeout(()=> {
						uni.navigateBack()
					},1000)
				}else {
					this.button_state = false;
					if(res.data.RawMessage.indexOf('to account does not exist') !== -1) {
						uni.showToast({
							title: '转账地址不存在',
							icon: 'none',
							duration: 1000,
							mask: true
						})
					}else if(res.data.RawMessage.indexOf('must transfer positive quantity') !== -1) {
						uni.showToast({
							title: '请输入正确的格式，只能保留小数点后四位小数',
							icon: 'none',
							duration: 1000,
							mask: true
						})
					}else {
						uni.showToast({
							title: '转账失败',
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				};
			},
			// allCoin() {//全部币数量
			// 	this.money = this.number;
			// },
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
