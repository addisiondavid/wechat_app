(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-actual-rank"],{2301:function(t,e,a){"use strict";a.r(e);var n=a("8a5b"),i=a.n(n);for(var r in n)"default"!==r&&function(t){a.d(e,t,(function(){return n[t]}))}(r);e["default"]=i.a},"27b3":function(t,e,a){var n=a("31f9");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=a("4f06").default;i("982c597a",n,!0,{sourceMap:!1,shadowMode:!1})},"31f9":function(t,e,a){var n=a("24fb");e=n(!1),e.push([t.i,"uni-page-body[data-v-ff210abc]{background-color:#e6edf4}.container[data-v-ff210abc]{font-size:%?28?%}.rank-menu[data-v-ff210abc]{display:flex;justify-content:space-around;white-space:nowrap;height:50px;line-height:50px;padding:0 10px;background-color:#fff;margin-bottom:2px}.rank-menu .rank-menu__list[data-v-ff210abc]{height:30px;margin:10px 0;line-height:30px;flex:1;text-align:center}.rank-menu .rank-menu__list .menu__list-item[data-v-ff210abc]{font-weight:700}.rank-menu .rank-menu__list.active[data-v-ff210abc]{background:#cbe2eb;border-radius:10px}.rank-main .rank-main__header[data-v-ff210abc]{display:flex;justify-content:space-around;height:30px;line-height:30px;padding:10px;margin-bottom:2px;background-color:#fff}.rank-main .rank-main__header uni-image[data-v-ff210abc]{width:18px;height:18px;vertical-align:text-bottom}.rank-main .rank-main__header .rank_search-time[data-v-ff210abc]{flex:1;padding-left:10px;font-size:%?28?%;color:#000}.rank-main .rank-main__header .rank_btn[data-v-ff210abc]{margin:0;line-height:30px;font-size:%?24?%;color:#5e5e5e;border-radius:15px;border:#a5c0d9 solid 1px;background-color:#fff}.rank-main .rank-main__list[data-v-ff210abc]{padding:0 10px;background-color:#fff;font-family:Poppins;font-style:normal;font-weight:400}.rank-main .rank-main__list .main__list-text[data-v-ff210abc]{display:flex;justify-content:space-between;padding:10px 0;font-size:%?24?%;color:#000}.rank-main .rank-main__list .main__list-list[data-v-ff210abc]{padding-bottom:20px}.rank-main .rank-main__list .main__list-list .list-list_item[data-v-ff210abc]{height:40px;line-height:40px;display:flex;background:#f1f4f8;border-radius:5px;padding:0 10px;margin-bottom:2px;font-size:%?28?%;color:#000}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-title[data-v-ff210abc]{flex-grow:1;white-space:nowrap}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-val[data-v-ff210abc]{width:100px;text-align:center}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-val .fs12[data-v-ff210abc]{font-size:%?18?%}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-val-0808[data-v-ff210abc]{width:150px;text-align:right}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-jump[data-v-ff210abc]{width:30px;text-align:center}.rank-main .rank-main__list .main__list-list .list-list_item .list_item-jump uni-image[data-v-ff210abc]{width:20px;height:20px;vertical-align:middle}.rank_search-box .uni-date[data-v-ff210abc]{border-color:#a5c0d9}.rank_search-box .uni-date-editor[data-v-ff210abc]{font-size:12px;color:#5e5e5e}body.?%PAGE?%[data-v-ff210abc]{background-color:#e6edf4}",""]),t.exports=e},"37af":function(t,e,a){"use strict";a.r(e);var n=a("9af5"),i=a("2301");for(var r in i)"default"!==r&&function(t){a.d(e,t,(function(){return i[t]}))}(r);a("dc6d");var s,o=a("f0c5"),c=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"ff210abc",null,!1,n["a"],s);e["default"]=c.exports},"8a5b":function(t,e,a){"use strict";var n=a("4ea4");a("99af"),a("4de4"),a("26e9"),a("fb6a"),a("4e82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=n(a("2909")),r=n(a("b018")),s=n(a("4501")),o=getApp().globalData,c={data:function(){return{currenEle:"",shici_conf_data:null,currentDataCode:"",unit:"",currentMenu:"",isCanSearch:!0,rankType:"desc",listData:[],dataTime:"".concat(r.default.getAppointDateStr(new Date,-1,"MM月dd日hh时"),"-").concat((new Date).Format("dd日hh时")),loadMoreStatus:"noMore",isInfiniting:!0,dataIndex:0,renderListData:[]}},onLoad:function(t){if(console.log("actual page",t),!t.ele)return!1;this.currenEle=t.ele;var e=s.default[this.currenEle],a=e.name,n=e.conf,i=e.unit,r=e.dataCode;this.shici_conf_data=n,this.currentDataCode=r,this.unit=i,this.currentMenu=n[0],this.isCanSearch=!(!this.currentMenu||void 0!=this.currentMenu.isCanSearch),uni.setNavigationBarTitle({title:"宁夏".concat(a,"排行")})},onShow:function(){this.getListData()},onReachBottom:function(){this.loadMoreList()},methods:{menuToggle:function(t){this.currentMenu=t,this.rankType="asc"===this.currentMenu.rankType?"asc":"desc",this.isCanSearch=!(!this.currentMenu||void 0!=this.currentMenu.isCanSearch),this.getListData()},rankTypeChange:function(){this.rankType="asc"===this.currentMenu.rankType?"asc":"desc",this.listData=this.listData.reverse(),this.dataIndex=0,this.renderListData=[],this.reloadList()},goToVIew:function(t){console.log(this.renderListData),uni.navigateTo({url:"./stationDetail?Station_Id_C=".concat(t.Station_Id_C,"&Station_Name=").concat(t.Station_Name,"&ele=").concat(this.currenEle,"&subEle=").concat(this.currentMenu.eleCode),fail:function(t){console.log(t)}})},dateChange:function(t){var e=new Date(t);this.getListData(e)},getListData:function(t){var e=this,a=this.currentMenu.timeInterval,n=new Date;t&&(n=t);var i=r.default.toTimeWorld(n),s=i.Format("yyyyMMddhhmmss"),c=r.default.getAppointHourStr(i,-a,"yyyyMMddhhmmss");"Day"==this.currentMenu.date_type?("BJ"==this.currentMenu.date_area?(s=r.default.getAppointDateStr(n,this.currentMenu.deviation,"yyyyMMdd120000"),c=r.default.getAppointDateStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval,"yyyyMMdd000000")):(s=r.default.getAppointDateStr(i,this.currentMenu.deviation,"yyyyMMdd120000"),c=r.default.getAppointDateStr(i,this.currentMenu.deviation-this.currentMenu.timeInterval,"yyyyMMdd000000")),this.dataTime="".concat(r.default.getAppointDateStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval,"MM月dd日00时"))):"Hor"==this.currentMenu.date_type?("BJ"==this.currentMenu.date_area?(s=r.default.getAppointHourStr(n,this.currentMenu.deviation,"yyyyMMddhh0000"),c=r.default.getAppointHourStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval,"yyyyMMddhh0000")):(s=r.default.getAppointHourStr(i,this.currentMenu.deviation,"yyyyMMddhh0000"),c=r.default.getAppointHourStr(i,this.currentMenu.deviation-this.currentMenu.timeInterval,"yyyyMMddhh0000")),this.dataTime="".concat(r.default.getAppointHourStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval,"MM月dd日hh时"),"-").concat(r.default.getAppointHourStr(n,this.currentMenu.deviation,"MM月dd日hh时"))):("BJ"==this.currentMenu.date_area?(c=r.default.getAppointHourStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval,"yyyyMMddhh0000"),s=r.default.getAppointHourStr(n,this.currentMenu.deviation,"yyyyMMddhh0000")):(c=r.default.getAppointHourStr(i,this.currentMenu.deviation-this.currentMenu.timeInterval,"yyyyMMddhh0000"),s=r.default.getAppointHourStr(i,this.currentMenu.deviation,"yyyyMMddhh0000")),this.dataTime="".concat(r.default.getAppointHourStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval,"MM月dd日hh时"),"-").concat(r.default.getAppointHourStr(n,this.currentMenu.deviation,"MM月dd日hh时")));var u=o.API.wx_api;uni.showToast({title:"加载中",icon:"loading",duration:1500}),"PRE"==this.currenEle?"PRE_Time_0808"!=this.currentMenu.eleCode?u+="/statUdi/statDataByTimeRang?interfaceId=statDataByTimeRang&dataCode=".concat(this.currentMenu.sta_dataCode,"&timeRange=%5B").concat(c,",").concat(s,"%5D&elements=Station_Name,Station_Id_C&statEles=").concat(this.currentMenu.statCode,"_SUM"):u+="/statUdi/statDataByTimeRang?interfaceId=statDataByTimeRang&dataCode=SURF_NX_MUL_CURRYEAR_DAY&timeRange=%5B".concat(c,",").concat(s,"%5D&elements=Station_Name,Station_Id_C&statEles=PRE_Time_0808_SUM,PRE_Time_0808_MMUT_SUM"):"AIR"==this.currenEle?u+="/queryUdi/getEleByTimeRange?interfaceId=getEleByTimeRange&dataCode=".concat(this.currentMenu.sta_dataCode,"&timeRange=%5B").concat(c,",").concat(s,")&elements=Lon,Lat,Station_Id_C,V_CITY,Station_SiteName,").concat(this.currentMenu.eleCode,"&orderBy=").concat(this.currentMenu.eleCode,":").concat(this.rankType):("TEM_ChANGE_24h"==this.currentMenu.eleCode&&(this.dataTime="".concat(r.default.getAppointHourStr(n,this.currentMenu.deviation-this.currentMenu.timeInterval-24,"MM月dd日hh时"),"-").concat(r.default.getAppointHourStr(n,this.currentMenu.deviation-1,"MM月dd日hh时"))),u+="/queryUdi/getEleByTimeRange?interfaceId=getEleByTimeRange&dataCode=".concat(this.currentMenu.sta_dataCode,"&timeRange=%5B").concat(c,",").concat(s,")&elements=Station_Name,").concat(this.currentMenu.eleCode,",Station_Id_C&orderBy=").concat(this.currentMenu.eleCode,":").concat(this.rankType)),this.listData=[],this.renderListData=[],uni.request({url:u,header:{"Content-Type":"application/json"},data:{key:o._apiKey},dataType:"json",success:function(t){t.data.DS.length>0?("PRE"==e.currenEle?(e.listData=t.data.DS.filter((function(t){return t[e.currentMenu.statCode+"_SUM"]>0&&t[e.currentMenu.statCode+"_SUM"]<2e3})),e.listData.sort((function(t,a){return t[e.currentMenu.statCode+"_SUM"]<a[e.currentMenu.statCode+"_SUM"]?1:-1}))):e.listData=t.data.DS.filter((function(t){return 999999!=t[e.currentMenu.eleCode]})),e.dataIndex=0,e.reloadList()):uni.showToast({title:"暂无数据！",icon:"error",duration:3e3})},fail:function(t){uni.showToast({title:"网络错误！",icon:"error",duration:3e3})}})},loadMoreList:function(){var t=Math.floor(this.listData.length/200)-1;this.dataIndex>t?this.loadMoreStatus="noMore":(this.loadMoreStatus="loading",this.dataIndex++,this.reloadList())},reloadList:function(){var t;(t=this.renderListData).push.apply(t,(0,i.default)(this.listData.slice(200*this.dataIndex,200*this.dataIndex+200)))}}};e.default=c},"9af5":function(t,e,a){"use strict";a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return n}));var n={uniDatetimePicker:a("f28b").default,uniLoadMore:a("0771").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"container"},[n("v-uni-view",{staticClass:"rank-menu"},t._l(t.shici_conf_data,(function(e,a){return t.shici_conf_data.length>1?n("v-uni-view",{key:a,staticClass:"rank-menu__list",class:{active:t.currentMenu.name===e.name},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.menuToggle(e)}}},[n("v-uni-text",{staticClass:"menu__list-item"},[t._v(t._s(e.name))])],1):t._e()})),1),n("v-uni-view",{staticClass:"rank-main"},[n("v-uni-view",{staticClass:"rank-main__header"},["desc"===t.rankType?n("v-uni-button",{staticClass:"rank_btn",attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.rankTypeChange.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:a("752a")}}),t._v("降序")],1):n("v-uni-button",{staticClass:"rank_btn",attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.rankTypeChange.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:a("3574")}}),t._v("升序")],1),n("v-uni-text",{staticClass:"rank_search-time"},[t._v(t._s(t.dataTime))]),t.isCanSearch?n("v-uni-view",{staticClass:"rank_search-box"},[n("uni-datetime-picker",{attrs:{border:"true"},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.dateChange.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:a("3c8b")}}),t._v("查询")],1)],1):t._e()],1),n("v-uni-view",{staticClass:"rank-main__list"},[n("v-uni-view",{staticClass:"main__list-text"},[n("v-uni-text",[t._v("共"+t._s(t.listData.length)+"站点"+t._s("PRE"==t.currenEle?"有降水":""))]),n("v-uni-text",[t._v("基于宁夏自治区28个国家站、900个区域站资料")])],1),n("v-uni-view",{staticClass:"main__list-list"},[0==t.listData.length?n("v-uni-view",{staticClass:"noData"},[n("v-uni-image",{attrs:{src:"/static/images/noData.png",mode:"heightFix"}}),n("v-uni-text",[t._v("暂无数据！")])],1):t._l(t.renderListData,(function(e,i){return n("v-uni-view",{key:e.Station_Id_C,staticClass:"list-list_item"},[n("v-uni-text",{staticClass:"list_item-title"},[t._v(t._s(i+1)+"."+t._s(e.Station_Name||e.V_CITY+"["+e.Station_SiteName+"]"))]),n("v-uni-text",{staticClass:"list_item-val",class:{"list_item-val-0808":"PRE_Time_0808"===t.currentMenu.eleCode}},[t._v(t._s(t.currentMenu.statCode?e[t.currentMenu.statCode+"_SUM"]:e[t.currentMenu.eleCode])),"PRE_Time_0808"===t.currentMenu.eleCode?[t._v("/"+t._s(e["PRE_Time_0808_MMUT_SUM"])),n("v-uni-text",{staticClass:"fs12"},[t._v("(常年值)")])]:t._e(),t._v(t._s(t.unit))],2),n("v-uni-view",{staticClass:"list_item-jump",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.goToVIew(e)}}},[n("v-uni-image",{attrs:{src:a("cc03")}})],1)],1)})),n("uni-load-more",{attrs:{status:t.loadMoreStatus,iconType:"snow"}})],2)],1)],1)],1)},r=[]},cc03:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGiSURBVHgBlZTdbcIwFIWTIB548wbtCKnEn3ip2aBMQLoBG1BG6ATABB2BPCEED80I7QTNG1KUn56TOpbrWkmxZDnY5365PvcGz+sY0+n0nrNL57s2h8Oh7PV666qqQt/3hXEUl2W5v1wuu1YQ34zgrQLsscZBECRFUQiABSAR9pcEYn0+nU4ff0AKcsBjCtHCFNkvA/CNmWLOG13QCJgJIYPBQB+Ox+MnG8SzLMvm0KcqxtOg0WgUYZHMJI7jlHthGNKbLWBrG5YkSYorL2gB/dQgbPLeO/M6FEM4x+PKBaOWPrIoGsRsYOjeFqM6SRuMxWDyNajpEdBTzzFM2GQyWZlnrCgWMZvN7rTZ/X7/y+sYAAoLpH8HvCsrkOf5gysYhWBPsS1ez+fzi3mGNqhBx+PxM1DXSjDlLRCVYd2cdUYKtMGyNL8plr8NorTs9N9FgpEHzHcppTDE0nMMaqhlTLOnzea3g0Vcr9dDkxn8i12ZUEOtivmJt0Wq7SXmjr3FtkDTpTCWfj3iPFKeuj9aCxgpI2Wzx8oqwMaVaef47x/bN1q37khGjoE7AAAAAElFTkSuQmCC"},dc6d:function(t,e,a){"use strict";var n=a("27b3"),i=a.n(n);i.a}}]);