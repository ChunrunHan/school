var require = {
	baseUrl: 'js/',
	paths: {
		mui: 'lib/mui.min',
		md5: 'lib/md5.min',
		zoom: 'lib/mui.zoom',
		view: 'lib/mui.previewimage',
		q: 'lib/q.min',
		mustache: 'lib/mustache.min',
		mall: 'lib/mall',
		updata: 'lib/updata',
		clipImg: 'lib/clipImg',
		pick: 'lib/mui.picker',
		picker: 'lib/mui.picker.min',
		popPicker: 'lib/mui.poppicker'
	},
	shim: {　　　　
		mui: {
			exports: 'mui'
		},
		q: {
			exports: 'Q'
		},
		md5: {
			exports: 'md5'
		},
		mustache: {
			exports: 'mustache'
		},
		zoom: {
			exports: 'zoom'
		},
		view: {
			exports: 'view'
		},
		updata: {
			exports: 'updata'
		},
		clipImg: {
			exports: 'clipImg'
		},
		pick:{
			deps: ["mui"],
			exports: 'pick'
		},
		picker:{
			deps: ["mui"],
			exports: 'picker'
		},
		popPicker:{
			deps: ["mui"],
			exports: 'popPicker'
		}
	},
	waitSeconds: 0
};

var urlBase = 'http://www.rainrain.xin:12345/school';
//var urlBase = 'http://192.168.1.110:12345/school';
var bucketP;
//var appKey = '0de446ad-eae2-4e55-8a8e-04951d5c220b';
//var appSource = 'app_wuye';
//var appVer = '0.3';
var pid;
var userSsoId;
var mobileP;
var token;
var zoneId;
var zoneName;
var realname;
var nickname;
var avatar;
var userId;
var zonearea;

//var autoSwitchInServiceNum;
var listHouse;
var timer;
var size = 2;
var page = 0;
var pageSize = 12;
var time;
var delwithNum;

var ERROR = {
	FILE_INVALID: 1,
	INVALID_PARAMS: 2
}

