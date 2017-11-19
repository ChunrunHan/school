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
			url: 'temporary_vehicle_add_house.html',
			id: 'temporary_vehicle_add_house.html'
		});
		
		//	获取单元楼层
		$.receiveHandler(function(id) {
			console.log(id);
			var building = plus.storage.getItem('Tbuild');
			document.querySelector('.floor-name').innerText = building + '号楼' + id + '单元';
			getZonesFloor(building,id);
		}, 'sendUnit');
		
		

	});
	
	//	根据单元获取楼层
	function getZonesFloor(building,unit) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/' + zoneId + '/' + building +  '/'+ unit + '/floor';
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取楼栋楼层：' + JSON.stringify(data));
			document.querySelector('.search-result').classList.add('mui-hidden');
			var json = {
				dataList: data
			}
			$.render('tpl/select_floor_data.html', json).then(function(html) {
				$.setValue('.floor-list', html);
				//	选择楼号单元楼层
				$.tapHandler({
					selector: '.floor-list li',
					id: 'num',
					url: 'temporary_vehicle_add_house.html',
					event: 'sendFloor',
					callback: function(id) {
						console.log(id);
						plus.storage.setItem('Tfloor',id);
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