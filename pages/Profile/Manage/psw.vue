<template>
	<view class="container p-16 b-b">
		<!-- 输入原密码 -->
		<input-self title="输入原密码" text="oldpsw" :account_state="oldpsw_state"  :account="oldpsw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="oldpsw_password">
			<input slot="input" :password="oldpsw_password" class="flex_1 c-1F1" type="text" v-model="oldpsw" 
			placeholder="输入原密码" placeholder-class="f-15 c-CCC">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('oldpsw')" :src="'../../../static/images/'+ oldpsw_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<!-- 输入新密码 -->
		<input-self title="输入新密码" text="newpsw" :account_state="newpsw_state"  :account="newpsw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="newpsw_password">
			<input slot="input" :password="newpsw_password" class="flex_1 c-1F1" type="text" v-model="newpsw" 
			placeholder="输入新密码（8-20位数字与字母组合）" placeholder-class="f-15 c-CCC" maxlength="20">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('newpsw')" :src="'../../../static/images/'+ newpsw_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<!-- 确认新密码 -->
		<input-self title="确认新密码" text="sure" :state1="false" :red_text="red_state" :account_state="sure_state"  :account="sure" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="sure_password">
			<input slot="input" :password="sure_password" class="flex_1 c-1F1" type="text" v-model="sure" maxlength="20"
			placeholder="确认新密码" placeholder-class="f-15 c-CCC">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('sure')" :src="'../../../static/images/'+ sure_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<!-- 提示信息 -->
		<input-self title="密码提示" text="tips_psw" :account_state="tips_state" :account="tips_psw" @eventAccount="eventAccount" @delect="delect">
			<input slot="input" class="flex_1 c-1F1" type="text" v-model="tips_psw" 
			placeholder="密码提示信息（选填）" placeholder-class="f-15 c-CCC">
		</input-self>
		<view class="m-b-30"></view>
		<!-- 确认 按钮 -->
		<btn-self text="确认" :state="allSelect" @btnClick="btnClick"></btn-self>
		<view class="f-18 c-009 w-100 f-center" style="margin-top: 60upx;" @tap="enter">忘记密码</view>
	</view>
</template>

<script>
	import inputSelf from '@/components/inputSelf.vue'
	
	export default {
		onLoad() {
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			this.tabClick = index;;
			let value = uni.getStorageSync('accountList');//账户列表
			this.dataAccountList = value;
		},
		data() {
			return {
				dataAccountList: [],
				tabClick: 0,
				oldpsw: "",//密码
				oldpsw_state: false,
				oldpsw_password: true,
				oldpsw_eyes_name: "eyes_0",
				newpsw: "",
				newpsw_state: false,
				newpsw_password: true,
				newpsw_eyes_name: "eyes_0",
				sure: "",
				sure_state: false,
				sure_password: true,
				sure_eyes_name: "eyes_0",
				tips_psw: "",//密码提示
				tips_state: false,
				red_state: false
			}
		},
		components: {
			inputSelf
		},
		computed: {
			allSelect() {
				if (this.oldpsw && this.newpsw && this.sure) {
					return true
				}else {
					return false
				}
			}
		},
		methods: {
			delect(i) {//原密码
				if(i == 'oldpsw') {
					this.oldpsw = '';
				}else if (i == 'newpsw') {//新密码
					this.newpsw = '';
				}else if(i == 'sure') {//确认新密码
					this.sure = '';
					this.red_state = false;
				}else {//提示信息
					this.tips_psw = '';
				}
			},
			eventAccount(options) {//原密码
				if(options == 'oldpsw') {
					this.oldpsw_state = true;
					if(this.newpsw == '') this.newpsw_state = false; 
					if(this.sure == '') this.sure_state = false;
					if(this.tips_psw == '') this.tips_state = false; 
				}else if (options == 'newpsw') {//新密码
					this.newpsw_state = true;
					if(this.oldpsw == '') this.oldpsw_state = false;
					if(this.sure == '') this.sure_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else if(options == 'sure') {//确认新密码
					this.sure_state = true;
					if(this.oldpsw == '') this.oldpsw_state = false;
					if(this.newpsw == '') this.newpsw_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else {//提示信息
					this.tips_state = true;
					if(this.oldpsw == '') this.oldpsw_state = false; 
					if(this.newpsw == '') this.newpsw_state = false; 
					if(this.sure == '') this.sure_state = false; 
				};
				if(this.newpsw && this.sure) {//新密码 和 确认新密码 有值
					if(this.newpsw !== this.sure) {//新密码 和 确认新密码不一致
						this.red_state = true
					}else {
						this.red_state = false
					}
				}
			},
			hide_show(options) {
				if(options == 'oldpsw') {//原密码
					if(this.oldpsw_password) {
						this.oldpsw_eyes_name = "eyes_1"
					}else {
						this.oldpsw_eyes_name = "eyes_0"
					}
					this.oldpsw_password = !this.oldpsw_password;
				}else if(options == 'newpsw') {//新密码
					if(this.newpsw_password) {
						this.newpsw_eyes_name = "eyes_1"
					}else {
						this.newpsw_eyes_name = "eyes_0"
					}
					this.newpsw_password = !this.newpsw_password;
				}else {
					if(this.sure_password) {
						this.sure_eyes_name = "eyes_1"
					}else {
						this.sure_eyes_name = "eyes_0"
					}
					this.sure_password = !this.sure_password
				}
			},
			enter() {//忘记密码
				uni.navigateTo({
					url: '/pages/Profile/Manage/forgetPsw'
				})
			},
			btnClick() {
				if(!this.allSelect) {
					uni.showToast({
						title: '请把信息填写完整',
						icon: 'none',
						mask: true
					});
					return;
				};
				if(this.oldpsw !== this.dataAccountList[this.tabClick].psw) {
					uni.showToast({
						title: this.dataAccountList[this.tabClick].tips_psw || "原密码错误",
						icon: 'none',
						mask: true
					})
					return
				};
				if(this.newpsw.length < 8) {
					uni.showToast({
						title: '新密码位数不能小于8',
						icon: 'none',
						mask: true
					});
					return;
				}
				let zg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/;
				if(!zg.test(this.newpsw)) {
						uni.showToast({
							icon: 'none',
							title: "密码为8-20位数字与字母组合"
						});
						return
				};
				
				if(this.newpsw && this.sure) {//新密码 和 确认新密码 有值
					if(this.newpsw !== this.sure) {//新密码 和 确认新密码不一致
						this.red_state = true;
					}else {
						this.red_state = false;
						this.dataAccountList[this.tabClick].psw = this.newpsw;
						this.dataAccountList[this.tabClick].tips_psw = this.tips_psw;
						uni.setStorage({//保存账号信息
							key: 'accountList',
							data: this.dataAccountList
						});
						uni.showToast({
							title: '修改完成',
							icon: 'none',
							mask: true
						})
						setTimeout(()=> {
							uni.navigateBack({})
						},1200)
					}
				}
			}
		}
	}
</script>

<style>
	view {
		display: flex;
	}
</style>
