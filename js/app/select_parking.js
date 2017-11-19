define(['mui', 'mall'], function(mui, $) {
	mui.init();
	var old_back = mui.back;
	mui.plusReady(function() {
		webviewInit();

		//	根据小区获取停车场列表
		$.receiveHandler(function(id) {
			plus.storage.setItem('sourceWeb', "owner_car_parking_add.html");
			getZonesParking();
		}, 'getParking');

	});

	//	获取车场信息
	function getZonesParking() {
		console.log('select zone getZonesParking');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/' + zoneId + '/parking/list/0/99';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取停车场信息：' + JSON.stringify(data));
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
							submitSelect(id[0], id[1]);
						}
					});
				});

			} else {
				mui.toast('当前没有停车场信息');
			}

		}).fail(function(status) {
			console.log('出错了');
			document.querySelector('.search-result').classList.remove('mui-hidden');
			statusHandler(status);
		});

	}

	//	点击确认选择楼层
	function submitSelect(id, name) {
		var sourceWeb = plus.storage.getItem('sourceWeb');
		var web = plus.webview.getWebviewById(sourceWeb);
		//		var web = plus.webview.getWebviewById('owner_car_parking_add.html');
		mui.fire(web, 'sendParking', {
			id: id,
			name: name
		});
		mui.back();
	}

	mui.back = function() {
		document.querySelector('.classify-list').innerHTML = '';
		document.querySelector('.search-result').classList.remove('mui-hidden');
		old_back();
	}

});