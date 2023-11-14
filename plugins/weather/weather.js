import makePy from '../tools/makePy.js';

const textArr = ["晴", "阴", "多云", "雨夹雪", "小雨", "中雨", "阵雨", "小雪", "中雪", "大雪", "大雨", "雾", "暴雨", "雷阵雨", "阵雪", "暴雪", "扬沙", "大暴雨", "霾", "浮尘", "晴转多云", "小雪转晴", "多云转晴", "多云间晴", "多云转阴", "多云间阴", "晴转阴", "阴转多云", "多云转小雪", "阵雪转晴", "晴转阵雪", "小雪转多云", "小雨转多云", "晴转小雪", "多云转雨夹雪", "多云转阵雪", "阵雨转多云", "多云转小雨", "多云转阵雨", "阵雪转小雪", "阴转小雪", "小雪转阴", "阵雪转多云", "阴转晴", "阴转阵雪", "阵雪转阴", "扬沙转多云", "扬沙转晴", "浮尘转晴", "晴转雨夹雪", "多云转中雪", "晴转中雪", "阴转小雨", "小雨转中雨", "小雨转阴", "中雨转多云", "中雨转小雨", "阴转中雨", "多云转中雨", "小雨转大雨", "阵雨转中雨", "阵雨转大雨", "阴转大雨", "雾转多云", "阵雨转小雨", "中雨转阴", "晴转小雨", "多云转大雨", "小雨转暴雨", "阵雨转晴", "小雨转晴", "阵雨转中到大雨", "小雨转阵雨", "阵雨转阴", "雨夹雪转晴", "雨夹雪转多云", "小雨转小雪", "小雪转雨夹雪", "阴转阵雨", "小雨转小到中雨", "小到中雨转小雨", "小到中雨转阴", "晴转阵雨", "中雨转阵雨", "阵雨转雷阵雨", "多云转大雪", "阴转中雪", "阴转大雪", "雨夹雪转阴", "雨夹雪转小雪", "小雨转大雪", "雨夹雪转大雪", "雨夹雪转中雪", "中雨转小雪", "中雨转中雪", "晴转大雪", "小雨转雨夹雪", "阴转雨夹雪", "多云转雾", "小雪转阵雪", "小雪转中雪", "多云转小到中雪", "中雪转多云", "中雪转小雪", "大雪转小雪", "中雨转大雨", "阵雨转雨夹雪", "多云转小到中雨", "小到中雨", "小到中雨转阵雨", "小雨转阵雪", "雷阵雨转多云", "雷阵雨转阵雨", "多云转扬沙", "晴转扬沙", "扬沙转阴", "浮尘转霾", "晴转霾", "霾转阴", "霾转多云", "霾转晴", "小到中雪转多云", "大雪转多云", "雨夹雪转小雨", "大雨转阴", "浮尘转多云", "多云转霾", "晴转雾","晴间多云", "小雨转中雪", "阵雨转小雪", "晴转雷阵雨", "阴转雾"]

const textObj = {
	0: '晴',
	1: '多云',
	2: '阴',
	3: '阵雨',
	4: '雷阵雨',
	5: '冰雹',
	6: '雨夹雪',
	7: '小雨',
	8: '中雨',
	9: '大雨',
	10: '暴雨',
	11: '大暴雨',
	12: '特大暴雨',
	13: '阵雪',
	14: '小雪',
	15: '中雪',
	16: '大雪',
	17: '暴雪',
	18: '雾',
	19: '冻雨_l',
	20: '沙尘暴',
	21: '小雨转中雨',
	22: '中雨转大雨',
	23: '大雨转暴雨',
	24: '暴雨转大暴雨',
	25: '大暴雨转特大暴雨',
	26: '小雪转中雪',
	27: '中雪转大雪',
	28: '大雪转暴雪',
	29: '浮尘',
	30: '扬沙',
	31: '强沙尘暴',
	32: '雨',
	33: '雪',
	53: '霾'
}

const weather = {}
// 过滤textArr
for (let i = 0; i < textArr.length; i++) {
  const res = makePy(textArr[i])[0].toLowerCase();
  weather[textArr[i]] = {
    name: textArr[i],
    type: res,
    image: res
  }
}

const weather2 = {}
for (let key in textObj) {
	let t = textObj[key].split('_');
	const res = makePy(t[0])[0].toLowerCase();
	weather2[key] = {
		key: key,
		name: t[0],
		type: res,
		image: t[1] ? t[1] + res : res
	}
}

// 包含白天和晚上的
const hasDN = ['晴', '多云', '阵雨', '晴转多云', '小雪转晴' ,'多云转晴'];

