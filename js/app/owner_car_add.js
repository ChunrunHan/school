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
	mui.plusReady(function() {
		console.log('#owner_car_add plus ready');
		plus.screen.lockOrientation("portrait-primary");
		//	房屋id
		var houseId = plus.storage.getItem('houseId');
//		alert(houseId);
		
		
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
				switch(priorityId){
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
		
		
		//	选择使用规则
		$.tapHandler({
			selector: '#select-rule',
			callback: function() {
				pickerBlur();
				mui('#sheet2').popover('toggle');
			}
		});
		//	车辆类型显示
		$.tapHandler({
			selector: '.rule-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				id = id.split(':');
				ruleId = id[0];
				showRule = id[1];
				console.log(showRule);
				console.log(ruleId);
				console.log(typeof ruleId);
				switch(ruleId){
					case 'false':
						ruleName = '使用固定车位';
						break;
					case 'true':
						ruleName = '使用流动车位';
						break;
				}
			    document.getElementById('select-rule').value = ruleName;
			    document.getElementById('showRule').innerText = showRule;
				mui('#sheet2').popover('toggle');
			}
		});
		
		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				pickerBlur();
				var carnum = document.getElementById('carnum').value;
				if(carnum == ""){
					mui.toast('请输入车牌号');
					return;
				} else if(carnum.length != 6){
					mui.toast('请输入正确的车牌号');
					return;
				} else if(priorityName == '' || priorityId == ''){
					mui.toast('请选择车辆类型');
					return;
				} else if(ruleId == ''){
					mui.toast('请选择使用规则');
					return;
				} else {
					addCarnum(carnum);
				}
				
				

			}
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
		
	});
	
	//	添加车辆
	function addCarnum(carnum){
		var houseId = plus.storage.getItem('houseId');
		houseId = parseInt(houseId);
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP +  '/ipms/car';
		var memo = document.getElementById('memo').value;
		var cityname = document.getElementById('selectCity').value;
		carnum = cityname + carnum;
		console.log(carnum);
		carnum = carnum.toUpperCase();
		var re=/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
		if(!re.test(carnum)){
			mui.toast('请输入正确的车牌号');
			return;
		}
		plus.nativeUI.showWaiting();
		var json = {
			zoneId: zoneId,
			carNum: carnum,
			type: priorityId,
			status: 1,
			houseId: houseId,
			isAutoBindPS: ruleId,
			memo: memo
		};
		console.log(JSON.stringify(json))
		$.post(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加成功');
				clearInput();
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
	
	mui.back = function() {
		pickerBlur();
		clearInput()
		old_back();	
	}
	
	function clearInput(){
		priorityName = '普通小型车';
		priorityId = 1;
		ruleId = 'false';
		ruleName = '使用固定车位';
		showRule = '显示相应的使用规则解释';
		document.getElementById('showRule').innerText = showRule;
		document.getElementById('memo').value = '';
		document.getElementById('carnum').value = '';
	    document.getElementById('select-priority').value = '';
 		document.getElementById('select-rule').value = '';
		
	}

});