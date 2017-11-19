define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
//		beforeback: function() {
//			var categorySubView = plus.webview.getWebviewById('goods_category_sub.html');
//			mui.fire(categorySubView, 'fireRefresh');
//			return true;
//		},
		subpages: [{
			url: 'property_announcement_sub.html',
			id: 'property_announcement_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('# property_announcement plusReady()');
		plus.screen.lockOrientation("portrait-primary");

		//	获取物业公告动态
		$.receiveHandler(function() {
			var propertysub = plus.webview.getWebviewById('property_announcement_sub.html');
			mui.fire(propertysub, 'propertyRefresh');
		}, 'getPropertyAnno');

		$.tapHandler({
			selector: '.icon-add',
			url: 'property_announcement_add.html'
		});


	});

});