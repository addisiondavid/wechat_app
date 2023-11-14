<template>
	<view class="container">
		<view class="city-weather_current">
			<view class="city-weather-current-day city-weather-current-cloudy-day" v-if="basic">
				<view class="row city-weather-current__source">
					<view class="current-location" @click="goToSearch">
						<text>{{currentCity}}</text>
						<text class="sanjiao"></text>
					</view>
				</view>
				<view class="row city-weather-current__condition">
					<view class="condition__wea-img">
						<image :src="weaImg" mode="heightFix"></image>
					</view>
					<view class="condition__wea-info">
						<view class="wea-info__date">
							<text>{{infoDate.week}}</text>
							<text class="date-split-line"></text>
							<text>{{infoDate.date}}</text>
						</view>
						<view class="wea-info__tmp">
							<text class="condition__tmp">{{basic['TEM']}}</text>
							<text class="condition__unit"> ℃</text>
						</view>
						<view class="wea-info__data-time">
							<text>更新时间：{{basic['Time']}}</text>
						</view>
					</view>
					
				</view>
				<!-- <view class="row">
					<text>42&nbsp;优</text>
				</view> -->
				<view class="row city-weather-current__basic">
					<view class="list-block">
						<view class="column">
							<image src="../../static/images/weather/feng.png" mode="heightFix"></image>
						</view>
						<view class="column">
							<text class="basic_item__value">{{QueryWinDir(basic['WIN_D_S_Max'])}}{{QueryWinSpeed(basic['WIN_S_Max'])}}</text>
							<text>风</text>
						</view>
					</view>
					<view class="list-block">
						<view class="column">
							<image src="../../static/images/weather/qiya.png" mode="heightFix"></image>
						</view>
						<view class="column">
							<text class="basic_item__value">{{basic['PRS']}}hPa</text>
							<text>气压</text>
						</view>
					</view>
					<view class="list-block">
						<view class="column">
							<image src="../../static/images/weather/shidu.png" mode="heightFix"></image>
						</view>
						<view class="column">
							<text class="basic_item__value">{{basic['RHU']}}%</text>
							<text>湿度</text>
						</view>
					</view>
				</view>
				<!-- <view class="row city-weather-current__near">
					<text class="iconfont icon-address"></text>
					<text class="title near__title">临近预报</text>
					<text class="near__tip">未来两小时无降水</text>
				</view> -->
			</view>
		</view>
		<view class="city-weather_nearforecast" v-if="nearForcestData">
			<view class="title nearforecast__title">
				<text>逐小时预报</text>
			</view>
			<scroll-view scroll-x="true" scroll-with-animation>
				<view class="nearforecast__list">
					<view class="nearforecast__list_item" v-for="(itemData,index) in nearForcestData" :key="itemData['Validtime']">
						<view class="list_item_time">{{formatNearForcestData(itemData['Validtime']).time}}</view>
						<!-- <view class="list_item_wea">
							<image :src="'/static/images/weather/'+ formatNearForcestData(itemData['Validtime'], itemData['WEP']).img +'.png'"></image> 
						</view>-->
						<view class="list_item_temp">{{itemData['TEM']?parseFloat(itemData['TEM']).toFixed(1):'--'}}℃</view>
						<view class="list_item_ws">{{QueryWinS(itemData['WIN_U'], itemData['WIN_V'])}}</view>
						<view class="list_item_wd">
							<!-- <image src=""></image> -->
							{{QueryWinD(itemData['WIN_U'], itemData['WIN_V'])}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="city-weather_sevenforecast" v-if="JSON.stringify(sevenData) != '{}'">
			<view class="title">
				<text>逐日预报</text>
			</view>
			<scroll-view class="days-wrap" scroll-x="true" scroll-with-animation>
				<view class="days" :style="{width: sevenData.daysWidth}" >
					<view  class="days-item" :class="item.isToday ? 'today-bg' : ''" :style="{width: item.width}"  v-for="item in sevenData.day7" :key="item.date">
						<view class="top-wrap">
							<view class="top">
								<view v-if="!item.isToday" class="week">{{item.week}}</view>
								<view v-else class="week">
									<text class="we-today">今</text>
								</view>
								<view class="date">{{item.date}}</view>
								<view class="wea"> {{item['wea'][0]}}</view>
								<image class="img" :src="item.src[0]"></image>
							</view>
						</view>
						<view class="temp-echart-bg"></view>
						<view class="bottom-wrap">
							<view class="bottom">
								<image class="img" :src="item.src[1]"></image>
								<view class="wea" v-if="item"> {{item['wea'][1]}}</view>
								<view class="win" v-if="item">{{QueryWinDir(item['win'])}}</view>
								<view class="speed" v-if="item">{{QueryWinSpeed(item['speed'])}}</view>
							</view>
						</view>
					</view> 
					<view class="temp-echart-view">
					    <ec-canvas ref="ec-canvas" class="temp-echart" id="temp-echart" canvas-id="temp-echart" :ec="ec"></ec-canvas>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="city-weather_airquality" v-if="airqualityData">
			<view class="title" @click="toogleAirqualityState">
				<text>空气质量</text>
				<!-- <text class="airqualityState" v-if="airqualityState">展开》</text>
				<text class="airqualityState" v-else>收起》</text> -->
			</view>
			<view class="airquality-wrap clear">
			    <view class="airquality" v-for="(item, index) in airqualityData" v-if="index < airqualityStateLength" :key="item.name" :style="item.style">
					<!-- <image class="img" :src="item.src"></image> -->
			        <text class="name">{{GetEleName(item.name)}}</text>
			        <text class="value">{{DataCheck(item.value)}}</text>
			    </view>
			</view>  
		</view>
	</view>
</template>

<script>
	import * as echarts from '@/plugins/echarts/echarts.js';
	import timeTransform from '@/plugins/tools/timeTransform.js';
	import { queryWeather, queryWeather2, queryWinD, queryWinS,queryWinSpeed,queryWinDir,dataCheck,getEleName } from '@/plugins/weather/weather.js';
	
	const app = getApp().globalData;
	export default {
		data() {
			return {
				basic: {},
				currentCity: app.BASE_CONFIG.location.city,
				infoDate: {
					week: timeTransform.getWeekDate(),
					date: new Date().Format('MM月dd日')
				},
				nearForcestData: null,
				nearForcestDate: [],
				weaImg: null,
				BJDate: new Date(),
				sevenData: {},
				ec: {
					disableTouch: true,
					lazyLoad: true
				},
				QueryWeather: queryWeather,
				QueryWeather2: queryWeather2,
				QueryWinD: queryWinD, 
				QueryWinS: queryWinS,
				QueryWinDir:queryWinDir,
				QueryWinSpeed:queryWinSpeed,
				DataCheck:dataCheck,
				GetEleName:getEleName,
				airqualityData: null,
				airqualityState: true,
				airqualityStateLength: 0
			}
		},
		onShow: function() {
			// 动态设置BarTitle
			// uni.setNavigationBarTitle({
			// 　　title: app.BASE_CONFIG.location.city
			// });
			
			this.currentCity = app.BASE_CONFIG.location.city;
			
			uni.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
			this.getNow((data) => {
				uni.hideToast();
				this.basic = data.DS[0];
				this.basic['Time'] = this.basic['Datetime'].substr(6,2)+'日'+this.basic['Datetime'].substr(8,2)+'时';
				//console.log("thisBasic:",this.basic)
			});
			
			this.getNearForcest((data) => {
				
				uni.hideToast();  
				//let timeRange_str = this.getTimeRangeStrByCurrentTime();
				//this.nearForcestData = data.Tqyb.Data.slice(timeRange_str);
				this.nearForcestData = data.slice(1,24);	
				//console.log("nearForcestData:",this.nearForcestData)
			});
			
			this.getSevenForecast((data => {
				console.log("newSevenData",data)
				uni.hideToast();
				this.sevenData = this.formatSevenDayData(data);
				console.info("sevenData",this.sevenData)
				this.weaImg = `/static/images/weather/${(timeTransform.isDaylight() ? queryWeather(this.sevenData.day7[0].wea[0], 'n').image : queryWeather(this.sevenData.day7[0].wea[1], 'd') ).image}.png`;
				
				this.$nextTick(() => {
					var query = uni.createSelectorQuery().in(this);
					query.select('.temp-echart').boundingClientRect(res => {
						this.init7DayEchart(this.sevenData.day7, res.width, res.height);
					}).exec();
				})
			}))
			
			this.getAirqualityForecast((data => {
				uni.hideToast();
				this.airqualityData = this.formatAirqualityData(data);
				this.airqualityStateLength = this.airqualityData.length;
			}));
		},
		methods: {
			getNow(fn) {
				const UTCDate = timeTransform.toTimeWorld(this.BJDate),
					  endDate = UTCDate.Format('yyyyMMddhhmmss'),
					  startDate = timeTransform.getAppointHourStr(UTCDate, -2, 'yyyyMMddhhmmss');
				uni.request({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeRangeAndRadius?interfaceId=getEleByTimeRangeAndRadius&dataCode=SURF_NX_MUL_HOR&timeRange=%5B${startDate},${endDate}%5D&elements=Datetime,Station_Id_C,TEM,PRE_1h,PRE_24h,WIN_D_S_Max,WIN_S_Max,PRS,RHU&distance=5000&orderBy=Datetime:desc`,
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
						console.log("res",res)
						if(res && res.data && res.data.DS && res.data.DS.length > 0){
							for (let i = 0; i < res.data.DS.length; i++) {
								if(res.data.DS[i]['PRS']!='999999'||res.data.DS[i]['PRS']!=999999){
									fn(res.data);
									break;
								}
							}
							
						}   
					}
				})	
			},
			async getNearForcest(fn) {
				
				let _self = this;
				for(let i=0;i>-6;i--){
					_self.nearForcestData = null;
					const startDate = timeTransform.getAppointHourStr(new Date(), i, 'yyyyMMddhh0000');
					const yubao_24h = await this.myRequest({
						url: `${app.API.wx_api}/queryUdi/getEleByTime?dataCode=SEVP_NX_WEFC_RFFC&interfaceId=getEleByTime&times=${startDate}&elements=Validtime,TEM,WIN_U,WIN_V&eleValueRanges=Station_Id_C:E${(Math.round(Number(app.BASE_CONFIG.location.lon) / 0.1) * 0.1).toFixed(3)}_N${(Math.round(Number(app.BASE_CONFIG.location.lat) / 0.1) * 0.1).toFixed(3)}`
					});
					if(yubao_24h.data.DS.length>0){
						fn(yubao_24h.data.DS);
						break;
					}
					
				}
			},
			formatNearForcestData(valid, wep) {
				//console.log("valid",valid)
				let currentHour = new Date().getHours(),
				    time = null;
				if(currentHour + valid === 24) {
					time = timeTransform.getAppointHourStr(new Date(), valid, 'MM月dd日');
				} else {
					time = timeTransform.getAppointHourStr(new Date(), valid, 'hh:00');
				}
				
				console.log("time",time)
					//date = new Date(timeTransform.getAppointHourStr(new Date(new Date().Format('yyyy/MM/dd 08:00:00')), valid, 'yyyy/MM/dd hh:mm:ss'));
				//let img = (timeTransform.isDaylight(date) ? queryWeather2(wep, 'n') : queryWeather2(wep, 'd')).image;
				return {
					//img,
					time
				};
			},
			getTimeRangeStrByCurrentTime() {
				const current_h = new Date().getHours();
				let timeRange_conf = '';
				if(current_h >= 18) {
					timeRange_conf = 2;
				} else if(current_h > 13) {
					timeRange_conf = 1;
				} else if (current_h > 7) {
					timeRange_conf = 0;
				} else if (current_h >= 0) {
					timeRange_conf = 3;
				}
				return timeRange_conf;
			},
			getSevenForecast(fn) {
				let _self = this;
				const currHour = this.BJDate.getHours();
				let startDate;
				if(currHour < 8) {
				    startDate = timeTransform.getAppointDateStr(this.BJDate, -1, 'yyyyMMdd120000');
				} else if(currHour >= 8 && currHour < 20) {
				    startDate = timeTransform.getAppointDateStr(this.BJDate, 0, 'yyyyMMdd000000');
				} else {
				    startDate = timeTransform.getAppointDateStr(this.BJDate, 0, 'yyyyMMdd120000');
				}  
				uni.request({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeAndAreaCode?dataCode=SEVP_NX_WEFC_RFFC&interfaceId=getEleByTimeAndAreaCode&times=${startDate}&elements=Station_Id_C,Datetime,Validtime,TEM_Max_24h,TEM_Min_24h,WEP_Past_12h,WIN_PD_12h,WIN_S_Max_12h&areacode=`+app.BASE_CONFIG.location.curid.substr(0,6)+`&eleValueRanges=Validtime:12,24,36,48,60,72,84,96,108,120,132,144,156,168;Prod_Code:SPCC`,
					header: {'Content-Type': 'application/json'},
					dataType: 'json',
					success: function(res) {
						if(res.data.returnCode == 0) fn(res.data.DS);
					}
				})
			},
			
			formatSevenDayData(sevenData) {
				//console.log("sevenData",sevenData)
				const width = Math.ceil(app.systemInfo.windowWidth / 5);
				let WIN_PD_12h,WEP_Past_12h,WIN_S_Max_12h,Station_Id_C;
				let tempMin=null,tempMax=null,win=null,speed=null,wea=null;
				const day7 = [];
				for(let sd in sevenData){
					let i=sevenData[sd];
					if(Station_Id_C==null){
						Station_Id_C=i['Station_Id_C'];
					}else if(Station_Id_C!=i['Station_Id_C']){
						continue;
					}
					if(i['Validtime']%24!=0){
						WIN_PD_12h=parseInt(i['WIN_PD_12h']);
						WIN_S_Max_12h=parseInt(i['WIN_S_Max_12h']);
						WEP_Past_12h=(timeTransform.isDaylight() ? queryWeather2(i['WEP_Past_12h'], 'n') : queryWeather2(i['WEP_Past_12h'], 'd')).name;
						//continue;
					}else{
						//console.log("i['Validtime']",i['Validtime'])
						
						const date = timeTransform.toTimeZone(i['Datetime'], parseInt(i['Validtime'])-24, 'MM月dd日'),
							  tempMin = parseInt(i['TEM_Min_24h']),
							  tempMax = parseInt(i['TEM_Max_24h']),
							  //win = i['WIN_PD_12h'],
							  win=parseInt(i['TEM_Max_24h']),
							  speed = parseInt(i['WIN_S_Max_12h']),
							  wea = [WEP_Past_12h, (timeTransform.isDaylight() ? queryWeather2(i['WEP_Past_12h'], 'n') : queryWeather2(i['WEP_Past_12h'], 'd')).name];
						day7.push({
							date,
							tempMax,
							tempMin,
							win,
							speed,
							wea,
							width: width + 'px',
							src: [`/static/images/weather/${queryWeather(wea[0], 'd').image}.png`,
							`/static/images/weather/${queryWeather(wea[1], 'n').image}.png`],
						});
					}
				}
				return {
				    daysWidth: width * 7 + 'px',
				    day7
				}
			},
			
			init7DayEchart(data, width, height) {
				console.info(data,width,height)
			    const low = [];
			    const high = [];
			    let min = 9999;
			    let max = -9999;
			    for (let i = 0; i < data.length; i++) {
					min = Math.min(data[i].tempMin, min);
					max = Math.max(data[i].tempMax, max);
					low.push(data[i].tempMin);
					high.push(data[i].tempMax);
			    }
				
			    this.$refs['ec-canvas'].init((canvas) => {
					const _this = this
					
					const chart = echarts.init(canvas, null, {
						width: width,
						height: height
					});

					const option = {
						calcubale: false,
						animation: true,
						xAxis: [{
						    type: "category",
						    boundaryGap: false,
						    splitLine: false,
						    axisLabel: false,
						    splitArea: false,
						    axisLine: false,
						    axisTick: false,
						}],
						yAxis: [{
						    splitLine: false,
						    scale: false,
						    allowDecimals: false,
						    splitNumber: "4",
						    min: min * 1,
						    max: max * 1,
						    type: "value",
						    show: false,
						    boundaryGap: false,
						    splitArea: false,
						    axisLine: false,
						    axisTick: false,
						}],
						grid: {
						    x: 40,
						    x2: 40,
						    y: 40,
						    y2: 40,
						    borderWidth: 0
						},
						series: [{
						    type: "line",
						    smooth: true,
						    symbol: "circle",
						    symbolSize: 5,
						    itemStyle: {
								color: "#F59F1E"
						    },
							lineStyle: {
								color: "#F59F1E",
								width: 1
							},
							label: {
								color: "#fff",
								show: true,
								fontSize: 14,
								position: "top",
								formatter: '{c}°'
							},
							data: high
						}, {
							type: "line",
							smooth: true,
							symbol: "circle",
							symbolSize: 5,
							itemStyle: {
								color: "#43B3FF",
							},
							lineStyle: {
								color: "#43B3FF",
								width: 1
							},
							label: {
								color: "#fff",
								fontSize: 14,
								show: true,
								position: "bottom",
								formatter: '{c}°'
							},
							data: low
						}],
						animation: false
					};
					chart.setOption(option);
					this.tempEchart = chart;
					
					return chart;
			    });
			},
			getAirqualityForecast(fn) {
				let _self = this;
				const UTCDate = timeTransform.toTimeWorld(this.BJDate),
					  endDate = UTCDate.Format('yyyyMMddhhmmss'),
					  startDate = timeTransform.getAppointHourStr(UTCDate, -12, 'yyyyMMddhhmmss');
				uni.request({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeRangeAndRadius?interfaceId=getEleByTimeRangeAndRadius&dataCode=CAWN_MEE_AIR_EMO&timeRange=%5B${startDate},${endDate}%5D&elements=V_QUAL,V_PPOLLU,V15823,V15810,PM2p5_Densty,PM10_Densty_Fore&distance=15000&orderBy=Datetime:desc`,
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
				 		_self.airqualityData = null;	
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
			formatAirqualityData(airqualityData) {
			    const style = `
			        width: ${((app.systemInfo.windowWidth - 20) / 4)}px;
			        height: ${((app.systemInfo.windowWidth - 20) / 4)}px 
			    `
				const key_map = {
					'AQI等级': 'AQIDJ',
					'AQI指数': 'AQIZS',
					'首要污染物': 'SYWYW'
				};
				const _data = [];
				for(let key in airqualityData) {
					if(key != '预报时效') {
						_data.push({
							name: key,
							value: airqualityData[key],
							style: style,
							src: `/static/images/airquality/${key_map[key] || key}.png`
						});
					}
				}
			    return _data;
			},
			goToSearch() {
				uni.navigateTo({
				    url: './search',
					fail(e) {
						console.log(e);
					}
				})
			},
			toogleAirqualityState(e) {
				// const _state = this.airqualityState;
				// const _length = _state ? 8 : this.airqualityData.length;
				// this.airqualityState = !_state;
				// this.airqualityStateLength = _length;
			},
			// 实现request请求的封装，便于实现同步请求
			myRequest(options) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: options.url,//app.API.wx_api + options.url,
						data: options.params || {},		
						method: options.method || 'GET',
						success: (res) => {
							resolve(res);
						},
						fail: (err) => {
							uni.showToast({ title: '网络错误，稍后重试！', icon: 'error', duration: 3000 });
							reject(null);
						}
					});
				});
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100vh;
		background: linear-gradient(180deg, #62B8F6 0%, #2C79C1 77.96%);
	}
	.container {
		padding: 10px 10px 5px;
		background: linear-gradient(180deg, #62B8F6 0%, #2C79C1 77.96%);
	}
	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333333;
	}
	.city-weather_current {
		padding: 0 10px;
		background: rgba(10, 47, 73, 0.3);
		border-radius: 15px;
		color: #fff;
		.city-weather-current-day {
			padding-top: 15px;
			.row {
				text-align: center;
			}
			.city-weather-current__source {
				padding-right: 10px;
				margin-bottom: 15px;
				text-align: right;
				font-size: 24rpx;
				.current-location {
					text-align: center;
					.sanjiao {
						display: inline-block;
						width: 14px;
						height: 14px;
						background: url(../../static/images/weather/sanjiao.png) no-repeat 0 0;
						vertical-align: sub;
					}
				}
			}
			.city-weather-current__condition {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 15px;
				font-size: 28rpx;
				.condition__wea-img {
					image {
						width: 200rpx;
						max-height: 100px;
					}
				}
				.condition__wea-info {
					> view {
						margin-bottom: 15px;
					}
					text {
						font-family: "Poppins";
						font-style: normal;
						font-weight: normal;
						font-size: 32rpx;
					}
					.wea-info__date {
						.date-split-line {
							display: inline-block;
							width: 2px;
							height: 20px;
							margin: 0 15px;
							background-color: #fff;
							vertical-align: sub;
						}
					}
					.wea-info__tmp {
						height: 55px;
						line-height: 55px;
						.condition__tmp {
							font-weight: 600;
							font-size: 130rpx;
						}
						.condition__unit {
							font-size: 100rpx;
						}
					}
					.wea-info__data-time {
						text {
							font-size: 28rpx;
						}
					}
				}
			}
			.city-weather-current__basic {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 0 5px;
				border-top: #fff solid 1px;
				image {
					width: 32px;
					height: 32px;
					vertical-align: middle;
				}
				.list-block {
					display: flex;
					align-items: center;
					padding: 10px 0 20px;
					position: relative;
					font-size: 32rpx;
					text {
						display: block;
						font-family: "Poppins";
						font-style: normal;
						font-weight: normal;
						font-size: 28rpx;
					}
					.column {
						margin: 0 3px;
					}
				}
			}
			.city-weather-current__near {
				padding: 10px 10px 20px;
				text-align: left;
				.near__title {
					margin-right: 10px;
					color: #FFFFFF;
				}
				.near__tip {
					font-size: 32rpx;
				}
			}
		}
	}
	.city-weather_nearforecast {
		margin-top: 15px;
		padding: 15px;
		background: rgba(10, 47, 73, 0.3);
		border-radius: 15px;
		.nearforecast__title {
			margin-bottom: 10px;
			font-family: 'Poppins';
			font-style: normal;
			font-size: 32rpx;
			font-weight: bold;
			color: #fff;
		}
		.nearforecast__list {
			display: flex;
			.nearforecast__list_item {
				margin: 0 36rpx;
				text-align: center;
				color: #fff;
				> view {
					margin: 2px 0;
					font-size: 28rpx;
					white-space: nowrap;
				}
				image {
					width: 26px;
					height: 26px;
				}
				.list_item_wea {
					height: 26px;
					margin: 0;
				}
				.list_item_time {
					white-space: nowrap;
					font-size: 24rpx;
				}
				.list_item_temp {
					font-size: 36rpx;
					color: #fff;
				}
				.list_item_ws {
					color: #fff;
				}
			}
		}
	}
	.city-weather_sevenforecast {
		padding: 15px 15px 0;
		margin-top: 15px;
		background: rgba(10, 47, 73, 0.3);
		border-radius: 15px;
		.title {
			margin-bottom: 10px;
			font-family: 'Poppins';
			font-style: normal;
			font-size: 32rpx;
			font-weight: bold;
			color: #fff;
		}
		.days-wrap {
			width: 100%;
			.days {
				position: relative;
				display: flex;
				.days-item {
					float: left;
					width: 20%;
					text-align: center;
					padding: 15px 0;
					font-size: 28rpx;
				}
				.week {
					margin-bottom: 5px;
					color: #fff;
				}
				.we-today {
					color: #fff;
					display: inline-block;
					width: 20px;
					height: 20px;
					line-height:20px;
					border-radius: 50%;
					background-color: rgb(106, 177, 224);
				}
				.date {
					margin-bottom: 5px;
					color: #fff;
					font-size: 24rpx;
				}
				.wea {
					white-space: nowrap;
					margin-bottom: 5px;
					color: #fff;
				}
				.win,
				.speed {
					white-space: nowrap;
					font-size: 24rpx;
					color: #fff;
				}
				.speed {
					margin-bottom: 5px;
				}
				.img {
					width: 20px;
					height: 20px;
					margin: auto;
				}
				.temp-echart-view {
					position: absolute;
					width: 100%;
					height: 130px;
					top: 90px;
					left: 0;
					right: 0;
					.temp-echart {
						width: 100%;
						height: 100%;
					}
				}
			}
			.temp-echart-bg {
				width: 100%;
				height: 120px;
			}
		}
	}
	.city-weather_airquality {
		padding: 15px 0 5px;
		margin: 15px 0;
		background: rgba(10, 47, 73, 0.3);
		border-radius: 15px;
		font-family: Poppins;
		font-style: normal;
		.title {
			padding: 0 15px;
			font-family: 'Poppins';
			font-style: normal;
			font-size: 32rpx;
			font-weight: bold;
			color: #fff;
		}
		.airquality-wrap {
			overflow: hidden;
			.airquality {
				float: left;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.name {
					display: block;
					font-size: 28rpx;
					width: 100%;
					text-align: center;
					color: #fff;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space:nowrap;
				}
				.value {
					display: block;
					font-size: 22rpx;
					color: #fff;
				}
				.img {
					width: 25px;
					height: 25px;
					margin-bottom: 5px;
				}
			}
		}
		
	}
	
</style>