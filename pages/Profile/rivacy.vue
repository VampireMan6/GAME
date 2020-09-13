<template>
	<view class="container p-16 b-b">
		<rich-text :nodes="text"></rich-text>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getMessage();
		},
		data() {
			return {
				text: '',
			}
		},
		methods: {
			async getMessage() {
				let res = await this.$myRequest1({
					url: 'GetArticle',
					method: "POST",
					data: {
						langmold: 0,
						call_index: 'Privacy'
					}
				});
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
		
	}
</style>
