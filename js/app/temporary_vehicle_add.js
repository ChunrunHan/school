define(['mui', 'mall','picker','popPicker'], function(mui, $, picker,popPicker) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			return true;
		}
	});
	
	var enterId = '';
	var enterName = '';
	var carId = '';
	var carNum = '';
	var cameraID = '';
	var old_back = mui.back;
	var stime = '';
	var etime = '';
	var houseId = '';
	var reasonName = '';
	var reasonId = '';
	var mobile = '';
	var carnumall = '';
	var sn = '';
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		mui.preload({
			url: 'temporary_vehicle_add_car.html',
			id: 'temporary_vehicle_add_car.html'
		});
		
		$.receiveHandler(function(){
			document.getElementById('carIn').value = NowTimerAll();
			stime = NowTimer();
			console.log(stime);
			
			var oldenterId = plus.storage.getItem('enterId');
			var oldenterName = plus.storage.getItem('enterName');
			var oldsn = plus.storage.getItem('sn',sn);
			
			if(oldenterId !== null && oldenterName !== null && oldsn !== null){
				document.getElementById('select-enter').value = oldenterName;
				enterId  = oldenterId;
				cameraID = enterId;
				sn = oldsn; 
				getZonesCar(cameraID);
			}
			
			console.log(typeof localStorage.sn);
			console.log('enterId: '+enterId);
			console.log('sn: ' + sn);
		},'showNowTime');
		
//		接受业主房屋信息
		$.receiveHandler(function(id) {
			console.log(id);
			var build = plus.storage.getItem('Tbuild');
			var unit = plus.storage.getItem('Tunit');
			var floor = plus.storage.getItem('Tfloor');
			var ownerinfo = build +"-"+ unit +"-"+ floor +"-"+ id;
			getHouseId(build,unit,floor,id);
			document.getElementById('select-owner').value = ownerinfo;
			plus.webview.close('temporary_vehicle_add_house.html');
			plus.webview.close('temporary_vehicle_add_floor.html');
			plus.webview.close('temporary_vehicle_add_build.html');
			plus.webview.close('temporary_vehicle_add_unit.html');
		}, 'sendHouse');

		//	拨打来访者电话
		$.tapHandler({
			selector: '#callguest',
			callback: function() {
				var num = document.getElementById('guestnum').value;
				if(num != ''){
					plus.device.dial(num);
					pickerBlur();
				}else{
					mui.toast('拨打手机号不能为空');
				}
			}
		});
		
		//	拨打业主电话
		$.tapHandler({
			selector: '#callowner',
			callback: function() {
				var num = document.getElementById('ownernum').value;
				if(num != ''){
					plus.device.dial(num);
					pickerBlur();
				}else{
					mui.toast('拨打手机号不能为空')
				}
				
			}
		});

		//	保存操作
		$.tapHandler({
			selector: '#tel-save',
			callback: function() {
				pickerBlur();
				clearAddTel();
				document.querySelector('.tel-box').style.display = 'none';
			}
		});
		
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
				reasonId = parseInt(id);
				switch(reasonId){
					case 1:
						reasonName = '走亲访友';
						break;
					case 2:
						reasonName = '维修装修';
						break;
					case 3:
						reasonName = '家政保洁';
						break;
					case 4:
						reasonName = '快递外卖';
						break;
					case 5:
						reasonName = '其他';
						break;
				}
			    document.getElementById('select-reason').value = reasonName;
				mui('#sheet2').popover('toggle');
			}
		});
		
		
		//	选择房屋楼号
		$.tapHandler({
			selector: '#select-owner',
			url: 'temporary_vehicle_add_build.html',
			event: 'showBuild'
		});
		
		//	选择入口位置
		$.tapHandler({
			selector: '#select-enter',
			url: 'temporary_vehicle_add_enter.html',
			event: 'showEnter'
		});
		
		window.addEventListener('sendEnter', getEnter);
		
		//	车牌号选择
		mui("body").on('tap', '#carnum', function() {
			if(cameraID == ''){
				mui.toast('请选择入口位置');
			}else{
				var sub = plus.webview.getWebviewById('temporary_vehicle_add_car.html');
				mui.fire(sub, 'getCarInList',{
					id: cameraID
				});
				mui.openWindow({
					url: 'temporary_vehicle_add_car.html',
					id: 'temporary_vehicle_add_car.html'
				});
			}
			
		});
		
		window.addEventListener('sendCar', getCar);
		
