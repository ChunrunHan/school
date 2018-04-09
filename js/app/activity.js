define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		subpages: [{
			url: 'activity_sub.html',
			id: 'activity_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('# activity plusReady()');
		plus.screen.lockOrientation("portrait-primary");

		//	获取物业公告动态
		$.receiveHandler(function() {
			var sub = plus.webview.getWebviewById('activity_sub.html');
			mui.fire(sub, 'activityRefresh');
		}, 'getActivity');

	});

});