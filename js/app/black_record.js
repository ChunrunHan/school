define(['mui', 'mall'], function(mui, $) {
		mui.init({
		swipeBack: true,
		subpages: [{
			url: 'black_record_sub.html',
			id: 'black_record_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('black_record plus ready');
		webviewInit();
		
		//	获取黑名单车辆信息
		$.receiveHandler(function() {
			var blacksub = plus.webview.getWebviewById('black_record_sub.html');
			mui.fire(blacksub, 'showblack');
		}, 'getBlack');
		
		$.tapHandler({
				selector: '.icon-add',
				url: 'black_record_add.html'
			});
		
		
	});
	
	

});
