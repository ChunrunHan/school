define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			return true;
		}
	});

	var carid = '';
	var type = '';
	var parkingId = '';
	var typename = '';
	var startTime = '';
	var endTime = '';
	var houseId = '';
	var owner = '';
	var parkingName = '';
	var sn = '';
	var old_back = mui.back;
	var stime = '';
	var etime = '';
	var oldStime = '';
	var oldEtime = '';
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//		info="{{houseId}},{{id}},{{parkingName}},{{sn}},{{type}},{{startTime}},{{endTime}},{{building}}-{{unit}}-{{floor}}-{{room}},{{parkingId}}">
		$.receiveHandler(function(id) {
			var list = id.split(',');
			console.log(id);
			houseId = list[0];
			carid = list[1];
			parkingName = list[2];
			sn = list[3];
			type = list[4];
			typename = showtype(type);
			document.getElementById('select-reason').value = typename;
//			alert(startTime);
			startTime = list[5];
//			alert(typeof startTime);
			if(startTime == ''){
				startTime = '';
			}else{
				startTime = parseInt(startTime);
				startTime = formatDateList(startTime);
				startTime = startTime + ':00';
			}
			
			stime = NowTimer();
			endTime = list[6];
			owner = list[7];
			if(owner == '---'){
				owner = '无房屋';
			}
			parkingId = list[8];
			document.querySelector('.park-num').innerText = sn;
			var json = {
				parkingName: parkingName,
				owner: owner,
				endTime: endTime,
				startTime: startTime
			}
			oldStime = startTime;
			oldEtime = endTime;
			$.bind(json);
		}, 'getInfo');

		//	选择来访原因
		$.tapHandler({
			selector: '#select-reason',
			callback: function() {
				pickerBlur();
				mui('#sheet2').popover('toggle');
			}
		});
		//	来访原因显示
		$.tapHandler({
			selector: '.reason-list',
			id: 'reason',
			callback: function(id) {
				console.log(id);
				type = parseInt(id);
				switch(type) {
					case 2:
						typename = '业主自有车位';
						break;
					case 3:
						typename = '业主租用车位';
						break;
				}
				document.getElementById('select-reason').value = typename;
				mui('#sheet2').popover('toggle');
			}
		});
		
		//	解除车位
		$.tapHandler({
			selector: '.delcar',
			callback: function() {
				delControl();
			}
		});

		//		保存操作
		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				var stime  = document.getElementById('carIn').value;
				var etime = document.getElementById('carOut').value;
				console.log(stime);
				if(stime == ""){
					mui.toast('开始时间必须大于当前时间');
					return;
				}
				console.log(etime);
				stime = timeToLong(stime);
				etime = timeToLong(etime);
				oldEtime = timeToLong(oldEtime);
				oldStime = timeToLong(oldStime);
				console.log(typeof stime);
				console.log(typeof oldEtime);
				// 获得当前的时间
				var timestamp = new Date().getTime();
				console.log(timestamp);
				console.log(formatDate(timestamp));
				console.log(stime);
				if(stime <= timestamp) {
					mui.toast('开始时间必须大于当前时间');
					return;
				}
				
				if(etime <= stime) {
					mui.toast('结束时间必须大于开始时间');
					return;
				}
				
				if(type == "" && typename == "") {
					mui.toast('请选择车位属性');
					return;
				} 
				
				addExpiredPark(stime,etime);

			}
		});

	});

	//	时间picker
	var myTimer = new Date();
	var currentYear = myTimer.getFullYear();
	var currentMonth = myTimer.getMonth() + 1;
	var currentDate = myTimer.getDate();


	var timePicker = new mui.DtPicker({
		type: "Datetime",
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
			console.log("当前时间: " + NowTimer())
			stime = items.y.text + items.m.text + items.d.text + items.h.text + items.i.text;
			console.log(stime);
			console.log(etime);
			if(parseInt(stime) < parseInt(NowTimer())) {
				mui.toast('开始时间必须等于大于当前时间')
				return;
			} else if(parseInt(stime) >= parseInt(etime)) {
				mui.toast('开始时间必须小于结束时间')
				return;
			} else {
				document.getElementById('serviceStart').value = items.y.text + "/" + items.m.text + "/" + items.d.text;
				startTime = items.y.text + "-" + items.m.text + "-" + items.d.text + " " + items.h.text + ":" + items.i.text + ":00" ;
				document.getElementById('carIn').value = startTime;
			}

		})

	});

	//	结束时间选择处理
	timeEndPicker.addEventListener('tap', function(event) {

		console.log('你点击了结束时间');
		pickerBlur(); //处理ios失去焦点的坑
		timePicker.show(function(items) {
			console.log(NowTimer())
			console.log(stime);
			console.log(etime);
			etime = items.y.text + items.m.text + items.d.text + items.h.text + items.i.text;
			if(parseInt(etime) <= parseInt(stime)) {
				mui.toast('结束时间必须大于开始时间')
				return;
			} else if(parseInt(etime) <= parseInt(NowTimer())) {
				mui.toast('结束时间必须大于当前时间')
				return;
			} else {
				document.getElementById('serviceEnd').value = items.y.text + "/" + items.m.text + "/" + items.d.text;
				endTime = items.y.text + "-" + items.m.text + "-" + items.d.text + " " + items.h.text + ":" + items.i.text + ":59";
				document.getElementById('carOut').value = endTime;
			}

		})

	});

	function showtype(type) {
		var reasonName;
		type = parseInt(type);
		switch(type) {
			case 2:
				reasonName = '业主自有车位';
				break;
			case 3:
				reasonName = '业主租用车位';
				break;
		}
		return reasonName;
	}

	//	续租车位操作
	function addExpiredPark(stime,etime) {
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + "/ipms/space";
		var json = {
			id: carid,
			zoneId: zoneId,
			houseId: houseId,
			sn: sn,
			parkingId: parkingId,
			type: type,
			startTime: stime,
			endTime: etime

		};
		console.log(JSON.stringify(json));
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('续租车位返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('续租车位成功');
				var detail = plus.webview.getWebviewById('expired_parking.html');
				mui.fire(detail, "getExpired");
				mui.back();
			} else {
				mui.toast('续租车位失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	//	解除车位
	function delControl() {
		//	弹出删除框
		mui.confirm('确定解除该车位吗？', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delCarPark();
				}
			});
	}
	
	//	解除车位操作
	function delCarPark() {
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + "/ipms/space";
		var json = {
			id: carid,
			zoneId: zoneId,
			houseId: '',
			sn: sn,
			parkingId: parkingId,
			type: 1,
			startTime: '',
			endTime: ''
		};
		console.log(JSON.stringify(json));
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('解除车位返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('解除车位成功');
				var detail = plus.webview.getWebviewById('expired_parking.html');
				mui.fire(detail, 'getExpired');
				old_back();
			} else {
				mui.toast('解除车位失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

	mui.back = function() {
		old_back();
	}

});