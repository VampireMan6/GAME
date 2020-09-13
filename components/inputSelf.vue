<template>
	<view class="column m-b-20">
		<view class="j-center m-b-10" style="height: 40upx;">
			<view class="transition c-w f-13" :class="account_state?'c-CCC':''" >{{title}}</view>
			<view v-if="red_text" class="j-center m-l-5">
				<image class="image_15" src="../static/images/wallet_18.png" mode=""></image>
				<view v-if="state1" class="m-l-5 f-10" style="color: #DE1313;">请以g开头设置账号！</view>
				<view v-else class="m-l-5 f-10" style="color: #DE1313;">输入的密码不一致。</view>
			</view>
		</view>
		<view class="column">
			<view class="j-center m-b-10" @tap="eventAccount">
				<slot name="input"></slot>
				<view v-if="account" class="j-center">
					<image class="image_delect" @tap="delect" src="../static/images/delect_0.png" mode=""></image>
					<slot name="pass"></slot>
				</view>
			</view>
			<view v-if="red_text" class="border_1_CCC b-DE1"></view>
			<view v-else class="border_1_CCC" :class="account?'b-009':'b-CCC'"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
			account_state: {
				type: Boolean,
				default: false
			},
			red_text: {
				type: Boolean,
				default: false
			},
			account: {
				type: String,
				default: ""
			},
			text: {
				type: String,
				default: ""
			},
			state1: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			eventAccount() {
				this.$emit('eventAccount',this.text)
			},
			delect() {
				this.$emit('delect',this.text)
			}
		}
	}
</script>

<style scoped>
	view {
		display: flex;
	}
</style>
