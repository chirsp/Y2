/**
 * 封装常见的方法,变量
 */

import config from '../siteinfo.js'

//拼接请求域名
let _api = "";
if (config.acid != -1) {
	let siteroot = config.siteroot.substr(0, siteinfo.siteroot.indexOf("app/index.php")); //截取域名
	_api = siteroot + "addons/kejia_travel/travel/core/web/index.php?_acid=" + config.acid + "&r=";
} else {
	_api = config.domain + 'index.php?s=';
}
// let _api_root = _api+'/api'
const x = {}

x.dev = true;

// #ifdef H5 
if(x.dev){
	x._api_root = '/loc/index.php?s=';
}else{
	x._api_root  = _api
} 
// #endif

// #ifndef H5
   x._api_root  = _api
// #endif



x._img_root = config.domain;
// 
x.ajax = function(url, data, success, method, loading,uId) {
	let uid = x.getStorage('kejia_order_uid');
	let token = x.getStorage('kejia_order_token');
	let openId = x.getStorage('kejia_order_openId');
	data.version = config.version;
	//data.openid=openId;
	if (loading) {
      uni.showLoading({
      	title:"加载中"
      })
	} 
	if(!uId){
		data.uid = uid;
	}
	data.token = token;
	data.uniacid = config.uniacid;
	console.log(data)
	// uni.showNavigationBarLoading()
	method = method === 'post' || method === 'POST' ? 'POST' : 'GET'
	uni.request({
		url: x._api_root + url,
		method: method,
		sslVerify: false,
		header: method === 'post' || method === 'POST' ? {
			'content-type': 'application/x-www-form-urlencoded'
		} : {
			'content-type': 'application/json'
		},
		data: data,
		success: function(res) {
			// console.log('【接口回调】',res)
		    uni.hideLoading()
			var ret = res.data
			let code = parseInt(ret.code)
			if (code == 0 || code == 2 || code == 3) {
				'function' === typeof success && success(ret)
			} else if (code == 1) {
				if (ret.msg == '参数错误') {
					x.alert('网络开小差，请稍后再试')
				} else {
					x.alert(ret.msg);
				}
			} else if (code == -99) {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/login/login'
				});
				// #endif

				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/login/login1'
				});
				// #endif

			} else {
				console.log(res)
				x.alert('网络开小差了，请稍后再试')
			}
		},
		fail: function(err) {
			// x.dev && console.log(err);
			// x.alert('请求异常');
		},
		complete: function(res) {
			uni.hideNavigationBarLoading();
			uni.stopPullDownRefresh();
			switch (res.statusCode) {
				case 408:
					x.toast('亲，网速不给力哟~')
					break;
				default:
					break;
			}
			if (x.dev) {
				// console.log(method+'请求地址:'+x._api_root+url+'状态码：'+res.statusCode)
			}
		}
	})
}

//  上传图片
x.uploadImg =function(url, data, success,loading){
	       if(loading){
			   uni.showLoading({
			   	title:'上传中'
			   })
		   }
			let token = uni.getStorageSync('kejia_order_token')
			uni.uploadFile({
				url: _api + url + '?token=' + data.token + '&shop_id=' + data.shop_id +
					'&uniacid=' + 1,
				filePath:data.imgUrl,
				name: 'image',
				success: (uploadFileRes) => {
					loading && uni.hideLoading()
					let data = JSON.parse(uploadFileRes.data);
					 success(data.data)
					return
				},
			       
			})
		},

// scene解码
x.scene_decode = function(e) {
	if (e === undefined)
	  return {};
	let scene = decodeURIComponent(e),
	  params = scene.split(','),
	  data = {};
	for (let i in params) {
	  var val = params[i].split(':');
	  val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
	}
	return data;		    
},		  

//页面跳转
x.openWin = function(name) {
	uni.navigateTo({
		url: name
	});
}

// 提示框
x.modelShow = function modelShow(
	title = '提示',
	content = '确认执行此操作吗?',
	callback = () => {},
	showCancel = true,
	cancelText = '取消',
	confirmText = '确定'
) {
	uni.showModal({
		title: title,
		content: content,
		showCancel: showCancel,
		cancelText: cancelText,
		confirmText: confirmText,
		cancelText: cancelText,
		success: function(res) {
			if (res.confirm) {
				// 用户点击确定操作
				setTimeout(() => {
					callback()
				}, 500)
			} else if (res.cancel) {
				// 用户取消操作
			}
		}
	})
}
//alert
x.alert = function(msg, title, cb) {
	title = title || '友情提示'
	uni.showModal({
		title: title,
		content: msg,
		showCancel: false,
		success(res) {
			if (res.confirm) {
				cb && cb();
			}
		}
	})
};

