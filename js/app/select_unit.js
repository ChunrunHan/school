define(['mui', 'mall'], function(mui, $) {
	mui.init();

	mui.plusReady(function() {
		webviewInit();

		//	获取楼层单元信息
		window.addEventListener('getUnit', getZonesUnit);

	});

	//获取小区楼栋
	function getZonesUnit(e) {
		var build = e.detail.build;
		build = parseInt(build);
		console.log('select zone getZonesBuild');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/' + zoneId + '/' + build +'/unit';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取楼层单元：' + JSON.stringify(data));
			document.querySelector('.search-result').classList.add('mui-hidden');
			var json = {
				dataList: data
			}
			$.render('tpl/select_unit_data.html', json).then(function(html) {
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

	//	点击确认选择单元
	function submitSelect(unit) {
		var sourceWeb = plus.storage.getItem('sourceWeb');
		var web = plus.webview.getWebviewById(sourceWeb);
		mui.fire(web, 'sendUnit', {
			unit: unit
		});
		mui.back();
	}

});