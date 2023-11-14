<template>
	<view class="container">
		<view class="bg">
			<view class="head">
				<view class="headIcon">
					<image :src="userInfo.avatarUrl"></image>
				</view>
				<view class="login">
					{{userInfo.nickName}}
				</view>
			</view>
			<button v-if="!hasUserInfo" class="button" type='default' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				微信登录
			</button>
			<!-- <button v-if="!hasUserInfo" class="button" type='default' @click="checkLoginStatus">
				微信登录
			</button> -->
			<button v-else class="button" type='default' @click="signOut">
				退出登录
			</button>
		</view>
		<view class="line"></view>
		<view class="item" @click="jumpToAbout">
			<view class="title">
				<image src="../../static/images/me/us.png" mode="heightFix"></image>
				<span >关于我们</span>
			</view>
			<view class="detail2">
				<text> ></text>
			</view>
		</view>
		<view class="line"></view>
		<view class="item" @click="jumpToContactUs">
			<view class="title">
				<image src="../../static/images/me/feek.png" mode="heightFix"></image>
				<span >联系我们</span>
			</view>
			<view class="detail2">
				<text> ></text>
			</view>
		</view>
		<view class="line"></view>
		<view class="item">
			<view class="title">
				<image src="../../static/images/me/banben.png" mode="heightFix"></image>
				版本信息
			</view>
			<view class="detail2">
				<text>{{version}}</text>
			</view>
		</view>
		<view class="hr"></view>
	</view>
</template>

<script>
	import WXBizDataCrypt from "@/plugins/crypt/WXBizDataCrypt.js";
	import { Base64 } from '@/js_sdk/js-base64/base64.js';
	
	const app = getApp().globalData;
	export default {
		data() {
			return {
				hasUserInfo: uni.getStorageSync('access_token') ? true : false,
				jsCode: '',
				openid: '',
				session_key: '',
				userInfo: uni.getStorageSync('user_info') || {
					avatarUrl: '/static/images/me/touxiang.png',
					nickName: ''
				}
			}
		},
		computed: {
			version: function () {
				return app.BASE_CONFIG.version;
			}
		},
		onLoad: function(option) {
			if(!uni.getStorageSync('access_token')) {
				this.doAuthorization();
			}
		},
		methods: {
			doAuthorization() {
				wx.login({
				    success: (res) => {
				        if (res.code) {
				            this.jsCode = res.code;
							console.log('获取code:', this.jsCode);
				            uni.request({  
				                url: `${app.API.wx_api}/wx_api/wxCheck`,
				                method: 'GET',  
				                data: {  
				                    appid: app._appid,
				                    js_code: res.code,
									grant_type: 'authorization_code'
				                },
				                success: (cts) => {  
				                    this.openid = cts.data.openid;
				                    this.session_key = cts.data.session_key;
									console.log('获取openid:', this.openid);
				                }
				            });
				        } else {
				            uni.showToast({ title: '网络错误！', icon: 'error', duration: 3000 });
				        }
				    }
				});
			},
			getPhoneNumber(e) {
				console.info("qianyr",e);
				if(e.detail.errMsg == 'getPhoneNumber:fail:access') {        
					uni.showModal({
						title: '用户未授权',
						content: '如需正常使用该小程序功能，请点击确定授权手机号！',
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				} else {
					//允许授权
					let pc = new WXBizDataCrypt(app._appid, this.session_key);
					let data = pc.decryptData(e.detail.encryptedData , e.detail.iv);
		
					this.checkLoginStatus(Base64.encode(data.phoneNumber));
				}  
			},
			checkLoginStatus(phoneNumber) {
				//phoneNumber = 'MTg2MDAxNTU4MDM=';
				uni.request({
				    url: `${app.API.wx_api}/wx_api/check`,
				    method: 'GET',
					data: {
						key: phoneNumber
					},
				    success: (res) => {
						if(res.data.code == 200) {
							this.loadUserInfo();
							// 保存用户token
							uni.setStorageSync('access_token', phoneNumber);
							app._apiKey = phoneNumber;
							this.userInfo.nickName = res.data.data.user.nickname;
							uni.setStorageSync('pro_class', res.data.data.article_type);
						} else {
							uni.showModal({
								title: '非法用户',
								content: '此用户手机号非系统内用户，请联系管理员！',
								showCancel: false,
								success: function (res) {
									if (res.confirm) {
										console.log('用户点击确定');
									}
								}
							});
						}
				    },
					fail: function(e) {
						uni.showToast({ title: '网络错误！', icon: 'error', duration: 3000 });
					}
				}); 
			},
			loadUserInfo() {
				uni.getUserInfo({
					success: res => {
						this.userInfo.avatarUrl = res.userInfo.avatarUrl;
						//this.userInfo.nickName = res.userInfo.nickName;
						this.hasUserInfo = true;
						
						uni.setStorageSync('user_info', this.userInfo);
					},
					fail: e => {
						uni.clearStorageSync('access_token');
						uni.clearStorageSync('pro_class');
						uni.showToast({ title: '获取用户失败', icon: 'error', duration: 3000 });
					}
				})
			},
			signOut() {
				uni.clearStorageSync('access_token');
				app._apiKey = '';
				uni.clearStorageSync('pro_class');
				this.userInfo.avatarUrl = '/static/images/me/touxiang.png';
				this.userInfo.nickName = '';
				uni.setStorageSync('user_info', this.userInfo);
				this.hasUserInfo = false;
				uni.reLaunch({
					url: '/pages/me/index'
				})
			},
			goto(url) {
				uni.navigateTo({
					url: url,
					fail(e) {
						console.log(e);
					}
				})
			},
			jumpToAbout(){
				uni.navigateTo({
					url: '/pages/me/aboutMe',
					fail(e) {
						console.log(e);
					}
				})
			},
			jumpToContactUs(){
				uni.navigateTo({
					url: '/pages/me/contactUs',
					fail(e) {
						console.log(e);
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #E6EDF4;
	}
	.bg {
		height: 150px;
		background-color: #2C79C1;
	}
	.head {
		display: flex;
		flex-direction: column;
	}
	.headIcon {
		display: flex;
		justify-content: center;
		image {
			width: 70px;
			height: 70px;
		}
	}
	.login {
		display: flex;
		color: #fff;
		font-size: 30rpx;
		margin-top: 15rpx;
		justify-content: center;
	}
	.button {
		margin: 10px;
		font-size: 28rpx;
	}
	.head image {
		border-radius: 50%;
	}
	.hr {
		width: 100%;
		height: 15px;
	}
	.item {
		display: flex;
		flex-direction: row;
		background-color: #fff;
	}
	.title {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 30rpx;
		font-size: 30rpx;
		font-weight: 400;
		image {
			width: 30px;
			height: 30px;
			vertical-align: middle;
			margin-right: 5px;
		}
	}
	.detail2 {
		font-size: 30rpx;
		position: absolute;
		right: 10px;
		height: 50px;
		line-height: 50px;
		color: #888;
	}
	.line {
		border: 1px solid #ccc;
		opacity: 0.2;
	}
</style>
