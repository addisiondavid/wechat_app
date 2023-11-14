<template>
	<view class="container">
		<view class="rank-main">
			<view class="rank-main__header">
				<!-- <template v-if="currenEle != 'PRE'"> -->
					<button class="rank_btn" v-if="rankType === 'desc'" type="default" @click="rankTypeChange">
						<image src="../../static/images/actual/jiangxu.png"></image>
						降序
					</button>
					<button class="rank_btn" v-else type="default" @click="rankTypeChange">
						<image src="../../static/images/actual/shengxu.png"></image>
						升序
					</button>
				<!-- </template> -->
				<text class="rank_search-time">{{dataTime}}234</text>
				<view class="rank_search-box">
					<uni-datetime-picker type="datetimerange" hide-second="true" border="true" @change="dateChange">
						<image src="../../static/images/actual/rili.png"></image>
						查询
					</uni-datetime-picker>
				</view>
			</view>
			<view class="rank-main__list">
				<view class="main__list-text">
					<text>共{{listData.length}}站点{{currenEle == 'PRE' ? '有降水': ''}}</text>
					<text>基于宁夏自治区28个国家站、900个区域站资料</text>
				</view>
				<view class="main__list-list">
					<view v-if="listData.length == 0" class="noData">
						<image src="/static/images/noData.png" mode="heightFix"></image>
						<text>暂无数据！</text>
					</view>
					<view v-else class="list-list_item" v-for="(item, index) in renderListData" :key="item.Station_Id_C">
						<text class="list_item-title">{{index + 1}}.{{item.Station_Name || item.V_CITY + "(" + item.Station_Id_C + ")"}}</text>
						<text class="list_item-val">{{currentMenu.statCode ? item[currentMenu.statCode + '_SUM'] : item[currentMenu.eleCode] }}{{unit}}</text>
					</view>
					<uni-load-more :status="loadMoreStatus" iconType="snow"></uni-load-more>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import timeTransform from '@/plugins/tools/timeTransform.js';
	import ELE_SHICI_CONF from '@/config/actual_ele_conf.js';
	
	const app = getApp().globalData;
	export default {
		data() {
			return {
				currenEle: '',
				shici_conf_data: null,
				currentDataCode: '',
				unit: '',
				currentMenu: '',
				rankType: 'desc',
				listData: [],
				dataTime: `${timeTransform.getAppointDateStr(new Date(), -1, 'MM月dd日hh时')}-${new Date().Format('dd日hh时')}`,
				loadMoreStatus: 'noMore',
				isInfiniting: true, // 是否在加载中
				dataIndex: 0,
				renderListData: []
			}
		},
		onLoad: function(option) {
			console.log('actual page', option);
			
			if(!option.ele) return false;
			
			this.currenEle = option.ele;
			let { name, conf, unit, dataCode } = ELE_SHICI_CONF[this.currenEle];
			
			this.shici_conf_data = conf;
			this.currentDataCode = dataCode;
			this.unit = unit;
			// 默认第一个菜单
			this.currentMenu = conf[0];
			
			// 动态设置BarTitle
			uni.setNavigationBarTitle({
			　　title: `宁夏${name}累加排行`
			});
		},
		onShow: function() {
			//console.log("checked-left-Date:",new Date())
			this.getListData( new Date(timeTransform.getAppointHourStr(new Date(), -1, 'yyyy/MM/dd hh:mm')), new Date() );
		},
		onReachBottom: function() {
			this.loadMoreList();
		},
		methods: {
			rankTypeChange() {
				this.rankType = (this.rankType === 'desc' ? 'asc' : 'desc');
				this.listData = this.listData.reverse();
				this.dataIndex = 0;
				this.renderListData = [];
				this.reloadList();
			},
			dateChange(date) {
				console.log("date:",date)
				this.getListData( new Date(date[0].replace('-', '/')), new Date(date[1].replace('-', '/')) );
			},
			getListData(startBJDate, endBJDate) {
				//change start-Date-here///////////////////////////////////////////
				//startBJDate.replace(startBJDate.getMinutes(),0)
				
				startBJDate.setMinutes(0)
				let startDate = timeTransform.toTimeWorld(startBJDate).Format('yyyyMMddhhmmss')
			    let endDate = timeTransform.toTimeWorld(endBJDate).Format('yyyyMMddhhmmss');
				let UTCDate = timeTransform.toTimeWorld(new Date())
			//	endDate = timeTransform.getAppointHourStr(UTCDate,0, 'yyyyMMddhh0000');
				
				this.dataTime = `${startBJDate.Format('MM月dd日hh时')}-${endBJDate.Format('dd日hh时')}`;
				
				uni.showToast({ title: '加载中', icon: 'loading', duration: 1500 });

				this.listData = [];
				this.renderListData = [];
				uni.request({
					url: `${app.API.wx_api}/statUdi/statDataByTimeRang?interfaceId=statDataByTimeRang&dataCode=${this.currentDataCode}&timeRange=%5B${startDate},${endDate})&elements=Station_Name,Station_Id_C&statEles=${this.currentMenu.statCode}_SUM`,
					header: {'Content-Type': 'application/json'},
					data: {
						key: app._apiKey
					},
					dataType: 'json',
					success: (res) => {
						console.log("call-here-----------------:",res)
						if(res.data.DS.length > 0) {
							// 过滤并排序
							console.log("left:,this",res)
							if(this.currenEle == 'PRE'){
								
								this.listData = res.data.DS.filter((item) => {
									
									return item[this.currentMenu.statCode + '_SUM'] > 0 && item[this.currentMenu.statCode + '_SUM'] < 2000;
								});
								
								this.listData.sort((obj1, obj2) => {
									return obj1[this.currentMenu.statCode + '_SUM'] < obj2[this.currentMenu.statCode + '_SUM'] ? 1 : -1;
								});
								
							}  
							else {
								this.listData = res.data.DS.filter((item) => {
									return item[this.currentMenu.eleCode] != 999999;
								});
							}
							
							//console.log("lookat-here:::::::",this.listData)
							this.dataIndex = 0;
							this.reloadList();
						} else {
							uni.showToast({ title: '暂无数据！',  icon: 'error', duration: 3000 });
						}
					},
					fail: (e) => {
						uni.showToast({ title: '网络错误！', icon: 'error', duration: 3000 });
					}
				})
			},
			loadMoreList() {
				let count = Math.floor(this.listData.length / 200) - 1;
				if(this.dataIndex > count) {
					this.loadMoreStatus = 'noMore';
				} else {
					this.loadMoreStatus = 'loading';
					this.dataIndex++;
					this.reloadList();
				}
			},
			reloadList() {
				this.renderListData.push(...this.listData.slice(this.dataIndex * 200, this.dataIndex * 200 + 200));
				//console.log(this.renderListData)
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #E6EDF4;
	}
	.container {
		font-size: 28rpx;
	}
	.rank-main {
		.rank-main__header {
			display: flex;
			justify-content: space-around;
			height: 30px;
			line-height: 30px;
			padding: 10px;
			margin-bottom: 2px;
			background-color: #fff;
			image {
				width: 18px;
				height: 18px;
				vertical-align: text-bottom;
			}
			.rank_search-time {
				flex: 1;
				padding-left: 10px;
				font-size: 28rpx;
				color: #000;
			}
			.rank_btn {
				margin: 0;
				line-height: 30px;
				font-size: 24rpx;
				color: #5E5E5E;
				border-radius: 15px;
				border: #A5C0D9 solid 1px;
				background-color: #fff;
			}
		}
		.rank-main__list {
			padding: 0 10px;
			background-color: #fff;
			font-family: "Poppins";
			font-style: normal;
			font-weight: normal;
			.main__list-text {
				display: flex;
				justify-content: space-between;
				padding: 10px 0;
				font-size: 24rpx;
				color: #000000;
			}
			.main__list-list {
				padding-bottom: 20px;
				.list-list_item {
					height: 40px;
					line-height: 40px;
					display: flex;
					background: #F1F4F8;
					border-radius: 5px;
					padding: 0 10px;
					margin-bottom: 2px;
					font-size: 28rpx;
					color: #000;
					.list_item-title {
						flex-grow: 1;
						white-space: nowrap;
					}
					.list_item-val {
						width: 50px;
						text-align: center;
					}
					.list_item-jump {
						width: 30px;
						text-align: center;
						image {
							width: 20px;
							height: 20px;
							vertical-align: middle;
						}
					}
				}
			}
		}
	}
	.rank_search-box {
		.uni-date {
			border-color: #A5C0D9;
		}
		.uni-date-editor {
			font-size: 24rpx;
			color: #5E5E5E;
		}
	}
</style>
