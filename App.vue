<script>
	import update from '@/common/js/update.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	@import './common/common.css';
	/* #endif */
	@import './static/iconfont/iconfont.css';
</style>
