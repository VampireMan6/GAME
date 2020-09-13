<template>
	<view class="container p-16 b-b">
		<rich-text :nodes="text"></rich-text>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.name = options.name;
			this.getMessage();
		},
		data() {
			return {
				name: "",
				text: ""
			}
		},
		methods: {
			async getMessage() {
				let res = await this.$myRequest1({
					url: 'GetArticle',
					method: "POST",
					data: {
						langmold: 0,
						call_index: this.name
					}
				})
				this.text = res.data.data.data;
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.is-rotate {
		  transform: rotate(180deg);
		}
	}
</style>
