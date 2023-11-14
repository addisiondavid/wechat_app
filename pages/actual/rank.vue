<template>
	<view class="container">
		<view class="rank-menu">
			<view class="rank-menu__list" v-if="shici_conf_data.length > 1" :class="{'active': currentMenu.name === item.name}" v-for="(item, index) in shici_conf_data" :key="index" @click="menuToggle(item)">
				<text class="menu__list-item">{{item.name}}</text>
			</view>
		</view>
		
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
				<text class="rank_search-time">{{dataTime}}</text>
				<view class="rank_search-box" v-if="isCanSearch">
					<uni-datetime-picker border="true" @change="dateChange">
						<image src="../../static/images/actual/rili.png"></image>
						查询
					</uni-datetime-picker>
				</view>
			</view>
			<view class="rank-main__list">
				<view class="main__list-text" v-if="currenEle != 'AIR'">
					<text v-if="currenEle != 'AIR'">共{{listData.length}}站点{{currenEle == 'PRE' ? '有降水': ''}}</text>
					<text style="flex:1;margin-left:5px;margin-right:5px" v-if="currenEle != 'AIR'">基于宁夏自治区28个国家站、900个区域站资料</text>
				
				</view>
				
				
				<view style="display:flex;align-items:center;padding:0.3em;padding-bottom: .8em;">
					
					<div style="display:flex;margin-right:5px" @click="resetHandler">
						<image src="../../static/images/reset.png" height="10px" width="10px" class="resetImg"></image>
					</div>
					
					<picker class="rank_btn2" mode="selector" :range="provinceData" range-key="label"  @change="sheng" >
						<view class="check_school">{{province.length>0?province:'选择市:'}}</view>
					</picker>
				
					<picker :class="{'disableColor': jy}" class="rank_btn2" mode="selector" :range="city1" range-key="label" :disabled='jy'  @change="shi">
						<view class="check_school">{{cityy.length>0?cityy:'选择区:'}}</view>
					</picker>
					
					<text v-if="currenEle == 'AIR'">共{{listData.length}}站点{{currenEle == 'PRE' ? '有降水': ''}}</text>
				
					
					
				
				</view>
				
				
				
				<view class="main__list-list">
					<view v-if="listData.length == 0" class="noData">
						<image src="/static/images/noData.png" mode="heightFix"></image>
						<text>暂无数据！</text>
					</view>
					<view v-else class="list-list_item" v-for="(item, index) in renderListData" :key="item.Station_Id_C">
						<text class="list_item-title">{{index + 1}}.{{item.Station_Name || item.V_CITY + "[" + item.Station_SiteName + "]"}}</text>
						<text class="list_item-val" :class="{'list_item-val-0808': currentMenu.eleCode === 'PRE_Time_0808'}">
							{{currentMenu.statCode ? item[currentMenu.statCode + '_SUM'] : item[currentMenu.eleCode] }}
							<template v-if="currentMenu.eleCode === 'PRE_Time_0808'">
								/{{item['PRE_Time_0808_MMUT_SUM']}}
								<!--
									<text class="fs12">(常年值)</text>
								-->
								
							</template>
							{{unit}}
						</text>
						
						<view class="list_item-jump" @click="goToVIew(item)"   >
							<image src="../../static/images/actual/tiaozhuan.png" ></image>
						</view>
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
				isCanSearch: true,
				rankType: 'desc',
				listData: [],
				dataTime: `${timeTransform.getAppointDateStr(new Date(), -1, 'MM月dd日hh时')}-${new Date().Format('dd日hh时')}`,
				loadMoreStatus: 'noMore',
				isInfiniting: true, // 是否在加载中
				dataIndex: 0,
				renderListData: [],
				moreList: ['选项一', '选项二', '选项三'], // 列表数组
				value: [1], // 默认选中选项二，必须是数组，数组里面是数字下标
				multiIndex: [0, 0, 0],
				multiIds: [],
				multiArray: [['全区'], ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'], ['兴庆区', '金凤区','西夏区', '永宁县','贺兰县','灵武市']],
				//multiArray:['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
				newArr: [],
				tempRegionArr:[],
				tempRegionArr2:[],
				tempListData:[],
				allRegionData:[],
				region2:'',
				region3:'',
				tryme:'区域',
				area_code:{
					兴庆区:'640104',
					金凤区:'640106',
					西夏区:'640105',
					永宁县:'640121',
					贺兰县:'640122',
					灵武市:'640181',
					惠农区:'640205',
					大武口区:'640202',
					平罗县:'640221',
					利通区:'640302',
					红寺堡区:'640303',
					盐池县:'640323',
					同心县:'640324',
					青铜峡市:'640381',
					西吉县:'640422',
					隆德县:'640423',
					彭阳县:'640425',
					泾源县:'640424',
					原州区:'640402',
					沙坡头区:'640502',
					中宁县:'640521',
					海原县:'640522',
					银川市:'640100',
					石嘴山市:'640200',
					吴忠市:'640300',
					固原市:'640400',
					中卫市:'640500'
				
				},
				regionFilData:[],
				startDate:null,
				endDate:null,
				timeSelected:false,
				array:['全区','市','区'],
				index:0,
				selectedRegion:'',
				hasRegionData:'',
				province:'',
				city1:'',
				city:'',
				cityy:'',
				jy:true,
				reset:false,
				shengArr:[],
				shiArr:[],
				provinceData:[
					{
						"label":"银川市",
						"value":"11"
					},
					{
						"label":"石嘴山市",
						"value":"12"
					},
					{
						"label":"吴忠市",
						"value":"13"
					},
					{
						"label":"固原市",
						"value":"14"
					},
					{
						"label":"中卫市",
						"value":"15"
					},
							
				],
				cityData:[
					[
						{
							"label":'兴庆区',
							"value":"1101"
						},
						{
							"label":'金凤区',
							"value":"1102"
						},
						{
							"label":'西夏区',
							"value":"1103"
						},
						{
							"label":'永宁县',
							"value":"1104"
						},
						{
							"label":'贺兰县',
							"value":"1105"
						},
						{
							"label":'灵武市',
							"value":"1106"
						},
					],
					[
						{
							"label":'惠农区',
							"value":"1201",
						},
						{
							"label":'大武口区',
							"value":"1202"
						},
						{
							"label":'平罗县',
							"value":"1203"
						}
						
					],
					[
						{
							"label":'利通区',
							"value":"1301"
						},
						{
							"label":'红寺堡区',
							"value":"1302"
						},
						{
							"label":'盐池县',
							"value":"1303"
						},
						{
							"label":'同心县',
							"value":"1304"
						},
						{
							"label":'青铜峡市',
							"value":"1305"
						},
					],
					[
						{
							"label":'西吉县',
							"value":"1401"
						},
						{
							"label":'隆德县',
							"value":"1402"
						},
						{
							"label":'彭阳县',
							"value":"1403"
						},
						{
							"label":'泾源县',
							"value":"1404"
						},
						{
							"label":'原州区',
							"value":"1405"
						},
					],
					[
						{
							"label":'沙坡头区',
							"value":"1501"
						},
						{
							"label":'中宁县',
							"value":"1502"
						},
						{
							"label":'海原县',
							"value":"1503"
						}
						
					],
					
					
				]
				
				
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
			this.isCanSearch = (this.currentMenu && this.currentMenu.isCanSearch == undefined ? true : false);
			
			// 动态设置BarTitle
			uni.setNavigationBarTitle({
			　　title: `宁夏${name}排行`
			});
			
			
		},
		onShow: function() {
			this.getListData();
		},
		onReachBottom: function() {
			this.loadMoreList();
		},
		methods: {
			resetHandler(e){
				this.reset =true;
				//empty city and province name selection
				this.province = '';
				this.cityy = '';
				this.listData = this.tempListData;
				this.renderListData = this.tempListData;
			},
			sheng(e){
				this.reset = false;
				this.allRegionData = [];
				this.shengArr = [];
				this.shiArr = [];
				this.cityy = '选择地区';  //empty city current selection//
				var index = e.detail.value;
				this.province = this.provinceData[index].label;
				var areaCode = this.area_code[this.province];
				this.city1  = this.cityData[index] 
				if(this.currenEle == 'AIR'){
					this.jy = true;
				}
				else{
					this.jy = false;
				}
			
				//get data from areaCode//
				uni.request({
					url: `https://jcfw.qx121.com.cn/statUdi/statDataByTimeRangAndAreaCode?interfaceId=statDataByTimeRangAndAreaCode&dataCode=SURF_NX_MUL_HOR&timeRange=%5B${this.startDate},${this.endDate}%5D&elements=Station_Name,Station_Id_C&statEles=PRE_1h_SUM&key=MTM2OTMzNTM3MjM%3D&areacode=${areaCode}`,
					data: {},		
					method: 'GET',
					success: (res) => {
						this.allRegionData = res.data.DS; 
						console.log("res.data.DS",res.data.DS)
						
						if(this.currenEle == 'AIR'){
							 //disable shi button if it is air query//
							this.tempListData.forEach(ele=>{
								
								if(ele.V_CITY_CODE.includes(areaCode)){
									this.shengArr.push(ele)
								}
							})						
							
						}
						
						else{
							res.data.DS.forEach(el=>{
								this.tempListData.forEach(ele=>{
									
									if(el.Station_Id_C == ele.Station_Id_C){
										this.shengArr.push(ele)
									}
								})						
							})
						}
							
						this.listData = this.shengArr;
						this.renderListData = this.shengArr;
						
					},
					fail: (err) => {
						uni.showToast({ title: '网络错误，稍后重试！', icon: 'error', duration: 3000 });
						reject(null);
					}
				});
				
			},
			
			shi(e){
				this.reset = false;
				this.allRegionData = [];
				this.shiArr = [];
				var index = e.detail.value;
				this.cityy = this.city1[index].label;
				console.log("this.cityy",this.cityy)
				var areaCode = this.area_code[this.cityy];
				//this.city1  = this.cityData[index] 
				this.jy = false
				console.log("areaCode",areaCode)
				//get data from areaCode//
				uni.request({
					url: `https://jcfw.qx121.com.cn/statUdi/statDataByTimeRangAndAreaCode?interfaceId=statDataByTimeRangAndAreaCode&dataCode=SURF_NX_MUL_HOR&timeRange=%5B${this.startDate},${this.endDate}%5D&elements=Station_Name,Station_Id_C&statEles=PRE_1h_SUM&key=MTM2OTMzNTM3MjM%3D&areacode=${areaCode}`,
					data: {},		
					method: 'GET',
					success: (res) => {
						this.allRegionData = res.data.DS; 
						
						this.tempListData.forEach(ele=>{
							
							if(areaCode == ele.Admin_Code_CHN){
								this.shiArr.push(ele)
							}
						})						
						
						
						this.listData = this.shiArr;
						this.renderListData = this.shiArr;
						
					},
					fail: (err) => {
						uni.showToast({ title: '网络错误，稍后重试！', icon: 'error', duration: 3000 });
						reject(null);
					}
				});
				
			},
		
			
			pickChange:function(e){
				this.selectedRegion = this.array[e.detail.value];
				var areaCode = ''
				
			    this.setData({
			      index:e.detail.value
			    });
				
				if(this.array[e.detail.value] == '市'){
					areaCode = this.area_code[this.region2]
				}
				else if(this.array[e.detail.value] == '区'){
					areaCode = this.area_code[this.region3]
				}
				this.tempRegionArr = []
		
				var data = {
				  renderListData: this.renderListData
				};
				
				uni.request({
					url: `https://jcfw.qx121.com.cn/statUdi/statDataByTimeRangAndAreaCode?interfaceId=statDataByTimeRangAndAreaCode&dataCode=SURF_NX_MUL_HOR&timeRange=%5B${this.startDate},${this.endDate}%5D&elements=Station_Name,Station_Id_C&statEles=PRE_1h_SUM&key=MTM2OTMzNTM3MjM%3D&areacode=${areaCode}`,
					data: {},		
					method: 'GET',
					success: (res) => {
					
						console.log("this.templistData",this.templistData)
						res.data.DS.forEach(el=>{
							this.templistData.forEach(ele=>{
								
								if(el.Station_Id_C == ele.Station_Id_C){
									console.log("ele",ele)
									this.tempRegionArr.push(ele)
								}
							})						
						})
						
						data.renderListData = this.tempRegionArr
						this.listData = this.tempRegionArr
						this.regionFilData = this.tempRegionArr
						this.setData(data)
						//this.timeSelected = false    //reset time hour selection
						
					},
					fail: (err) => {
						uni.showToast({ title: '网络错误，稍后重试！', icon: 'error', duration: 3000 });
						reject(null);
					}
				});
			},
			testing(e){
				console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
				    var data = {
				      multiArray: this.multiArray,
				      multiIndex: this.multiIndex
				    };
					var data2 = {
					  tryme: this.tryme,
					};
					
				    data.multiIndex[e.detail.column] = e.detail.value;
					console.log("data.multiIndex",data.multiIndex)
				    switch (e.detail.column) {
				    
				      case 1:   //get second column
				        switch (data.multiIndex[0]) {   //determine which row in first column 
				          case 0:
				            switch (data.multiIndex[1]) {
				              case 0:
				                data.multiArray[2] = ['兴庆区', '金凤区','西夏区', '永宁县','贺兰县','灵武市'];
				                break;
				              case 1:
				                data.multiArray[2] = ['惠农区','大武口区','平罗县'];
				                break;
				              case 2:
				                data.multiArray[2] = ['利通区', '红寺堡区','盐池县','同心县','青铜峡市'];
				                break;
				              case 3:
				                data.multiArray[2] = ['西吉县', '隆德县', '彭阳县','泾源县','原州区'];
				                break;
				              case 4:
				                data.multiArray[2] = ['沙坡头区', '中宁县', '海原县'];
				                break;
				            }
				            break;
				        }
				        data.multiIndex[2] = 0;
				        break;
				    }		
					
				    console.log(data.multiIndex);
					if(this.tryme==='区域 '){
						this.tryme = '区域'
					}
					else{
						this.tryme = '区域 '
					}
					data2.tryme = this.tryme
			      
				    this.setData(data);
					this.setData(data2)
					
				   this.multiArray = data.multiArray
				   this.multiIndex = data.multiIndex
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
			bindMultiPickerChange(e) {
			    console.log(this.data.multiIds);
			},
			test1(e){
				
				
				this.multiArray[1][e.detail.value[1]]
				
				var url=''
				url=`https://jcfw.qx121.com.cn/queryUdi/getEleByTimeRange?interfaceId=getEleByTimeRange&dataCode=SURF_NX_MUL_HOR&timeRange=%5B20220920140000,20220920150000)&elements=Station_Name,TEM,Station_Id_C&orderBy=TEM:desc&key=MTM2OTMzNTM3MjM%3D`
				uni.request({
					url: `https://jcfw.qx121.com.cn/statUdi/statDataByTimeRangAndAreaCode?interfaceId=statDataByTimeRangAndAreaCode&dataCode=SURF_NX_MUL_HOR&timeRange=%5B${this.startDate},${this.endDate}%5D&elements=Station_Name,Station_Id_C&statEles=PRE_1h_SUM&key=MTM2OTMzNTM3MjM%3D&areacode=${this.area_code[this.multiArray[2][e.detail.value[2]]]}`,
					data: {},		
					method: 'GET',
					success: (res) => {
					
						console.log("res",res)
						res.data.DS.forEach(el=>{
							this.listData.forEach(ele=>{
								
								if(el.Station_Id_C == ele.Station_Id_C){
									this.tempRegionArr.push(ele)
								}
							})						
						})
						
						console.log("this.tempRegionArr",this.tempRegionArr)
						
					},
					fail: (err) => {
						uni.showToast({ title: '网络错误，稍后重试！', icon: 'error', duration: 3000 });
						reject(null);
					}
				});
				
				
			},
			multiColChange(e){
				this.tempRegionArr = []
				this.region2 = this.multiArray[1][e.detail.value[1]]
				this.region3 = this.multiArray[2][e.detail.value[2]]
				
				//console.log("this.multiArray",this.multiArray[0][e.detail.value[0]])
				//console.log("this.multiArray",this.multiArray[1][e.detail.value[1]])
				//console.log("this.multiArray",this.multiArray[2][e.detail.value[2]])
			    
				if(this.timeSelected == false){
					this.listData = this.templistData
				}
				var data = {
				  renderListData: this.renderListData
				};
				var url=''
				url=`https://jcfw.qx121.com.cn/queryUdi/getEleByTimeRange?interfaceId=getEleByTimeRange&dataCode=SURF_NX_MUL_HOR&timeRange=%5B20220920140000,20220920150000)&elements=Station_Name,TEM,Station_Id_C&orderBy=TEM:desc&key=MTM2OTMzNTM3MjM%3D`
				uni.request({
					url: `https://jcfw.qx121.com.cn/statUdi/statDataByTimeRangAndAreaCode?interfaceId=statDataByTimeRangAndAreaCode&dataCode=SURF_NX_MUL_HOR&timeRange=%5B${this.startDate},${this.endDate}%5D&elements=Station_Name,Station_Id_C&statEles=PRE_1h_SUM&key=MTM2OTMzNTM3MjM%3D&areacode=${this.area_code[this.multiArray[2][e.detail.value[2]]]}`,
					data: {},		
					method: 'GET',
					success: (res) => {
						this.hasRegionData = res.data.DS
						this.regionFilData = res.data.DS
						console.log("this.listData",this.listData)
						res.data.DS.forEach(el=>{
							this.listData.forEach(ele=>{
								
								if(el.Station_Id_C == ele.Station_Id_C){
									this.tempRegionArr.push(ele)
								}
							})						
						})
						data.renderListData = this.tempRegionArr
						this.templistData = this.listData
						this.listData = this.tempRegionArr
						this.setData(data)
						this.timeSelected = false    //reset time hour selection
					},
					fail: (err) => {
						uni.showToast({ title: '网络错误，稍后重试！', icon: 'error', duration: 3000 });
						reject(null);
					}
				});
			
				//https://jcfw.qx121.com.cn/statUdi/statDataByTimeRangAndAreaCode?interfaceId=statDataByTimeRangAndAreaCode&dataCode=SURF_NX_MUL_HOR&timeRange=%5B20220919050000,20220919060000%5D&elements=Station_Name,Station_Id_C&statEles=PRE_1h_SUM&key=MTM2OTMzNTM3MjM%3D&areacode=this.area_code[this.multiArray[2][e.detail.value[2]]]
				
				//this.area_code[this.multiArray[2][e.detail.value[2]]]
				
			},
			menuToggle(item) {
				this.currentMenu = item;
				this.rankType = (this.currentMenu.rankType === 'asc' ? 'asc' : 'desc');
				this.isCanSearch = (this.currentMenu && this.currentMenu.isCanSearch == undefined ? true : false);
				this.getListData();
			},
			rankTypeChange() {
				this.rankType = (this.currentMenu.rankType === 'asc' ? 'asc' : 'desc');
				
				this.listData = this.listData.reverse();
				this.dataIndex = 0;
				this.renderListData = [];
				this.reloadList();
			},
			goToVIew(item) {
				console.log(this.renderListData)
				uni.navigateTo({
				    url: `./stationDetail?Station_Id_C=${item.Station_Id_C}&Station_Name=${item.Station_Name}&ele=${this.currenEle}&subEle=${this.currentMenu.eleCode}`,
					fail(e) {
						console.log(e);
					}
					
				})
				
			},
			dateChange(date) {
				const BJDate = new Date(date);
				this.getListData(BJDate);
			},
			getListData(date) {
				const timeInterval = this.currentMenu.timeInterval;
				let BJDate = new Date();
					
				// 若自定义时间，重新给起止时间赋值
				if(date) {
					BJDate = date;
				}
				let UTCDate = timeTransform.toTimeWorld(BJDate),
					  endDate = UTCDate.Format('yyyyMMddhhmmss'),
					  startDate = timeTransform.getAppointHourStr(UTCDate, -timeInterval, 'yyyyMMddhhmmss');
				if(this.currentMenu.date_type == 'Day') {
					if(this.currentMenu.date_area == 'BJ') {
					    endDate = timeTransform.getAppointDateStr(BJDate, this.currentMenu.deviation, 'yyyyMMdd120000');
					    startDate = timeTransform.getAppointDateStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'yyyyMMdd000000');
					}else{
						endDate = timeTransform.getAppointDateStr(UTCDate, this.currentMenu.deviation, 'yyyyMMdd120000');
						startDate = timeTransform.getAppointDateStr(UTCDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'yyyyMMdd000000');
					}
					this.dataTime=`${timeTransform.getAppointDateStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'MM月dd日00时')}`;
					
				}else if(this.currentMenu.date_type == 'Hor') {
					if(this.currentMenu.date_area == 'BJ') {
					    endDate = timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation, 'yyyyMMddhh0000');
					    startDate = timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'yyyyMMddhh0000');
						console.log("wind.....111111111111111111111111111")
					}else{
						//go here////////////////////////
						console.log("wind.....122222222")
						endDate = timeTransform.getAppointHourStr(UTCDate, this.currentMenu.deviation, 'yyyyMMddhh0000');
						startDate = timeTransform.getAppointHourStr(UTCDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'yyyyMMddhh0000');
					}
					this.dataTime=`${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'MM月dd日hh时')}-${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation, 'MM月dd日hh时')}`;
					
				}else{
					if(this.currentMenu.date_area == 'BJ') {
					    startDate = timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'yyyyMMddhh0000');
					    endDate = timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation, 'yyyyMMddhh0000');
					}else{
						startDate = timeTransform.getAppointHourStr(UTCDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'yyyyMMddhh0000');
						endDate = timeTransform.getAppointHourStr(UTCDate, this.currentMenu.deviation, 'yyyyMMddhh0000');
					}
					this.dataTime=`${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval, 'MM月dd日hh时')}-${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation, 'MM月dd日hh时')}`;
			
				}	 
				
				// 根据是否存在“统计要素”，判识使用哪种接口（统计、查询接口）
				let reqUrl = app.API.wx_api;
				uni.showToast({ title: '加载中', icon: 'loading', duration: 1500 });
				if(this.currenEle == 'PRE') {
					if(this.currentMenu.eleCode != 'PRE_Time_0808') {
						reqUrl += `/statUdi/statDataByTimeRang?interfaceId=statDataByTimeRang&dataCode=${this.currentMenu.sta_dataCode}&timeRange=%5B${startDate},${endDate}%5D&elements=Station_Name,Admin_Code_CHN,Station_Id_C&statEles=${this.currentMenu.statCode}_SUM`;
					} else {
						// 当年统计
						reqUrl += `/statUdi/statDataByTimeRang?interfaceId=statDataByTimeRang&dataCode=SURF_NX_MUL_CURRYEAR_DAY&timeRange=%5B${startDate},${endDate}%5D&elements=Station_Name,Admin_Code_CHN,Station_Id_C&statEles=PRE_Time_0808_SUM,PRE_Time_0808_MMUT_SUM`;
					}
				} else if(this.currenEle == 'AIR') {
					reqUrl += `/queryUdi/getEleByTimeRange?interfaceId=getEleByTimeRange&dataCode=${this.currentMenu.sta_dataCode}&timeRange=%5B${startDate},${endDate})&elements=Lon,Lat,Station_Id_C,V_CITY,V_CITY_CODE,Station_SiteName,${this.currentMenu.eleCode}&orderBy=${this.currentMenu.eleCode}:${this.rankType}`;
				} else {
					if(this.currentMenu.eleCode == 'TEM_ChANGE_24h') {
						this.dataTime=`${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval-24, 'MM月dd日hh时')}-${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-1, 'MM月dd日hh时')}`;
					}
					if(this.currentMenu.eleCode == 'TEM_Min' || this.currentMenu.eleCode =='TEM_Max'){
						this.dataTime=`${timeTransform.getAppointHourStr(BJDate, this.currentMenu.deviation-this.currentMenu.timeInterval-24, 'MM月dd日')}`;
					}
					console.log("this.currentMenu.eleCode....",this.currentMenu.eleCode)
					reqUrl += `/queryUdi/getEleByTimeRange?interfaceId=getEleByTimeRange&dataCode=${this.currentMenu.sta_dataCode}&timeRange=%5B${startDate},${endDate})&elements=Station_Name,${this.currentMenu.eleCode},Admin_Code_CHN,Station_Id_C&orderBy=${this.currentMenu.eleCode}:${this.rankType}`; //&eleValieRanges=${this.currentMenu.eleCode}:(-999999,999990)
				}

				this.listData = [];
				this.renderListData = [];
				this.tempRegionArr2 = [];
				
				this.startDate = startDate;
				this.endDate = endDate;
				
				uni.request({
					url: reqUrl,
					header: {'Content-Type': 'application/json'},
					data: {
						key: app._apiKey
					},
					dataType: 'json',
					success: (res) => {
						if(res.data.DS.length > 0) {
							if(this.currenEle == 'PRE') {
								// 过滤并排序
								this.listData = res.data.DS.filter((item) => {
									return item[this.currentMenu.statCode + '_SUM'] > 0 && item[this.currentMenu.statCode + '_SUM'] < 2000;
								});
								
								this.listData.sort((obj1, obj2) => {
									return obj1[this.currentMenu.statCode + '_SUM'] < obj2[this.currentMenu.statCode + '_SUM'] ? 1 : -1;
								});
							} else {
								this.listData = res.data.DS.filter((item) => {
									return item[this.currentMenu.eleCode] != 999999;
								});
							}
							this.timeSelected = true;
							
							console.log("this.listData ",this.listData )
							
							this.tempListData   =  this.listData 
							//console.log("this.tempListData",this.tempListData)
							// 若选择了地区
							//this.listData = this.shengArr;
							//this.shiArr
							//this.renderListData = this.shengArr;
							var tempArr = [];
							tempArr = [];
							
							//if reset button is not activated
							if(!this.reset){
								
								if(this.shiArr.length>0){
									
									this.listData.forEach(el=>{
										this.allRegionData.forEach(ele=>{
											if(el.Station_Id_C === ele.Station_Id_C){
												tempArr.push(el)
											}
										})
									})
									
									this.listData = tempArr;
									
								} 
								
								else if(this.shengArr.length>0){
									this.listData.forEach(el=>{
										this.allRegionData.forEach(ele=>{
											if(el.Station_Id_C === ele.Station_Id_C){
												tempArr.push(el)
											}
										})
									})
									
									this.listData = tempArr;
								}
								
							} 
							//if reset button is activated
							else{
								this.listData = this.tempListData;
								//this.renderListData = this.tempListData;
					
							}
							
							
							
						
							this.dataIndex = 0;
							this.reloadList();
							//uni.hideToast();
						} else {
							uni.showToast({ title: '暂无数据！',  icon: 'error', duration: 3000 });
						}
					},
					fail: (e) => {
						uni.showToast({ title: '网络错误！', icon: 'error', duration: 3000 });
					},
					
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
			}
		},
	}
