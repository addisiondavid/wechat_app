let apiPublicUrl = '',
    apiPublicPort = '';
	
export default {
    /*-基础请求地址-*/
    baseUrl: `${apiPublicUrl}${apiPublicPort}`,
	/*-实时天气接口-*/
	weatherNow: `https://jcfw.qx121.com.cn/Json/ReaTimeLBS.ashx?key=2G6NW5z76npCDQk`,
	/*-临近预报接口-*/
	weatheForcest_near: `https://jcfw.qx121.com.cn/Json/WeatherGPS.ashx?key=Tv9neNwGYGXIMC0`,
	/*-一周预报接口-*/
	sevenforecast: `http://cloud.nx121.net/Json/ForecastAN7.ashx?key=BJvsXN8EpPaX92S`,
	/*-空气质量预报接口-*/
	airqualityrecast: `https://jcfw.qx121.com.cn/Json/AirQualityForecast.ashx?key=2fAUURViLq3uBmm`,
	/*-微信小程序-API*/
	wx_api: 'https://jcfw.qx121.com.cn'//'https://aid.huaxin-hitec.com'
};
