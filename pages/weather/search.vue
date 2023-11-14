<template>
	<view class="container">
		<view class="search-input">
			<view class="input-wrap">
				<view class="iconfont icon-search"></view>
				<input class="input" adjust-position="false" placeholder="请输入城市名,快速查询天气信息" placeholder-class="input-p"
					@input="inputHandle" @confirm="inputHandle" v-model="value" />
				<view class="iconfont icon-del" @click="clearHandle"></view>
			</view>
			<button class="cancel" @click="cancelHandle" size="mini" plain>取消</button>
		</view>
		<view class="current-location">
			<text class="sanjiao"></text>
			<text>当前位置：</text>
			<text>{{curr_local}}</text>
			<view class="dw" @click="dwHandle">重新定位</view>
		</view>
		<view class="result" v-if="isSearch">
			<view class="item" :key="item.id" :data-res="item" v-for="item in result" @click="selectItem">
				{{item.title}},
				{{item.city}},
				{{item.province}}
			</view>
		</view>
		<view class="default" v-else>
			<text class="title">宁夏回族自治区城市</text>
			<view class="hot clear">
				<view class="item" :key="index" :data-value="item" v-for="item in hotCity" @click="hotHandle">
					{{item}}
				</view>
			</view>
			<text class="title">历史搜索</text>
			<view class="history clear">
				<view class="item" :key="index" v-for="(item, index) in history" :data-value="item" @click="hotHandle">
					{{item}}
					<text class="iconfont icon-del" @click="delHandle" :data-value="item"></text>
				</view>
				<view class="noData" v-if="history.length == 0">
					<text>无历史数据</text>
				</view>
			</view>
			<text class="clear-h" v-if="history.length" @click="clearHistory">清空历史</text>
		</view>
	</view>
</template>