//		//	车牌号选择
//		var picker = new mui.PopPicker({
//			buttons: ['取消', '确认']
//		})
//		picker.setData(carList);
//
//		var select = document.getElementById('selectCity');
//		select.addEventListener('tap', function(event) {
//			picker.show(function(item) {
//				console.log(item[0].text);
//				document.getElementById('selectCity').value = item[0].value;
//			})
//
//		});
		
		
//		保存操作
		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				if(enterId == ""){
					mui.toast('请选择入口位置');
					return;
				}
				var cityname = document.getElementById('selectCity').value;
				carnumall =  document.getElementById('carnum').value;
				carnumall = cityname + carnumall;
				console.log(carnumall);
				var re=/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
				if(!re.test(carnumall)){
					mui.toast('请输入正确的车牌号');
					return;
				}
				if(stime == ""){
					mui.toast('请选择进场时间');
					return;
				}
				if(etime == ""){
					mui.toast('请选择预计出场时间');
					return;
				}
				if(reasonId == "" && reasonName == ""){
					mui.toast('请选择来访目的');
					return;
				}
				mobile = document.getElementById('guestnum').value;
				if(mobile == '') {
					mui.toast('联系电话不能为空');
					return false;
				} else {
					if(checkMobile(mobile)) {
						console.log('手机号：' + mobile);
						addNewCar();
						
					}
				}
				
			

			}
		});
		

	});
	
	function getEnter(e) {
		enterId = e.detail.id;
		enterName = e.detail.name;
		sn = e.detail.sn;
		
//		localStorage.enterId = enterId;
//		localStorage.enterName = enterName;
//		localStorage.sn = sn;
		
		plus.storage.setItem('enterId',enterId);
		plus.storage.setItem('enterName',enterName);
		plus.storage.setItem('sn',sn);
		
		document.getElementById('select-enter').value = enterName;
		console.log('cameraID' + e.detail.id);
		cameraID = enterId;
		document.getElementById('carnum').value = "";
		document.getElementById('selectCity').value = "鲁";
		getZonesCar(cameraID);
	}
	
	function getCar(e) {
		carId = e.detail.id;
		carNum = e.detail.name;
		console.log(carNum);
		console.log(typeof carNum);
		var city = carNum.substring(0,1);
		var num = carNum.substring(1,7);
		document.getElementById('selectCity').value = city;
		document.getElementById('carnum').value = num;
	}


	//	时间picker
	
	var myTimer = new Date();
	var currentYear = myTimer.getFullYear();
	var currentMonth = myTimer.getMonth()+1;
	var currentDate = myTimer.getDate();
	var year=new Date().getFullYear() ;
	var  month=new Date().getMonth()+1;
	var day=new Date().getDate();
	
//	document.getElementById("carOut").setAttribute("data-options","{"type":"Datetime","beginYear",currentYear,"endYear":currentYear,"beginMonth":currentMonth,"beginDay":currentDate}");
//	document.getElementById('carOut').setAttribute('data-options',"{"type":"hour","beginYear",year,"endYear":2012,"beginMonth":month,"beginDay":day,"customData":{"h":[{"text":"上午","value":"上午"},{"text":"下午","value":"下午"},{"text":"晚上","value":"晚上"}]},"labels":["年", "月", "日", "时段", "分"]}");
	
	var timePicker = new mui.DtPicker({
		type: "Datetime",
		beginYear: currentYear,
		endYear: currentYear
	}); 

