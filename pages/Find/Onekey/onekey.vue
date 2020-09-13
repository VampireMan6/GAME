<template>
	<view class="container p-16 b-b">
		<!-- 顶部 -->
		<view class="b-b b-r-5 f-13 f-w-600 c-009 j-center m-b-30" style="padding: 44upx 36upx;background-color: #7CC6C6;border: 2upx solid #E0F2F2;">
			<view style="width: 6upx;height: 6upx;" class="b-r-50 b-009"></view>
			<view class="flex_1 m-l-10">平台创建的代币符合GRC20标准，所有参数在代币创建成功后无法再修改。</view>
		</view>
		<!-- 代币全称 -->
		<input-self2 :state="state1" text="代币名称" index="1" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input1" type="text" maxlength="7" placeholder="代币名称为A-Z大写字母,最长7位" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- 发行总量 -->
		<input-self2 :state="state2" text="发行总量" index="2" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input2" type="number" placeholder="代币初始发行的总量" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- 流通量 -->
		<input-self2 :state="state3" text="流通量" index="3" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input3" type="number" placeholder="代币初始发行的流通量" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- 代币接收地址 -->
		<input-self2 :state="state4" text="代币接收地址" index="4" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input4" maxlength="12" type="text" placeholder="请输入代币接受地址" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- GAME账户私钥 -->
		<input-self2 :state="state5" text="GAME账户私钥" index="5" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input5" type="text" placeholder="请输入该账户私钥" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- 小数位数 -->
		<input-self2 :state="false" text="小数位数" index="6" @delect="delect">
			<!-- <input slot="input" class="flex_1 f-15" v-model="input6" type="text" placeholder="小数位数" placeholder-class="f-15 c-CCC"> -->
			<view slot="input">4位</view>
		</input-self2>
		<!-- 确定发币 按钮 -->
		<btn-self class="w-100" text="确定发币" :state="true" @btnClick="btnClick"></btn-self>
	</view>
</template>

<script>
	import inputSelf2 from '@/components/inputSelf2.vue'
	
	export default {
		onLoad() {
			let index = uni.getStorageSync('accountIndex');//账户下标选择
			if(index) {
				this.tabClick = index;
			};
			let value = uni.getStorageSync('accountList');//账户列表
			this.dataAccountList = value;
			this.account_name = value[this.tabClick].account;
			this.privateKey = value[this.tabClick].privateKey;
		},
		data() {
			return {
				input1: "",
				input2: "",
				input3: "",
				input4: "",
				input5: "",
				tabClick: 0,
				account_name: "",
				privateKey: "",
				button_state: false
			}
		},
		computed: {
			state1() {if(this.input1) {return true;}else {return false}},
			state2() {if(this.input2) {return true;}else {return false}},
			state3() {if(this.input3) {return true;}else {return false}},
			state4() {if(this.input4) {return true;}else {return false}},
			state5() {if(this.input5) {return true;}else {return false}},
			state6() {if(this.input6) {return true;}else {return false}},
			
		},
		components: {
			inputSelf2
		},
		methods: {
			async getOneKey() {//发币
				let res = await this.$myRequest({
					url: 'oneKeyDeployToken',
					method: "POST",
					data: {
						createAccount: this.account_name,
						issueAccount: this.input4,
						maxSupply: parseInt(this.input2),
						issueAmount: parseInt(this.input3),
						symbol: this.input1,
						nosPrivateKey: this.input5,
					}
				});
				if(res.data.StatusCode == 200) {
					this.button_state = false;
					uni.setStorage({//发新币
						key: 'onekey',
						data: 'onekey'
					});
					uni.showToast({
						title: "创建成功",
						icon: "none",
						mask: true
					})
					setTimeout(()=> {
						uni.navigateBack({})
					},1000)
				}else {
					this.button_state = false;
					let str = res.data.RawMessage.indexOf("token with symbol already exists");
					if(str !== -1) {
						uni.showToast({
							title: "该代币名称已经存在",
							icon: "none",
							mask: true
						})
					}else {
						uni.showToast({
							title: "创建token失败",
							icon: "none",
							mask: true
						})
					}
				}
			},
			delect(options) {
				if(options == '1') {
					this.input1 = ""
				}else if(options == "2") {
					this.input2 = ""
				}else if(options == "3") {
					this.input3 = ""
				}else if(options == "4") {
					this.input4 = ""
				}else{
					this.input5 = ""
				}
			},
			btnClick() {
				if(!this.input1) {
					uni.showToast({
						title: "代币名称不能为空",
						icon: 'none'
					});
					return
				};
				if(!(/^[A-Z]{1,7}$/.test(this.input1))) {
					uni.showToast({
						title: "代币名称为A-Z大写字母,最长7位",
						icon: 'none'
					});
					return
				};
				if(!this.input2) {
					uni.showToast({
						title: "发行总量不能为空",
						icon: 'none'
					});
					return
				};
				if(!this.input3) {
					uni.showToast({
						title: "流通量不能为空",
						icon: 'none'
					});
					return
				};
				if(parseInt(this.input2) < parseInt(this.input3)) {//流通量不能大于发行量
					uni.showToast({
						title: "流通量不能大于发行量",
						icon: 'none'
					});
					return
				};
				if(!this.input4) {
					uni.showToast({
						title: "代币接收不能为空",
						icon: 'none'
					});
					return
				};
				if(!(/^[a-z1-5]{12}$/.test(this.input4)) || this.input4[0] !== 'g') {
					uni.showToast({
						title: "代币接收地址错误",
						icon: 'none'
					});
					return
				};
				if(this.account_name == this.input4) {
					uni.showToast({
						title: "不可以填写当前账号的地址哦",
						icon: 'none'
					});
					return;
				};
				if(!this.input5) {
					uni.showToast({
						title: "账户私钥不能为空",
						icon: 'none'
					});
					return
				};
				if(this.privateKey !== this.input5) {
					uni.showToast({
						title: "私钥与当前账号不匹配",
						icon: 'none'
					});
					return
				};
				if(!this.button_state) {
					this.button_state = true;
					this.getOneKey();
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
