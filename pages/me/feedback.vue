<template>
	<view class="container">
		<view class="opinion_wrap">
		    <view class="wrap">
		        <view class="contant_wrap">
		            <view class="contant">
		                <textarea name="opinion" v-model="content" auto-height placeholder-class="placeholder" placeholder="为了带给您更好的体验,期待您任何的对决策气象服务的意见和建议,我们将会不断改进!" />
		            </view>
		        </view>
				<view class="submitBtn">
					<button type="primary" hover-class="none" :disabled="disabled" :loading="loading" @click="submitOption">提交</button>
				</view>
		    </view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data() {
			return {
				content: '',
				loading: false,
				disabled: false
			}
		},
		onLoad: function(option) {},
		methods: {
			submitOption() {
				if(!app._apiKey) {
					uni.showModal({
						title: '用户未登录',
						content: '如需正常使用该小程序功能，请前往登录！',
						showCancel: true,
						success: function (resbtn) {
							if (resbtn.confirm) {
								uni.reLaunch({
									url: '/pages/me/index'
								})
							}
						}
					});
					return false;
				}
				if(!this.content) {
					uni.showToast({ title: '请输入内容！', icon: 'error', duration: 1000 });
					return false;
				}
				
				this.loading = true;
				this.disabled = true;
				uni.request({
				    url: `${app.API.wx_api}/wx_api/suggest`,  
				    method: 'POST',
					header: {
					    'content-type': 'application/x-www-form-urlencoded'
					},
				    data: {  
				        key: app._apiKey,
						content: this.content
				    },  
				    success: (res) => {  
						if(res.data.code == 200) {
							uni.showToast({ title: '谢谢您的反馈！', icon: 'success', duration: 3000 });
						} else {
							uni.showToast({ title: '提交错误！', icon: 'error', duration: 3000 });
						}
						this.loading = false;
						this.disabled = false;
				    },
					fail: (e) => {
						uni.showToast({ title: '网络错误！', icon: 'error', duration: 3000 });
						this.loading = false;
						this.disabled = false;
					}
				});  
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #E6EDF4;
	}
	.contant_wrap {
	    background-color: #fff;
	}
	.contant {
	    width: 94%;
	    margin: 0 auto
	}
	textarea {
	    min-height: 600rpx;
	    padding: 10rpx 0;
	    width: 100%;
	}
	.submitBtn {
	    margin-top: 60rpx;
	    padding: 0 30rpx;
		button {
			font-size: 36rpx !important;
			background-color: #2C79C1;
		}
		button[loading][type=primary] {
		    background-color: #2C79C1;
		}
		button[disabled][type=primary] {
		    background-color: #2C79a0;
		}
	}
	.placeholder {
	    color: #999999;
	    font-size: 28rpx;
	}
</style>
