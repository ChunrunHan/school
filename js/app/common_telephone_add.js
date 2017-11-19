define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var telPriority = 0;
	var telPriorityName;
	var old_back = mui.back;
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		zoneId = plus.storage.getItem('zoneId');

		//	选择优先级
		$.tapHandler({
			selector: '#priority-select',
			callback: function() {
				pickerBlur();
				mui('#sheet2').popover('toggle');
			}
		});
		//	入驻品类显示
		$.tapHandler({
			selector: '.priority-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				telPriority = parseInt(id);
				switch(telPriority) {
					case 1:
						telPriorityName = '低';
						break;
					case 2:
						telPriorityName = '较低';
						break;
					case 3:
						telPriorityName = '中';
						break;
					case 4:
						telPriorityName = '较高';
						break;
					case 5:
						telPriorityName = '高';
						break;
				}
				document.getElementById('priority-select').value = telPriorityName;
				mui('#sheet2').popover('toggle');
			}
		});

		$.tapHandler({
			selector: '.tel-save',
			callback: function(id) {
				pickerBlur();
				var json = $.serialize();
				console.log(json)
				if(json.name == '') {
					mui.toast('电话名称不能为空');
					return;
				} else if(json.number == '') {
					mui.toast('电话号码不能为空');
					return;
				} else {
					if(telPriority == 0) {
						mui.toast('请选择优先级');
						return;
					} else {
						plus.nativeUI.showWaiting('保存中');
						console.log('添加的数据(' + JSON.stringify(json) + ')');
						var addjson = mui.extend(addjson, json, {
							zoneId: zoneId,
							priority: telPriority,
							available: true
						});
						addTel(addjson);
					}

				}

			}
		});

	});

	//	添加保存电话操作
	function addTel(addjson) {
		console.log('addTel(' + JSON.stringify(addjson) + ')');
		//		plus.storage.setItem('token', demoToken);
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/phone';
		$.post(url, addjson).then(function(data) {
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('电话添加成功');
				clearTelAdd();
				var list = plus.webview.getWebviewById('common_telephone_sub.html');
				mui.fire(list, 'telRefresh');
				mui.back();
				return;
			} else {
				mui.toast('电话添加失败');
			}

		}).fail(function(status) {
			plus.nativeUI.closeWaiting();
			console.log('添加分类请求函数' + status)
			statusHandler(status);

		})
	}

	function clearTelAdd() {
		document.getElementById('priority-select').value = '';
		telPriority = 0;
		$.bind({
			name: '',
			number: ''
		});
	}

	mui.back = function() {
		clearTelAdd();
		old_back();
	}

});