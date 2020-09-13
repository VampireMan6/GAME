<template>
	<view class="container b-b f-15 c-CCC">
		<view class="column fixed w-100 b-b">
			<!-- 顶部状态栏 -->
			<view :style="{ height: statusBarH + 'px' }"></view>
			<view class="w-100 f-between j-center b-w b-b" style="margin: 18upx 0 20upx 0;height: 88upx;padding-right: 32upx;">
				<i v-if="show" class="uni-btn-icon c-1F1" style="font-size: 27px;" @tap="back"></i>
				<view v-else tyle="width: 36upx;height: 36upx;"></view>
				<view class="f-16 c-1F1" style="font-weight: 700;">创建钱包</view>
				<view tyle="width: 36upx;height: 36upx;"></view>
			</view>
		</view>
		<scroll-view scroll-y="true" :style="{ height: scrolleight + 'px',marginTop: content_top + 'px'}">
			<view class="column p-16 b-b" style="">
				<!-- 顶部文字提示 -->
				<view class="contain f-13 column b-b b-r-5 c-009 f-w-600 b-E0F">
					<view class="m-b-10">· 密码用于保护私钥和交易授权，强度非常重要</view>
					<view>· GAME不存储密码，也无法帮您找回，请务必牢记</view>
				</view>
				<!-- 账户名 -->
				<input-self title="账户名" :red_text="red_state" :state1="true" text="account" :account_state="account_state" :account="account" @eventAccount="eventAccount" @delect="delect">
					<input slot="input" class="flex_1 c-1F1" type="text" v-model="account" @input="input_text"
					placeholder="账户名(账户号必须g开头,a-z,1-5的12位账户名)" maxlength="12" placeholder-class="f-15 c-CCC">
				</input-self>
				<!-- 钱包密码 -->
				<input-self title="钱包密码" text="psw" :account_state="psw_state"  :account="psw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="psw_password">
					<input slot="input" :password="psw_password" class="flex_1 c-1F1" type="text" v-model="psw" 
					placeholder="钱包密码(8-20位数字与字母组合)" placeholder-class="f-15 c-CCC">
					<view slot="pass" class="j-center">
						<view class="border m-l-10"></view>
						<image class="eyes_image m-l-10" @tap="hide_show('psw')" :src="'../../static/images/'+ psw_eyes_name +'.png'"></image>
					</view>
				</input-self>
				<!-- 重复钱包密码 -->
				<input-self title="重复钱包密码" text="rep_psw" :account_state="rep_psw_state"  :account="rep_psw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="psw_password">
					<input slot="input" :password="rep_password" class="flex_1 c-1F1" type="text" v-model="rep_psw" 
					placeholder="重复钱包密码" placeholder-class="f-15 c-CCC">
					<view slot="pass" class="j-center">
						<view class="border m-l-10"></view>
						<image class="eyes_image m-l-10" @tap="hide_show('rep_psw')" :src="'../../static/images/'+ rep_eyes_name +'.png'"></image>
					</view>
				</input-self>
				<!-- 密码提示 -->
				<input-self title="密码提示" text="tips_psw" :account_state="tips_state" :account="tips_psw" @eventAccount="eventAccount" @delect="delect">
					<input slot="input" class="flex_1 c-1F1" type="text" v-model="tips_psw" 
					placeholder="密码提示信息（选填）" placeholder-class="f-15 c-CCC">
				</input-self>
				<view style="height: 80upx;"></view>
				<!-- 创建钱包按钮 -->
				<btn-self text="创建钱包" :state="allSelect" @btnClick="btnClick"></btn-self>
				<!-- 导入钱包 -->
				<view class="f-18 c-009 f-w-600 f-center" style="margin-top: 54upx;" @tap="enterWallet">导入钱包</view>
				<!-- 服务及隐私条款 -->
				<view class="f-13 c-CCC f-center w-100" style="margin-top: 174upx;" @tap="enterRc">进入即代表阅读并同意<view class="c-009">《服务及隐私条款》</view></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import inputSelf from '@/components/inputSelf.vue'
	import { PrivateKey, PublicKey, Signature, Aes, key_utils, config }  from 'eosjs-ecc';
	
	export default {
		onLoad(options) {
			try {
				let res = uni.getSystemInfoSync();
				this.statusBarH = res.statusBarHeight;
				this.scrolleight = res.windowHeight - this.statusBarH - uni.upx2px(88);
				this.content_top = this.statusBarH + uni.upx2px(88);
			} catch (e) {
				// error
			};
			if(options.state == 1) {
				this.show = false
			};
			function randomString(length) {
			  var str = 'abcdefghighlmnopqrstuvwsyz12345';
			  var result = '';
			  for (var i = length; i > 0; --i) 
			    result += str[Math.floor(Math.random() * str.length)];
			  return result;
			};
			this.account = 'g' + randomString(11);
			
			//创建随机私钥
			// let privateWif;
			// PrivateKey.randomKey().then(privateKey => privateWif = privateKey.toWif()).then( res=> {
			// 	this.str = res;
			// });
			let value = uni.getStorageSync('accountList');//判断是否有账户列表存在
			if(value) {//存在
				this.accountList = value;
			};
			this.getMyCoin();
		},
		data() {
			return {
				statusBarH: 0,
				scrolleight: 500,
				content_top: 44,
				show: true,
				accountList: [],
				privateKey:"",
				publicKey:"",
				account: "",//账户
				account_state: false,
				psw: "",//密码
				psw_state: false,
				rep_psw: "",//重复密码
				rep_psw_state: false,
				tips_psw: "",//密码提示
				tips_state: false,
				psw_password: true,
				psw_eyes_name: "eyes_0",
				rep_password: true,
				rep_eyes_name: "eyes_0",
				red_state: false,
				button_state: false,
			}
		},
		computed: {
			allSelect() {
				if (this.account && this.psw && this.rep_psw) {
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
			async getMyCoin() {
				let res = await this.$myRequest({
					url: 'generateNOSKey',
					method: "GET"
				});
				if(res.data.StatusCode == 200) {
					this.privateKey = res.data.Data.privateKey;
					this.publicKey = res.data.Data.publicKey;
				}
			},
			input_text(e) {
				if(e.detail.value.trim().length == 0) {
					this.red_state = false;
				};
				if(e.detail.value[0] !== "g") {
					this.red_state = true;
				}else {
					this.red_state = false;
				}
			},
			delect(i) {//账户事件
				if(i == 'account') {
					this.account = '';
					this.red_state = false;
				}else if (i == 'psw') {//钱包密码事件
					this.psw = '';
				}else if(i == 'rep_psw') {//重复钱包密码
					this.rep_psw = '';
				}else {
					this.tips_psw = '';
				}
			},
			eventAccount(options) {//账户事件
				if(options == 'account') {
					this.account_state = true;
					if(this.psw == '') this.psw_state = false; 
					if(this.rep_psw == '') this.rep_psw_state = false;
					if(this.tips_psw == '') this.tips_state = false; 
				}else if (options == 'psw') {//钱包密码事件
					this.psw_state = true;
					if(this.account == '') {
						this.account_state = false;
						this.red_state = false;
					};
					if(this.rep_psw == '') this.rep_psw_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else if(options == 'rep_psw') {//重复钱包密码
					this.rep_psw_state = true;
					if(this.account == '') {
						this.account_state = false;
						this.red_state = false;
					};
					if(this.psw == '') this.psw_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else {
					this.tips_state = true;
					if(this.account == '') {
						this.account_state = false;
						this.red_state = false;
					};
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
			btnClick() {//进入 创建钱包
				if(this.allSelect) {
					if(!(/^[a-z1-5]{12}$/.test(this.account)) || this.account[0] !== 'g') {
						uni.showToast({
							title: "账户名格式错误",
							icon: 'none'
						});
						return
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
								title: "8-20位数字与字母组合"
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
					uni.showToast({
						icon: 'none',
						title: "创建中...",
						mask: true
					});
					if(!this.button_state) {
						this.button_state = true;
						setTimeout(()=> {
							this.getAccount();
						},1000)
					}
				}
			},
			async getAccount() {//创建账户
				let res = await this.$myRequest({
					url: 'createAccount',
					data: {
						account: this.account,
						nosPrivateKey: this.privateKey
					}
				});
				if(res.data.StatusCode == 400) {
					this.button_state = false;
					let str = JSON.parse(res.data.RawMessage).error.what;
					if(str == 'Account name already exists') {
						uni.showToast({
							title: '账号名已经存在',
							icon: 'none',
							duration: 1000
						})
					}else {
						uni.showToast({
							title: '创建账号失败',
							icon: 'none',
							duration: 1000
						})
					}
				}else if(res.data.StatusCode == 200) {
					this.button_state = false;
					uni.showToast({
						title: '创建账号成功',
						icon: 'none',
						duration: 1000
					});
					let value = uni.getStorageSync('accountList');//账户列表
					if(value) {
						this.accountList = value;
					}
					let transaction_id = "";
					transaction_id = res.data.Data.action.transaction_id;
					let obj = {};
					obj.account = this.account;
					obj.psw = this.psw;
					obj.privateKey = this.privateKey;
					obj.publicKey = this.publicKey;
					obj.transaction_id = transaction_id;
					obj.tips_psw = this.tips_psw;
					obj.name = "";
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
					setTimeout(()=> {
						uni.switchTab({
							url: '/pages/Wallet/wallet'
						})
					},1000)
				}
			},
			enterWallet() {//导入钱包
				uni.navigateTo({
					url: '/pages/Wallet/importWallet'
				})
			},
			back() {
				uni.navigateBack({})
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
		.contain {
			padding: 44upx 48upx;
			border: 2upx solid #7CC6C6;
			margin-bottom: 64upx;
		}
	}
</style>
