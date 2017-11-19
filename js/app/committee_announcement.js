define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		subpages: [{
			url: 'committee_announcement_sub.html',
			id: 'committee_announcement_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('#committee_announcement plusReady()');
		plus.screen.lockOrientation("portrait-primary");

		//	获取物业公告动态
		$.receiveHandler(function() {
			var propertysub = plus.webview.getWebviewById('committee_announcement_sub.html');
			mui.fire(propertysub, 'propertyRefresh');
		}, 'getPropertyAnno');


		$.tapHandler({
			selector: '.icon-add',
			url: 'committee_announcement_add.html'
		});

	});

});