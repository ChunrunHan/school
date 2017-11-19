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
			url: 'temporary_vehicle_add_unit.html',
			id: 'temporary_vehicle_add_unit.html'
		});

		//	获取楼栋
		$.receiveHandler(function() {
			getZonesBuild();
		}, 'showBuild');


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
				$.setValue('.build-list', html);
				//	选择房屋楼号
				$.tapHandler({
					selector: '.build-list li',
					id: 'num',
					url: 'temporary_vehicle_add_unit.html',
					event: 'sendBuild',
					callback: function(id) {
						console.log(id);
						plus.storage.setItem('Tbuild',id);
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