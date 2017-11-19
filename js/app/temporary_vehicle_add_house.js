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
		
		//	进场时间默认为当前时间
		$.receiveHandler(function(id) {
			console.log(id);
			var building = plus.storage.getItem('Tbuild');
			var unit = plus.storage.getItem('Tunit');
			document.querySelector('.house-name').innerText = building + '号楼' + unit + '单元' + id +'楼层';
			getZonesHouse(building,unit,id);
		}, 'sendFloor');
		

	});
	
	//	根据楼层获取房间
	function getZonesHouse(building,unit,floor) {
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + '/admin/' + zoneId + '/' + building +  '/'+ unit + '/' + floor + '/room';
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取房屋：' + JSON.stringify(data));
			document.querySelector('.search-result').classList.add('mui-hidden');
			var json = {
				dataList: data
			}
			$.render('tpl/select_house_data.html', json).then(function(html) {
				$.setValue('.house-list', html);
				//	选择楼号单元
				$.tapHandler({
					selector: '.house-list li',
					id: 'num',
					url: 'temporary_vehicle_add.html',
					event: 'sendHouse',
					callback: function(id) {
						console.log(id);
						plus.storage.setItem('Thouse',id);
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