<template>
	<view class="container p-16 b-b">
		<coin-select :select_text="select_text" :mantleState="mantleState" @select="selectCoin"></coin-select>
		<view style="height: 60upx;"></view>
		<!-- 输入有效地址 -->
		<input-self title="输入有效地址" text="address" :account_state="address_state" :account="address" @eventAccount="eventAccount" @delect="delect">
			<input slot="input" class="flex_1 c-1F1" type="text" maxlength="12" v-model="address" 
			placeholder="请输入有效的地址" placeholder-class="f-15 c-CCC">
		</input-self>
		<!-- 名称 -->
		<input-self title="名称" text="address_name" :account_state="address_name_state" :account="address_name" @eventAccount="eventAccount" @delect="delect">
			<input slot="input" class="flex_1 c-1F1" type="text" v-model="address_name" 
			placeholder="名称" placeholder-class="f-15 c-CCC">
		</input-self>
		<view class="m-b-30"></view>
		<!-- 保存 按钮 -->
		<btn-self text="保存" :state="allSelect" @btnClick="btnClick"></btn-self>
		<!-- 蒙层 -->
		<mantle v-if="mantleState" @cancel="cancel"></mantle>
		<!-- 弹出层 -->
		<coin-list-popup :dataList="dataList" :mantleState="mantleState" @cancel="cancel" :tabClick="tabClick" @select="select"></coin-list-popup>
	</view>
</template>

<script>
	import inputSelf from '@/components/inputSelf.vue'
	import coinSelect from '@/components/coinSelect.vue'
	import coinListPopup from '@/components/coinListPopup.vue'
	
	export default {
		onLoad() {
			let coinList = uni.getStorageSync('coinDataList');//账户下币的列表
			this.dataList = coinList;
			this.select_text = this.dataList[0].name;
		},
		data() {
			return {
				addressList: [],
				select_text: "请选择币种",
				mantleState: false,
				address: "",//地址
				address_state: false,
				address_name: "",
				address_name_state: false,
				dataList: [],
				tabClick: 999,
			}
		},
		components: {
			inputSelf,
			coinSelect,
			coinListPopup
		},
		computed: {
			allSelect() {
				if (this.address && this.address_name) {
					return true
				}else {
					return false
				}
			}
		},
		methods: {
			delect(i) {
				if(i == 'address') {
					this.address = '';
				}else {
					this.address_name = '';
				}
			},
			eventAccount(options) {
				if(options == 'address') {
					this.address_state = true;
					if(this.address_name == '') this.address_name_state = false; 
				}else {
					this.address_name_state = true;
					if(this.address == '') this.address_state = false; 
				}
			},
			selectCoin() {//币种选择
				this.mantleState = true;
			},
			cancel() {//蒙层取消
				this.mantleState = false;
			},
			select(i) {//币种选中
				this.tabClick = i;
				this.select_text = this.dataList[i].name;
				this.mantleState = false;
			},
			btnClick() {//新建地址
				if(this.allSelect) {
					if(!(/^[a-z1-5]{12}$/.test(this.address)) || this.address[0] !== 'g') {
						uni.showToast({
							title: "该地址无效",
							icon: 'none'
						});
						return
					};
					let obj = new Object;
					obj.address = this.address;
					obj.address_name = this.address_name;
					obj.name = this.select_text;
					let addressList = uni.getStorageSync('addressList');
					if(addressList) {
						this.addressList = addressList;
						this.addressList.push(obj);
					}else {
						this.addressList[0] = obj
					}
					uni.setStorage({//保存新增地址信息
						key: 'addressList',
						data: this.addressList
					});
					uni.showToast({
						title: '新增成功',
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
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.popup {
			height: 480upx;
			bottom: -480upx;
			left: 0;
			right: 0;
			.contain {
				
			}
		}
		.bottom_true {
			bottom: 68upx;
		}
	}
</style>
