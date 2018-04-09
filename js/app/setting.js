define(['mui', 'mall', 'updata'], function(mui, $, updata) {

	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	mui.plusReady(function() {
		console.log('#setting plusReady()');
		webviewInit();
		
		//	获取当前版本号
		plus.runtime.getProperty(plus.runtime.appid, function(appinfo) {
			console.log(appinfo.version);
			$.setValue('#version', appinfo.version);
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


});