</script>

<style lang="less">
	.disableColor{
		color:lightgrey !important;
	}
	.resetImg{
		height: 30px;
		width:30px
	}
	.imgRank{
		width:18px;
		height:18px;
	}
	.picker-view {
	  height: 200rpx;
	}
	.item {
	  height: 98rpx!important;
	  text-align: center; // 文字水平居中
	  font-size: 32rpx;
	  line-height: 98rpx; // 让height = line-height文字就可垂直居中
	  color: #333;
	}
	.picker-box {
		height: 98rpx!important;
	}

	.custom-region{
		padding: 0px 10px 0px 10px;
		display:flex;
		justify-content: flex-end;
		background-color: #fff;
	}
	.rank_btn2{
		margin: 0;
		font-size: 20rpx;
		color: #5E5E5E;
		border-radius: 15px;
		border: #A5C0D9 solid 1px;
		background-color: #fff;
		padding: 4px 14px 4px 14px;
		margin-right:.5em;
		    
		
	}
	page {
		background-color: #E6EDF4;
	}
	.container {
		font-size: 28rpx;
	}
	.rank-menu {
		display: flex;
		justify-content: space-around;
		white-space: nowrap;
		height: 50px;
		line-height: 50px;
		padding: 0 10px;
		background-color: #fff;
		margin-bottom: 2px;
		.rank-menu__list {
			height: 30px;
			margin: 10px 0;
			line-height: 30px;
			flex: 1;
			text-align: center;
			.menu__list-item {
				font-weight: 700;
			}
			&.active {
				background: #CBE2EB;
				border-radius: 10px;
			}
		}
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
						width: 100px;
						text-align: center;
						.fs12 {
							font-size: 18rpx;
						}
					}
					.list_item-val-0808 {
						width: 205px;
						text-align: right;
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
			font-size: 12px;
			color: #5E5E5E;
		}
	}
</style>