//  var timePicker = new mui.DtPicker({"type":"hour","beginYear",year,"endYear":2012,"beginMonth":month,"beginDay":day,"customData":{"h":[{"text":"上午","value":"上午"},{"text":"下午","value":"下午"},{"text":"晚上","value":"晚上"}]},"labels":["年", "月", "日", "时段", "分"]}); 
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
				var startTime = items.y.text + "-" + items.m.text + "-" + items.d.text + " " +items.h.text + ":" +items.i.text;
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
				var endTime = items.y.text + "-" + items.m.text + "-" + items.d.text + " " +items.h.text + ":" +items.i.text;
				document.getElementById('carOut').value = endTime;
			}

		})

	});
	
	//	获取房屋ID
	function getHouseId(build,unit,floor,house){
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/house/searchOne/' + zoneId + "/" + build + "/" + unit + "/" + floor + "/" + house;
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			if(data.errCode == 0){
				houseId = data.data.id;
			}else{
				mui.toast('获取业主失败');
			}
			
		}).fail(function(status){
			console.log('获取房屋id' + status);
			statusHandler(status);
		})
		
	}
	
	//	添加临时车辆
	function addNewCar(){
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP +  '/ipms/'+ zoneId + '/add/tempCarRecord';
		console.log(stime);
		var enterTime = document.getElementById('carIn').value;
		var leaveTime = document.getElementById('carOut').value;
		enterTime = timeToLong(enterTime);
		leaveTime = timeToLong(leaveTime);
		if(carId == ""){
			mui.toast('请选择车牌号');
			return;
		}
		var json = {
			enterTime:enterTime,
			leaveTime:leaveTime,
			purpose: reasonId,
			mobile: mobile,
			houseId: houseId,
			carId: carId
		};
		console.log(JSON.stringify(json));
		$.post(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加临时车成功');
				openSwitch(sn);
			} else {
				mui.toast('添加临时车失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	//	开闸放行操作
	function openSwitch(sn){
		plus.nativeUI.showWaiting();
		console.log('打开的摄像头sn: ' + sn);	
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/ipms/send/pass/"+ sn;
		console.log(url);
		$.get(url).then(function(data) { 
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code == 0){
				mui.toast('开闸成功');
				var detail = plus.webview.getWebviewById('temporary_vehicle.html');
				mui.fire(detail, 'getIn');
				mui.back();
			}else{
				mui.toast('开闸失败');
			}
		}).fail(function(status){
			console.log('开闸操作：'+ status);
			statusHandler(status);
		})
		
	}
	
	
	//	自动获取入口车辆
	function getZonesCar(cameraID) {
//		alert('获取入口车辆啊')
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/getRecentCar/' + zoneId + '/' + cameraID + '/0/1';
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取车信息：' + JSON.stringify(data));

			if(data.errCode === 0) {
				carNum = data.dataList[0].carNum;
				carId = data.dataList[0].id;
				console.log(carNum);
				var city = carNum.substring(0,1);
				var num = carNum.substring(1,7);
				document.getElementById('selectCity').value = city;
				document.getElementById('carnum').value = num;
			} else if(data.errCode === 9){
				mui.toast('当前入口没有车辆数据');
			} else {
				mui.toast('自动获取车牌号码失败');
			}

		}).fail(function(status) {
			console.log('自动获取的入口车辆信息失败' + status)
			statusHandler(status);
		});
	}

	//	清空内容
	function clearAddTel() {
		$.bind({
			position: '',
			carnum: '',
			outtime: '',
			phone: '',
			reason: '',
			owner: ''
		});
		enterId = '';
		enterName = '';
		carId = '';
		carNum = '';
		cameraID = '';
		stime = '';
		etime = '';
		houseId = '';
		reasonName = '';
		reasonId = '';
		mobile = '';
		carnumall = '';
		document.getElementById('carIn').value = "";
		document.getElementById('carOut').value = "";
	}
	
	mui.back = function() {
			clearAddTel()
			old_back();
	}

});