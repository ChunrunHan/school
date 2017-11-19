define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('#black_record plus ready');
		plus.screen.lockOrientation("portrait-primary");
		
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
				} else {
					addBlackCarnum(carnum);
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
	function addBlackCarnum(carnum){
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
			id: '',
			zoneId: zoneId,
			carNum: carnum,
			type: 1,
			status:2,
			memo: memo
		};
		console.log(JSON.stringify(json))
		$.post(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加成功');
				clearInput();
				var detail = plus.webview.getWebviewById('black_record.html');
				mui.fire(detail, 'getBlack');
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
		document.getElementById('memo').value = '';
		document.getElementById('carnum').value = '';
	}

});