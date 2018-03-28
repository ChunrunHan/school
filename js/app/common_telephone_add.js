define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var old_back = mui.back;
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");

		$.tapHandler({
			selector: '.tel-save',
			callback: function(id) {
				pickerBlur();
				var json = $.serialize();
				var memo = document.getElementById('textarea').value;
				console.log(json)
				if(json.contacts == '') {
					mui.toast('联系部门不能为空');
					return;
				} else if(json.mobile == '') {
					mui.toast('电话号码不能为空');
					return;
				} else {
						plus.nativeUI.showWaiting('保存中');
						
						var addjson = mui.extend(addjson, json, {
							memo: memo
						});
					console.log('添加的数据(' + JSON.stringify(addjson) + ')');
					addTel(addjson);
					
				}

			}
		});

	});

	//	添加保存电话操作
	function addTel(addjson) {
		console.log('addTel(' + JSON.stringify(addjson) + ')');
		urlBase = plus.storage.getItem('urlBase');
		var url = urlBase + '/phone/add';
		console.log(url)
		$.post(url, addjson).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log(data)
			if(data.errCode === 0) {
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