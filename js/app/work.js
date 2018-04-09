define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		subpages: [{
			url: 'work_sub.html',
			id: 'work_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('# work plusReady()');
		plus.screen.lockOrientation("portrait-primary");

		//	获取动态
		$.receiveHandler(function() {
			var sub = plus.webview.getWebviewById('work_sub.html');
			mui.fire(sub, 'workRefresh');
		}, 'getWork');

	});

});