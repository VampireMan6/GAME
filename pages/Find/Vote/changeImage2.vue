<template>
	<view class="container">
		<tui-image-cropper :lockRatio="true" :imageUrl="imageUrl" @ready="ready" @cropper="cropper"></tui-image-cropper>
	</view>
</template>

<script>
	import { url2 } from '@/common/js/api.js'
	import tuiImageCropper from '@/components/tui-image-cropper.vue'
	export default {
		data() {
			return {
				src: '',
				imageUrl: '' //要裁剪的图片
			};
		},
		onLoad(options) {
			this.src = options.src || '';
			//如果从上个页面传值时可显示loading
			this.src &&
				uni.showLoading({
					title: '请稍候...',
					mask: true
				});
		},
		components: {
			tuiImageCropper
		},
		methods: {
			ready() {
				this.imageUrl = this.src;
			},
			cropper(e) {
				//裁剪完成后处理逻辑 上传图片
				uni.showLoading({
					title: "图片上传中",
					mask: true
				})
				uni.uploadFile({
					url: url2 + 'upload',
					method: "POST",
					filePath: e.url,
					name: 'file',
					imgType: 1,
					formData: {
						'user': 'test'
					},
					success: (uploadFileRes) => {
						let img = JSON.parse(uploadFileRes.data).data.path;
						uni.setStorage({//主图修改
							key: 'imageUrl',
							data: img,
							success() {
								uni.hideLoading();
								uni.navigateBack({})
							}
						})
					}
				})
			}
		}
	};
</script>

<style>
	view {
		display: flex;
	}
</style>
