define(['mui', 'mall'], function(mui, $) {
	mui.init();

	mui.plusReady(function() {
		webviewInit();

		//	获取小区楼栋单元楼层信息
		window.addEventListener('getFloor', getZonesFloor);

	});

	//获取小区楼栋单元楼层
	function getZonesFloor(e) {
		var build = e.detail.build;
		var unit = e.detail.unit;
		console.log('select zone getZonesFloor');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/' + zoneId + '/' + build +  '/'+ unit + '/floor';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取小区楼栋：' + JSON.stringify(data));
			document.querySelector('.search-result').classList.add('mui-hidden');
			var json = {
				dataList: data
			}
			$.render('tpl/select_floor_data.html', json).then(function(html) {
				$.setValue('.classify-list', html);
				$.tapHandler({
					selector: '.classify-list li',
					id: 'num',
					callback: function(id) {
						submitSelect(id);
					}
				});
			});

		}).fail(function(status) {
			console.log('出错了');
			document.querySelector('.search-result').classList.remove('mui-hidden');
			statusHandler(status);
		});

	}

	//	点击确认选择楼层
	function submitSelect(floor) {
		var sourceWeb = plus.storage.getItem('sourceWeb');
		var web = plus.webview.getWebviewById(sourceWeb);
		mui.fire(web, 'sendFloor', {
			floor: floor
		});
		mui.back();
	}

});