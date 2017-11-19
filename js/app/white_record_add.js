define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var priorityName = '地上车辆';
	var priorityId = 6;
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('#white_record_add plus ready');
		plus.screen.lockOrientation("portrait-primary");

		//	选择车辆位置
		$.tapHandler({
			selector: '#select-priority',
			callback: function() {
				pickerBlur();
				mui('#sheet1').popover('toggle');
			}
		});
		//	车辆位置显示
		$.tapHandler({
			selector: '.priority-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				priorityId = parseInt(id);
				switch(priorityId) {
					case 5:
						priorityName = 'VIP车辆';
						break;
					case 6:
						priorityName = '地上车辆';
						break;
					case 7:
						priorityName = '地下车辆';
						break;
				}
				document.getElementById('select-priority').value = priorityName;
				mui('#sheet1').popover('toggle');
			}
		});

		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				pickerBlur();
				var carnum = document.getElementById('carnum').value;
				if(carnum == "") {
					mui.toast('请输入车牌号');
					return;
				} else if(carnum.length != 6) {
					mui.toast('请输入正确的车牌号');
					return;
				} else if(priorityName == '' || priorityId == '') {
					mui.toast('请选择车辆位置');
					return;
				} else {
					addWhiteCarnum(carnum);
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
	function addWhiteCarnum(carnum) {
		urlBaseP = plus.storage.getItem('urlBaseP');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + '/ipms/car';
		var memo = document.getElementById('memo').value;
		var cityname = document.getElementById('selectCity').value;
		carnum = cityname + carnum;
		console.log(carnum);
		carnum = carnum.toUpperCase();
		var re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
		if(!re.test(carnum)) {
			mui.toast('请输入正确的车牌号');
			return;
		}
		plus.nativeUI.showWaiting();
		var json = {
			id: '',
			status: 1,
			zoneId: zoneId,
			carNum: carnum,
			type: priorityId,
			memo: memo
		};
		console.log(JSON.stringify(json))
		$.post(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加成功');
				var detail;
				var eventname;
				if(priorityId == 5) {
					eventname = 'govip';
				} else if(priorityId == 6) {
					eventname = 'goup';
				} else if(priorityId == 7) {
					eventname = 'godown';
				}
				var detail = plus.webview.getWebviewById('white_record.html');
				mui.fire(detail, eventname);
				clearInput();
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

	function clearInput() {
		priorityName = '地上车辆';
		priorityId = 6;
		document.getElementById('memo').value = '';
		document.getElementById('carnum').value = '';
		document.getElementById('select-priority').value = '';

	}

});