class Utils {
    constructor() {
        this.hasOwnProperty = Object.prototype.hasOwnProperty;
        this.propIsEnumerable = Object.prototype.propertyIsEnumerable;
    }
    isObj(x) {
        let type = typeof x;
        return x !== null && (type === 'object' || type === 'function');
    }

    toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        return Object(val);
    }

    assignKey(to, from, key) {
        var val = from[key];
        if (val === undefined || val === null) {
            return;
        }
        if (this.hasOwnProperty.call(to, key)) {
            if (to[key] === undefined || to[key] === null) {
                throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
            }
        }
        if (!this.hasOwnProperty.call(to, key) || !this.isObj(val)) {
            to[key] = val;
        } else {
            to[key] = this.assign(Object(to[key]), from[key]);
        }
    }

    assign(to, from) {
        if (to === from) {
            return to;
        }
        from = Object(from);
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                this.assignKey(to, from, key);
            }
        }
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                    this.assignKey(to, from, symbols[i]);
                }
            }
        }
        return to;
    }

    deepAssign(target) {
        target = this.toObject(target);
        for (let s = 1; s < arguments.length; s++) {
            this.assign(target, arguments[s]);
        }
        return target;
    }
    /*
        根据中心经纬度，半径（公里）-> 计算正北、南、东、西经纬度
        @param {lon,lat,radius}
        @retrun {log: [], lat: []}
    */
    byCenterPointGetFourCoordinate({lon, lat, radius}) {
        const PI = 3.14159265;
        const degree = (24901 * 1609) / 360.0;
        const raidusMile = radius * 1000;

        const dpmLat = 1 / degree;
        const radiusLat = dpmLat * raidusMile;
        const minLat = (lat - radiusLat).toFixed(5);
        const maxLat = Math.abs((lat + radiusLat).toFixed(5));
        const mpdLng = degree * Math.cos(lat * (PI / 180));
        const dpmLng = 1 / mpdLng;
        const radiusLng = dpmLng * raidusMile;
        const minLng = (lon - radiusLng).toFixed(5);
        const maxLng = Math.abs((lon + radiusLng).toFixed(5));
        return {
            'lon': `[${minLng}, ${maxLng}]`,
            'lat': `[${minLat}, ${maxLat}]`
        }
    }

    /**
     * [getQueryString 获取url中的参数]
     * @param  {[type]} name [参数名称]
     * @return {[type]}      [参数值]
     */
    getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let result = window.location.search.substr(1) || window.location.hash.split("?")[1],
        resultM = (result && result.match(reg)) || null;
        return (resultM ? decodeURIComponent(resultM[2]) : null);
    }

    /**
     * [getNumberDigitValue 得到一个数的每一位数字]
     * @param  {[type]} num [数字]
     * @return {[type]}     [每一位数字的数组]
     */
    getNumberDigitValue(num) {
        let list = [];
        for(let i = 10000; i >= 1; parseInt(i /= 10)) {
			list.push(parseInt(num / i));
			num = num - (parseInt(num / i)) * i;
		}
        return list.reverse();
    }

    /**
     * 某个点是否在某个区域
     */
    isPointInPolygon(ALon, ALat, polygon) {
        let iSum = 0,iCount = polygon.length,
            dLon1, dLon2, dLat1, dLat2, dLon;
    	if (iCount < 3) return false;

    	for (let i = 0; i < iCount; i++) {
    		if (i == iCount - 1) {
    			dLon1 = polygon[i].lng;
    			dLat1 = polygon[i].lat;
    			dLon2 = polygon[0].lng;
    			dLat2 = polygon[0].lat;
    		} else {
    			dLon1 = polygon[i].lng;
    			dLat1 = polygon[i].lat;
    			dLon2 = polygon[i + 1].lng;
    			dLat2 = polygon[i + 1].lat;
    		}
    		//以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
    		if (((ALat >= dLat1) && (ALat < dLat2)) || ((ALat >= dLat2) && (ALat < dLat1))) {
    			if (Math.abs(dLat1 - dLat2) > 0) {
    				//得到 A点向左射线与边的交点的x坐标：
    				dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - ALat)) / (dLat1 - dLat2);
    				if (dLon < ALon)
    					iSum++;
    			}
    		}
    	}
    	if (iSum % 2 != 0) return true;
    	return false;
    }

    /**
     * [testColor 判断是否是合法的 颜色值]
     * @param  {[type]} color [颜色值]
     * @return {[type]}       [颜色值合法返回true，否则false]
     */
     testColor(color) {
        const re1 = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i,
              re2 = /^rgb\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\)$/i,
              re3 = /^rgba\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,(1|1.0|0.[0-9])\)$/i
        return re2.test(color) || re1.test(color) || re3.test(color);
    }

    /**
     * param 将要转为URL参数字符串的对象
     * key URL参数字符串的前缀
     * encode true/false 是否进行URL编码,默认为true
     * return URL参数字符串
     */
    urlEncode(param, key, encode) {
        if(param == null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (let i in param) {
                let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    }
	
	/*
	 * 设置本地缓存
	*/
	setlocal(id, val) {
		uni.setStorageSync(id, val);
	}
}
let utils = new Utils();

export default utils;
