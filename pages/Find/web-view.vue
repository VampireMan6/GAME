<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.url = options.url;
		},
		data() {
			return {
				url: ""
			}
		}
	}
</script>

<style>
</style>
