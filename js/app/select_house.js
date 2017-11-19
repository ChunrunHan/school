define(['mui', 'mall'], function(mui, $) {
	mui.init();

	mui.plusReady(function() {
		webviewInit();
		//	获取房屋信息
		window.addEventListener('getHouse', getZonesHouse);
	});

	//获取小区楼栋
	function getZonesHouse(e) {
		var build = e.detail.build;
		var unit = e.detail.unit;
		var floor = e.detail.floor;
		console.log('select zone getZonesHouse');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/' + zoneId + '/' + build +  '/'+ unit + '/' + floor + '/room';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取房屋信息：' + JSON.stringify(data));
			if(data.length != 0){
				document.querySelector('.search-result').classList.add('mui-hidden');
				var json = {
					dataList: data
				}
				$.render('tpl/select_house_data.html', json).then(function(html) {
					$.setValue('.classify-list', html);
					$.tapHandler({
						selector: '.classify-list li',
						id: 'num',
						callback: function(id) {
							submitSelect(id);
						}
					});
				});
			} else {
				document.querySelector('.classify-list').innerHTML = '';
				document.querySelector('.search-result').classList.remove('mui-hidden');
			}
			

		}).fail(function(status) {
			console.log('出错了');
			document.querySelector('.search-result').classList.remove('mui-hidden');
			statusHandler(status);
		});

	}

	//	点击确认选择楼层
	function submitSelect(house) {
		var sourceWeb = plus.storage.getItem('sourceWeb');
		var web = plus.webview.getWebviewById(sourceWeb);
		mui.fire(web, 'sendHouse', {
			house: house
		});
		mui.back();
	}

});