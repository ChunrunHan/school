define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			return true;
		}
	});

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		mui.preload({
			url: 'temporary_vehicle_add_floor.html',
			id: 'temporary_vehicle_add_floor.html'
		});
		
		//	进场时间默认为当前时间
		$.receiveHandler(function(id) {
			console.log("build: " + id);
			console.log(typeof id);
			document.querySelector(".unit-name").innerText = id + '号楼';
			getZonesUnit(id);
		}, 'sendBuild');
		

	});
	
	//	根据楼座获取单元
	function getZonesUnit(building) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/' + zoneId + '/' + building +'/unit';
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取楼栋单元：' + JSON.stringify(data));
			document.querySelector('.search-result').classList.add('mui-hidden');
			var json = {
				dataList: data
			}
			$.render('tpl/select_unit_data.html', json).then(function(html) {
				$.setValue('.unit-list', html);
				//	选择楼号单元
				$.tapHandler({
					selector: '.unit-list li',
					id: 'num',
					url: 'temporary_vehicle_add_floor.html',
					event: 'sendUnit',
					callback: function(id) {
						console.log(id);
						plus.storage.setItem('Tunit',id);
					}
					
				});
			});

		}).fail(function(status) {
			console.log('出错了');
			document.querySelector('.search-result').classList.remove('mui-hidden');
			statusHandler(status);
		});
	}

});