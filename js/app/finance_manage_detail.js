define(['mui', 'mall', 'picker', 'popPicker'], function(mui, $, picker, popPicker) {
	mui.init({
		swipeBack: true
	});

	var old_back = mui.back;
	var status = '收入';
	var reasonId;
	var reasonName;
	var financeCategoryId = 0;
	mui.plusReady(function() {

		console.log('#finance manage detail plusReady()');
		webviewInit();

		//接收传过来的id
		$.receiveHandler(function(id) {
//			id='{ "categoryName":"{{categoryName}}","money":"{{money}}","eventTime":"{{eventTime}}","sign":"{{sign}}"}'>
			console.log('id ：' + id);
			id = JSON.parse(id);
			console.log(JSON.stringify(id));
			status = id.signName;
			document.querySelector('.del').setAttribute('id',id.id);
//			alert(status);
//			alert(id.id);
			if(status == '收入'){
				financeCategoryId = 0;
			}else{
				financeCategoryId = 1;
			}
			switch(id.categoryName){
				case '物业用房租金':
					reasonId = 1;
					break;
				case '车位出租租金':
					reasonId = 2;
					break;
				case '公共部位广告':
					reasonId = 3;
					break;
				case '其他收入':
					reasonId = 4;
					break;
				case '公共设施':
					reasonId = 5;
					break;
				case '冲抵物业费':
					reasonId = 6;
					break;
				case '办公用品':
					reasonId = 7;
					break;
				case '其他支出':
					reasonId = 8;
					break;
				
			}
			$.bind(id);
			document.getElementById('textarea').value = id.memo;

		}, 'getIncomeInfo');
		
		mui('.mui-content').on('keyup', '#inputmoney', function() {
			var m = /^((0?)|([1-9]\d*?))(.\d{1,2})?$/;
			if(m.test(this.value)) {

			} else {
				mui.toast('最多保留两位小数');
				this.value = '';
			}
		});
		
		//	修改保存操作
		$.tapHandler({
			selector: '.save',
			callback: function(id) {
				pickerBlur();
				var memo = document.getElementById('textarea').value;
				var eventTime = document.getElementById('select-time').innerText;
				var money = document.getElementById('inputmoney').value;
				var id = document.querySelector('.del').getAttribute('id');
				eventTime = eventTime.replace(/-/g,'/');
//				alert(eventTime);
				eventTime = eventTime + ' 00:00';
//				alert(eventTime);
				eventTime = timeToLong(eventTime);
				
				if(money == ''){
					mui.toast('金额不能为空');
					return;
				}else {
					money = parseFloat(money);
					var addjson = {
						memo:memo,
						eventTime: eventTime,
						money:money,
						financeCategoryId: reasonId,
						id: id
					}
					console.log(JSON.stringify(addjson));
					editFinance(addjson);
				}
				
				

			}
		});
		
		$.tapHandler({
			selector: '.del',
			id: 'id',
			callback: function(id) {
//				alert('删除的id: '+id);
				delControl(id);
			}
				
		});

	});
	
		// 选择时间
	var timePicker = new mui.DtPicker({
		type: "date"
	});

	var timeSelect = document.getElementById('select-time');
	//	开始时间选择处理
	timeSelect.addEventListener('tap', function(event) {
		console.log('选择时间');
		pickerBlur();
		timePicker.show(function(items) {
			document.getElementById('select-time').innerText = items.y.text + "-" + items.m.text + "-" + items.d.text;
		})

	});
	
	//	选择收入项目
		$.tapHandler({
			selector: '#select-reason',
			callback: function() {
				pickerBlur();
				if(status == '收入'){
					mui('#sheet1').popover('toggle');
				} else {
					mui('#sheet2').popover('toggle');
				}
				
			}
		});
		//	收入原因显示
		$.tapHandler({
			selector: '.object-list',
			id: 'reason',
			callback: function(id) {
				console.log(id);
				reasonId = parseInt(id);
				switch(reasonId){
					case 1:
						reasonName = '物业用房租金';
						break;
					case 2:
						reasonName = '车位出租租金';
						break;
					case 3:
						reasonName = '公共部位广告';
						break;
					case 4:
						reasonName = '其他收入';
						break;
					case 5:
						reasonName = '公共设施';
						break;
					case 6:
						reasonName = '冲抵物业费';
						break;
					case 7:
						reasonName = '办公用品';
						break;
					case 8:
						reasonName = '其他支出';
						break;
				}
			    document.getElementById('select-reason').innerText = reasonName;
			    if(status == '收入'){
					mui('#sheet1').popover('toggle');
				} else {
					mui('#sheet2').popover('toggle');
				}
				
			}
		});
		
	//	修改收入、支出
	function editFinance(addjson) {
		plus.nativeUI.showWaiting();
		console.log('addFinance(' + JSON.stringify(addjson) + ')');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/ywh/finance';
		$.put(url, addjson).then(function(data) {
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('修改成功');
				clearTelAdd();
				var list = plus.webview.getWebviewById('finance_manage.html');
				if(financeCategoryId == 1){
					//	支出
					mui.fire(list, 'expendRefresh');
				}else{
					//	收入
					mui.fire(list, 'incomeRefresh');
				}
				mui.back();
				return;
			} else {
				mui.toast('修改失败');
			}

		}).fail(function(status) {
			plus.nativeUI.closeWaiting();
			console.log('修改收支请求函数' + status)
			statusHandler(status);

		})
	}
	
	function delControl(id) {
		console.log('delControl(' + id + ')');
		//	弹出删除框
		mui.confirm('确定删除该信息吗？', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					plus.nativeUI.showWaiting('删除中');
					delFinance(id);
				}
			});
	}

	//	删除电话请求
	function delFinance(id) {
		console.log('delTel(' + id + ')');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/user/ywh/finance/'+ id +'/delete';
		$.del(url).then(function(data) {
			console.log('got from server: ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('删除成功');
				clearTelAdd();
				var list = plus.webview.getWebviewById('finance_manage.html');
				if(financeCategoryId == 1){
					//	支出
					mui.fire(list, 'expendRefresh');
				}else{
					//	收入
					mui.fire(list, 'incomeRefresh');
				}
				mui.back();
				return;
			} else {
				mui.toast('删除失败');	
			}

		}).fail(function(status) {
			console.log('删除收支请求'+ status);
			statusHandler(status);
		});
	}

	

	function clearTelAdd() {
		document.getElementById('textarea').value = '';
		document.getElementById('inputmoney').value = '';
		
	}
	
	

	mui.back = function() {
		clearTelAdd();
		old_back();
	}
	
	
	

});