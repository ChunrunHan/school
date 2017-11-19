define(['mui', 'mall'], function(mui, $) {
	mui.init({
		subpages: [{
			url: 'temporary_vehicle_add_car_sub.html',
			id: 'temporary_vehicle_add_car_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}],
		swipeBack: true //启用右滑关闭功能

	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		//	获取信息
		$.receiveHandler(function(id) {
			console.log("carmeraSn: " + id);
			var carsub = plus.webview.getWebviewById('temporary_vehicle_add_car_sub.html');
			mui.fire(carsub, 'carRefresh',{
				id: id
			});
		}, 'getCarInList');
		
		

	})

});