(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-actual-rankAdd"],{"2a29":function(t,a,e){"use strict";e.r(a);var n=e("eaa0"),i=e("af89");for(var s in i)"default"!==s&&function(t){e.d(a,t,(function(){return i[t]}))}(s);e("5730");var r,o=e("f0c5"),c=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"614e9cac",null,!1,n["a"],r);a["default"]=c.exports},5730:function(t,a,e){"use strict";var n=e("93f2"),i=e.n(n);i.a},"5eb8":function(t,a,e){"use strict";var n=e("4ea4");e("99af"),e("4de4"),e("26e9"),e("fb6a"),e("4e82"),e("ac1f"),e("5319"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var i=n(e("2909")),s=n(e("b018")),r=n(e("4501")),o=getApp().globalData,c={data:function(){return{currenEle:"",shici_conf_data:null,currentDataCode:"",unit:"",currentMenu:"",rankType:"desc",listData:[],dataTime:"".concat(s.default.getAppointDateStr(new Date,-1,"MM月dd日hh时"),"-").concat((new Date).Format("dd日hh时")),loadMoreStatus:"noMore",isInfiniting:!0,dataIndex:0,renderListData:[]}},onLoad:function(t){if(console.log("actual page",t),!t.ele)return!1;this.currenEle=t.ele;var a=r.default[this.currenEle],e=a.name,n=a.conf,i=a.unit,s=a.dataCode;this.shici_conf_data=n,this.currentDataCode=s,this.unit=i,this.currentMenu=n[0],uni.setNavigationBarTitle({title:"宁夏".concat(e,"累加排行")})},onShow:function(){this.getListData(new Date(s.default.getAppointHourStr(new Date,-1,"yyyy/MM/dd hh:mm")),new Date)},onReachBottom:function(){this.loadMoreList()},methods:{rankTypeChange:function(){this.rankType="desc"===this.rankType?"asc":"desc",this.listData=this.listData.reverse(),this.dataIndex=0,this.renderListData=[],this.reloadList()},dateChange:function(t){console.log("date:",t),this.getListData(new Date(t[0].replace("-","/")),new Date(t[1].replace("-","/")))},getListData:function(t,a){var e=this;t.setMinutes(0);var n=s.default.toTimeWorld(t).Format("yyyyMMddhhmmss"),i=s.default.toTimeWorld(a).Format("yyyyMMddhhmmss");s.default.toTimeWorld(new Date);this.dataTime="".concat(t.Format("MM月dd日hh时"),"-").concat(a.Format("dd日hh时")),uni.showToast({title:"加载中",icon:"loading",duration:1500}),this.listData=[],this.renderListData=[],uni.request({url:"".concat(o.API.wx_api,"/statUdi/statDataByTimeRang?interfaceId=statDataByTimeRang&dataCode=").concat(this.currentDataCode,"&timeRange=%5B").concat(n,",").concat(i,")&elements=Station_Name,Station_Id_C&statEles=").concat(this.currentMenu.statCode,"_SUM"),header:{"Content-Type":"application/json"},data:{key:o._apiKey},dataType:"json",success:function(t){console.log("call-here-----------------:",t),t.data.DS.length>0?(console.log("left:,this",t),"PRE"==e.currenEle?(e.listData=t.data.DS.filter((function(t){return t[e.currentMenu.statCode+"_SUM"]>0&&t[e.currentMenu.statCode+"_SUM"]<2e3})),e.listData.sort((function(t,a){return t[e.currentMenu.statCode+"_SUM"]<a[e.currentMenu.statCode+"_SUM"]?1:-1}))):e.listData=t.data.DS.filter((function(t){return 999999!=t[e.currentMenu.eleCode]})),e.dataIndex=0,e.reloadList()):uni.showToast({title:"暂无数据！",icon:"error",duration:3e3})},fail:function(t){uni.showToast({title:"网络错误！",icon:"error",duration:3e3})}})},loadMoreList:function(){var t=Math.floor(this.listData.length/200)-1;this.dataIndex>t?this.loadMoreStatus="noMore":(this.loadMoreStatus="loading",this.dataIndex++,this.reloadList())},reloadList:function(){var t;(t=this.renderListData).push.apply(t,(0,i.default)(this.listData.slice(200*this.dataIndex,200*this.dataIndex+200)))}}};a.default=c},"93f2":function(t,a,e){var n=e("b31a");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=e("4f06").default;i("60a99214",n,!0,{sourceMap:!1,shadowMode:!1})},af89:function(t,a,e){"use strict";e.r(a);var n=e("5eb8"),i=e.n(n);for(var s in n)"default"!==s&&function(t){e.d(a,t,(function(){return n[t]}))}(s);a["default"]=i.a},b31a:function(t,a,e){var n=e("24fb");a=n(!1),a.push([t.i,"uni-page-body[data-v-614e9cac]{background-color:#e6edf4}.container[data-v-614e9cac]{font-size:%?28?%}.rank-main .rank-main__header[data-v-614e9cac]{display:flex;justify-content:space-around;height:30px;line-height:30px;padding:10px;margin-bottom:2px;background-color:#fff}.rank-main .rank-main__header uni-image[data-v-614e9cac]{width:18px;height:18px;vertical-align:text-bottom}.rank-main .rank-main__header .rank_search-time[data-v-614e9cac]{flex:1;padding-left:10px;font-size:%?28?%;color:#000}.rank-main .rank-main__header .rank_btn[data-v-614e9cac]{margin:0;line-height:30px;font-size:%?24?%;color:#5e5e5e;border-radius:15px;border:#a5c0d9 solid 1px;background-color:#fff}.rank-main .rank-main__list[data-v-614e9cac]{padding:0 10px;background-color:#fff;font-family:Poppins;font-style:normal;font-weight:400}.rank-main .rank-main__list .main__list-text[data-v-614e9cac]{display:flex;justify-content:space-between;padding:10px 0;font-size:%?24?%;color:#000}.rank-main .rank-main__list .main__list-list[data-v-614e9cac]{padding-bottom:20px}.rank-main .rank-main__list .main__list-list .list-list_item[data-v-614e9cac]{height:40px;line-height:40px;display:flex;background:#f1f4f8;border-radius:5px;padding:0 10px;margin-bottom:2px;font-size:%?28?%;color:#000}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-title[data-v-614e9cac]{flex-grow:1;white-space:nowrap}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-val[data-v-614e9cac]{width:50px;text-align:center}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-jump[data-v-614e9cac]{width:30px;text-align:center}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-jump uni-image[data-v-614e9cac]{width:20px;height:20px;vertical-align:middle}.rank_search-box .uni-date[data-v-614e9cac]{border-color:#a5c0d9}.rank_search-box .uni-date-editor[data-v-614e9cac]{font-size:%?24?%;color:#5e5e5e}body.?%PAGE?%[data-v-614e9cac]{background-color:#e6edf4}",""]),t.exports=a},eaa0:function(t,a,e){"use strict";e.d(a,"b",(function(){return i})),e.d(a,"c",(function(){return s})),e.d(a,"a",(function(){return n}));var n={uniDatetimePicker:e("f28b").default,uniLoadMore:e("0771").default},i=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("v-uni-view",{staticClass:"container"},[n("v-uni-view",{staticClass:"rank-main"},[n("v-uni-view",{staticClass:"rank-main__header"},["desc"===t.rankType?n("v-uni-button",{staticClass:"rank_btn",attrs:{type:"default"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.rankTypeChange.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:e("752a")}}),t._v("降序")],1):n("v-uni-button",{staticClass:"rank_btn",attrs:{type:"default"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.rankTypeChange.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:e("3574")}}),t._v("升序")],1),n("v-uni-text",{staticClass:"rank_search-time"},[t._v(t._s(t.dataTime))]),n("v-uni-view",{staticClass:"rank_search-box"},[n("uni-datetime-picker",{attrs:{type:"datetimerange","hide-second":"true",border:"true"},on:{change:function(a){arguments[0]=a=t.$handleEvent(a),t.dateChange.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:e("3c8b")}}),t._v("查询")],1)],1)],1),n("v-uni-view",{staticClass:"rank-main__list"},[n("v-uni-view",{staticClass:"main__list-text"},[n("v-uni-text",[t._v("共"+t._s(t.listData.length)+"站点"+t._s("PRE"==t.currenEle?"有降水":""))]),n("v-uni-text",[t._v("基于宁夏自治区28个国家站、900个区域站资料")])],1),n("v-uni-view",{staticClass:"main__list-list"},[0==t.listData.length?n("v-uni-view",{staticClass:"noData"},[n("v-uni-image",{attrs:{src:"/static/images/noData.png",mode:"heightFix"}}),n("v-uni-text",[t._v("暂无数据！")])],1):t._l(t.renderListData,(function(a,e){return n("v-uni-view",{key:a.Station_Id_C,staticClass:"list-list_item"},[n("v-uni-text",{staticClass:"list_item-title"},[t._v(t._s(e+1)+"."+t._s(a.Station_Name||a.V_CITY+"("+a.Station_Id_C+")"))]),n("v-uni-text",{staticClass:"list_item-val"},[t._v(t._s(t.currentMenu.statCode?a[t.currentMenu.statCode+"_SUM"]:a[t.currentMenu.eleCode])+t._s(t.unit))])],1)})),n("uni-load-more",{attrs:{status:t.loadMoreStatus,iconType:"snow"}})],2)],1)],1)],1)},s=[]}}]);