function queryWeather(str, state = '') {
  const _obj = weather[str];
  const _has = hasDN.includes(str);
  return {
    ..._obj,
    image: _has ? state + "-" + _obj.image : _obj.image
  }
}

function queryWeather2(str, state = '') {
  const _obj = weather2[str];
  const _has = hasDN.includes(textObj[str]);
  return {
    ..._obj,
    image: _has ? state + "-" + _obj.image : _obj.image
  }
}

// 风向
function __getWinDByUV(u, v) {
	let fx = 999.9;
	if (u > 0 & v > 0) {
	　　fx = 270 - Math.atan(v / u) * 180 / Math.PI;
	} else if (u < 0 & v > 0) {
	　　fx = 90 - Math.atan(v / u) * 180 / Math.PI;
	} else if (u < 0 & v < 0) {
	　　fx = 90 - Math.atan(v / u) * 180 / Math.PI;
	} else if (u > 0 & v < 0) {
	　　fx = 270 - Math.atan(v / u) * 180 / Math.PI;
	} else if (u == 0 & v > 0) {
	　　fx = 180;
	} else if (u == 0 & v < 0) {
	　　fx = 0;
	} else if (u > 0 & v == 0) {
	　　fx = 270;
	} else if (u < 0 & v == 0) {
	　　fx = 90;
	} else if (u == 0 & v == 0) {
	　　fx = 999.9;
	}
}
function queryWinD(u, v) {
	const windDir = __getWinDByUV(u, v);
	return queryWinDir(windDir);
}
function queryWinDir(windDir) {
	if(windDir == 999999) return '-';
	else if (windDir >= 22.5 && windDir < 67.5) return "东北风";
	else if (windDir >= 67.5 && windDir < 112.5) return "东风";
	else if (windDir >= 112.5 && windDir < 157.5) return "东南风";
	else if (windDir >= 157.5 && windDir < 202.5) return "南风";
	else if (windDir >= 202.5 && windDir < 247.5) return "西南风";
	else if (windDir >= 247.5 && windDir < 292.5) return "西风";
	else if (windDir >= 292.5 && windDir < 337.5) return "西北风";
	else return "北风";
}
// 风速
function __getWinSByUV(u, v) {
	return Math.sqrt(Math.pow(u, 2) + Math.pow(v, 2));
}
function queryWinS(u, v) {
	const speed = __getWinSByUV(u, v);
	return queryWinSpeed(speed);
}

function queryWinSpeed(speed) {
	if(speed <= 0 || speed == 999999) return '-';
	else if(speed > 0 && speed <= 0.2) return '无风';
	else if(speed > 0.2 && speed <= 1.5) return '1级';
	else if(speed > 1.5 && speed <= 3.3) return '2级';
	else if(speed > 3.3 && speed <= 5.4) return '3级';
	else if(speed > 5.4 && speed <= 7.9) return '4级';
	else if(speed > 7.9 && speed <= 10.7) return '5级';
	else if(speed > 10.7 && speed <= 13.8) return '6级';
	else if(speed > 13.8 && speed <= 17.1) return '7级';
	else if(speed > 17.1 && speed <= 20.7) return '8级';
	else if(speed > 20.7 && speed <= 24.4) return '9级';
	else if(speed > 24.4 && speed <= 28.4) return '10级';
	else if(speed > 28.4 && speed <= 32.6) return '11级';
	else if(speed > 32.6 && speed <= 36.9) return '12级';
	else if(speed > 36.9 && speed <= 41.4) return '13级';
	else if(speed > 41.4 && speed <= 46.1) return '14级';
	else if(speed > 46.1 && speed <= 50.9) return '15级';
	else if(speed > 50.9 && speed <= 56.0) return '16级';
	else if(speed > 56.0 && speed <= 61.2) return '17级';
	else if(speed > 61.2) return '17级以上';
}
function dataCheck(data){
	if(data=='999999'){
		return '';
	}else{
		return data;
	}
};
function getEleName(data){
	if(data=='V_QUAL'){
		return '空气质量级别';
	}else if(data=='V_PPOLLU'){
		return '首要污染物';
	}else if(data=='V15823'){
		return 'CO浓度';
	}else if(data=='V15810'){
		return 'SO2浓度';
	}else if(data=='V15826_01'){
		return 'O3 1小时浓度';
	}else if(data=='V15826_08'){
		return 'O3 8小时浓度';
	}else if(data=='PM2p5_Densty'){
		return 'PM2.5';
	}else if(data=='PM10_Densty_Fore'){
		return 'PM10';
	}else{
		return data;
	}
};
	
export {
	queryWeather,
	queryWeather2,
	queryWinD,
	queryWinS,
	queryWinSpeed,
	queryWinDir,
	dataCheck,
	getEleName
}