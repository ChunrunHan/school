define(['mui', 'mall'], function(mui, $) {
	mui.init({
		subpages: [{
			url: 'warn_car_sub.html',
			id: 'warn_car_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}],
		swipeBack: true //启用右滑关闭功能

	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		//	获取异常车辆信息
		$.receiveHandler(function() {
			var sub = plus.webview.getWebviewById('warn_car_sub.html');
			mui.fire(sub, 'warnRefresh');
		}, 'getWarnCar');
		
		

	})


});