//判断手机号格式
function checkMobile(mobile) {
	if(!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(mobile))) {
		mui.toast('手机号格式不正确');
		return false;
	} else {
		return true;
	}
}
//时间戳转时间
function formatDate(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
//时间戳转时间
function formatDateList(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

//时间戳转时间
function formatDateTime(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	return hour + ":" + minute;
}

//时间戳转日期
function formatDateDay(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	return month + "-" + date;
}
//星期几
function getMyDay(date) {
	var week;
	if(date.getDay() == 0) week = "星期日"
	if(date.getDay() == 1) week = "星期一"
	if(date.getDay() == 2) week = "星期二"
	if(date.getDay() == 3) week = "星期三"
	if(date.getDay() == 4) week = "星期四"
	if(date.getDay() == 5) week = "星期五"
	if(date.getDay() == 6) week = "星期六"
	return week;
}

//	uuid



//	获取验证码倒计时实现
var sec = 58;
var intervalid;

function runTime() {
	if(sec == 0) {
		sec = 58;
		document.querySelector('.get-time').innerHTML = "59秒";
		document.querySelector('.get-time').classList.add('mui-hidden');
		document.querySelector('.get-smscode').classList.remove('mui-hidden');
		clearInterval(intervalid);
	} else {
		document.querySelector('.get-time').innerHTML = sec-- + "秒";
	}

}

//	开启倒计时
function openRunTime() {
	document.querySelector('.get-smscode').classList.add('mui-hidden');
	document.querySelector('.get-time').classList.remove('mui-hidden');
	intervalid = setInterval(runTime, 1000);
}

//	关闭倒计时
function closeRunTime() {
	document.querySelector('.get-smscode').classList.remove('mui-hidden');
	document.querySelector('.get-time').classList.add('mui-hidden');
	clearInterval(intervalid);
}

//	数据不为空时隐藏提示，禁用上拉加载
function dataHaveHidden(id) {
	console.log(id);
	document.querySelector('.search-result').classList.add('mui-hidden');
	mui(id).pullRefresh().enablePullupToRefresh();
}

function getPulldownOptions(callback, auto) {
	return {
		height: 50,
		auto: auto,
		contentdown: "下拉可以刷新",
		contentover: "释放立即刷新",
		contentrefresh: "正在刷新...",
		callback: callback
	}
}

function getPullupOptions(callback) {
	return {
		contentrefresh: "正在加载...",
		contentnomore: '没有更多数据了',
		callback: callback
	}
}

function statusHandler(status) {
	console.log('statusHandler(' + status + ')');
	plus.nativeUI.closeWaiting();

	switch(status) {
		case 0:
			mui.toast('网络问题，请稍后再试');
			break;
		case ERROR.FILE_INVALID:
			mui.toast('无效的文件');
			break;
		case ERROR.INVALID_PARAMS:
			mui.toast('无效的参数');
			break;
		case 204:
//			mui.toast('没有内容，请稍候再试');
			break;
		case 401:
//			delDeviceTokenFromAndroid();
			plus.storage.clear();
			plus.runtime.restart();
			mui.toast('没有权限，请联系客服');
			break;
		case 403:
//			delDeviceTokenFromAndroid();
			plus.storage.clear();
			plus.runtime.restart();
			mui.toast('越权操作，请联系客服');
			break;
		case 404:
			mui.toast('请求地址错误，请联系客服');
			break;
		case 500:
			mui.toast('服务器出错啦，请稍候再试');
			break;
		default:
			mui.toast('未知错误，错误代码[' + status + ']');
	}
}

//	推送信息获得待处理报修
function openRepairSub() {
	var repair = plus.webview.getWebviewById('repair.html');
//	var index = plus.webview.getWebviewById('index.html');
	if(deal !== null) {
//		mui.fire(index, 'showUserRepair');
		mui.fire(repair, 'getDealRepair');
		mui.openWindow({
			url: 'repair.html'
		});

	} else {
		alert('请重启程序后，手动打开待配送查看');
	}

}
//	推送信息获取报警车辆数
//function openHtml() {
//	var index = plus.webview.getWebviewById('index.html');
//	if(index !== null) {
//		mui.fire(index, 'showWarnCar');
//		mui.openWindow({
//			url: 'index.html'
//		});
//
//	} else {
//		alert('请重启程序后，手动打开待验证查看');
//	}
//}

// 禁用横屏和滚动
function webviewInit() {
	plus.screen.lockOrientation("portrait-primary");
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
}

// 维修推送和报警推送判断
function openHtml(id) {
//	alert('推送返回的参数:' + id);
//	alert(typeof id);
//	if(plus.os.name == 'Android') {
			switch(id){
				//	物业公告
				case 'b02':
					mui.openWindow({
						url: 'property_announcement.html',
						id: 'property_announcement.html',
					});
					var propertysub = plus.webview.getWebviewById('property_announcement_sub.html');
					mui.fire(propertysub, 'propertyRefresh');
					break;
				//	新鲜事
				case 'c01':
					mui.openWindow({
						url: 'community_dynamics.html',
						id: 'community_dynamics.html',
					});
					var communitysub = plus.webview.getWebviewById('community_dynamics_sub.html');
					mui.fire(communitysub, 'communityRefresh');
					break;
				// 	业主报修
				case 'e08':
//					var delwithNum = plus.storage.getItem('repairNum');
//					if(delwithNum != '0') {
//						plus.audio.createPlayer('_www/Audio/newOrder.mp3').play();
//					}

					mui.openWindow({
						url: 'repair.html',
						id: 'repair.html',
					});
					var repairsub = plus.webview.getWebviewById('repair_sub.html');
					mui.fire(repairsub, 'repairRefresh',{
						num: 1
					});
					
				
//					if(typeof time !== 'undefined') {
//						clearInterval(time);
//					}
//					if(delwithNum != '0') {
//						time = setInterval(playPromptMusic, 60000);
//					}
					break;	
				//	物业建议
				case 'b08':
					mui.openWindow({
						url: 'advise_property.html',
						id: 'advise_property.html'
					});
					var advisesub = plus.webview.getWebviewById('advise_property_sub.html');
					mui.fire(advisesub, 'adviseRefresh');
					break;
				//	表扬物业
				case 'b04':
					mui.openWindow({
						url: 'praise_property.html',
						id: 'praise_property.html'
					});
					var praisesub = plus.webview.getWebviewById('praise_property_sub.html');
					mui.fire(praisesub, 'praiseRefresh');
					break;
				//	投诉物业
				case 'b05':
					mui.openWindow({
						url: 'critica_property.html',
						id: 'critica_property.html'
					});
					var criticasub = plus.webview.getWebviewById('critica_property_sub.html');
					mui.fire(criticasub, 'criticaRefresh');
					break;
				//	常用电话
				case 'b07':
					mui.openWindow({
						url: 'common_telephone.html',
						id: 'common_telephone.html'
					});
					var telsub = plus.webview.getWebviewById('common_telephone_sub.html');
					mui.fire(telsub, 'telRefresh');
					break;
				//	智慧停车
				case 'b12':
					mui.openWindow({
						url: 'vehicle_management.html',
						id: 'vehicle_management.html'
					});
					break;
				//	临时车辆
				case 'b1201':
					mui.openWindow({
						url: 'temporary_vehicle.html',
						id: 'temporary_vehicle.html'
					});
					var self = plus.webview.getWebviewById('temporary_vehicle.html');
					mui.fire(self, 'showin');
					break;
				//	进出记录
				case 'b1202':
					mui.openWindow({
						url: 'inout_record.html',
						id: 'inout_record.html'
					});
					var self = plus.webview.getWebviewById('inout_record.html');
					mui.fire(self, 'getPush');
					break;
				//	道闸控制
				case 'b1203':
					mui.openWindow({
						url: 'zone_switch.html',
						id: 'zone_switch.html'
					});
					break;
				//	续租缴费
				case 'b1204':
					mui.openWindow({
						url: 'owner_pay.html',
						id: 'owner_pay.html'
					});
					break;
				//	信息总览
				case 'b1205':
					mui.openWindow({
						url: 'owner_car.html',
						id: 'owner_car.html'
					});
					break;
				//	到期车位
				case 'b1206':
					mui.openWindow({
						url: 'expired_parking.html',
						id: 'expired_parking.html'
					});
					var sub = plus.webview.getWebviewById('expired_parking_sub.html');
					mui.fire(sub, 'expiredRefresh',{
						num: 0
					});
					break;
				//	异常车辆
				case 'b1207':
					mui.openWindow({
						url: 'warn_car.html',
						id: 'warn_car.html'
					});
					var sub = plus.webview.getWebviewById('warn_car_sub.html');
					mui.fire(sub, 'warnRefresh');
					break;
				//	白名单
				case 'b1208':
					mui.openWindow({
						url: 'white_record.html',
						id: 'white_record.html'
					});
					var self = plus.webview.getWebviewById('white_record.html');
					mui.fire(self, 'goup');
					break;
				//	黑名单
				case 'b1209':
					mui.openWindow({
						url: 'black_record.html',
						id: 'black_record.html'
					});
					var blacksub = plus.webview.getWebviewById('black_record_sub.html');
					mui.fire(blacksub, 'showblack');
					break;
				//	业主验证
				case 'e09':
					mui.openWindow({
						url: 'userauth.html',
						id: 'userauth.html'
					});
					var pending = plus.webview.getWebviewById('userauth.html');
					mui.fire(pending, 'pendRefresh');
					break;
				//	业委会公告
				case 'c04':
					mui.openWindow({
						url: 'committee_announcement.html',
						id: 'committee_announcement.html',
					});
					var sub = plus.webview.getWebviewById('committee_announcement_sub.html');
					mui.fire(sub, 'propertyRefresh');
					break;
				//	业委会财务
				case 'c0401':
					mui.openWindow({
						url: 'finance_manage.html',
						id: 'finance_manage.html',
					});
					var incomesub = plus.webview.getWebviewById('finance_manage.html');
					mui.fire(incomesub, 'incomeRefresh');
					break;
				
			}
			
//	} else {
//		mui.toast('IOS推送处理');
//	}

}

//function playPromptMusic() {
//	delwithNum = plus.storage.getItem('delwithNum');
//	console.log(delwithNum);
//	if(delwithNum != '0') {
//		if(plus.os.name == 'Android') {
//			plus.audio.createPlayer('_www/Audio/newOrder.mp3').play();
//		} else {
//			MallPluginFn();
//			plus.MallPlugin.PlayPromptMusic();
//		}
//	}
//
//	var indexsub = plus.webview.getWebviewById('index_sub.html');
//	mui.fire(indexsub, 'indexSubRefresh');
//
//	if(typeof time !== 'undefined') {
//		clearInterval(time);
//	}
//
//	if(delwithNum != '0') {
//		time = setInterval(playPromptMusic, 60000);
//	}
//
//}

function PropertyPluginFn() {
	var _BARCODE = 'PropertyPlugin',
		B = window.plus.bridge;
	PropertyPlugin = {
		SetDisablePushNotification: function(status, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.exec(_BARCODE, "SetDisablePushNotification", [callbackID, status]);
		},
		openHtml: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.exec(_BARCODE, "openHtml", [callbackID]);
		},
		GetDeviceToken: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.exec(_BARCODE, "GetDeviceToken", [callbackID]);
		},
		DownLoad: function(version, appUrl, appMd5, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.exec(_BARCODE, "DownLoad", [callbackID, version, appUrl, appMd5]);
		},
		nativeTakePhoto: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.execSync(_BARCODE, "nativeTakePhoto", [callbackID]);
		},
		recognizeCard: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.execSync(_BARCODE, "recognizeCard", [callbackID]);
		}
