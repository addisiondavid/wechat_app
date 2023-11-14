// 为Date类 添加时间格式化原型方法 便于书写
Date.prototype.Format = function(fmt) {
    let o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}

class Time {
    constructor() {}
    // 世界时间转本地时间
    toTimeZone(time, offset = 8, format = 'yyyy/MM/dd hh:mm:ss') {
		
        time = time.split('');
        let newTime = time[0] + time[1] + time[2] + time[3] + '/' + time[4] + time[5] + '/' + time[6] + time[7] + ' ' + time[8] + time[9] + ':' + time[10] + time[11] + ':' + time[12] + time[13];
        let localTime = new Date(newTime).getTime();
        let wishTime = localTime + (3600000 * offset);
		//console.log("new Date(wishTime).Format(format)",new Date(wishTime).Format(format))
        return new Date(wishTime).Format(format);
    }
    // 本地时间转世界时间
    toTimeWorld(date, offset = -8) {
        let localTime = new Date(date).getTime();
        let wishTime = localTime + (3600000 * offset);
        return new Date(wishTime);
    }
    // 本地当前时间根据（天、时、分（分钟间隔））转据当前时间最近的世界时间点
    dateToTimeWorldBy(date, dateType = 1, dateStep = 0 , offset = -8) {
        let year = date.getFullYear(),month,day,hour,minute;
        date.setHours(date.getHours() + offset);
        let temDate;
        // 1-> 天 2->小时 3->分钟
        switch (dateType) {
            case 0:
            case 1:
                date.setDate(date.getDate());
                month = date.getMonth() + 1,
                day = date.getDate();
                temDate = `${year}/${month}/${day} 00:00:00`;
                break;
            case 2:
                date.setHours(date.getHours());
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours();
                temDate = `${year}/${month}/${day} ${hour}:00:00`;
                break;
            default:
                date.setMinutes(date.getMinutes());
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes();
                temDate = `${year}/${month}/${day} ${hour}:${minute}:00`;

        }
        let wordTime = this.toTimeWorld(temDate, 0);
        return wordTime;
    }
    // 本地当前时间根据（天、时、分（分钟间隔））转据当前时间最近的世界时间点
    dateToLatelyMinTime(date, dateStep = 1) {
        let year = date.getFullYear(),month,day,hour,minute;
        date.setMinutes(Math.floor(date.getMinutes() / dateStep) * dateStep);

        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes();
        return new Date(`${year}/${month}/${day} ${hour}:${minute}:00`);
    }
    // 指定据当前的前N天或后N天
    getAppointDateStr(date, AddDayCount, format = 'yyyy/MM/dd') {
        let localTime = date.getTime();
        let wishTime = localTime + (24 * 3600000 * AddDayCount);
        return new Date(wishTime).Format(format);
    }
    // 指定据当前的前N小时或后N小时
    getAppointHourStr(date, AddHourCount, format = 'yyyy/MM/dd hh:mm') {
		//console.log("date:",date)
		//console.log("AddHourCount:",AddHourCount)
		//console.log("format:",format)
        let localTime = date.getTime();
        let wishTime = localTime + (3600000 * AddHourCount);
        return new Date(wishTime).Format(format);
    }
    // 指定据当前的前N分钟或后N分钟
    getAppointMinStr(date, AddMinCount, format = 'yyyy/MM/dd hh:mm') {
        let localTime = date.getTime();
        let wishTime = localTime + (60000 * AddMinCount);
        return new Date(wishTime).Format(format);
    }
    // 指定据当前的前N月或后N月
    getAppointMonStr(date, AddMonCount, format = 'yyyy/MM/dd hh:mm') {
        var localTime = new Date(date.valueOf());
        localTime.setMonth(localTime.getMonth() + AddMonCount);
        return localTime.Format(format);
    }
    // 指定据当前的前N年或后N年
    getAppointYearStr(date, AddYearCount, format = 'yyyy/MM/dd hh:mm') {
        var localTime = new Date(date.valueOf());
        localTime.setFullYear(localTime.getFullYear() + AddYearCount);
        return localTime.Format(format);
    }
    /**
     * [dateClone 克隆时间对象]
     * @param  {[type]} time [时间对象]
     * @return {[type]}      [克隆的时间对象]
     */
    dateClone(time) {
        return new Date(time.valueOf());
    }
    /**
     * [calculatinTimeDifference 计算时间差]
     * @param  {[type]} start [开始时间]
     * @param  {[type]} end   [结束时间]
     * @param  {[type]} type  [计算时间差的类型【1：天， 2：小时 3：分钟 4：秒】]
     * @return {[type]}       [时间差]
     */
    calculatinTimeDifference(start, end, type) {
        let Millisecond = end.getTime() - start.getTime();
        let timeDifference = 0;
        switch (type) {
            case 1:
                timeDifference = Math.floor(Millisecond / (24 * 3600 * 1000));
                break;
            case 2:
                let leave1 = Millisecond % (24 * 3600 * 1000);
                timeDifference = Math.floor(Millisecond / (24 * 3600 * 1000)) * 24 + Math.floor(leave1 / (3600 * 1000));
                break;
            case 3:
                break;
            default:

        }
        return timeDifference;
    }

    /**
     * [getCountDays 获取一个月的天数]
     * @return {[type]} [一个月的天数]
     */
    getCountDays() {
        let curDate = new Date(),
            curMonth = curDate.getMonth();
        curDate.setMonth(curMonth + 1);
        curDate.setDate(0);
        return curDate.getDate();
    }

    /**
     * [secondConversion 秒转换为天，小时，分钟]
     * @param  {Number} [second=0] [秒]
     * @return {[type]}             [转换后的时间字符串]
     */
    secondConversion(second = 0) {
        let newtime = '',
            d = Math.floor(second / (3600 * 24)),
            h = Math.floor((second % (3600 * 24)) / 3600),
            m = Math.floor(((second % (3600 * 24)) % 3600) / 60);
        if (d > 0) {
            if (h === 0 && m === 0) {
                newtime= d + '天';
            } else {
                newtime= d + '天' + h + '小时' + m + '分';
            }
        } else {
            if (h != 0) {
                if (m === 0) {
                    newtime = h + '小时';
                } else {
                    newtime = h + '小时' + m + '分';
                }
            } else {
                newtime = m + '分';
            }
        }
        return newtime;
    }
	
	/**
	 * [isDaylight 这里夜间时间设置为23:00 -- 07:00]
	 * @param  {[null]}
	 * @return {[type]}       [夜间返回true，白天返回false]
	 */
	isDaylight(date) {
	    const currdate = date || new Date();
	    if(currdate.getHours() >= 23 || currdate.getHours() < 7) {
	    	return true;
	    } else {
	    	return false;
	    }
	}
	
	/**
	 *获取当前星期几
	 *
	*/
	getWeekDate() {
	    const now = new Date();
	    const day = now.getDay();
	    const weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	    const week = weeks[day];
	   return week;
	}
}
let time = new Time();

export default time;
