// 页面白名单
const whiteList = [
	'/',
	'/pages/me/index',
	'/pages/index/index',
	//'/pages/product/index'
]
console.log("empty")
function hasPermission (url) {
	console.log("pass")
	let access_token = uni.getStorageSync('access_token');
	// 在白名单中或有token，直接跳转
	if(whiteList.indexOf(url) !== -1 || access_token) {
		return true;
	}
	return false;
}

uni.addInterceptor('navigateTo', {
	// 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
	invoke (e) {
		console.log("navigateTo:",e.url)
		if(!hasPermission(e.url)) {
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
			return false
		}
		return true
	},
	success (e) {
		// console.log(e)
	}
})

uni.addInterceptor('switchTab', {
	// tabbar页面跳转前进行拦截，目前只对H5有效
	invoke (e) {
		console.log("switchTab",e.url)
		if(!hasPermission(e.url)) {
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
			return false
		}
		return true
	},
	success (e) {
		 console.log(e,"switchTab")
	}
})