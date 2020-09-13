<template>
	<view class="container p-16 b-b">
		<!-- 私钥 -->
		<textarea style="height: 200upx;padding: 30upx 20upx;" v-model="value_text" class="w-100 b-F9F b-b m-b-30" placeholder="请输入64位私钥" placeholder-class="f-15 c-CCC" />
		<!-- 输入新密码 -->
		<input-self title="输入新密码" text="newpsw" :account_state="newpsw_state"  :account="newpsw" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="newpsw_password">
			<input slot="input" :password="newpsw_password" class="flex_1 c-1F1" type="text" v-model="newpsw" 
			placeholder="输入新密码（8-20位数字与字母组合）" placeholder-class="f-15 c-CCC">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('newpsw')" :src="'../../../static/images/'+ newpsw_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<!-- 确认新密码 -->
		<input-self title="确认新密码" text="sure" :account_state="sure_state"  :account="sure" @eventAccount="eventAccount" @delect="delect" @hide_show="hide_show" :psw_password="sure_password">
			<input slot="input" :password="sure_password" class="flex_1 c-1F1" type="text" v-model="sure" 
			placeholder="确认新密码" placeholder-class="f-15 c-CCC">
			<view slot="pass"  class="j-center">
				<view class="border m-l-10"></view>
				<image class="eyes_image m-l-10" @tap="hide_show('sure')" :src="'../../../static/images/'+ sure_eyes_name +'.png'"></image>
			</view>
		</input-self>
		<view class="m-b-30"></view>
		<!-- 确认 按钮 -->
		<btn-self text="确认" :state="allSelect" @btnClick="btnClick"></btn-self>
	</view>
</template>

<script>
	import inputSelf from '@/components/inputSelf.vue'
	
	export default {
		onLoad() {
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			this.tabClick = index;
			let value = uni.getStorageSync('accountList');//账户列表
			this.dataAccountList = value;
			this.privateKey = value[index].privateKey;
		},
		data() {
			return {
				newpsw: "",
				newpsw_state: false,
				newpsw_password: true,
				newpsw_eyes_name: "eyes_0",
				sure: "",
				sure_state: false,
				sure_password: true,
				sure_eyes_name: "eyes_0",
				privateKey: "",
				value_text: "",
				tabClick: 0,
				dataAccountList: [],
			}
		},
		components: {
			inputSelf
		},
		computed: {
			allSelect() {
				if (this.newpsw && this.sure && this.value_text) {
					return true
				}else {
					return false
				}
			}
		},
		methods: {
			delect(i) {//原密码
				if(i == 'newpsw') {//新密码
					this.newpsw = '';
				}else{//确认新密码
					this.sure = '';
				}
			},
			eventAccount(options) {//原密码
				if(options == 'newpsw') {//新密码
					this.newpsw_state = true;
					if(this.oldpsw == '') this.oldpsw_state = false;
					if(this.sure == '') this.sure_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}else {//确认新密码
					this.sure_state = true;
					if(this.oldpsw == '') this.oldpsw_state = false;
					if(this.newpsw == '') this.newpsw_state = false; 
					if(this.tips_psw == '') this.tips_state = false; 
				}
			},
			hide_show(options) {
				if(options == 'newpsw') {//新密码
					if(this.newpsw_password) {
						this.newpsw_eyes_name = "eyes_1"
					}else {
						this.newpsw_eyes_name = "eyes_0"
					}
					this.newpsw_password = !this.newpsw_password;
				}else {//确认密码
					if(this.sure_password) {
						this.sure_eyes_name = "eyes_1"
					}else {
						this.sure_eyes_name = "eyes_0"
					}
					this.sure_password = !this.sure_password
				}
			},
			btnClick() {
				if(!this.allSelect) {
					uni.showToast({
						title: '请把信息填写完整',
						icon: 'none',
						mask: true
					});
					return;
				}
				if(this.value_text !== this.privateKey) {
					uni.showToast({
						icon: 'none',
						title: "私钥与账号不匹配，请重试"
					});
					return
				};
				if(this.newpsw !== this.sure) {
					uni.showToast({
						icon: 'none',
						title: "两次密码数次不一致，请重试"
					});
					return
				};
				this.dataAccountList[this.tabClick].psw = this.newpsw;
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
</script>

<style>
	view {
		display: flex;
	}
</style>
