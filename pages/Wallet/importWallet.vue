<template>
	<view class="container b-b">
		<!-- 顶部导航 -->
		<view class="top_nav j-center w-100 f-center f-18 f-w-600 m-b-20">
			<view v-for="(item,i) in dataList" :key="i" >
				<view class="absolute z-1 b-r-50 b-009" style="width: 34upx;height: 34upx;"></view>
				<view  class="relative z-999 c-1F1" style="margin: 6upx 0 0 10upx;">{{item}}</view>
			</view>
		</view>
		<!-- 输入框 -->
		<textarea class="textarea b-F9F w-100 b-r-5 b-b f-15 m-b-50" v-model="textarea" :placeholder="placeList[tabClick]" placeholder-class="c-15 c-CCC"/>
		<!-- 钱包密码 -->
		<input-self title="钱包密码" text="psw" :account_state="psw_state"  :account="psw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="psw_password">
			<input slot="input" :password="psw_password" class="flex_1 c-1F1" type="text" v-model="psw" 
			placeholder="钱包密码(8-20位数字与字母组合)" placeholder-class="f-15 c-CCC">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('psw')" :src="'../../static/images/'+ psw_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<!-- 重复钱包密码 -->
		<input-self title="重复钱包密码" text="rep_psw" :account_state="rep_psw_state"  :account="rep_psw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="psw_password">
			<input slot="input" :password="rep_password" class="flex_1 c-1F1" type="text" v-model="rep_psw" 
			placeholder="重复钱包密码" placeholder-class="f-15 c-CCC">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('rep_psw')" :src="'../../static/images/'+ rep_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<!-- 钱包名称 -->
		<!-- <input-self title="钱包名称" text="account" :account_state="account_state" :account="account" @eventAccount="eventAccount" @delect="delect">
			<input slot="input" class="flex_1 c-1F1" type="text" v-model="account" 
			placeholder="钱包名称（选填）" placeholder-class="f-15 c-CCC">
		</input-self> -->
		<!-- 密码提示 -->
		<input-self title="密码提示" text="tips_psw" :account_state="tips_state" :account="tips_psw" @eventAccount="eventAccount" @delect="delect">
			<input slot="input" class="flex_1 c-1F1" type="text" v-model="tips_psw" 
			placeholder="密码提示信息（选填）" placeholder-class="f-15 c-CCC">
		</input-self>
		<view style="height: 80upx;"></view>
		<!-- 开始导入 按钮 -->
		<btn-self text="开始导入" :state="allSelect" @btnClick="btnClick"></btn-self>
		<!-- 服务及隐私条款 -->
		<view class="f-13 c-CCC f-center w-100" style="margin-top: 100upx;" @tap="enterRc">进入即代表阅读并同意<view class="c-009">《服务及隐私条款》</view></view>
		</scroll-view>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<view :class="mantleState?'bottom_true':''" class="popup p-x-16 b-b fixed z-999 w-100 transition" @touchmove.stop.prevent="moveHandle">
			<view class="h-100 b-w w-100 b-b view column">
				<view class="column" style="height: 100upx;margin-top: -100upx;">
					<view class="j-center f-between">
						<view class="c-b f-w-600">选择钱包</view>
					</view>
					<view style="height: 60upx;"></view>
				</view>
				<scroll-view class="h-100 column" scroll-y="true" >
					<view class="f-between j-center b-b b-r-5 b-009 scroll_item" v-for="(item,i) in dataMsg" :key="i" @tap="selectWallet(i)">
						<view class="column c-w">
							<view class="m-b-8">{{item}}</view>
						</view>
						<image v-if="i == tabClicks" class="image_15" src="../../static/images/wallet_7.png" mode=""></image>
						<view v-else class="image_15 b-w b-r-50"></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import inputSelf from '@/components/inputSelf.vue'
	import { url } from '@/common/js/api.js'
	import { PrivateKey } from 'eosjs-ecc'
	import { JsonRpc,EosApi,Eos  } from 'eosjs'
	
	export default {
		data() {
			return {
				tt: "",
				dataList: ['私钥导入'],
				tabClick: 1,
				placeList: ['按顺序输入助记词,助记词之间请用一个空格分开。','请输入64位私钥'],
				psw: "",//密码
				psw_state: false,
				psw_password: true,
				psw_eyes_name: "eyes_0",
				rep_psw: "",//重复密码
				rep_psw_state: false,
				rep_password: true,
				rep_eyes_name: "eyes_0",
				account: "",//账户
				account_state: false,
				tips_psw: "",//密码提示
				tips_state: false,
				textarea: "",//私钥
				publicKey: "",//公钥
				mantleState: false,
				dataMsg: [],
				tabClicks: 999,
				accountList: [],
			}
		},
		computed: {
			allSelect() {
				if (this.psw && this.rep_psw && this.textarea) {
					return true
				}else {
					return false
				}
			}
		},
		components: {
			inputSelf
		},
		methods: {
			JsonRpc2 : function(method,params){
				return new Promise((success,error)=>{
					uni.request({
						method: "POST",
						url: url+"/v1/history/"+method, //仅为示例，并非真实接口地址。
						data:JSON.stringify(params) ,
						dataType:"json",
						success: (res) => {
								 success(res.data);
							},
							error:(err) => {
								 error(err.data);
							}
					})
				})
			},
			delect(i) {//账户事件
				if(i == 'account') {
					this.account = '';
				}else if(i == 'psw') {//钱包密码事件
					this.psw = '';
				}else if(i == 'rep_psw') {//重复钱包密码
					this.rep_psw = '';
				}else {
					this.tips_psw = '';
				}
			},
			moveHandle() {
				
			},
			eventAccount(options) {//账户事件
				if(options == 'account') {
					this.account_state = true;
					if(this.psw == '') this.psw_state = false; 
					if(this.rep_psw == '') this.rep_psw_state = false;
					if(this.tips_psw == '') this.tips_state = false; 
				}else if(options == 'psw') {//钱包密码事件
					this.psw_state = true;
					if(this.account == '') this.account_state = false;
					if(this.rep_psw == '') this.rep_psw_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else if(options == 'rep_psw') {//重复钱包密码
					this.rep_psw_state = true;
					if(this.account == '') this.account_state = false;
					if(this.psw == '') this.psw_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else {
					this.tips_state = true;
					if(this.account == '') this.account_state = false; 
					if(this.psw == '') this.psw_state = false; 
					if(this.rep_psw == '') this.rep_psw_state = false; 
				}
			},
			hide_show(options) {//显示隐藏
				if(options == 'psw') {
					if(this.psw_password) {
						this.psw_eyes_name = "eyes_1"
					}else {
						this.psw_eyes_name = "eyes_0"
					}
					this.psw_password = !this.psw_password;
				}else {
					if(this.rep_password) {
						this.rep_eyes_name = "eyes_1"
					}else {
						this.rep_eyes_name = "eyes_0"
					}
					this.rep_password = !this.rep_password;
				}
			},
			cancel() {// 蒙层取消
				this.mantleState = false;
			},
			selectWallet(i) {//钱包选择
				this.tabClicks = i;
				this.getMyCoin(this.dataMsg[i])
			},
			async getMyCoin(options) {//账户信息
				let res = await this.$myRequest({
					url: 'getAccount',
					method: "GET",
					data: {
						account: options
					}
				});
				if(res.data.StatusCode == 200) {
					let value = uni.getStorageSync('accountList');//账户列表
					if(value) {//存在
						this.accountList = value;
						let index = value.findIndex(x=> {
							return x.account == options
						});
						if(index == -1) {//不存在
							let obj = {};
							obj.account = res.data.Data.account_name;
							obj.psw = this.psw;
							obj.privateKey = this.textarea.trim();
							obj.publicKey = this.publicKey;
							obj.tips_psw = this.tips_psw;
							obj.name = this.account;
							obj.isPreserve = false;
							this.accountList.push(obj)
						}else {//存在
							this.accountList[index].account = res.data.Data.account_name;
							this.accountList[index].privateKey = this.textarea.trim();
							this.accountList[index].publicKey = this.publicKey;
							this.accountList[index].psw = this.psw;
							this.accountList[index].tips_psw = this.tips_psw;
							this.accountList[index].name = this.account;
						};
						uni.setStorage({//保存账号信息
							key: 'accountList',
							data: this.accountList
						});
						uni.setStorage({//保存账号下标信息
							key: 'accountIndex',
							data: 0
						});
					}else {//不存在
						let obj = {};
						obj.account = res.data.Data.account_name;
						obj.psw = this.psw;
						obj.privateKey = this.textarea.trim();
						obj.publicKey = this.publicKey;
						obj.tips_psw = this.tips_psw;
						obj.name = this.account;
						obj.isPreserve = false;
						this.accountList.push(obj);
						uni.setStorage({//保存账号信息
							key: 'accountList',
							data: this.accountList
						});
						uni.setStorage({//保存账号下标信息
							key: 'accountIndex',
							data: 0
						});
					};
					uni.showToast({
						icon: 'none',
						title: "导入成功",
						mask: true
					});
					setTimeout(()=> {
						uni.reLaunch({
							url: '/pages/Wallet/wallet'
						})
					},1000)
				}
			},
			btnClick() {
				if(this.allSelect) {
					if(!this.textarea.trim()) {
						uni.showToast({
							icon: 'none',
							title: "私钥不能为空"
						});
						return;
					};
					if(this.psw.length < 8) {
						uni.showToast({
							icon: 'none',
							title: "密码字符不能少于8位"
						});
						return
					}
					let zg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/; 
					if(!zg.test(this.psw)) {
							uni.showToast({
								icon: 'none',
								title: "密码为8-20位数字与字母组合"
							});
							return
					};
					if(this.psw !== this.rep_psw) {
						uni.showToast({
							icon: 'none',
							title: "两次密码输入不一致"
						});
						return
					};
					this.publicKey = PrivateKey.fromString(this.textarea.trim()).toPublic().toString();
					this.funs();
				}
			},
			funs:async function() {
				let data=await this.JsonRpc2("get_key_accounts",{
					public_key:this.publicKey
				});
				this.mantleState = true;
				this.dataMsg = data.account_names;
				// this.getMyCoin(data.account_names);
			},
			enterRc() {
				uni.navigateTo({
					url: '/pages/Profile/rivacy'
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
		padding: 32upx 32upx 68upx;
		.top_nav :nth-child(2) {
			margin-left: 40upx;
		}
		.textarea {
			height: 200upx;
			padding: 30upx 20upx;
		}
		.bottom_fixed {
			bottom: 68upx;
		}
		.popup {
			left: 0;
			right: 0;
			height: 50vh;
			bottom: -50vh;
			.view {
				border-radius: 10upx 10upx 0 0;
				padding: 140upx 40upx 40upx;
				.scroll_item {
					padding: 20upx 30upx;
					margin-bottom: 30upx;
				}
			}
		}
		.bottom_true {
			bottom: 68upx;
		}
	}
</style>
