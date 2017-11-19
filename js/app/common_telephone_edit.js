define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			var listSubView = plus.webview.getWebviewById('category_sub.html');
			mui.fire(listSubView, 'refreshCategorySub');
			return true;
		}
	});
	var priorityNum;
	var numId;
	mui.plusReady(function() {
		console.log('common_telephone_edit plusReady()');
		plus.screen.lockOrientation("portrait-primary");
		zoneId = plus.storage.getItem('zoneId');

		//	所有的input光标定位到最后
		mui('.mui-content').on('mousedown', 'input[type=text]', function() {
			console.log(this.value.length);
			var pos = this.value.length
			setCursorPosition(this, pos);
		});
		
		mui('.mui-content').on('mouseup', 'input[type=text]', function() {
			console.log(this.value.length);
			var pos = this.value.length
			setCursorPosition(this, pos);
		});

		//	接收数据编辑操作
		$.receiveHandler(function(json) {
			console.log('当前编辑的物品名称 =' + json);
			$.bind(json);
			//			alert(typeof json);
			json = JSON.parse(json);
			console.log(typeof json.priority);
			priorityNum = json.priority;
			numId = parseInt(json.id);
			showPriority(json.priority);
		}, 'editClass');

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
				priorityNum = parseInt(id);
				switch(priorityNum) {
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

		//	编辑保存操作
		$.tapHandler({
			selector: '.number-save',
			callback: function() {
				pickerBlur();
				//	后台接口要求传送数据格式
				var json = $.serialize();
				console.log(json)
				if(json.name == '') {
					mui.toast('电话名称不能为空');
					return;
				} else if(json.number == '') {
					mui.toast('电话号码不能为空');
					return;
				} else {
					plus.nativeUI.showWaiting('保存中');
					console.log('编辑提交的数据(' + JSON.stringify(json) + ')');
					var addjson = mui.extend(addjson, json, {
						id: numId,
						zoneId: zoneId,
						available: true,
						priority: priorityNum

					});
					editTel(addjson);
				}

			}
		});
	});

	function showPriority(priority) {
		priority = parseInt(priority);
		var showtext;
		switch(priority) {
			case 1:
				showtext = '低';
				break;
			case 2:
				showtext = '较低';
				break;
			case 3:
				showtext = '中';
				break;
			case 4:
				showtext = '较高';
				break;
			case 5:
				showtext = '高';
				break;
		}
		document.getElementById('priority-select').value = showtext;
	}

	//	修改编辑电话请求函数
	function editTel(json) {
		console.log('editTel：' + JSON.stringify(json));
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/phone';
		$.put(url, json).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('修改电话成功');
				var list = plus.webview.getWebviewById('common_telephone_sub.html');
				mui.fire(list, 'telRefresh');
				mui.back();
			} else {
				mui.toast('修改电话失败');
			}

		}).fail(function(status) {
			console.log('修改电话请求函数' + status)
			statusHandler(status);
		});
	}
});