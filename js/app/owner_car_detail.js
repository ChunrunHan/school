define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
//			document.getElementById('carP').classList.remove('mui-hidden');
//			document.getElementById('carI').classList.remove('mui-hidden');
			pickerBlur();
			return true;
		}
	});

	var houseId;
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");

		mui.preload({
			url: 'select_parking.html',
			id: 'select_parking.html'
		});

		mui.preload({
			url: 'owner_car_add_edit.html',
			id: 'owner_car_add_edit.html'
		});

		//	获取业主楼栋单元楼层房屋号
		window.addEventListener('getOwnerInfo', getOwnerInfo);
		window.addEventListener('getCarInfo', getCarInfo);

		//	新增选择
		$.tapHandler({
			selector: '.icon-add',
			callback: function() {
				pickerBlur();
				mui('#sheet2').popover('toggle');
			}
		});
		//	新增选择类显示
		$.tapHandler({
			selector: '.add-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				id = parseInt(id);
				switch(id) {
					case 1:
						var sub = plus.webview.getWebviewById('owner_car_parking_add.html');
						mui.fire(sub, 'showNowTime');
						mui.openWindow({
							url: 'owner_car_parking_add.html',
							id: 'owner_car_parking_add.html'
						});
						break;
					case 2:
						mui.openWindow({
							url: 'owner_car_add.html',
							id: 'owner_car_add.html'
						});
						break;
				}
				mui('#sheet2').popover('toggle');
			}
		});

	})

	//	清空内容
	function clearAddTel() {
		$.bind({
			name: '',
			phone: '',
			priority: ''
		});
	}
	//	获取用户信息
	function getOwnerInfo(e) {
		//		alert('获取用户详情啊')
		plus.nativeUI.showWaiting();
		houseId = e.detail.houseId;
		var id = houseId.toString();
		plus.storage.setItem('houseId', id);
		getCarInfo(houseId);
		//		alert(e.detail.houseId);
		var housePt = e.detail.housePt;
		document.getElementById('housePt').value = housePt;
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/houseuser/' + houseId;
		$.get(url).then(function(data) {
			//			plus.nativeUI.closeWaiting();

			console.log(JSON.stringify(data));
			var ownerName;
			var ownerPhone;
			mui.each(data, function(index, item) {
				if(item.houseRole == 1) {
					ownerName = item.realname;
					ownerPhone = item.mobile;
					console.log(ownerName);
					console.log(ownerPhone);
					document.querySelector('.call-owner').setAttribute('tel', ownerPhone);
					document.getElementById('ownerName').value = ownerName;
					document.getElementById('ownerPhone').value = parseInt(ownerPhone);
				}
			});

			//	拨打电话
			$.tapHandler({
				selector: '.call-owner',
				id: 'tel',
				callback: function(id) {
					plus.device.dial(id);
					pickerBlur();
				}
			});

		}).fail(function(status) {
			console.log('获取用户信息' + status);
			if(status == 204){
				mui.toast('当前房屋未绑定业主');
			}
			statusHandler(status);
		})

	}

	//	获取用户车辆车位信息
	function getCarInfo(houseId) {
		var houseId = plus.storage.getItem('houseId');
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/house/' + houseId;
		console.log('获取用户车辆车位信息: ' + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			console.log(data.parkingSpaceList);
			console.log(data.carList);
			if(data.parkingSpaceList == undefined){
				mui.toast('暂无车位信息！');
			} else {
				document.getElementById('carP').classList.remove('mui-hidden');
			}
			
			if(data.carList == undefined){
				mui.toast('暂无车辆信息！');
			}else{
				document.getElementById('carI').classList.remove('mui-hidden');
			}
			
			if(data.parkingSpaceList == undefined && data.carList == undefined) {
				document.querySelector('.search-result').classList.remove('mui-hidden');
			} else {
				document.querySelector('.search-result').classList.add('mui-hidden');
				var json = {
					parkList: data.parkingSpaceList,
					carList: data.carList
				}
				mui.each(json.parkList, function(index, item) {
//					alert(item.startTime);
					var zonemode = plus.storage.getItem('zoneMode');
					if(parseInt(zonemode)){
						if(item.startTime == undefined && item.endTime == undefined){
							item.endTime = '当前没有设置时间';
						}else{
							item.startTime = formatDay(item.startTime);
							item.endTime = formatDay(item.endTime);
						}
					}else{
						item.endTime = '本小区不支持时间模式';
					}
					
					
					switch(item.type) {
						case 1:
							item.typeName = '未被使用车位';
							break;
						case 2:
							item.typeName = '业主自有车位';
							break;
						case 3:
							item.typeName = '业主租用车位';
							break;
							//						case 4:
							//							item.typeName = '分享';
							//							break;
							//						case 5:
							//							item.typeName = '虚拟车位';
							//							break;
							//						case 6:
							//							item.type = '流动车位';
							//							break;
					}
				});

				$.render('tpl/owner_car_detail_data.html', json).then(function(html) {
					$.setValue('.car-info', html);

					//	编辑车位属性
					$.tapHandler({
						selector: '.zone-area li',
						id: 'id',
						url: 'owner_car_parking_add_edit.html',
						event: 'showCarParking'
					});

					//	编辑车辆属性
					$.tapHandler({
						selector: '.tel-list li',
						id: 'id',
						url: 'owner_car_add_edit.html',
						event: 'showCarInfo'
					});
				});

			}

		}).fail(function(status) {
			console.log('获取车辆信息' + status);
			document.querySelector('.search-result').classList.remove('mui-hidden');
			statusHandler(status);
		})

	}

	var old_back = mui.back;
	mui.back = function() {
		document.querySelector('.car-info').innerHTML = '';
		old_back();
	}

});