<script>
	import QQMap from '@/plugins/qqMap/qq-map.js';

	const app = getApp().globalData;
	export default {
		data() {
			return {
				isSearch: false,
				result: [],
				value: '',
				hotCity: ['银川市', '灵武市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
				history: []
			}
		},
		computed: {
			curr_local: function() {
				return app.BASE_CONFIG.location.city;
			}
		},
		onLoad: function() {
			this.history = this.getHistoryLocal();
		},
		onShow: function() {},
		methods: {
			inputHandle(e) {
				const _self = this;
				const {
					value
				} = e.detail;
				if (value) {
					QQMap.getSuggestion({
						keyword: value,
						success: (res) => {
							_self.isSearch = true;
							_self.result = res.data;
						},
						fail: (e) => {
							console.info(e);
						}
					});
				} else {
					this.isSearch = false;
				}
			},
			// 设置历史记录
			setLocal(val) {
				const arr = this.getHistoryLocal();
				if (!arr.includes(val)) {
					arr.push(val);
					uni.setStorageSync('history', arr);
				}
			},
			getHistoryLocal() {
				return uni.getStorageSync('history') ? uni.getStorageSync('history') : [];
			},
			cancelHandle() {
				uni.navigateBack();
			},
			selectItem(e) {
				const {
					res
				} = e.currentTarget.dataset;
				console.log(res);
				const resData = {
					ad_info: {
						adcode: res.adcode
					},
					location: res.location,
					address_components: {
						city: res.city,
						district: res.district,
						street_number: res.address
					}
				}
				this.setGobalVar(resData);
				uni.navigateBack();
			},
			clearHandle() {
				this.value = '';
				this.isSearch = false;
				this.result = [];
			},
			clearHistory() {
				uni.removeStorage({
					key: 'history'
				});
				this.history = [];
			},
			dwHandle() {
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
									uni.showModal({
										title: '用户未授权',
										content: '你拒绝了授权，无法获取定位，请删除小程序，重新加载后开启授权定位！',
										showCancel: false,
										success: function (res) {
											if (res.confirm) {
												console.log('用户点击确定');
											}
										}
									});
								}
							})
						} else {
							_self.getLocal();
						}
					}
				});
			},
			hotHandle(e) {
				const {
					value
				} = e.currentTarget.dataset;
				this.setLocal(value);
				QQMap.geocoder({
					address: value,
					success: (res) => {
						console.info(res);
						this.setGobalVar(res.result);
						uni.navigateBack();
					}
				});
			},
			delHandle(e) {
				const {
					value
				} = e.currentTarget.dataset;
				const arr = this.getLocal();
				if (arr.includes(value)) {
					const index = arr.indexOf(value);
					arr.splice(index, 1);
					uni.setStorageSync('history', arr);
					this.history = arr;
				}
			},
			// 获取当前位置经纬度
			getLocal() {
				uni.getLocation({
				    type: 'wgs84',
				    success: (res) => {
						this.reverseGeocoder(res.latitude, res.longitude);
				    }
				});
			},
			// 解析坐标
			reverseGeocoder(latitude, longitude) {
			    QQMap.reverseGeocoder({
					location: {
						latitude,
						longitude
					},
					success:(res) => {
						const { result: { ad_info: { adcode },address_component: { city, district, street_number } } } = res;
						app.BASE_CONFIG.location.lon = longitude;
						app.BASE_CONFIG.location.lat = latitude;
						app.BASE_CONFIG.location.city = `${city}${district}`;
						app.BASE_CONFIG.location.curid= adcode.toString();
						this.$store.dispatch('changeCurid', adcode.toString());
						
						uni.navigateBack(); 
					}
			    });
			},
			setGobalVar(res) {
				const { ad_info: { adcode },location: {lng, lat},address_components: { city, district, street_number } }  = res;
				app.BASE_CONFIG.location.lon = lng;
				app.BASE_CONFIG.location.lat = lat;
				app.BASE_CONFIG.location.city = `${city}${district}`;
				app.BASE_CONFIG.location.curid= adcode.toString();
				this.$store.dispatch('changeCurid', adcode.toString());
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100vh;
		background-color: #E6EDF4;
	}
	.search-input {
		padding: 10px;
		display: flex;
	}
	.search-input .input-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 10px;
		font-size: 28rpx;
		flex: 1;
	}
	.search-input .icon-search {
		display: inline-block;
		width: 20px;
		height: 20px;
		margin-right: 10px;
		background: url('../../static/images/search/search.png') no-repeat 0 0;
	}
	.search-input .icon-del {
		display: inline-block;
		width: 20px;
		height: 20px;
		margin-right: 10px;
		background: url('../../static/images/search/del.png') no-repeat 0 0;
	}
	.search-input .input {
		flex: 1;
	}
	.search-input .cancel {
		font-size: 28rpx;
		border: 0;
	}
	.current-location {
		height: 24px;
		line-height: 24px;
		padding: 0 10px;
		font-size: 28rpx;
		.sanjiao {
			display: inline-block;
			width: 20px;
			height: 20px;
			background: url(../../static/images/search/weizhi.png) no-repeat 0 0;
			vertical-align: sub;
		}
		.dw {
			float: right;
			padding: 0 10px;
			text-align: center;
			line-height: 24px;
			background-color: #2C79C1;
			border-radius: 5px;
			font-size: 24rpx;
			color: #fff;
		}
	}
	.result .item {
		font-size: 24rpx;
		padding: 10px;
	}
	.history .clear {
		font-size: 28rpx;
	}
	.default .title {
		display: block;
		padding: 10px;
		font-size: 28rpx;
	}
	.hot,
	.history {
		width: calc(100% - 20px);
		margin: auto;
	}
	.hot .item,
	.history .item {
		float: left;
		font-size: 28rpx;
		width: calc((100% - 30px) / 3);
		margin-right: 10px;
		margin-bottom: 10px;
		text-align: center;
		line-height: 30px;
	}
	.hot .item:nth-child(3n),
	.hot .history:nth-child(3n) {
		margin-right: 10px;
	}
	.history .icon-del {
		padding: 10px;
	}
	.clear-h {
		color: rgb(211, 210, 210);
		display: block;
		font-size: 28rpx;
		text-align: center;
	}
	.clear {
		overflow: hidden;
	}
	.noData {
		background-color: transparent;
	}
</style>
