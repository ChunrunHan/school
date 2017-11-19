define(['mui', 'mall'], function(mui, $) {
	mui.init({
		subpages: [{
			url: 'common_telephone_sub.html',
			id: 'common_telephone_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}],
		swipeBack: true //启用右滑关闭功能

	});
	
	var telPriority;
	var telPriorityName;
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");

		//	新增电话
		$.tapHandler({
			selector: '.icon-add',
			url:'common_telephone_add.html'
		});
		
		//	获取所有电话信息
		$.receiveHandler(function() {
			var telsub = plus.webview.getWebviewById('common_telephone_sub.html');
			mui.fire(telsub, 'telRefresh');
		}, 'getTelephone');
		
		

	})


});