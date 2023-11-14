<template>
	<view class="container">
		<web-view :src="href" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data() {
			return {
				href: app.BASE_CONFIG.webView_h5_url,
			}
		},
		onLoad: function(option) {
			if(option){
				console.log('actual page');
				console.log("option..................",option)
				let { dataType, ele, eleName } = option;
				let { lon, lat, curid } = app.BASE_CONFIG.location;
				this.href += `?curid=${curid}&vw=${app.systemInfo.windowWidth}&dataType=${dataType}&eleName=${eleName}&ele=${ele}&t=${Date.now()}`;
				//console.info(this.href)
				console.log("this.href...............",this.href)
			}
			
		},
		methods: {
			handleMessage(evt) {  
				console.log("evt.................",evt)
				console.log('接收到的消息：' + JSON.stringify(evt.detail.data));  
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #E6EDF4;
	}
	.container {
		padding: 20px;
		font-size: 28rpx;
		line-height: 24px;
	}
</style>
