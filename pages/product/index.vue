<template>
	<view class="container">
		<view class="products-list-box">
			<view class="products-list-box__class">
				<view class="news-carousel" v-for="(item,index) in carouselTxt" :key="item.index">
					<div class="carousel-text-container">
						<text :class="isActive===index? 'title':''" @click="btn(index)">{{item}}</text>
					</div>
				</view>
				
<!--			
				<view class="list-box__class_name">
					<text>{{curr_class_name}}</text>
				</view>
				
				<view style="display:flex">
					<input type="text" placeholder="请输入类别" :value="tagName" @input="handleInput">
					<span style="margin-left:1em" v-if="tagName.length>0">结果:{{filterArt.length}}</span>
				</view>
				
-->
				<!-- <view class="list-box__class_link" @click="isOpenClassfiyBox = !isOpenClassfiyBox">
					<image src="../../static/images/products/fenlei.png"></image>
					决策产品
				</view> -->
			</view>
			
			<view class="products-classfiy-box-wrap" :class="{'active': isOpenClassfiyBox}">
				<view class="products-classfiy-box">
					<view class="classfiy-box__bigClass">
						<view class="bigClass__item" :class="{bigClass_active: bigItem.id == currentBigClassId}" v-for="bigItem in bigClassData" @click="getSubClassDataByBigClass(bigItem.id)" :key="bigItem.id">
							<text>{{bigItem.name}}</text>
						</view>
					</view>
					<view class="classfiy-box__subClass">
						<view class="subClass-row" v-for="subItem in subClassData" :key="subItem.id">
							<text class="subClass-row_title" v-if="subItem.children.length > 0">{{subItem.name}}</text>
							<view v-else class="subClass-row__item" :class="{'active':subItem.name == curr_class_name}" @click="toggleSubClassfiy(subItem)">
								<text>{{subItem.name}}</text>
							</view>
							<view class="subClass-row__item" :class="{'active':subItem_item.name == curr_class_name}" v-for="subItem_item in subItem.children" :key="subItem_item.id" @click="toggleSubClassfiy(subItem_item)">
								<text>{{subItem_item.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="products-list-box__list">
				<scroll-view class="list-box__list_wrap" scroll-y="true" scroll-with-animation refresher-enabled="true" :refresher-triggered="triggered" @scrolltolower="loadMoreList" @refresherrefresh="refresherNewList" :scroll-top="scrollTop" @scroll="scroll">
					<view class="list_wrap__list" v-if="productList.length > 0">
						<view class="list_item" v-for="(item, index) in filterArt" :key="index" @click="getToDetail(item)">
							<view class="list_item__title">
								<text class="item__title">{{item.RETAIN1}}</text>
							</view>
							<view class="list_item__date">
								<text class="item__class">{{menuTypeConf[item.ELE_CODE] || '信息专报'}}</text>
								<text class="item__date">{{thisTimeTransform.toTimeZone(item.Datetime, -8, 'MM月dd日hh时')}}</text>
							</view>
						</view>
					</view>
					<view v-else class="noData">
						<image src="/static/images/noData.png" mode="heightFix"></image>
					</view>
					<uni-load-more :status="loadMoreStatus" iconType="snow"></uni-load-more>
					
				</scroll-view>
			</view>
		</view>
		<view class="top" :style="{'display':(topState === true? 'block':'none')}">
		    <uni-icons class="topc" type="arrowthinup" size="50" @click="top"></uni-icons>
		</view>
	</view>
</template>

<script>
	import timeTransform from '@/plugins/tools/timeTransform.js';
	
	const app = getApp().globalData;
	export default {
		data() { 
			return {
				productList: [],
				isRefreshing: false, // 是否在刷新中
			    isInfiniting: true, // 是否在加载中
			    triggered: true,
				infiniteDisabled: false,
			    loadMoreStatus: 'noMore', // 上拉加载的状态样式
				topState: false,
				scrollTop: 0,
				oldScrollTop: 0,
				
				classfiyData: [],
				bigClassData: [],
				subClassData: [],
				currentBigClassId: -1,
				curr_class_name: '气象信息专报',
				curr_class_id: undefined,
				isOpenClassfiyBox: false,
				menuTypeConf: {},
				tagName:'',
				filterArt:[],
				carouselTxt:['天气','气候','农业','重大活动','大气污染','康养旅游','其他'],
				isActive:0,
			}
		},
		computed: {
			thisTimeTransform: function() {
				return timeTransform;
			},
		},
		onLoad: function(option) {
			console.log('product page');
		},
		onShow: function() {
			this.getProductList(this.curr_class_id);
			this.initClassfiyData();
		},
		onTabItemTap:function(item){
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
		},
		methods: {
			btn(index){
				var temp = [];
				this.CAT = ""
				this.isActive = index
				
				this.filterArt = this.productList.filter(elem=>{
					if(this.carouselTxt[index]=="康养旅游"){
						
						this.CAT = "康养旅游"
						if(elem.RETAIN1.includes("康养")){
							temp.push(elem)
						}
						if(elem.RETAIN1.includes("旅游")){
							temp.push(elem)
						}
						
					}
					if(this.carouselTxt[index]=="其他"){
						if(elem.RETAIN1.includes("天气")==false && elem.RETAIN1.includes("气候")==false && elem.RETAIN1.includes("农业")==false && elem.RETAIN1.includes("重大活动")==false && elem.RETAIN1.includes("大气污染")==false && elem.RETAIN1.includes("康养")==false && elem.RETAIN1.includes("旅游")==false){
							this.CAT = "其他"
							temp.push(elem)
						}
					}
					else{
						return elem.RETAIN1.includes(this.carouselTxt[index])
					}
							
				})
					
				if(this.CAT == "康养旅游" || this.CAT == '其他'){
					this.filterArt = temp
				}
				console.log("this.filterArt",this.filterArt)
			},
			setData(obj){
				let that = this;    
				let keys = [];    
				let val,data;    
				Object.keys(obj).forEach(function(key){    
				 keys = key.split('.');    
				 val = obj[key];    
				 data = that.$data;    
				 keys.forEach(function(key2,index){    
					 if(index+1 == keys.length){    
						 that.$set(data,key2,val);    
					 }else{    
						 if(!data[key2]){    
							that.$set(data,key2,{});    
						 }    
					 }    
					 data = data[key2];    
				 })    
				});    
			}, 
			handleInput({ detail }) {
			    this.tagName = detail.value
				this.filterArt = this.productList.filter(elem=>{
					return elem.RETAIN1.includes(detail.value)
						
				})
				console.log("this.filterArt",this.filterArt)
			
			
			},
			scroll (e) {
				//当距离大于500时显示回到顶部按钮
				this.oldScrollTop = e.detail.scrollTop;
				if(e.detail.scrollTop > 500) { 
				    this.topState = true;
				} else {
					//当距离小于500时显示回到顶部按钮
				    this.topState = false;
				}
			},
			top() {
		　　　　 //视图会发生重新渲染
				this.scrollTop = this.oldScrollTop;
				//当视图渲染结束 重新设置为0
				this.$nextTick(() => {
					this.scrollTop = 0;
				});
		　　 },
			initClassfiyData() {
				this.classfiyData = uni.getStorageSync('pro_class') || [];
				
				// 建立栏目类型配置
				this.menuTypeConf = {};
				this.classfiyData.map(item => {
					this.menuTypeConf[item.id] = item.name;
				});
				
				this.classfiyData.unshift({
					id: "-1",
					pid: "0",
					name: "全部"
				},{
					id: "",
					pid: "-1",
					name: "全部"
				});
				this.bigClassData = this.toTreeData(this.classfiyData);
				
				this.getSubClassDataByBigClass(this.bigClassData[0].id);
			},
			getSubClassDataByBigClass(bigClassId) {
				this.currentBigClassId = bigClassId;
				this.bigClassData.forEach(item => {
					if(item.id == bigClassId) {
						this.subClassData = item.children;
					}
				});
				console.log("this.subClassData:",this.subClassData)
			},
			// 结构化数据-->树形结构数据
			toTreeData(data) {
			    const pos = {}, tree = [];
			    let i = 0;
			    while(data.length != 0) {
			        if(data[i].pid == 0) {
			            tree.push({
							...data[i], 
							children: [],
						});
			            pos[data[i].id] = [tree.length - 1];
			            data.splice(i, 1);
			            i--;
			        } else {
			            let posArr = pos[data[i].pid];
			            if(posArr != undefined) {
			                let obj = tree[posArr[0]];
			                for(let j = 1; j < posArr.length; j++) {
			                    obj = obj.children[posArr[j]];
			                }
			                obj.children.push({
			                    ...data[i],
			                    children: []
			                });
			                pos[data[i].id] = posArr.concat([obj.children.length - 1]);
			                data.splice(i, 1);
			                i--;
			            }
			        }
			        i++;
			        if(i > data.length - 1) {
			            i = 0;
			        }
			    }
			    return tree;
			},
			toggleSubClassfiy(subClassfiyItem) {
				this.curr_class_name = subClassfiyItem.name;
				this.curr_class_id = subClassfiyItem.id;
				this.isOpenClassfiyBox = false;
				this.getProductList(subClassfiyItem.id);
			},
			getProductList(templateId) {
				if(app._apiKey) {
					const endDate = new Date(),
						  endDateStr = endDate.Format('yyyyMMddhhmmss'),
						  startDate = timeTransform.getAppointYearStr(endDate, -10, 'yyyyMMddhhmmss');
						  
					let url = `${app.API.wx_api}/downUdi/getFileByTimeRange?interfaceId=getEleByTimeRange&dataCode=SEVP_NX_DOC_FILE&timeRange=%5B${startDate},${endDateStr}%5D&elements=ELE_CODE,RETAIN1,File_URL,Datetime&orderBy=Datetime:desc`;
					
					if (templateId) {
						url += `&eleValueRanges=ELE_CODE:${templateId}`;
					}
					uni.request({
						url: url,
						header: {'Content-Type': 'application/json'},
						data: {
							key: app._apiKey
						},
						dataType: 'json',
						success: (res) => {
							if(res.statusCode == 200) {
								this.productList = res.data.DS;
								this.filterArt = this.productList;
								//进来先filter天气类
								this.btn(0);
							}
						}
					})
				}
			},
			goto(url) {
				uni.navigateTo({
					url: url,
					fail(e) {
						console.log(e);
					}
				})
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
							console.log("res::....",res)
							console.log("url:.....",current)
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
						fail(e) {
							uni.hideLoading();
							console.log("error:",error)
						}
					});
				// } else {
				// 	uni.navigateTo({
				// 		url: `./detail?title=${item.title}&url=${item.content}`,
				// 		fail(e) {
				// 			console.log(e);
				// 		}
				// 	})
				// }
				
			},
			refresherNewList() {
				if (this.isRefreshing) return;
				this.isRefreshing = true
				this.triggered = true;
				this.isInfiniting = false;
				setTimeout(() => {
					this.refresherComplete();
				}, 3000);
			},
			refresherComplete() {
			    this.triggered = false;
			    this.isRefreshing = false;
			    this.isInfiniting = true;
				this.infiniteDisabled = false;
			},
			loadMoreList() {
				if(this.isInfiniting) {
					this.loadMoreStatus = this.infiniteDisabled  ? 'noMore' : 'loading';
					setTimeout(() => {
						this.loadMoreStatus = 'noMore';
						this.infiniteDisabled = false;
					}, 3000);
				}
			}
		}
	}
