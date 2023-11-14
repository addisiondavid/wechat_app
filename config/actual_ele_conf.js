import timeTransform from '../plugins/tools/timeTransform.js';
const ele_shici_conf = {
	PRE: {
		name: '降水量',
		unit: 'mm',
		dataCode: 'SURF_NX_MUL_HOR',
		conf: [
			{name: '1小时', eleCode: 'PRE_1h', timeInterval: 1, date_area:'UTC',deviation:0, date_type:'Hor',statCode: 'PRE_1h',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '6小时', eleCode: 'PRE_6h', timeInterval: 6, date_area:'UTC',deviation:0, date_type:'Hor',statCode: 'PRE_1h',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '24小时', eleCode: 'PRE_24h', timeInterval: 24, date_area:'UTC',deviation:0, date_type:'Hor',statCode: 'PRE_1h',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '48小时', eleCode: 'PRE_48h', timeInterval: 48, date_area:'UTC',deviation:0, date_type:'Hor',statCode: 'PRE_1h',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '72小时', eleCode: 'PRE_72h', timeInterval: 72, date_area:'UTC',deviation:0, date_type:'Hor',statCode: 'PRE_1h',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '当年', eleCode: 'PRE_Time_0808', date_type:'Hor',date_area:'UTC',deviation:0,timeInterval: timeTransform.calculatinTimeDifference(new Date(new Date().getFullYear() + '/01/01 00:00:00'), new Date(), 2), statCode: 'PRE_Time_0808', isCanSearch: false},
		]
	},
	TEM: {
		name: '气温',
		unit: '℃',
		dataCode: 'SURF_NX_MUL_HOR',
		conf: [
			{name: '逐小时气温', eleCode: 'TEM', timeInterval: 1, date_area:'UTC',deviation:0,date_type:'Hor',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '最低气温', eleCode: 'TEM_Min',rankType:'asc', timeInterval: 1, date_area:'UTC',deviation:0,date_type:'Day',sta_dataCode: 'SURF_NX_MUL_DAY'},
			{name: '最高气温', eleCode: 'TEM_Max', timeInterval: 1, date_area:'UTC',deviation:0,date_type:'Day',sta_dataCode: 'SURF_NX_MUL_DAY'},
			{name: '24小时变温', eleCode: 'TEM_ChANGE_24h', timeInterval: 1,date_area:'UTC',deviation:0, date_type:'Hor',sta_dataCode: 'SURF_NX_MUL_HOR'}
		]
	},
	WIN: {
		name: '风场',
		unit: 'm/s',
		dataCode: 'SURF_NX_MUL_HOR',
		conf: [
			{name: '最大风速', eleCode: 'WIN_S_Max', timeInterval: 1, date_area:'UTC',deviation:0,date_type:'Hor',sta_dataCode: 'SURF_NX_MUL_HOR'},
			{name: '极大风速', eleCode: 'WIN_S_Inst_Max', timeInterval: 1, date_area:'UTC',deviation:0,date_type:'Hor',sta_dataCode: 'SURF_NX_MUL_HOR'}
		]
	},
	AIR: {
		name: '环境监测',
		unit: '',
		dataCode: 'CAWN_MEE_AIR_EMO',
		conf: [
			{name: 'AQI', timeInterval: 1, eleCode: 'V_QUAL', date_type:'Hor',date_area:'UTC',deviation:0,sta_dataCode: 'CAWN_MEE_AIR_EMO'},
			{name: 'PM2.5', timeInterval: 1, eleCode: 'PM2p5_Densty', date_type:'Hor',date_area:'UTC',deviation:0,sta_dataCode: 'CAWN_MEE_AIR_EMO'},
			{name: 'PM10', timeInterval: 1, eleCode: 'PM10_Densty_Fore', date_type:'Hor',date_area:'UTC',deviation:0,sta_dataCode: 'CAWN_MEE_AIR_EMO'}
		]
	},
	RADAR: {
		name: '雷达拼图',
		dataCode: 'RADA_NX_PIC_FILE',
		conf: [
			{name: '银川市', areaCode: 'Z9951',timeRange:-2},
			{name: '固原市', areaCode: 'Z9954',timeRange:-2},
			{name: '吴忠市', areaCode: 'Z9953',timeRange:-2},
			{name: '宁夏全区', areaCode: 'ningxia',timeRange:-2}
		]
	},
	SATELLITE: {
		name: '风四云图',
		dataCode: 'SATE_NX_PIC_FILE',
		conf: [
			{name: '红外云图', eleCode: 'CH12',timeRange:-8},
			{name: '可见光云图', eleCode: 'CH01',timeRange:-8},
			{name: '水汽通道云图', eleCode: 'CH09',timeRange:-8},
		]
	}
};

export default ele_shici_conf;