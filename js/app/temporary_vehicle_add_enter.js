define(['mui', 'mall'], function(mui, $) {
	mui.init();
	var old_back = mui.back;
	mui.plusReady(function() {
		webviewInit();

		//	根据小区获取停车场列表
		$.receiveHandler(function(id) {
			getZonesEnter();
		}, 'showEnter');

	});

	//	获取入口信息
	function getZonesEnter() {
		console.log('select zone getZonesEnter');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/' + zoneId + '/2/camera/list/0/99';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取入口摄像头信息：' + JSON.stringify(data));
			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				$.render('tpl/select_parking_data.html', data).then(function(html) {
					$.setValue('.classify-list', html);
					$.tapHandler({
						selector: '.classify-list li',
						id: 'id',
						callback: function(id) {
							console.log(id);
							id = id.split(':');
							console.log(typeof id[2]);
							console.log(id[2])
							submitSelect(id[0], id[1], id[2]);
						}
					});
				});

			} else {
				mui.toast('当前没有入口信息');
			}

		}).fail(function(status) {
			console.log('出错了'+status);
			document.querySelector('.search-result').classList.remove('mui-hidden');
			statusHandler(status);
		});

	}

	//	点击确认选择入口
	function submitSelect(id, name, sn) {
		var web = plus.webview.getWebviewById('temporary_vehicle_add.html');
		mui.fire(web, 'sendEnter', {
			id: id,
			name: name,
			sn:sn
		});
		mui.back();
	}

	mui.back = function() {
		document.querySelector('.classify-list').innerHTML = '';
		document.querySelector('.search-result').classList.remove('mui-hidden');
		old_back();
	}

});