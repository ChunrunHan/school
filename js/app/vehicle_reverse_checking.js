define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('#vehicle reverse checking plus ready');
		plus.screen.lockOrientation("portrait-primary");
		
		mui.preload({
			url: 'vehicle_reverse_detail.html',
			id: 'vehicle_reverse_detail.html'
		});
		
		//	车牌号选择
		var picker = new mui.PopPicker({
			buttons: ['取消', '确认']
		})
		picker.setData(carList);

		var select = document.getElementById('selectCity');
		select.addEventListener('tap', function(event) {
			picker.show(function(item) {
				console.log(item[0].text);
				document.getElementById('selectCity').value = item[0].value;
			})

		});
		
		//	拍照
		$.tapHandler({
			selector: '#camera',
			callback: function() {
				PropertyPluginFn();
		      	plus.PropertyPlugin.recognizeCard(null, function(result) {
		          	console.log(result);
		          	alert("成功： "+result);
		            
	                
	            }, function(result) {
	              console.log(result);
	              	alert("失败： "+result);
	            });
			}
		});
		
		//	查找
		$.tapHandler({
			selector: '#search',
			callback: function() {
				var carnum = document.getElementById('carnum').value;
				var cityname = document.getElementById('selectCity').value;
				carnum = cityname + carnum;
				console.log(carnum);
				carnum = carnum.toUpperCase();
				var re=/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
				if(!re.test(carnum)){
					mui.toast('请输入正确的车牌号');
					return;
				}
				searchCar(carnum);
			}
		});
		
	});
	
	
	
	//	车辆反查
	function searchCar(carnum){
		console.log('查找的车牌号：' + carnum);
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP +  '/ipms/queryCarDetail/'+ zoneId +'/'+ carnum;
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
//				var detail = plus.webview.getWebviewById('vehicle_reverse_detail.html');
//				mui.fire(sub, 'getCarInfo', {
//					
//				});
//				mui.openWindow({
//					url: 'vehicle_reverse_detail.html',
//					id: 'vehicle_reverse_detail.html'
//				});
				
			} else {
				mui.toast('搜索失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	mui.back = function() {
		pickerBlur();
		clearInput()
		old_back();	
	}
	
	function clearInput(){
		document.getElementById('carnum').value = '';
	}

});