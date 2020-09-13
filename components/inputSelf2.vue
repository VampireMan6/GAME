<template>
	<view class="column">
		<view class="m-b-10 f-13">{{text}}</view>
		<view class="j-center m-b-10">
			<slot name="input"></slot>
			<image v-if="state" class="image_15 m-l-10" src="../static/images/delect_0.png" mode="" @tap="delect"></image>
		</view>
		<view :class="state?'b-009':'b-CCC'" class="m-b-20" style="height: 2upx"></view>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: ""
			},
			state: {
				type: Boolean,
				default: false
			},
			index: {
				type: String,
				default: "0"
			}
		},
		methods: {
			delect() {
				this.$emit('delect',this.index)
			}
		}
	}
</script>

<style scoped>
	view {
		display: flex;
	}
</style>
