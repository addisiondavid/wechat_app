<template>
	<view class="container">
		<view class="img-menu" v-if="shici_conf_data.length > 0">
			<view class="img-menu__list" :class="{'active': currentMenu.name === item.name}" v-for="(item, index) in shici_conf_data" :key="index" @click="menuToggle(item)">
				<text class="menu__list-item">{{item.name}}</text>
			</view>
		</view>
		<view class="orientation-container" v-if="radarEle=='雷达'">
			
		</view>
		<view class="img-main" v-if="listData.length > 0">
			<view class="img-main__time">
				<text>更新时间：{{curr_img_time}}</text>
			</view>
			<view class="img-main__imgs">
				<view class="main-imgs" @touchmove="touchMoveHandle" @touchstart="touchstart" @touchend="touchend" :class="{'on': imgIndex == index}" v-for="(item, index) in listData" :key="index">
					<image mode='scaleToFill' :src="imgBaseUrl + item.File_URL" class="main-imgs_img" :style="{overflow:'scroll',width:setData.scaleWidth +'px',height:setData.scaleHeight+'px'}"></image>
				</view>
			</view>
			<view class="img-main__control-wrap">
				<view class="img-main__control">
					<view class="control-play" @click="autoPlay">
						<image v-if="isAutoPlay" src="../../static/images/actual/zanting.png"></image>
						<image v-else src="../../static/images/actual/bofang.png"></image>
					</view>
					<view class="control-slider">
						<pp-slider :value="imgIndex" activeColor="rgb(0, 122, 255)" lineSize="8" @change="sliderChange" min="0" :max="imgLastIndex" step="1" />
					</view>
				</view>
			</view>
		</view>
		<view v-else class="noData">
			<image src="/static/images/noData.png" mode="heightFix"></image>
			<text>暂无数据！</text>
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
				shici_conf_data: [],
				currentMenu: '',
				dataCode: '',
				listData: [],
				imgLastIndex: 0,
				imgIndex: 0,
				curr_img_time: '',
				timer: null,
				startData: {      // 滑动数据
					clientX: 0,   // 左右滑动
					clientY: 0    // 上下滑动
				},
				isAutoPlay: false,
				imgBaseUrl: app.API.wx_api,
				setData:{
					distance:0,
					scale:1,
					scaleWidth:414,
					scaleHeight:240,
					baseWidth:414,
					baseHeight:240
					
				},
				radarEle:'',
				
			}
		},
		onLoad: function(option) {
			
			//plus.screen.lockOrientation('landscape-primary');
			console.log('actual page', option);
			this.radarEle = option.eleName
			if(!option.ele) return false;
			
			this.currenEle = option.ele;
			let { name, dataCode, conf } = ELE_SHICI_CONF[option.ele];
			this.shici_conf_data = conf;
			// 默认第一个菜单
			this.currentMenu = conf[0];
			this.dataCode = dataCode;
			
			// 动态设置BarTitle
			uni.setNavigationBarTitle({
			　　title: `${name}`
			});
		},
		onShow: function() {
			this.getListData();
			 uni.onWindowResize(res => {
			  // portrait 竖屏 landscape 横屏   将状态值存储到这个this.landscape变量中 
			   if(res.deviceOrientation === 'landscape'){
				   if(this.radarEle==='雷达'){
					   //main-imgs_img
					   this.setData.baseWidth = 820
					   this.setData.baseHeight = 480
					   this.setData.scaleWidth ="100%";
					   this.setData.scaleHeight ="calc(100% - 45px)";
				   }
			   } else{
				   this.setData.baseWidth = 414
				   this.setData.baseHeight = 240
				   this.setData.scaleWidth = '414'
				   this.setData.scaleHeight = '240'
			   }
			   
			});
			
		},
		methods: {
			changeOrientation(){
				if(plus){
					//plus.screen.lockOrientation('landscape-primary');
				}
			},
			menuToggle(item) {
				this.currentMenu = item;
				this.getListData();
			},
			getListData() {
				let startDate = null;
				const BJDate = new Date(),
					  UTCDate = timeTransform.toTimeWorld(BJDate)
					  //endDate = UTCDate.Format('yyyyMMddhhmmss');
				
				startDate = timeTransform.getAppointHourStr(UTCDate, -2, 'yyyyMMddhhmmss')
					 console.log("elase")
				
				let endDate = timeTransform.getAppointHourStr(UTCDate, 8, 'yyyyMMddhhmmss')
				
				
				
				if(this.currentMenu.timeRange) {
					if(this.currenEle==='RADAR'){
						 startDate = timeTransform.getAppointHourStr(UTCDate, this.currentMenu.timeRange, 'yyyyMMddhhmmss');
					}else{
						 startDate = timeTransform.getAppointHourStr(UTCDate, this.currentMenu.timeRange, 'yyyyMMddhhmmss');
						 
					}		  
					 console.log("this.currentMenu.timeRange....",this.currentMenu.timeRange)
				}
				
				uni.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
				
				let url = '';
				if(this.currentMenu.areaCode) {
					url = `getFileByTimeRangeAndAreaCode?interfaceId=getFileByTimeRangeAndAreaCode&areaCode=${this.currentMenu.areaCode}`;
				} else {
					url = `getFileByTimeRangeAndEleCode?interfaceId=getFileByTimeRangeAndEleCode&eleCode=${this.currentMenu.eleCode}`;
				}
				console.log("startDate....",startDate)
				console.log("endDate....",endDate)
				uni.request({
					url: `${app.API.wx_api}/downUdi/${url}&dataCode=${this.dataCode}&timeRange=%5B${startDate},${endDate}%5D&elements=Valid,File_URL,Datetime&orderBy=Datetime`,
					header: {'Content-Type': 'application/json'},
					data: {
						key: app._apiKey
					},
					dataType: 'json',
					success: (res) => {
						if(res.data.DS.length > 0) {
							console.log("res...........",res)
							this.listData = res.data.DS;
							this.imgLastIndex = this.listData.length - 1;
							this.changePic(this.imgLastIndex);
							uni.hideToast();
						} else {
							uni.showToast({ title: '暂无数据！',  icon: 'error', duration: 2000 });
						}
					},
					fail: function(e) {
						uni.showToast({ title: '加载失败！',  icon: 'error', duration: 2000 });
					}
				}) 
			},
			changePic (index) {
				this.imgIndex = index;
				
				if(this.radarEle==='雷达'){
					this.curr_img_time = timeTransform.toTimeZone(this.listData[index].Datetime, -8, 'yyyy-MM-dd hh:mm');
				}else{
					this.curr_img_time = timeTransform.toTimeZone(this.listData[index].Datetime, -8, 'yyyy-MM-dd hh:mm');
				}
				
			},
			touchstart(e) {
					
				console.log('开始位置', e.changedTouches[0].clientX);
				this.startData.clientX = e.changedTouches[0].clientX;
				this.startData.clientY = e.changedTouches[0].clientY;
				
				if(e.touches.length == 1){
					console.log("单滑了")
					return;
				}
				console.log('双手指触发开始')
				console.log("e:...............",e)
				//double slide begin
				 let xMove = e.touches[1].clientX - e.touches[0].clientX;
				 let yMove = e.touches[1].clientY - e.touches[0].clientY;
				 let distance = Math.sqrt(xMove * xMove + yMove * yMove);
				 
				this.setData.distance = distance
				 
			},
			// 滑动结束
			touchend (e) {
				console.log('结束位置', e.changedTouches[0].clientX);
				const subX = e.changedTouches[0].clientX - this.startData.clientX;
				const subY = e.changedTouches[0].clientY - this.startData.clientY;
				if(subY > 50 || subY < -50) {
					console.log('上下滑');
				} else {
					// 右滑，显示前一张
					if(subX > 100){ 
						// if(this.imgIndex == 0) {
						// 	this.imgIndex = this.listData.length - 1;
						// } else {
						// 	this.imgIndex--;
						// }
						if(this.imgIndex != 0) {
							this.imgIndex--;
						}
					// 左滑，显示下一张
					} else if (subX < -100) { 
						// if(this.imgIndex == this.listData.length - 1) {
						// 	this.imgIndex = 0;
						// } else {
						// 	this.imgIndex++;
						// }
						if(this.imgIndex != this.listData.length - 1) {
							this.imgIndex++;
						}
					}
					this.changePic(this.imgIndex);
				}
			},
			autoPlay() {
				this.isAutoPlay = !this.isAutoPlay;
				clearInterval(this.timer);
				if(this.isAutoPlay) {
					this.timer = setInterval(() => {
						this.imgIndex++;
						if(this.imgIndex == this.listData.length) {
						    this.imgIndex = 0;
						}
						this.changePic(this.imgIndex);
					}, 1000);
				}
			},
			sliderChange(value) {
				this.changePic(value);
			},
			signatureTouchStart(e){
				console.log("phone touch")
				
			},
			touchMoveHandle(e){
				if (e.touches.length == 1) {
				  console.log("单滑了");
				  return
				}
				console.log('双手指运动开始')
				let xMove = e.touches[1].clientX - e.touches[0].clientX;
				let yMove = e.touches[1].clientY - e.touches[0].clientY;
				// 新的 ditance 
				let distance = Math.sqrt(xMove * xMove + yMove * yMove);
				
				let distanceDiff = distance - this.setData.distance;
				let newScale = this.setData.scale + 0.005 * distanceDiff
				// 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
				if (newScale >= 2) {
				  newScale = 2
				}
				if (newScale <= 0.6) {
				  newScale = 0.6
				}
				let scaleWidth = newScale * this.setData.baseWidth
				let scaleHeight = newScale * this.setData.baseHeight
				
				console.log("scaleWidth.......",scaleWidth)
				console.log("scaleHeight......",scaleHeight)
				
				this.setData.scaleWidth = scaleWidth;
				this.setData.scaleHeight = scaleHeight;
			
			}
		}
	}
