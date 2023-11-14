<template>
	<view class="container">
		<view class="con-box-notices" v-if="newEarlyWarnData != ''">
			<uni-notice-bar speed="50" showIcon="true" scrollable="true" single="true" :text="newEarlyWarnData"></uni-notice-bar>
		</view>
		<view class="city-weather_current" @click="goWeather" v-if="basic">
			<view class="row-inline city-weather_current_city">
				<text class="current__city">{{basic.Station_Name}}</text>
				<text class="iconfont icon-address"></text>
				<text class="current__title" v-if="basic">
					{{basic['TEM_Max_24h']?parseInt(basic['TEM_Max_24h']):'-'}}
					<text class="current__title-symbol">℃ </text>
					/{{basic['TEM_Min_24h']?parseInt(basic['TEM_Min_24h']):'-'}}
					<text class="current__title-symbol">℃</text>
				</text>
				<text v-else>
					-℃/-℃ 
				</text>
			</view>
			<view class="row-inline city-weather_current_tianqi">
				<view class="current_tianqi">
					<image class="current__img" :src="basic.img"></image>
					<text class="current__title">{{weatherName}}</text>
				</view>
				<view class="current_air">
					<view class="air-aqi">
						<text class="air_title">AQI等级：</text>
						<view class="air-aqi__level" :style="{'background-color': levelColor || '#ffffff'}"></view>
					</view>
					<!-- <view class="air-pollutant">
						<text class="air_title">首要污染物：</text>
						<text class="air-pollutant__value">{{airBasic.pollValue}}</text>
					</view> -->
				</view>
			</view>
		</view>
		<view class="con-box con-box-products">
			<view class="box-header">
				<view class="box-header__title">
					<view class="header__title-tip">
						<image src="/static/images/shouye/juece-tip.png"></image>
					</view>
					<text class="header__title-text">信息专报</text>
				</view>
				<text class="box-header__more" @click="goProductTabView">查看全部>></text>
			</view>
			<view class="box-container">
				<view class="box-container__list" v-if="newProductList.length > 0" :animation="animationData">
					<view class="list_item" v-for="(item, index) in newProductList" :key="index" @click="getToDetail(item)">
						<image class="list_item__img" src="/static/images/shouye/laba.png"></image>
						<text class="list_item__title">{{item.RETAIN1}}</text>
						<!-- <text class="list_item__date">{{thisTimeTransform.toTimeZone(item.Datetime, 0, 'MM月dd日hh时')}}</text> -->
					</view>
				</view>
				<view v-else class="noData">
					<image src="/static/images/noData.png" mode="heightFix"></image>
					<text>暂无数据！</text>
				</view>
			</view>
		</view>
		<view class="con-box con-box-actual">
			<view class="box-header">
				<view class="box-header__title">
					<view class="header__title-tip">
						<image src="/static/images/shouye/shikuang-tip.png"></image>
					</view>
					<text class="header__title-text">实况监测</text>
				</view>
			</view>
			<view class="box-container">
				<view class="subMenu-item" v-for="(item,index) in subMenu.actual" :key="item.ele" :style="subMenuStyle" @click="getRouterView('actual', item)">
					<view class="img">
						<image :src="item.icon" mode="heightFix"></image>
					</view>
					<text class="name">{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class="con-box con-box-forecast">
			<view class="box-header">
				<view class="box-header">
					<view class="box-header__title">
						<view class="header__title-tip">
							<image src="/static/images/shouye/yubao-tip.png"></image>
						</view>
						<text class="header__title-text">预警预报</text>
					</view>
				</view>
			</view>
			<view class="box-container">
				<view class="subMenu-item" v-for="(item,index) in subMenu.forecast" :key="item.ele" :style="subMenuStyle" @click="getRouterView('forecast', item)">
					<view class="img">
						<image :src="item.icon" mode="heightFix"></image>
					</view>
					<text class="name">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import timeTransform from '@/plugins/tools/timeTransform.js';
	import { queryWeather,queryWeather2, queryWinD, queryWinS } from '@/plugins/weather/weather.js';
	
	let app = getApp().globalData;
	export default {
		data() {
			return {
				basic: {},
				weatherName:'',
				levelColor: null,
				// 服务产品区块
				scrollHeight: 0,
				BJDate: new Date(),
				height: 0,
				animationData: {},
				scrollTimer: null,
				newEarlyWarnData: '',
				// 实况监测区块
				subMenu: {
					actual: [
						{
							name: '降水',
							icon: '/static/images/shouye/ac-pre.png',
							ele: 'PRE',
							path: '../actual/index'
						},
						{
							name: '气温',
							icon: '/static/images/shouye/ac-tem.png',
							ele: 'TEM',
							path: '../actual/index'
						},
						{
							name: '风场',
							icon: '/static/images/shouye/ac-win.png',
							ele: 'WIN',
							path: '../actual/index'
						},
						{
							name: '环境',
							icon: '/static/images/shouye/ac-air.png',
							ele: 'AIR',
							path: '../actual/index'
						},
						{
							name: '雷达',
							icon: '/static/images/shouye/ac-radar.png',
							ele: 'RADAR',
							path: '../actual/imgShow'
						},
						{
							name: '风四云图',
							icon: '/static/images/shouye/ac-satellite.png',
							ele: 'SATELLITE',
							path: '../actual/imgShow'
						},
						{
							name: '灾情信息',
							icon: '/static/images/shouye/ac-disaster.png',
							ele: 'DISASTER',
							path: '../actual/index'
						}
					],
					forecast: [
						{
							name: '降水',
							icon: '/static/images/shouye/for-pre.png',
							ele: 'PRE',
							path: '../forecast/index'
						},
						{
							name: '气温',
							icon: '/static/images/shouye/for-tem.png',
							ele: 'TEM',
							path: '../forecast/index'
						},
						{
							name: '风场',
							icon: '/static/images/shouye/for-win.png',
							ele: 'WIN',
							path: '../forecast/index'
						},
						// {
						// 	name: '环境',
						// 	icon: '/static/images/shouye/for-air.png',
						// 	ele: 'AIR',
						// 	path: '../forecast/index'
						// },
						{
							name: '预警信号',
							icon: '/static/images/shouye/for-warn.png',
							ele: 'WARN',
							path: '../forecast/index'
						}]
				},
				subMenuStyle: null,
				newProductList: [],
				aqiColorConf: {
					'优': '#1EF875',
					'良': '#E4F33E',
					'轻度污染': '#E4993E',
					'中度污染': '#F10617',
					'重度污染': '#99074E',
					'严重污染': '#860022'
				}
			}
		},
		computed: {
			curid: function() {
				return this.$store.state._curid;
			},
			thisTimeTransform: function() {
				return timeTransform;
			},
		},
		watch: {
		    curid: {
		        handler(curid) {
		            this.init();
		        },
		        immediate: false,
		        deep: true,
			}
		},
		onShow: function() {
			this.init();
		},
		methods: {
			init() {
				uni.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
				// 最新预警
				this.getNearWarn();
				setInterval(() => {
					this.getNearWarn();
				}, 1000 * 60 * 30);
				
				// 临近预报
				this.getNearForcest((data) => {
					console.log("data",data)
					uni.hideToast();
					this.basic = data[0];
					this.weatherName=(timeTransform.isDaylight() ? queryWeather2(this.basic['WEP_Past_12hA'], 'n') : queryWeather2(this.basic['WEP_Past_12h'], 'd')).name;
					this.basic.img = `/static/images/weather/${(timeTransform.isDaylight() ? queryWeather2(this.basic['WEP_Past_12hA'], 'n') : queryWeather2(this.basic['WEP_Past_12h'], 'd')).image}.png`;
					this.basic.city = app.BASE_CONFIG.location.city;
					console.log("this.basic............................",this.basic)
				});
				this.getAirqualityForecast((data) => {
					console.log(this.aqiColorConf[data['V_QUAL']])
					this.levelColor = this.aqiColorConf[data['V_QUAL']];
					//this.airBasic.pollValue = data.Kzyb[0]['首要污染物'];
				});
				
				this.getNewProductList();
				
				// 子菜单大小
				this.subMenuStyle = `
				    width: ${((app.systemInfo.windowWidth - 20) / 4)}px;
				    height: ${((app.systemInfo.windowWidth - 20) / 4)}px 
				`;
				let curid=app.BASE_CONFIG.location.curid;
				setTimeout( ()=>{
					console.info(curid,app.BASE_CONFIG.location);
				    if(curid!=app.BASE_CONFIG.location.curid){
						console.info(app.BASE_CONFIG.location);
						// 临近预报
						this.getNearForcest((data) => {
							uni.hideToast();
							this.weatherName=(timeTransform.isDaylight() ? queryWeather2(this.basic['WEP_Past_12hA'], 'n') : queryWeather2(this.basic['WEP_Past_12h'], 'd')).name;
							this.basic = data[0];
							this.basic.img = `/static/images/weather/${(timeTransform.isDaylight() ? queryWeather2(this.basic['WEP_Past_12h'], 'n') : queryWeather2(this.basic['WEP_Past_12h'], 'd')).image}.png`;
							this.basic.city = app.BASE_CONFIG.location.city;
						});
						this.getAirqualityForecast((data) => {
							console.log(this.aqiColorConf[data['V_QUAL']])
							this.levelColor = this.aqiColorConf[data['V_QUAL']];
							//this.airBasic.pollValue = data.Kzyb[0]['首要污染物'];
						});
					}
				},2000) 
			},
			// 获取最新预警
			getNearWarn() {
				const BJDate = new Date(),
					  UTCDate = timeTransform.toTimeWorld(BJDate),
					  endDate = BJDate.Format('yyyyMMddhhmmss'),
					  startDate = timeTransform.getAppointHourStr(BJDate, -2, 'yyyyMMddhhmmss');
				uni.request({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeRange?dataCode=SEVP_NX_ALARM&interfaceId=getEleByTimeRange&timeRange=%5B${startDate},${endDate}%5D&elements=headline,Datetime`,
					header: {'Content-Type': 'application/json'},
					data: {
						key: app._apiKey
					},
					dataType: 'json',
					success: (res) => {
						let msg = '';
						if(res && res.data && res.data.DS && res.data.DS.length > 0) {
							res.data.DS.forEach((item) => {
								msg += `${timeTransform.toTimeZone(item.Datetime, -8, 'dd日hh:mm')}-${item.headline}  `;
							});
							this.newEarlyWarnData = msg;
						}
					}
				});
			},
			// 获取临近预报
			getNearForcest(fn) {
				console.log(fn)
				let startDate;
				const currHour = this.BJDate.getHours();
				if(currHour < 8) {
				    startDate = timeTransform.getAppointDateStr(this.BJDate, -1, 'yyyyMMdd120000');
				} else if(currHour >= 8 && currHour < 20) {
				    startDate = timeTransform.getAppointDateStr(this.BJDate, 0, 'yyyyMMdd000000');
				} else {
				    startDate = timeTransform.getAppointDateStr(this.BJDate, 0, 'yyyyMMdd120000');
				}  
				uni.request({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeAndAreaCode?dataCode=SEVP_NX_WEFC_RFFC&interfaceId=getEleByTimeAndAreaCode&times=${startDate}&elements=Station_Name,TEM_Max_24h,TEM_Min_24h,WEP_Past_12h&areacode=`+app.BASE_CONFIG.location.curid.substr(0,6)+`&eleValueRanges=Validtime:24;Prod_Code:SPCC`,
					header: {'Content-Type': 'application/json'},
					dataType: 'json',
					success: function(res) {
						if(res.data.returnCode == 0) fn(res.data.DS);
					}
				})
			},
			getAirqualityForecast(fn) {
				const BJDate = new Date(),
					  UTCDate = timeTransform.toTimeWorld(BJDate),
					  endDate = UTCDate.Format('yyyyMMddhhmmss'),
					  startDate = timeTransform.getAppointHourStr(UTCDate, -2, 'yyyyMMddhhmmss');
				uni.request({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeRangeAndRadius?interfaceId=getEleByTimeRangeAndRadius&dataCode=CAWN_MEE_AIR_EMO&timeRange=%5B${startDate},${endDate}%5D&elements=Datetime,Station_Id_C,V_QUAL&distance=15000&orderBy=Datetime:desc`,
					//url: 'app.API.airqualityrecast',
					header: {'Content-Type': 'application/json'},
					data: {
						key: app._apiKey,
						lat:app.BASE_CONFIG.location.lat,
						lon:app.BASE_CONFIG.location.lon,
						an: app.BASE_CONFIG.location.curid.substr(0,4)
					},
					dataType: 'json',
					success: function(res) {		
						if(res && res.data && res.data.DS && res.data.DS.length > 0){
							for (let i = 0; i < res.data.DS.length; i++) {
								if(res.data.DS[i]['V_QUAL']!='999900'){
									fn(res.data.DS[i]);
									break;
								}
							}
						}   
					}
				})
			},
			// 跳转到天气详情
			goWeather() {
				uni.navigateTo({
				    url: '../weather/index',
					fail(e) {
						console.log(e);
					}
				})
			},
			// 按时间查询最新的产品列表
			getNewProductList() {
				if(app._apiKey) {
					const endDate = new Date(),
						  endDateStr = endDate.Format('yyyyMMddhhmmss'),
						  startDate = timeTransform.getAppointDateStr(endDate, -30, 'yyyyMMddhhmmss');
					uni.request({
						url: `${app.API.wx_api}/downUdi/getFileByTimeRangeAndAreaCode?interfaceId=getFileByTimeRangeAndAreaCode&dataCode=SEVP_NX_DOC_FILE&timeRange=%5B${startDate},${endDateStr}%5D&elements=RETAIN1,File_URL,Datetime&orderBy=Datetime:desc&areaCode=NX`,
						header: {'Content-Type': 'application/json'},
						data: {
							key: app._apiKey
						},
						dataType: 'json',
						success: (res) => {
							if(res.statusCode == 200) {
								const productList = res.data.DS;
								this.newProductList = [];
								// 产品列表开启滚动
								// if(productList.length > 3) {
								// 	this.newProductList.push(...productList, ...productList);
								// 	this.prizeScroll(productList.length * 2);
								// } else {
									this.newProductList.push(...productList.slice(0,6));
								//}
							}
						}
					})
				}
			},
			prizeScroll(len) {
				clearInterval(this.scrollTimer);
				const scrollSpeed = 50;
				this.getHeight(len);
				let animation = uni.createAnimation({
					duration: this.height / scrollSpeed,
					timingFunction: 'linear',
					delay: 0
				});
				this.animation = animation;
				this.scrollTimer = setInterval(() => {
					if (this.scrollHeight >= this.height) {
						animation.translateY(0).step();
						this.scrollHeight = 0;
						this.animationData = animation.export();
					} else {
						this.scrollHeight = this.scrollHeight + 1;
						animation.translateY(-this.scrollHeight).step();
						this.animationData = animation.export();
					}
				}, scrollSpeed);
			},
			// 获取dom高度
			getHeight(len) {
				// let query = uni.createSelectorQuery().in(this);
				// query.selectAll(Class).boundingClientRect(data => {
				// 	this.height = 120;//data[0].height;
				// }).exec();
				this.height = len * 40 -120;
			},
			getToDetail(item) {
				// const ext = item.content.substr(item.content.lastIndexOf(".")+1).toLowerCase();
				// if(ext == 'pdf') {
					let current = app.API.wx_api + item.File_URL;
					uni.showLoading({
						title: '正在加载文件...',
						mask: true
					})
					uni.downloadFile({
						url: current,
						filePath: wx.env.USER_DATA_PATH + "/" + `${item.RETAIN1}.pdf`,
						success: function(res) {
							uni.hideLoading();
							let filePath = res.filePath;
							uni.openDocument({
								filePath: filePath,
								fileType: 'pdf',
								showMenu: true,
								success: function(res) {
									console.log('打开文档成功')
								}
							});
						},
						fail() {
							uni.hideLoading();
						}
					});
				// } else {
				// 	uni.navigateTo({
				// 		url: `../product/detail?title=${item.title}&url=${item.content}`,
				// 		fail(e) {
				// 			console.log(e);
				// 		}
				// 	})
				// }
			},
			goProductTabView() {
				uni.switchTab({
				    url: '../product/index',
					fail(e) {
						console.log(e);
					}
				});
			},
			getRouterView(dataType, menuItem) {
				console.log("menuItem:",menuItem," dataType：",dataType)
				
				//WebView webView= (WebView) findViewById(R.id.webview)
					
				if(menuItem.hasOwnProperty('ele')){
					uni.navigateTo({
					    url: `${menuItem.path}?dataType=${dataType}&ele=${menuItem.ele}&eleName=${menuItem.name}`,
						fail(e) {
							console.log(e);
						}
					})
				}
				
				
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #E6EDF4;
	}
	.container {
		padding: 0 10px 10px;
	}
	.con-box-notices {
		height: 72rpx;
		margin: 20rpx 0 0;
		border-radius: 30rpx;
		overflow: hidden;
	}
	.city-weather_current {
		height: 90rpx;
		padding: 30rpx 50rpx 40rpx;
		margin-bottom: 40rpx;
		margin-top: 20rpx;
		background: linear-gradient(180deg, #62B8F6 0%, #409BF0 77.96%);
		border-radius: 30rpx;
		display: flex;
		justify-content: space-between;
		color: #fff;
		font-family: Poppins;
		font-style: normal;
		.city-weather_current_city {
			min-width: 45%;
		}
		.icon-address {
			display: inline-block;
			width: 24rpx;
			height: 28rpx;
			margin-left: 10rpx;
			background: url('/static/images/shouye/loc.png') no-repeat 0 0;
		}
		.icon-address,
		.current__city {
			font-size: 32rpx;
		}
		.current__title {
			display: block;
			line-height: 60rpx;
			font-weight: bold;
			font-size: 36rpx;
		}
		.current__title-symbol {
			font-size: 32rpx;
		}
		.current__img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 10rpx;
		}
		.city-weather_current_tianqi {
			text-align: center;
			.current_tianqi {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
			.current_air {
				margin-top: 14rpx;
				font-size: 24rpx;
				.air-aqi {
					display: flex;
					.air-aqi__level {
						width: 50rpx;
						height: 32rpx;
						border-radius: 10rpx;
					}
				}
			}
			.current__title {
				line-height: 40rpx;
				font-weight: normal;
				font-size: 24rpx;
			}
		}
	}
	.con-box {
		margin-top: 10px;
		background-color: #fff;
		border-radius: 30rpx;
		overflow: hidden;
		.box-header {
			height: 72rpx;
			line-height: 72rpx;
			background-color: #F2F5F9;
			overflow: hidden;
			.box-header__title {
				float: left;
				overflow: hidden;
				.header__title-text {
					font-weight: bold;
					font-size: 32rpx;
					color: #000000;
				}
				.header__title-tip {
					float: left;
					width: 44rpx;
					height: 44rpx;
					line-height: 44rpx;
					text-align: center;
					background-color: rgba(245, 159, 30, .2);
					border-radius: 4rpx;
					margin: 14rpx 20rpx 0rpx 30rpx;
				}
				image {
					width: 28rpx;
					height: 28rpx;
					vertical-align: middle;
				}
			}
			.box-header__more {
				float: right;
				margin-right: 20rpx;
				font-size: 26rpx;
				color: #38A1E8;
			}
		}
		.box-container {
			padding: 10rpx 0;
			overflow: hidden;
			.box-container__list {
				padding: 0 40rpx;
				max-height: 240rpx;
				overflow-y: auto;
				overflow-x: hidden;
				.list_item {
					height: 80rpx;
					line-height: 80rpx;
					font-size: 32rpx;
					color: #666666;
					.list_item__title {
						display: inline-block;
						width: 95%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.list_item__img {
						width: 20rpx;
						height: 20rpx;
						float: left;
						margin-top: 30rpx;
						margin-right: 10rpx;
					}
					.list_item__date {
						float: right;
					}
				}
			}
		}
	}
	.con-box-products {
		margin-top: -20rpx;
		box-shadow: none;
		.box-container {
			max-height: 240rpx;
		}
	}
	.con-box-actual {
		.box-header {
			.header__title-tip {
				background-color: rgba(56, 161, 232, .2) !important;
			}
		}
	}
	.subMenu-item {
		float: left;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		&:nth-child(3n) {
			border-right: 0;
		}
		.name {
			display: block;
			font-size: 32rpx;
			width: 100%;
			margin-top: 10rpx;
			text-align: center;
			color: #666666;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space:nowrap;
		}
		.img {
			width: 96rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: #F2F5F9;
			border-radius: 10rpx;
			text-align: center;
			image {
				height: 50rpx;
				vertical-align: middle;
			}
		}
	}
	.con-box-forecast {
		.box-header {
			.header__title-tip {
				background-color: rgba(30, 245, 155, .2) !important;
			}
		}
		.subMenu-item {
			.img {
				background: #EDFBF6;
			}
		}
	}
	
</style>
