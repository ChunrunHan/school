define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			var index = plus.webview.getWebviewById('index.html');
			mui.fire(index, 'refreshWarnNum');
			return true;
		}
	});

	mui.plusReady(function() {
		console.log('#vehicle_managerment ready');
		plus.screen.lockOrientation("portrait-primary");
		//	关闭右滑关闭功能
		var wv = plus.webview.currentWebview();
		wv.setStyle({
			popGesture: 'none'
		});

		$.receiveHandler(function(id) {
			if(id == '0') {
				document.querySelector('.warn-car').style.display = 'none';
				document.querySelector('.warn-car').innerText = id;
			} else {
				document.querySelector('.warn-car').style.display = 'inline-block';
				document.querySelector('.warn-car').innerText = id;
			}

		}, 'showWarn');

		//	根据权限显示界面
		var showClass = plus.storage.getItem('newshowP');
		console.log(typeof showClass)
		console.log('neshow..........: ' + showClass);
		//	判断账号是否有角色
		if(showClass == '') {
			delDeviceTokenFromAndroid();
			console.log('当前账号没有配置权限');
			plus.nativeUI.closeWaiting();
			mui.toast('当前账号没有配置权限');
			plus.storage.clear();
			plus.runtime.restart();
			return;
		}
		showClass = showClass.split(',');
		console.log(showClass);
		for(var i = 0; i < showClass.length; i++) {
			console.log(showClass[i]);
			var others = document.getElementById(showClass[i]);
			//			alert(others);
			if(others != null) {
				document.getElementById(showClass[i]).classList.remove('mui-hidden');
				document.getElementById(showClass[i]).classList.add('showbtn');
				switch(showClass[i]) {
					//	临时车辆
					case 'carList':
						mui.preload({
							url: 'temporary_vehicle_add_build.html',
							id: 'temporary_vehicle_add_build.html'
						});

						mui.preload({
							url: 'temporary_vehicle_add.html',
							id: 'temporary_vehicle_add.html'
						});
						
						mui.preload({
							url: 'temporary_vehicle_add_car.html',
							id: 'temporary_vehicle_add_car.html'
						})

						mui.preload({
							url: 'temporary_vehicle_detail.html',
							id: 'temporary_vehicle_detail.html'
						});


						break;
						//	进出记录
					case 'carList':
						mui.preload({
							url: 'inout_record.html',
							id: 'inout_record.html'
						});
						break;
						//	道闸控制
					case 'openDoor':
						break;
						//	续租缴费
					case 'ipmsRent':
						break;
						//	信息总览
					case 'ipms_house':
						mui.preload({
							url: 'owner_car.html',
							id: 'owner_car.html'
						});
						break;
						//	到期车位
					case 'alertSpace':
						mui.preload({
							url: 'expired_parking.html',
							id: 'expired_parking.html'
						});
						break;
						//	异常车辆
					case 'alertCar':
						mui.preload({
							url: 'warn_car.html',
							id: 'warn_car.html'
						});
						break;
						//	白名单
					case 'whiteList':
						mui.preload({
							url: 'white_record_add.html',
							id: 'white_record_add.html'
						});
						break;
						//	黑名单
					case 'blackList':
						mui.preload({
							url: 'black_record_add.html',
							id: 'black_record_add.html'
						});
						break;

				}
			} else {
				continue;
			}
		}

		// 添加样式
		var div3 = document.querySelectorAll('.nine div');
		console.log(div3);
		mui.each(div3, function(index, item) {
			console.log(index);
			if(index == 2 || index == 5 || index == 8 || index == 11) {
				console.log('3n+index : ' + index);
				div3[index].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 0px;text-align:center;"
			} else {
				console.log('!3n :' + index);
				div3[index].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 1px dashed #bbbbbb;text-align:center;"
			}
		})

		//	遍历显示的div
		var newdiv3 = document.querySelectorAll('.showbtn');
		for(var i = 0; i < newdiv3.length; i++) {
			if(i == 2 || i == 5 || i == 8 || i == 11) {
				console.log('3n+index : ' + i);
				newdiv3[i].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 0px;text-align:center;"
			} else {
				console.log('!3n :' + i);
				newdiv3[i].style.cssText = "float: left;width: 33%;height: 100px;border-bottom: 1px dashed #bbbbbb;border-right: 1px dashed #bbbbbb;text-align:center;"
			}
		}

		mui.preload({
			url: 'select_build.html',
			id: 'select_build.html'
		});

		mui.preload({
			url: 'select_unit.html',
			id: 'select_unit.html'
		});

		mui.preload({
			url: 'select_floor.html',
			id: 'select_floor.html'
		});

		mui.preload({
			url: 'select_house.html',
			id: 'select_house.html'
		});

		//	临时车辆
		$.tapHandler({
			selector: '.nine-temporary-vehicle',
			url: 'temporary_vehicle.html',
			event: 'getIn'
		});

		//	进出记录
		$.tapHandler({
			selector: '.nine-inout',
			url: 'inout_record.html',
			event: 'getAllcar'
		});

		//	道闸控制
		$.tapHandler('.nine-switch', 'zone_switch.html');

		// 	续租缴费
		$.tapHandler('.nine-pay', 'owner_pay.html');

		//	业主车辆
		$.tapHandler('.nine-ownercar', 'owner_car.html');

		//	信息总览
		$.tapHandler('.nine-parking', 'car_parking.html');

		//	到期车位
		$.tapHandler({
			selector: '.nine-expired',
			url: 'expired_parking.html',
			event: 'getExpired'
		});

		//	异常车辆
		$.tapHandler({
			selector: '.nine-warncar',
			url: 'warn_car.html',
			event: 'getWarnCar'
		});

		//	黑名单
		$.tapHandler({
			selector: '.nine-black',
			url: 'black_record.html',
			event: 'getBlack'
		});

		//	白名单
		$.tapHandler({
			selector: '.nine-white',
			url: 'white_record.html',
			event: 'showUp'
		});
		
		//	车辆反查
		$.tapHandler({
			selector: '#searchCar',
			url: 'vehicle_reverse_checking.html'
		});
		
		

	});

});