</script>

<style lang="less">
	page,
	.container {
		width: 100%;
		height: 100%;
	}
	page {
		background-color: #E6EDF4;
	}
	.container {
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
	}
	.img-menu {
		display: flex;
		justify-content: space-around;
		white-space: nowrap;
		width: 100%;
		height: 40px;
		padding: 5px;
		line-height: 30px;
		box-sizing: border-box;
		background-color: #fff;
		.img-menu__list {
			height: 30px;
			line-height: 30px;
			flex: 1;
			text-align: center;
			.menu__list-item {
				color: #000000;
			}
			&.active {
				.menu__list-item {
					display: block;
					background-color: #2C79C1;
					border-radius: 15px;
					color: #FFFFFF;
				}
			}
		}
	}
	.img-main {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		flex: 1;
		.img-main__time {
			line-height: 30px;
			color: #888;
			font-size: 32rpx;
			text-align: center;
		}
		.img-main__imgs {
			width: 100%;
			height: 300rpx;
			position: relative;
			flex-grow: 1;
			.main-imgs {
				width: 100%;
				height: 100%;
				opacity: 0;
				//transition-duration: 0.3s;
				position: absolute;
				.main-imgs_img {
					position: absolute;
					width: 100%;
					top: 50%;
					height:100%;
					transform: translateY(-50%);
					
				}
			}
			.on {
				opacity: 1;
			}
		}
		.img-main__control-wrap {
			box-sizing: border-box;
			width: 100%;
			height: 40px;
			line-height: 40px;
			padding: 0 7px;
			margin-bottom: 15px;
			.img-main__control {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 100%;
				background-color: #FFFFFF;
				border-radius: 15px;
				list-style: none;
				margin: 0 auto;
				overflow: hidden;
				.control-play {
					text-align: center;
					margin: 0 5px;
					image {
						width: 30px;
						height: 30px;
						vertical-align: middle;
					}
				}
				.control-slider {
					flex-grow: 1;
					padding-top: 12px;
					height: 25px;
					margin-right: 10px;
				}
			}
		}
		// .img-main__control {
		// 	display: flex;
		// 	justify-content: space-between;
		// 	height: 70px;
		// 	border-top: #ccc solid 1px;
		// 	.control-play {
		// 		width: 79px;
		// 		line-height: 70px;
		// 		text-align: center;
		// 		border-right: #ccc solid 1px;
		// 		image {
		// 			width: 45px;
		// 			height: 45px;
		// 			vertical-align: middle;
		// 		}
		// 	}
		// 	.control-slider {
		// 		flex-grow: 1;
		// 		padding-top: 25px;
		// 	}
		// }
	}
	.noData {
		padding-top: 150px;
		background-color: transparent;
	}
</style>
