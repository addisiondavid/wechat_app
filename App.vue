<script>
	import API from './config/api.config.js';
	import BASE_CONFIG from './config/base.config.js';
	import QQMap from './plugins/qqMap/qq-map.js';
	
	export default {
		globalData: {
			BASE_CONFIG: BASE_CONFIG,
			API: API,
			_curid: '640106',
			_appid: 'wx4b12af12658de9bf',
			_apiKey: uni.getStorageSync('access_token') //'MTg2MDAxNTU4MDM='
		},
		onLaunch: function() {
			const _self = this;
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.userLocation']) {
						// 未授权
						uni.authorize({
							scope: 'scope.userLocation',
							success() {
								_self.getLocal();
							},
							fail() {
								console.log("你拒绝了授权，无法获得周边信息")
							}
						})
					} else {
						_self.getLocal();
					}
				}
			});
			
			this.getSystemInfo();
			
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 获取设备信息
			getSystemInfo() {
				uni.getSystemInfo({
				    success: (res) => {
					    const { windowWidth } = res;
						this.globalData.systemInfo = {
							windowWidth
						}
					}
				})
			},
			// 获取当前位置经纬度
			getLocal(callBack) {
				const location = this.globalData.BASE_CONFIG.location;
				if(location.isOpen) {
					uni.getLocation({
					    type: 'wgs84',
					    success: (res) => {
							this.reverseGeocoder(res.latitude, res.longitude, callBack);
					    }
					});
				} else {
					this.reverseGeocoder(location.lat, location.lon, callBack);
				}
			},
			// 解析坐标
			reverseGeocoder(latitude, longitude, callBack) {
			    QQMap.reverseGeocoder({
					location: {
						latitude,
						longitude
					},
					success:(res) => {
						const { result: { ad_info: { adcode },address_component: { city, district, street_number } } } = res;
						console.log('当前位置：', res);
						if(adcode.startsWith('64')){
							this.globalData.BASE_CONFIG.location.lon = longitude;
							this.globalData.BASE_CONFIG.location.lat = latitude;
							this.globalData.BASE_CONFIG.location.city = `${city}${district}`;
							this.globalData.BASE_CONFIG.location.curid= adcode;
							this.$store.dispatch('changeCurid', adcode);
							console.log('当前全局配置变更为：', this.globalData.BASE_CONFIG);
						}
						callBack && callBack();
					}
			    });
			}
		}
		
	}
</script>

<style lang="less">
	/*每个页面公共css */
	page {
		background-color: #E5E5E5;
	}
	.container {
		height: auto;
		margin: 0; 
	}
	.title {
		font-size: 28rpx; 
		font-weight: bold;
	}
	.rank_search-box .uni-date {
		height: 28px;
		padding: 0 10px;
		border: #bfbfbf solid 1px;
		border-radius: 15px;
	}
	.noData {
		padding: 5px 0;
		text-align: center;
		background-color: #fff;
		image {
			width: 64px;
			height: 64px;
		}
		text {
			display: block;
			font-size: 24rpx;
			color: #ccc;
			padding-left: 13px;
		}
	}
	.uni-load-more {
		background-color: #fff;
		.uni-load-more__text {
		    font-size: 30rpx !important;
		}
	}
</style>
