define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var priorityName = '普通小型车';
	var priorityId = 1;
	var ruleId = 'false';
	var ruleName = '使用固定车位';
	var showRule = '使用固定车位(含月租车位)';
	var old_back = mui.back;
	var carId;
	mui.plusReady(function() {
		console.log('#owner_car_add plusReady');
		plus.screen.lockOrientation("portrait-primary");
		//	房屋id
		var houseId = plus.storage.getItem('houseId');
		//		 { "id":"f63ef7105e3273f9015e32a34b2f0031","carNum":"鲁A66666","type":"1","houseId":"5893", "zoneId":"6", "memo":"" }
		$.receiveHandler(function(json) {
			console.log(json);
			$.bind(json);
			var data = JSON.parse(json);
			console.log(data.carNum);
			priorityId = parseInt(data.type);
			priorityName = carType(data.type);
			document.getElementById('select-priority').value = priorityName;
			carId = data.id;
			document.getElementById('memo').value = data.memo;

		}, 'showCarInfo');

		//	选择车辆类型
		$.tapHandler({
			selector: '#select-priority',
			callback: function() {
				pickerBlur();
				mui('#sheet1').popover('toggle');
			}
		});
		//	车辆类型显示
		$.tapHandler({
			selector: '.priority-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				priorityId = parseInt(id);
				switch(priorityId) {
					case 1:
						priorityName = '普通小型车';
						break;
					case 2:
						priorityName = '大型车辆';
						break;
					case 3:
						priorityName = '摩托车';
						break;
					case 4:
						priorityName = '特殊车辆';
						break;
				}
				document.getElementById('select-priority').value = priorityName;
				mui('#sheet1').popover('toggle');
			}
		});
		
		$.tapHandler({
			selector: '#delete',
			callback:function(){
				delControl();
			}
		});

//		//	选择使用规则
//		$.tapHandler({
//			selector: '#select-rule',
//			callback: function() {
//				pickerBlur();
//				mui('#sheet2').popover('toggle');
//			}
//		});
//		//	车辆类型显示
//		$.tapHandler({
//			selector: '.rule-list',
//			id: 'priority',
//			callback: function(id) {
//				console.log(id);
//				id = id.split(':');
//				ruleId = id[0];
//				showRule = id[1];
//				console.log(showRule);
//				console.log(ruleId);
//				console.log(typeof ruleId);
//				switch(ruleId) {
//					case 'false':
//						ruleName = '使用固定车位';
//						break;
//					case 'true':
//						ruleName = '使用流动车位';
//						break;
//				}
//				document.getElementById('select-rule').value = ruleName;
//				document.getElementById('showRule').innerText = showRule;
//				mui('#sheet2').popover('toggle');
//			}
//		});

		$.tapHandler({
			selector: '#save',
			callback: function() {
				pickerBlur();
				var carnum = document.getElementById('carnum').value;
				if(carnum == "") {
					mui.toast('请输入车牌号');
					return;
				} else if(carnum.length != 7) {
					mui.toast('请输入正确的车牌号');
					return;
				} else if(priorityName == '' || priorityId == '') {
					mui.toast('请选择车辆类型');
					return;
				} else if(ruleId == '') {
					mui.toast('请选择使用规则');
					return;
				} else {
					addCarnum(carnum);
				}

			}
		});
	});

	//	添加车辆
	function addCarnum(carnum) {
		var houseId = plus.storage.getItem('houseId');
		houseId = parseInt(houseId);
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + '/ipms/car';
		var memo = document.getElementById('memo').value;

		var re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
		if(!re.test(carnum)) {
			mui.toast('请输入正确的车牌号');
			return;
		}
		plus.nativeUI.showWaiting();
		var json = {
			id: carId,
			zoneId: zoneId,
			carNum: carnum,
			type: priorityId,
			status: 1,
			houseId: houseId,
			memo: memo
		};
		console.log(JSON.stringify(json))
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加成功');
				var detail = plus.webview.getWebviewById('owner_car_detail.html');
				mui.fire(detail, 'getCarInfo');
				old_back();

			} else {
				mui.toast('添加失败');
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	//	解除车辆
	function delCarnum() {
		var carnum = document.getElementById('carnum').value;
		var houseId = plus.storage.getItem('houseId');
		houseId = parseInt(houseId);
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + '/ipms/car';
		var memo = document.getElementById('memo').value;
		
//		var re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
//		if(!re.test(carnum)) {
//			mui.toast('请输入正确的车牌号');
//			return;
//		}
		plus.nativeUI.showWaiting();
		var json = {
			id: carId,
			zoneId: zoneId,
			carNum: carnum,
			type: priorityId,
			status: 1,
			houseId: 0,
			isAutoBindPS: ruleId,
			memo: ''
		};
		console.log(JSON.stringify(json))
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('解除车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('解除成功');
				var detail = plus.webview.getWebviewById('owner_car_detail.html');
				mui.fire(detail, 'getCarInfo');
				old_back();

			} else if(data.code == 70){
				mui.toast('该车辆位于小区内禁止删除');
			}else {
				mui.toast('解除失败');
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

	function clearInput() {
		priorityName = '普通小型车';
		priorityId = 1;
		ruleId = 'false';
		ruleName = '使用固定车位';
		document.getElementById('memo').value = '';
		document.getElementById('carnum').value = '';
		document.getElementById('select-priority').value = '';

	}

	function carType(type) {
		type = parseInt(type); 
		switch(type) {
			case 1:
				priorityName = '普通小型车';
				break;
			case 2:
				priorityName = '大型车辆';
				break;
			case 3:
				priorityName = '摩托车';
				break;
			case 4:
				priorityName = '特殊车辆';
				break;
		}
		return priorityName;
	}
	
	
	
	function delControl() {
		mui.confirm('你确定解除绑定吗？', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delCarnum();
				}
			});
	}
});