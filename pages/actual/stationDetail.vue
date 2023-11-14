<template>
	<view class="container">
		<view class="station-title">
			<text>{{stat_title}}</text>
		</view>
		<view class="station-h24-box">
			<view class="h24-box__title">
				<text>近24小时{{curr_ele_conf.name}}统计与{{curr_ele_conf.name}}预报</text>
			</view>
			<scroll-view class="h24-box__wrap" scroll-x="true" scroll-with-animation>
				<view class="temp-echart-view">
				    <ec-canvas ref="ec-canvas" class="temp-echart" id="temp-echart" canvas-id="temp-echart" :ec="ec"></ec-canvas>
				</view>
			</scroll-view>
		</view>
		<view class="station-d7-box" >
			<view class="d7-box__title" :class="{'hide7Day': curr_ele_conf.d7_ac_ele==null}">
				<text>近7天{{curr_ele_conf.name}}统计</text>
			</view>
			<scroll-view class="d7-box__wrap" scroll-x="true" scroll-with-animation>
				<view class="temp-d7-echart-view">
				    <ec-canvas ref="ec-d7-canvas" class="temp-d7-echart" id="temp-d7-echart" canvas-id="temp-d7-echart" :ec="ec"></ec-canvas>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import * as echarts from '@/plugins/echarts/echarts.js';
	import timeTransform from '@/plugins/tools/timeTransform.js';
	
	const app = getApp().globalData;
	export default {
		data() {
			return {
				ec: {
					disableTouch: true,
					lazyLoad: true
				},
				stat_id: -1,
				stat_title: '',
				curr_ele: '',
				curr_sub_ele: '',
				curr_ele_conf: null,
				eleName_conf: {
					PRE: {
						name: '降水',
						chartType: 'bar',
						ac_ele: 'PRE_1h',
						ac_datacode:'SURF_NX_MUL_HOR',
						fr_datacode:'SEVP_NX_WEFC_RFFC',
						fr_ele: 'PRE_PRE_Fore',
						d7_ac_ele: ['PRE_Time_0808'],
						d7_fr_ele: ['PRE_24h'],
						chartYName: '︵\nm\nm\n︶\n量\n水\n降'
					},
					TEM: {
						name: '气温',
						chartType: 'line',
						ac_ele: 'TEM',
						fr_ele: 'TEM',
						ac_datacode:'SURF_NX_MUL_HOR',
						fr_datacode:'SEVP_NX_WEFC_RFFC',
						d7_ac_ele: ['TEM_Max','TEM_Min'],
						d7_fr_ele: ['TEM_Max_24h', 'TEM_Min_24h'],
						chartYName: '︵\n℃\n︶\n度\n温'
					},
					WIN: {
						name: '风速',
						chartType: 'line',
						ac_ele: 'WIN_S_Max',
						fr_ele: 'WIN_S',
						ac_datacode:'SURF_NX_MUL_HOR',
						fr_datacode:'SEVP_NX_WEFC_RFFC',
						d7_ac_ele: ['WIN_S_Max'],
						d7_fr_ele: ['WIN_S'],
						chartYName: '︵\ns\n.\nm\n︶\n速\n风'
					},
					V_QUAL: {
						name: 'AQI',
						chartType: 'bar',
						ac_ele: 'V_QUAL',
						ac_datacode:'CAWN_MEE_AIR_EMO',
						chartYName: '\nI\nQ\nA'
					},
					PM2p5_Densty: {
						name: 'PM2.5',
						chartType: 'line',
						ac_ele: 'PM2p5_Densty',
						ac_datacode:'CAWN_MEE_AIR_EMO',
						chartYName: '\n5\n.\n2\nM\nP'
					},
					PM10_Densty_Fore: {
						name: 'PM10',
						chartType: 'line',
						ac_ele: 'PM10_Densty_Fore',
						ac_datacode:'CAWN_MEE_AIR_EMO',
						chartYName: '\n0\n1\nM\nP'
					}
				}
			}
		},
		onLoad: function(option) {
			
			const { Station_Id_C, V_CITY//Station_Name is this wrong
			,ele, subEle } = option;
			
			console.log("3:",ele)
			console.log("4:",subEle)
			this.stat_id = Station_Id_C;
			//this.stat_title = Station_Name;
			this.stat_title = V_CITY
			this.curr_ele = ele;
			this.curr_sub_ele = subEle;
			this.curr_ele_conf = this.eleName_conf[this.curr_ele] || this.eleName_conf[this.curr_sub_ele];
		},
		onShow: function() {
			const query1 = uni.createSelectorQuery().in(this);
			query1.select('.temp-echart').boundingClientRect(res => {
				this.get24hData(res);
			}).exec();
			
			if(this.curr_ele_conf.d7_ac_ele != null){
				query1.select('.temp-d7-echart').boundingClientRect(res => {
					this.get7dData(res);
				}).exec();
			}else{
				query1.select('.station-d7-box').hide();	
			}
		},
		methods: {
			// 24小时实况数据
			async get24hData(res) {
				//this one is undefined
				console.log("empty2?",this.curr_ele_conf)
				const UTCDate = timeTransform.toTimeWorld(new Date()),
					  currDate = UTCDate.Format('yyyyMMddhhmmss'),
					  prev24Date = timeTransform.getAppointHourStr(UTCDate, -24, 'yyyyMMddhhmmss');
				const shikuang_24h = await this.myRequest({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeRangeAndStaIds?dataCode=${this.curr_ele_conf.ac_datacode}&interfaceId=getEleByTimeRangeAndStaIds&StaIds=${this.stat_id}&timeRange=%5B${prev24Date},${currDate}%5D&elements=Datetime,${this.curr_ele_conf.ac_ele}&orderBy=Datetime`
				});
				if(this.curr_ele_conf.fr_datacode != null){
					const curr_valid = parseInt(UTCDate.Format('hh'));
					let yubaoDate = timeTransform.getAppointHourStr(UTCDate, 0, 'yyyyMMdd000000');
					if(curr_valid > 20 || curr_valid == 0) {
						yubaoDate = timeTransform.getAppointDateStr(UTCDate, -1, 'yyyyMMdd120000');
					}
					
					const yubao_24h = await this.myRequest({
						url: `${app.API.wx_api}/queryUdi/getEleByTimeAndStaIds?dataCode=${this.curr_ele_conf.fr_datacode}&interfaceId=getEleByTimeAndStaIds&times=${yubaoDate}&StaIds=${this.stat_id}&elements=${this.curr_ele_conf.fr_ele},Validtime,Datetime&orderBy=Validtime&eleValueRanges=Prod_Code:SCMOC`
					});
					this.init24hEchart([shikuang_24h.data.DS,yubao_24h.data.DS], res.width, res.height);
				}
				this.init24hEchart([shikuang_24h.data.DS,[]], res.width, res.height);
			},
			// 7天实况数据
			async get7dData(res) {
				const UTCDate = timeTransform.toTimeWorld(new Date()),
					  currDate = UTCDate.Format('yyyyMMddhhmmss'),
					  prev1DDate = timeTransform.getAppointDateStr(UTCDate, -1, 'yyyyMMdd235959'),
					  prev8DDate = timeTransform.getAppointDateStr(UTCDate, -8, 'yyyyMMddhhmmss');
					  
				const shikuang_7d = await this.myRequest({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeRangeAndStaIds?dataCode=SURF_NX_MUL_DAY&interfaceId=getEleByTimeRangeAndStaIds&StaIds=${this.stat_id}&timeRange=%5B${prev8DDate},${prev1DDate}%5D&elements=Datetime,Station_Id_C,${this.curr_ele_conf.d7_ac_ele.join(',')}&orderBy=Datetime`
				});
				
				const yubao_7d = await this.myRequest({
					url: `${app.API.wx_api}/queryUdi/getEleByTimeAndStaIds?dataCode=SEVP_NX_WEFC_RFFC&interfaceId=getEleByTimeAndStaIds&times=${UTCDate.Format('yyyyMMdd000000')}&StaIds=${this.stat_id}&elements=${this.curr_ele_conf.d7_fr_ele.join(',')},Validtime,Datetime&orderBy=Validtime&eleValueRanges=Prod_Code:SCMOC`
				});
				this.init7dEchart([shikuang_7d.data.DS, yubao_7d.data.DS], res.width, res.height);
			},
			init24hEchart(dataArray, width, height) {
			    let axisData =[], yxisData = [];
				// 处理实况数据
				if(dataArray[0].length > 0 ) {
					dataArray[0].forEach((data) => {
						axisData.push(timeTransform.toTimeZone(data.Datetime, 0, 'hh:mm'));
						if(data[this.curr_ele_conf.ac_ele]==999999){
							yxisData.push(0);
						}else if(data[this.curr_ele_conf.ac_ele]=='优'){
							yxisData.push({value: 10,itemStyle: {color: '#1EF875'}},);
						}else if(data[this.curr_ele_conf.ac_ele]=='良'){
							yxisData.push({value: 10,itemStyle: {color: '#E4F33E'}},);
						}else if(data[this.curr_ele_conf.ac_ele]=='轻度污染'){
							yxisData.push({value: 10,itemStyle: {color: '#E4993E'}},);
						}else if(data[this.curr_ele_conf.ac_ele]=='中度污染'){
							yxisData.push({value: 10,itemStyle: {color: '#F10617'}},);
						}else if(data[this.curr_ele_conf.ac_ele]=='重度污染'){
							yxisData.push({value: 10,itemStyle: {color: '#99074E'}},);
						}else if(data[this.curr_ele_conf.ac_ele]=='严重污染'){
							yxisData.push({value: 10,itemStyle: {color: '#860022'}},);
						}else{
							yxisData.push(data[this.curr_ele_conf.ac_ele]);
						}
					});
				}
				// 处理预报数据
				if(dataArray[1].length > 0) {
					const valid = (parseInt(new Date().Format('hh')) - 8) % 3;
					const data_yubao = dataArray[1].slice(valid, valid+24);
					data_yubao.forEach((data) => {
						axisData.push(timeTransform.toTimeZone(data.Datetime, data.Validtime, 'hh:mm'));
						yxisData.push(data[this.curr_ele_conf.fr_ele]==999999?0:data[this.curr_ele_conf.fr_ele]);
					});
				}
				let maxV = Math.ceil(Math.max(...yxisData));
				
				let curr_dataIndex = 0,
					curr_dataVal = 0;
			    this.$refs['ec-canvas'].init((canvas) => {
					const _this = this;
					
					const chart = echarts.init(canvas, null, {
						width: width,
						height: height
					});
					const option = {
						grid: {
							top: 10,
							left: 10,
							right: 5,
							bottom: 10,
							containLabel: true,
						},
						xAxis: [
							{
								type: 'category',
								boundaryGap: false,
								data: axisData,
								axisTick: {
									length: 10,
									//alignWithLabel: true,
								},
								axisLabel: {
									fontSize: 12,
									interval: 2,
									rotate: 45,
									color: '#7e7e7e'
								},
								axisLine: {
									onZero: false
								}
							},
							{
								type: 'category', 
								data: [
									{
										value: '实况',
										textStyle: {
											fontSize: 16,
											fontWeight: 100,
											lineHeight: 70,
											color: '#7e7e7e'
										}
									}
								],
								position : 'top',
								axisTick: {
									show: false
								},
								splitArea: {
									show: true,
									areaStyle: {
										color: ['#f4f9ff']
									}
								},
								axisLine: {
									onZero: false
								}
							}
						],
						yAxis: {
							type: 'value',
							name: this.curr_ele_conf.chartYName,
							max: maxV + 0.1,
							nameTextStyle: {
								fontSize: 12,
								nameLocation: 'left',
								padding: [200, 50, -170, 0]
							},
							splitLine: {
								show: false
							}
						},
						series: [{
							type: this.curr_ele_conf.chartType,
							data: yxisData,
							barWidth: 5,
							itemStyle: {
								normal: {
									color: '#96c97c'
								}
							},
							label: {
								show: false,
								position: 'top',
								textStyle: {
									color: '#000000',
								},
								formatter: function(params) {
									let chazhi = (maxV < 1 ? 0.1 : 1);
									if(Math.abs(params.data - curr_dataVal) > chazhi || params.dataIndex - curr_dataIndex > 2) {
										curr_dataIndex = params.dataIndex;
										curr_dataVal = params.data;
										return curr_dataVal;
									} else {
										return '';
									}
								}
							}
						}]
					};
					if(dataArray[1].length > 0) {
						option.xAxis[1].data.push({
							value: '预报',
							textStyle: {
								fontSize: 16,
								fontWeight: 100,
								lineHeight: 70,
								color: '#7e7e7e'
							}
						});
						option.xAxis[1].splitArea.areaStyle.color.push('#c5d9f2');
					}
					chart.setOption(option);
					
					return chart;
			    });
			},
			init7dEchart(dataArray, width, height) {
			    let axisData =[], yxisData = [], yxisData2 = [];
			    // 处理实况数据
			    if(dataArray[0].length > 0 ) {
					dataArray[0].forEach((data) => {
						axisData.push(timeTransform.toTimeZone(data.Datetime, 0, 'MM/dd'));
						let d = (data[this.curr_ele_conf.d7_ac_ele[0]] >= 500000 ? 0 : data[this.curr_ele_conf.d7_ac_ele[0]]);
						yxisData.push(d);
						if(this.curr_ele_conf.d7_ac_ele[1]) {
							let d2 = (data[this.curr_ele_conf.d7_ac_ele[1]] >= 500000 ? 0 : data[this.curr_ele_conf.d7_ac_ele[1]]);
							yxisData2.push(d2);
						}
					});
			    }
				// 处理预报数据
				if(dataArray[1].length > 0 ) {
					dataArray[1].forEach((data) => {
						if(data.Validtime % 24 == 0) {
							axisData.push(timeTransform.toTimeZone(data.Datetime, data.Validtime, 'MM/dd'));
							let d = (data[this.curr_ele_conf.d7_fr_ele[0]] >= 500000 ? 0 : data[this.curr_ele_conf.d7_fr_ele[0]]);
							yxisData.push(d);
							if(this.curr_ele_conf.d7_fr_ele[1]) {
								let d2 = (data[this.curr_ele_conf.d7_fr_ele[1]] >= 500000 ? 0 : data[this.curr_ele_conf.d7_fr_ele[1]]);
								yxisData2.push(d2);
							}
						}
					});
				}
				//check here for e-charts
			    this.$refs['ec-d7-canvas'].init((canvas) => {
					
					const _this = this;
					
					const chart = echarts.init(canvas, null, {
						width: width,
						height: height
					});
					console.log(chart)
					const option = {
						grid: {
							top: 10,
							left: 10,
							right: 5,
							bottom: 10,
							containLabel: true,
						},
						xAxis: [
							{
								type: 'category',
								boundaryGap: false,
								data: axisData,
								axisTick: {
									length: 10,
									//alignWithLabel: true,
								},
								axisLabel: {
									fontSize: 12,
									rotate: 45,
									color: '#7e7e7e'
								},
								axisLine: {
									onZero: false
								}
							},
							{
								type: 'category', 
								data: [
									{
										value: '实况',
										textStyle: {
											fontSize: 16,
											fontWeight: 100,
											lineHeight: 70,
											color: '#7e7e7e'
										}
									}
								],
								position : 'top',
								axisTick: {
									show: false
								},
								splitArea: {
									show: true,
									areaStyle: {
										color: ['#f4f9ff']
									}
								},
								axisLine: {
									onZero: false
								}
							}
						],
						yAxis: {
							type: 'value',
							name: this.curr_ele_conf.chartYName,
							nameTextStyle: {
								fontSize: 12,
								nameLocation: 'left',
								padding: [200, 50, -160, 0]
							},
							splitLine: {
								show: false
							}
						},
						series: [{
							type: this.curr_ele_conf.chartType,
							data: yxisData,
							barWidth: 10,
							itemStyle: {
								normal: {
									color: '#f3c265'
								}
							},
							label: {
								show: true,
								position: 'top',
								textStyle: {
									color: '#000000',
								}
							}
						}]
					};
					if(dataArray[1].length > 0) {
						option.xAxis[1].data.push({
							value: '预报',
							textStyle: {
								fontSize: 16,
								fontWeight: 100,
								lineHeight: 70,
								color: '#7e7e7e'
							}
						});
						option.xAxis[1].splitArea.areaStyle.color.push('#c5d9f2');
					}
					
					if(this.curr_ele_conf.d7_ac_ele[1]) {
						option.series.push({
							type: this.curr_ele_conf.chartType,
							data: yxisData2,
							barWidth: 10,
							itemStyle: {
								normal: {
									color: '#96c97c'
								}
							},
							label: {
								show: true,
								position: 'top',
								textStyle: {
									color: '#000000',
								}
							}
						});
					}
					chart.setOption(option);
					
					return chart;
			    });
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
		background-color: #FFFFFF;
	}
	.container {
		width: auto;
		padding: 10px;
		font-size: 32rpx;
	}
	.station-title {
		padding-bottom: 5px;
		margin-bottom: 10px;
		border-bottom: #333 solid 1px;
	}
	.h24-box__wrap {
		border-bottom: #333 solid 1px;
		.temp-echart-view {
			width: 100%;
			height: 320px;
			.temp-echart {
				width: 100%;
				height: 100%;
			}
		}
	}
	.station-d7-box {
		margin-top: 10px;
		.d7-box__wrap {
			.temp-d7-echart-view {
				width: 100%;
				height: 280px;
				.temp-d7-echart {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.hide7Day{
		display:none;
	}
</style>