</script>

<style lang="less">
	.title {
		color: red;
	
	}
	.news-carousel{
		display:flex;
	}
	.carousel-text-container{
		padding:.4em;
	}
	page {
		width: 100%;
		height: 100%;
		background-color: #E6EDF4;
	}
	.container {
		width: 100%;
		height: 100%;
		.top {
			position: relative;
			display: none;
		}
		.topc {
			position: fixed;
			right: 0;
			background: #F0F0F0;
			top: 70%;
			height: 100rpx;
			line-height: 100rpx;
		}
	}
	.products-search-box {
		height: 38px;
		padding: 5px 15px 3px;
		background-color: #fff;
		box-shadow: 0 0 5px 5px #EEEEEE;
		.products-search-box__link {
			height: 34px;
			line-height: 34px;
			color: #999;
			font-size: 32rpx;
			image {
				width: 20px;
				height: 20px;
				vertical-align: sub;
				margin-right: 5px;
			}
		}
	}
	.products-list-box {
		height: 100vh;
		position: relative;
		.products-classfiy-box-wrap {
			position: absolute;
			top: 40px;
			left: 0;
			width: 100vw;
			height: 0px;
			background-color: rgba(0, 0, 0, .6);
			z-index: 2;
			overflow: hidden;
			transition: height 0.2s; 
			&.active {
				height: calc(100vh - 40px);
			}
			.products-classfiy-box {
				display: flex;
				width: 100vw;
				height: 46vh;
				background-color: #fff;
				.classfiy-box__bigClass {
					flex: 3;
					background-color: #F4F4F4;
					.bigClass__item {
						height: 100rpx;
						line-height: 100rpx;
						margin-bottom: 2px;
						text-align: center;
						font-size: 28rpx;
					}
					.bigClass_active {
						background-color: #FFFFFF;
					}
				}
				.classfiy-box__subClass {
					flex: 5;
					padding: 10px;
					overflow: auto;
					.subClass-row {
						min-height: 40px;
						white-space: nowrap;
						.subClass-row_title {
							display: block;
							clear: both;
							font-size: 32rpx;
							color: #323232;
						}
						.subClass-row__item {
							padding: 5px;
							float: left;
							font-family: "Poppins";
							font-style: normal;
							font-weight: normal;
							font-size: 28rpx;
							color: #545454;
							&.active {
								color: #3295F1;
							}
						}
					}
				}
			}
		}
		.products-list-box__class {
			display: flex;
			height: 40px;
			line-height: 40px;
			padding: 0 10px;
			margin-bottom: 2px;
			text-align: center;
			justify-content: space-between;
			background-color: #fff;
			font-family: "Poppins";
			font-style: normal;
			font-weight: normal;
			font-size: 28rpx;
			align-items: center;
			.list-box__class_name {
				flex-grow: 1;
				color: #3295F1;
			}
			.list-box__class_link {
				width: 100px;
				padding: 0 5px;
				image {
					width: 20px;
					height: 20px;
					vertical-align: sub;
				}
			}
		}
		.products-list-box__list {
			height: calc(100vh - 41px);
			.list-box__list_wrap {
				width: 100%;
				height: 100%;
				// .list_wrap__list {
				// 	width: 100%;
				// 	height: 100%;
				// }
				.list_item {
					height: 70px;
					padding: 10px 10px;
					margin-bottom: 2px;
					font-size: 36rpx;
					background-color: #fff;
					font-family: PingFang HK;
					font-style: normal;
					.list_item__img {
						width: 24px;
						height: 24px;
						margin-right: 5px;
						vertical-align: sub;
					}
					.list_item__title {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.item__title {
						font-weight: 600;
						font-size: 36rpx;
						color: #3E4958;
					}
					.list_item__date {
						margin-top: 20px;
						font-weight: 300;
						font-size: 30rpx;
						color: #3E4958;
						overflow: hidden;
						.item__class {
							float: left;
							padding: 0 10rpx;
							height: 40rpx;
							line-height: 40rpx;
							font-size: 24rpx;
							background-color: #D8EDF4;
							border-radius: 5px;
							text-align: center;
						}
						.item__date {
							float: right;
						}
					}
				}
			}
		}
	}
</style>
