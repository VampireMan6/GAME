<template>
	<view class="container p-16 b-b">
		<view class="f-center" style="margin: 30rpx 0 80rpx;">
			<image class="b-r-50" style="width: 120rpx;height: 120rpx;" :src="image" mode="aspectFill" @tap="chooseImage"></image>
			<!-- <image :src="image" mode="aspectFill"  @tap="chooseImage"></image> -->
		</view>
		<!-- 节点名称 -->
		<input-self2 :state="state1" text="节点名称" index="1" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input1" type="text" placeholder="请输入节点名称" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- 节点所属方 -->
		<input-self2 :state="state2" text="节点所属方" index="2" @delect="delect">
			<input slot="input" class="flex_1 f-15" v-model="input2" type="text" placeholder="请输入节点所属方" placeholder-class="f-15 c-CCC">
		</input-self2>
		<!-- 节点地址选取 -->
		<view class="f-13 m-b-10">节点地址选取</view>
		<view class="m-b-10" @tap="loaction">{{input4}}</view>
		<view class="m-b-20 w-100 b-009" style="height: 2rpx"></view>
		<!-- 分成比例 -->
		<input-self2 :state="false" text="分成比例" index="5" @delect="delect">
			<input disabled="true" slot="input" class="flex_1 f-15" v-model="input5" type="text" placeholder="2(节点账户):8(投票账户)"
			 placeholder-class="f-15 c-CCC">
		</input-self2>
		<view style="height: 60rpx;"></view>
		<btn-self text="保存" class="w-100" :state="allSelect" @btnClick="btnClick"></btn-self>
	</view>
</template>

<script>
	import inputSelf2 from '@/components/inputSelf2.vue'

	export default {
		onLoad(options) {
			this.listIndex = options.index;
			let names = options.names;
			let myNodeList = uni.getStorageSync('myNodeList'); //我的节点列表
			this.dataList = myNodeList;
			this.input1 = this.dataList[this.listIndex].name;
			if (this.image) {
				this.image = this.dataList[this.listIndex].image;
			};
			this.input2 = this.dataList[this.listIndex].describe;
			this.input4 = this.dataList[this.listIndex].loaction;
			let accountList = uni.getStorageSync('accountList'); //账户列表
			this.dataAccountList = accountList;
			let index2 = this.dataAccountList.findIndex(x => x.account == names);
			this.privateKey = this.dataAccountList[index2].privateKey;
			this.account_name = this.dataAccountList[index2].account;
		},
		onShow() {
			let value = uni.getStorageSync('imageUrl');
			if (value) {
				this.image = value;
			}
		},
		data() {
			return {
				name: "",
				privateKey: "",
				input1: "",
				input2: "",
				input4: "dizhi",
				input5: "2(节点账户):8(投票账户)",
				dataList: [],
				dataAccountList: [],
				image: "../../../static/images/vote_logo.png",
				listIndex: 0,
				latitude: 0, //经度
				longitude: 0, //纬度
			}
		},
		components: {
			inputSelf2
		},
		computed: {
			state1() {
				if (this.input1) {
					return true;
				} else {
					return false
				}
			},
			state2() {
				if (this.input2) {
					return true;
				} else {
					return false
				}
			},
			state4() {
				if (this.input4) {
					return true;
				} else {
					return false
				}
			},
			allSelect() {
				if (this.input1 && this.input2 && this.input4) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			loaction() {
				uni.chooseLocation({
					success: (res) => {
						this.input4 = res.address;
						this.latitude = res.latitude;
						this.longitude = res.longitude;
					}
				})
			},
			btnClick() {
				if (this.image == '') {
					uni.showToast({
						title: "请上传图片",
						icon: "none"
					});
					return;
				};
				if (!this.input4) {
					uni.showToast({
						title: "请选择节点地址",
						icon: "none"
					});
					return;
				};
				if (!this.allSelect) {
					uni.showToast({
						title: "请把数据填写完整",
						icon: "none"
					});
					return;
				}
				this.setNode();
			},
			delect(options) {
				if (options == '1') {
					this.input1 = ""
				} else if (options == "2") {
					this.input2 = ""
				} else if (options == "3") {
					// this.input3 = ""
				} else if (options == "4") {
					this.input4 = ""
				}
			},
			chooseImage() { //上传照片
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: res => {
						const tempFilePaths = res.tempFilePaths[0];
						uni.navigateTo({
							url: ('/pages/Find/Vote/changeImage2?src=' + tempFilePaths)
						})
					}
				})
			},
			async setNode() {
				let data = {
					"producer_account_name": this.input1.trim(),
					"org": {
						"candidate_name": this.input2.trim(),
						"website": "https://game.io",
						"ownership_disclosure": "https://game.io",
						"code_of_conduct": "",
						"email": "",
						"branding": {
							"logo_256": this.image,
							"logo_1024": this.image,
							"logo_svg": this.image
						},
						"location": {
							"name": this.input4,
							"country": "",
							"latitude": this.latitude,
							"longitude": this.longitude
						},
						"social": {
							"steemit": "",
							"twitter": "",
							"github": "",
							"telegram": ""
						}
					}
				};
				let res = await this.$myRequest({
					url: 'setNode',
					method: "POST",
					data: {
						bpAccount: this.account_name,
						nosPrivateKey: this.privateKey,
						nodesJson: JSON.stringify(data)
					}
				});
				console.log(res)
				if (res.data.StatusCode == 200) {
					uni.showToast({
						title: "设置成功",
						icon: "none"
					});
					this.dataList[this.listIndex].name = this.input1;
					this.dataList[this.listIndex].describe = this.input2;
					this.dataList[this.listIndex].loaction = this.input4;
					this.dataList[this.listIndex].image = this.image;
					this.dataList[this.listIndex].latitude = this.latitude;
					this.dataList[this.listIndex].longitude = this.longitude;
					uni.setStorage({
						key: 'myNodeList',
						data: this.dataList
					});
					uni.setStorage({
						key: 'setUpNodeMes',
						data: "state_true"
					});
					setTimeout(() => {
						uni.navigateBack({})
					}, 1000)
				}
			},
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}

	.container {}
</style>
