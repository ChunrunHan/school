define(['mui', 'mall', 'updata'], function(mui, $, updata) {

	mui.init({
		preloadPages: [{
			url: 'account.html',
			id: 'account.html'
		}, {
			url: 'modify_mobile.html',
			id: 'modify_mobile.html'
		}, {
			url: 'forget_password.html',
			id: 'forget_password.html'
		}],
		swipeBack: true //启用右滑关闭功能
	});

	mui.plusReady(function() {
		console.log('#setting plusReady()');
		webviewInit();
		
		mui.preload({
			url: 'user_edit.html',
			id: 'user_edit.html'
		});
		var versions = document.querySelector('#versions');
			urlBaseP = plus.storage.getItem('urlBaseP');
			updata.setUrl(urlBaseP);	
		
		if(plus.os.name == 'iOS') {
			versions.style.backgroundColor = '#fff';
		} else {
			versions.addEventListener('tap', updata.updata);
		}

		//	获取当前版本号
		plus.runtime.getProperty(plus.runtime.appid, function(appinfo) {
			console.log(appinfo.version);
			$.setValue('#version', appinfo.version);
		});

		//	跳转账号管理页面
		$.tapHandler('.goAccount', 'account.html');

		//	跳转修改信息页面
		$.tapHandler({
			selector: '.goSellerEdit',
			url: 'user_edit.html',
			event: 'getInfo'
		});

		//	退出app	
		$.tapHandler({
			selector: '.logout',
			url: 'login.html',
			callback: function() {
				delDeviceToken(null);
				PropertyPluginFn();
				plus.PropertyPlugin.SetDisablePushNotification();
				plus.storage.clear();
				plus.runtime.restart();
				return false;
			}
		});

	});
	
	function delDeviceToken(deviceToken) {
	urlBaseP = plus.storage.getItem('urlBaseP');
	var url = urlBaseP + '/user/reset/devicetoken/' + deviceToken;
	console.log('updateDeviceToken' + url);
	$.put(url).then(function(data) {
		console.log(JSON.stringify(data));
		if(data.code === 0) {
			mui.toast('成功');
		} else {
			mui.toast('出错了');
		}

	}).fail(function(status) {
		statusHandler(status);
		console.log('updateDeviceToken失败' + status)
	});
}
	

});