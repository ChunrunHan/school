define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		subpages: [{
			url: 'sale_sub.html',
			id: 'sale_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('#sale_sub plusReady()');
		plus.screen.lockOrientation("portrait-primary");
		
		//	获取社区动态
		$.receiveHandler(function() {
			var communitysub = plus.webview.getWebviewById('sale_sub.html');
			mui.fire(communitysub, 'saleRefresh');
		}, 'getSale');
		
		$.tapHandler({
			selector: '.icon-add',
			url: 'sale_sub_add.html'
		});

		var old_back = mui.back;
		mui.back = function() {
			old_back();
		}

	});

});