//		alipay: function(statement, successCallback, errorCallback) {
//			var success = typeof successCallback !== 'function' ? null : function(args) {
//					successCallback(args);
//				},
//				fail = typeof errorCallback !== 'function' ? null : function(code) {
//					errorCallback(code);
//				};
//			callbackID = B.callbackId(success, fail);
//
//			return B.exec(_BARCODE, "alipay", [callbackID, statement]);
//		}

	};
	window.plus.PropertyPlugin = PropertyPlugin;
};

//	 注销app,推送清除devicetoken


//	下拉刷新获取失败,停止下拉
function stopDownRefresh(Domid, isUp) {
	if(isUp === true) {
		mui(Domid).pullRefresh().endPullupToRefresh(false);
	} else {
		console.log(Domid);
		mui(Domid).pullRefresh().endPulldownToRefresh();
	}
}

//设置光标位置函数 
function setCursorPosition(ctrl, pos) {
	if(ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos, pos);
	} else if(ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

//	实时动态强制更改用户录入金额
function amount(th) {
	var regStrs = [
		['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0  
		['[^\\d\\.]+$', ''], //禁止录入任何非数字和点  
		['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点  
		['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上  
	];
	for(var i = 0; i < regStrs.length; i++) {
		var reg = new RegExp(regStrs[i][0]);
		th.value = th.value.replace(reg, regStrs[i][1]);
	}
}

//	录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全  
function overFormat(th) {
	var v = th.value;
	if(v === '0') {
		v = '0.00';
	} else if(v === '0.') {
		v = '0.00';
	} else if(/^0+\d+\.?\d*.*$/.test(v)) {
		v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
		v = inp.getRightPriceFormat(v).val;
	} else if(/^0\.\d$/.test(v)) {
		v = v + '0';
	} else if(!/^\d+\.\d{2}$/.test(v)) {
		if(/^\d+\.\d{2}.+/.test(v)) {
			v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
		} else if(/^\d+$/.test(v)) {
			v = v + '.00';
		} else if(/^\d+\.$/.test(v)) {
			v = v + '00';
		} else if(/^\d+\.\d$/.test(v)) {
			v = v + '0';
		} else if(/^[^\d]+\d+\.?\d*$/.test(v)) {
			v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
		} else if(/\d+/.test(v)) {
			v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
			ty = false;
		} else if(/^0+\d+\.?\d*$/.test(v)) {
			v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
			ty = false;
		} else {
			v = '0.00';
		}
	}
	th.value = v;
}

//	textarea禁止换行
function checkEnter(e) {
	var et = e || window.event;
	var keycode = et.charCode || et.keyCode;
	if(keycode == 13) {
		if(window.event)
			window.event.returnValue = false;
		else
			e.preventDefault(); //for firefox
	}
}
//让当前页面所有input失去焦点,关闭软键盘
function pickerBlur() {
	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].blur();
	}
}

//	返回当前时间戳
function currentTime() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year + "/" + month + "/" + date + " " + hour + ":" + minute;
	var date = new Date(currentdate);
	currentdate = date.getTime();
	return currentdate;
}
//  获得当前时间
function NowTimer() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year + month + date + hour + minute;
	return currentdate;
}

