<template>
	<view class="container">
		<web-view :src="href"></web-view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data() {
			return {
				href: null,
			}
		},
		onLoad: function(option) {
			console.log('actual page');
			let { title, url } = option;
			// 动态设置BarTitle
			uni.setNavigationBarTitle({
			　　title: title
			});
			
			this.href = app.API.wx_api + url;
		},
		methods: {}
	}
</script>

<style lang="less">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
