define(['mui', 'mall'], function(mui, $) {
	mui.init();

	mui.plusReady(function() {
		webviewInit();

		//	获取小区楼栋信息
		$.receiveHandler(function(id) {
			plus.storage.setItem('sourceWeb',"owner_car.html");
			getZonesBuild();
		}, 'getBuilding');
		
		//	获取小区楼栋信息
		$.receiveHandler(function(id) {
			plus.storage.setItem('sourceWeb',"owner_pay.html");
			getZonesBuild();
		}, 'getPayBuilding');


	});

	//获取小区楼栋
	function getZonesBuild() {
		console.log('select zone getZonesBuild');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/' + zoneId + '/building';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取小区楼栋：' + JSON.stringify(data));
			document.querySelector('.search-result').classList.add('mui-hidden');
			var json = {
				dataList: data
			}
			$.render('tpl/select_build_data.html', json).then(function(html) {
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
	function submitSelect(build) {
		var sourceWeb = plus.storage.getItem('sourceWeb');
		var web = plus.webview.getWebviewById(sourceWeb);
		mui.fire(web, 'sendBuild', {
			build: build
		});
		mui.back();
	}

});