//  获得当前时间
function NowDate() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year + month + date;
	return currentdate;
}

//  获得当前时间
function NowDateAll() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year +"-"+ month +"-"+ date;
	return currentdate;
}
//  获得当前完整时间
function NowTimerAll() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
	return currentdate;
}

//  获得明天时间
function tomorrowTimer() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate() + 1;
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	var tomorrowTimer = year + "-" + month + "-" + date;
	return tomorrowTimer;
}

//时间戳转时间
function formatDay(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	return year + "-" + month + "-" + date
}

function currentShortTime() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	var currentdate = year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
	var date = new Date(currentdate);
	currentdate = date.getTime();
	return currentdate;
}


//JavaScript判断数组是否包含指定元素的方法
Array.prototype.contains = function(needle) {
	for(i in this) {
		if(this[i] == needle) return true;
	}
	return false;
}
//	求两个数组的不相同元素
function ArrydifferentE(a, b) {
	var  c  =   [];
	var  tmp  =  a.concat(b);
	var  o  =   {};
	for (var  i  =  0;  i  <  tmp.length;  i ++) (tmp[i]  in  o)  ?  o[tmp[i]] ++  :  o[tmp[i]]  =  1;
	for (x  in  o) 
		if (o[x]  ==  1)  c.push(x);
	return(c);
}
//	1.首页功能模块ID
var showIndexDom = ['parkingManage',
	'repairManage',
	'announcement',
	'praise',
	'complain',
	'suggest',
	'phoneManage',
	'carList',
	'carRecord',
	'openDoor',
	'ipms_house',
	'alertSpace',
	'alertCar',
	'whiteList',
	'blackList',
	'ipmsRent',
	'vipWhiteList',
	'undergroundWhiteList',
	'overgroundWhiteList',
	'ownersCommitteeAnnouncement',
	'ownersCommitteeManage',
	'ownersCommitteeFinance',
	'originalManage'
]

