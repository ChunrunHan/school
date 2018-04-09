define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		subpages: [{
			url: 'study_sub.html',
			id: 'study_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('# study plusReady()');
		plus.screen.lockOrientation("portrait-primary");

		//	获取动态
		$.receiveHandler(function() {
			var sub = plus.webview.getWebviewById('study_sub.html');
			mui.fire(sub, 'studyRefresh');
		}, 'getStudy');

	});

});