//toast
x.toast = function(msg, icon, duration) {
	icon = icon || 'none';
	duration = duration || 1500;
	uni.showToast({
		title: msg,
		icon: icon,
		duration: duration
	});
};

//操作成功后，的提示信息
x.successToShow = function successToShow(msg = '保存成功', callback = function() {}) {
	setTimeout(function() {
		uni.showToast({
			title: msg,
			icon: 'success',
			duration: 1000,
			success() {
				setTimeout(function() {
					callback()
				}, 500)
			}
		})
	}, 100)

}

//操作失败的提示信息
x.errorToShow = function errorToShow(msg = '操作失败', callback = function() {}) {
	setTimeout(function() {
		uni.showToast({
			title: msg,
			icon: 'none',
			duration: 1500,
			success() {
				setTimeout(function() {
					callback()
				}, 1500)
			}
		})
	}, 100)

}
x.setStorage = function(name, value) {
	uni.setStorageSync(name, value)
}

x.getStorage = function(name) {
	return uni.getStorageSync(name)
}
//移除
x.del = function del(key, sync = true) {
	try {
		if (sync) {
			return uni.removeStorageSync(key);
		} else {
			uni.removeStorage({
				key: key
			});
		}
	} catch (e) {
		return false;
	}
}
x.format = function(timestr) {
	let d = new Date(timestr * 1000)
	let yy = d.getFullYear()
	let mm = d.getMonth() + 1
	mm = mm < 10 ? '0' + mm : mm
	let dd = d.getDate()
	dd = dd < 10 ? '0' + dd : dd;
	let h = d.getHours();
	h = h < 10 ? '0' + h : h;
	let m = d.getMinutes();
	m = m < 10 ? '0' + m : m;
	let s = d.getSeconds();
	s = s < 10 ? '0' + s : s;
	return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s
}

x.format2 = function(timestr) {
	let d = new Date(timestr)
	let yy = d.getFullYear()
	let mm = d.getMonth() + 1
	mm = mm < 10 ? '0' + mm : mm
	let dd = d.getDate()
	dd = dd < 10 ? '0' + dd : dd
	return yy + '-' + mm + '-' + dd
}

x.getParam = function(path, name) {
	var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
	if (reg.test(path))
		return unescape(RegExp.$2.replace(/\+/g, " "));
	return "";
}

x.tempToast = function() {
	x.toast('该功能即将开放，敬请期待');
}

x.trim = function(str) {
	return str.replace(/^\s*/, "");
}

/**
 *
 *  判断是否在微信浏览器 true是
 */
x.isWeiXinBrowser = function isWeiXinBrowser() {
	// #ifdef H5
	// window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
	let ua = window.navigator.userAgent.toLowerCase()
	// 通过正则表达式匹配ua中是否含有MicroMessenger字符串
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true
	} else {
		return false
	}
	// #endif

	return false
}

// 检验空字符
x.isEmpty = function(obj) {
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		if (typeof obj == "undefined" || obj == null || obj == "" || re.test(obj)) {
			return true;
		} else {
			return false;
		}
	},
		

x.wxPay = function(info, url) {
	var that = this
	// #ifdef MP-WEIXIN
	console.log("【小程序支付接口回调】")
	uni.requestPayment({
		provider: 'wxpay',
		timeStamp: info.timeStamp,
		nonceStr: info.nonceStr,
		package: info.package,
		signType: 'MD5',
		paySign: info.paySign,
		success: function(res) {
			x.toast('支付成功', 'success');
			setTimeout(function() {
				if (url) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateBack();
				}
			}, 1000)
		},
		fail: function(err) {
			console.log('fail:' + JSON.stringify(err));
			// that.$api.alert('未支付', '友情提示');
			uni.showToast({
				title: '未支付',
				mask: true,
				icon: 'none',
				duration: 2000
			})
		}
	});
	// #endif

	// #ifdef APP-PLUS
	// APP支付
	uni.getProvider({
		service: 'payment',
		success: function(res) {
			let orderInfo = JSON.stringify(info)
			// console.log("【APP支付接口回调啾啾啾】",orderInfo)
			uni.requestPayment({
				provider: "wxpay",
				orderInfo: orderInfo, //微信、支付宝订单数据
				success: function(res) {
					// console.log("成功：",res)
					uni.showToast({
						icon: "none",
						title: "支付成功"
					})
					uni.navigateBack(-1)
				},
				fail: function(err) {
					// console.log("失败：",err)
					uni.showToast({
						title: '订单已取消',
						mask: true,
						icon: 'none',
						duration: 2000
					})
					return false
				}
			});
		}
	})
	// #endif
}


	export default x