//判断安卓系统大于等于7.0的拍照不能调用相机

function photoSource() {
	console.log("OS version: " + plus.os.version);
	console.log("OS version: " + plus.os.name);
	var version = plus.os.version;
	var system = plus.os.name;
	var actionbuttons;
	if(version >= 7.0 && system == 'Android') {
		//	弹出系统选择按钮框
		actionbuttons = [{
			title: "相册选取"
		}];
	} else {
		//	弹出系统选择按钮框
		actionbuttons = [{
			title: "拍照"
		}, {
			title: "相册选取"
		}];
	}

	console.log(actionbuttons);

	var actionstyle = {
		title: "选择照片",
		cancel: "取消",
		buttons: actionbuttons
	};
	//	判断安卓系统大于7.0禁用拍照功能
	console.log("OS version: " + plus.os.version);
	console.log("OS version: " + plus.os.name);
	var version = plus.os.version;
	var system = plus.os.name;
	if(version >= 7.0 && system == 'Android') {
		plus.nativeUI.actionSheet(actionstyle, function(e) {
			//	索引值从0开始,即1表示点击buttons中定义的第一个按钮
			if(e.index == 1) {
				// 相册选取
				galleryImg();
			}
		});

	} else {
		plus.nativeUI.actionSheet(actionstyle, function(e) {
			//	索引值从0开始,即1表示点击buttons中定义的第一个按钮
			if(e.index == 1) {
				//	拍照操作
				getImage();
			} else if(e.index == 2) {
				// 相册选取
				galleryImg();
			}
		});
	}
}
// 安卓调用注销app,传devicetoken 为null.
//function delDeviceTokenFromAndroid() {
//	updateDeviceToken(null);
//}
//
//function updateDeviceTokenFromAndroid(deviceToken) {
//	updateDeviceToken(deviceToken);
//}

function updateDeviceToken(deviceToken) {
	urlBaseP = plus.storage.getItem('urlBaseP');
	var url = urlBaseP + '/user/reset/devicetoken/' + deviceToken;
	console.log('updateDeviceToken' + url);
	$.put(url).then(function(data) {
		console.log(JSON.stringify(data));
		if(data.code === 0) {
//			mui.toast('成功');
		} else {
//			mui.toast('出错了');
		}

	}).fail(function(status) {
		statusHandler(status);
		console.log('updateDeviceToken失败' + status)
	});
}
//没有数据时显示提示
function showTag(dom) {
	var lis = document.querySelectorAll(dom).length;
	if(lis == 0) {
		document.querySelector('.search-result').classList.remove('mui-hidden');
	} else {
		document.querySelector('.search-result').classList.add('mui-hidden');
	}
}

function showDomTag(dom,selector) {
	var lis = document.querySelectorAll(dom).length;
	if(lis == 0) {
		document.querySelector(selector).classList.remove('mui-hidden');
	} else {
		document.querySelector(selector).classList.add('mui-hidden');
	}
}

function getDateTimeBefor(publishtime) {
        var currTime = Date.parse(new Date());;
        var l = parseInt(currTime) - parseInt(publishtime);
        // 少于一分钟
        var time = l / 1000;
        if (time < 60) {
            return "刚刚";
        }

        // 秒转分钟
        var minuies = time / 60;
        if (minuies < 60) {
            return Math.floor(minuies) + "分钟前";
        }

        // 秒转小时
        var hours = time / 3600;
        if (hours < 24) {
            return Math.floor(hours) + "小时前";
        }
        //秒转天数
        var days = time / 3600 / 24;
        if (days < 30) {
            return Math.floor(days) + "天前";
        }
        //秒转月
        var months = time / 3600 / 24 / 30;
        if (months < 12) {
            return Math.floor(months) + "月前";
        }
        //秒转年
        var years = time / 3600 / 24 / 30 / 12;
        return Math.floor(years) + "年前";

    }


//  获得当前完整时间
function NowTimerThree() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year + '-' + month + '-' + date;
	return currentdate;
}
// 将时间转换成时间戳
function timeToLong(timer){
//	var timer = "2017/06/14 11:15"
	var date = new Date(timer);
	return date.getTime();
}

