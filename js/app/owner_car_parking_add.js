define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			return true;
		}
	});

	var priorityName = '';
	var priorityId = 1;
	var parkingId = '';
	var parkingName = '';
	var placeId = '';
	var placeName = '';
	var sn = '';
	var old_back = mui.back;
	var zoneMode;
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//	获得当前小区收费模式是否为时间模式（0：不是 ，1：是）
		zoneMode = plus.storage.getItem('zoneMode');
		zoneMode = parseInt(zoneMode);
		if(zoneMode == 1){
			document.getElementById('monthly-rent').style.display = 'block';
		} else {
			document.getElementById('monthly-rent').style.display = 'none';
		}
		
		mui.preload({
			url: 'select_place.html',
			id: 'select_place.html'
		});

		//	保存操作
		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				pickerBlur();
				sn = document.getElementById('select-parkingnum').value;
				var startTime = document.getElementById('carIn').value;
				var endTime = document.getElementById('carOut').value;
				 if(parkingName == "" || parkingId == "") {
					mui.toast('请选择车场');
					return;
				} else if(sn == "") {
					mui.toast('请选择车位号');
					return;
				} else if(priorityName == "" || priorityId == "") {
					mui.toast('请选择车位属性');
					return;
				} else if(priorityId == 3 && zoneMode == 1){	
					if(startTime == "") {
						mui.toast('请选择开始时间');
						return;
					}
					if(endTime == "") {
						mui.toast('请选择结束时间');
						return;
					} 
				} else {
					addCarParking();
				}

			}
		});
		//	选择车场
		$.tapHandler({
			selector: '#select-parking',
			url: 'select_parking.html',
			event: 'getParking'
		});
		
		//	选择车位号
		mui("body").on('tap', '#select-parkingnum', function() {
			if(parkingId == ""){
				mui.toast('请选择车场');
				return;
			}else{
				console.log('车场id: ' + parkingId);
//				var parkid = parkingId.toString();
//				plus.storage.setItem('parkingId',parkid);
				var sub = plus.webview.getWebviewById('select_place.html');
				mui.fire(sub, 'getCarPlace',{
					id: parkingId
				});
				mui.openWindow({
					url: 'select_place.html',
					id: 'select_place.html'
				});
			}
			
		});
		

		//	选择车位属性
		$.tapHandler({
			selector: '#select-priority',
			callback: function() {
				pickerBlur();
				mui('#sheet1').popover('toggle');
			}
		});
		//	车位属性显示
		$.tapHandler({
			selector: '.priority-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				priorityId = parseInt(id);
				switch(priorityId) {
					case 1:
						priorityName = '未被使用车位';
						document.getElementById('timebox').style.display = 'none';
						break;
					case 2:
						priorityName = '业主自有车位';
						document.getElementById('timebox').style.display = 'none';
						break;
					case 3:
						priorityName = '业主租用车位';
						document.getElementById('timebox').style.display = 'block';
						break;
				}
				document.getElementById('select-priority').value = priorityName;
				mui('#sheet1').popover('toggle');
			}
		});

		//	进场时间默认为当前时间
		$.receiveHandler(function(id) {
			var houseId = plus.storage.getItem('houseId');

		}, 'showNowTime');

		window.addEventListener('sendParking', getParking);
		window.addEventListener('sendPlace', getPlace);

	});

	function getParking(e) {
		parkingId = e.detail.id;
		parkingName = e.detail.name;
		document.getElementById('select-parking').value = parkingName;
		sn = '';
		document.getElementById('select-parkingnum').value = sn;
	}
	
	function getPlace(e) {
		placeId = e.detail.id;
		sn = e.detail.sn;
		document.getElementById('select-parkingnum').value = sn;
	}

	//	时间picker
	var stime;
	var etime;
	var myTimer = new Date();
	var currentYear = myTimer.getFullYear();

	var timePicker = new mui.DtPicker({
		type: "date",
		beginYear: currentYear,
		endYear: currentYear
	});

	//	获得开始和结束点击框
	var timeStartPicker = document.getElementById('carIn');
	var timeEndPicker = document.getElementById('carOut');
	//	开始时间选择处理
	timeStartPicker.addEventListener('tap', function(event) {
		console.log('你点击了开始时间');
		pickerBlur();
		timePicker.show(function(items) {
			console.log("当前时间: " + NowDate())
			stime = items.y.text + items.m.text + items.d.text;
			console.log(stime);
			console.log(etime);
			if(parseInt(stime) < parseInt(NowDate())) {
				mui.toast('开始时间必须等于大于当前时间')
				return;
			} else if(parseInt(stime) >= parseInt(etime)) {
				mui.toast('开始时间必须小于结束时间')
				return;
			} else {
				document.getElementById('serviceStart').value = items.y.text + "/" + items.m.text + "/" + items.d.text + ' ' + '00:00';
				var startTime = items.y.text + "-" + items.m.text + "-" + items.d.text;
				document.getElementById('carIn').value = startTime;
			}

		})

	});
	//	结束时间选择处理
	timeEndPicker.addEventListener('tap', function(event) {
		console.log('你点击了结束时间');
		pickerBlur(); //处理ios失去焦点的坑
		timePicker.show(function(items) {
			console.log(NowDate())
			console.log(stime);
			console.log(etime);
			etime = items.y.text + items.m.text + items.d.text;
			if(parseInt(etime) <= parseInt(stime)) {
				mui.toast('结束时间必须大于开始时间')
				return;
			} else if(parseInt(etime) <= parseInt(NowDate())) {
				mui.toast('结束时间必须大于当前时间')
				return;
			} else {
				document.getElementById('serviceEnd').value = items.y.text + "/" + items.m.text + "/" + items.d.text + ' ' + '23:59';
				var endTime = items.y.text + "-" + items.m.text + "-" + items.d.text;
				document.getElementById('carOut').value = endTime;
			}

		})
	});

	//	清空内容
	function clearAddTel() {
		$.bind({
			name: '',
			phone: '',
			priority: ''
		});
	}

	//	添加车位操作
	function addCarParking() {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var houseId = plus.storage.getItem('houseId');
		houseId = parseInt(houseId);
		var serviceStart = document.getElementById('serviceStart').value;
		var serviceEnd = document.getElementById('serviceEnd').value;
		console.log(serviceStart);
		console.log(typeof serviceEnd);
		if(serviceStart == '' && serviceEnd == ''){
			serviceStart = '';
			serviceEnd = '';
		} else {
			serviceStart = timeToLong(serviceStart);
			serviceEnd = timeToLong(serviceEnd);
		}
		console.log(serviceStart);
		console.log(typeof serviceEnd);

		var json = {
			id: placeId,
			zoneId: zoneId,
			houseId: houseId,
			sn: sn,
			parkingId: parkingId,
			type: priorityId,
			startTime: serviceStart,
			endTime: serviceEnd

		};
		var url = urlBaseP + "/ipms/space";
		console.log(JSON.stringify(json));
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车位返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加成功');
				clearInput();
				var detail = plus.webview.getWebviewById('owner_car_detail.html');
				mui.fire(detail, 'getCarInfo');
				old_back();		
			} else if(data.code == 22){
				mui.toast('车位已绑定房屋');
			} else {
				mui.toast('添加失败');
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
		priorityName = '';
		priorityId = 1;
		parkingId = '';
		parkingName = '';
		sn = '';
		document.getElementById('serviceStart').value = '';
		document.getElementById('serviceEnd').value = '';
	    document.getElementById('select-parkingnum').value = '';
 		document.getElementById('carIn').value = '';
		document.getElementById('carOut').value = '';
		document.getElementById('select-parking').value = '';
		document.getElementById('select-priority').value = '';
	}

});