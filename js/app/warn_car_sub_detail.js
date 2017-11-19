define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true
	});

	var carId = '';
	var old_back = mui.back;
	mui.plusReady(function() {

		console.log('#warn_car_sub plusReady()');
		webviewInit();

		$.receiveHandler(function(id) {
			id = id.split(':');
			carid = id[0];
			var carnum = id[1];
			document.querySelector('.carname').innerText = carnum;
			document.querySelector('.delall').setAttribute('carid',carid);
			getCarInfo(carid);
		}, 'showCarInfo');

		//	全部清除
		$.tapHandler({
			selector: '.delall',
			id: 'carid',
			callback: function(id) {
				delControl(id,1);
			}
		});

	});

	//	获取异常车辆信息
	function getCarInfo(carId) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/getIllegalCarDetail/' + zoneId + '/' + carId;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('所有的异常车辆详情(' + JSON.stringify(data) + ')');
			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(index, item) {
					item.recordTime = formatDate(item.recordTime);
					item.reason = showReason(item.reason);
					item.carType = showCarType(item.carType);
//					item.type = statusType(item.type);
				});

				$.render('tpl/warn_car_sub_detail_data.html', data).then(function(html) {
					$.setValue('.repair-all', html);

					//	清除单条报警信息
					$.tapHandler({
						selector: '.delete',
						id: 'info',
						callback: function(id) {
							delControl(id,0);
						}
					});

				});
			} else {
				document.querySelector('.search-result').classList.remove('mui-hidden');
			}

		}).fail(function(status) {
			console.log('获取违规车辆违规详情' + status);
			statusHandler(status);
		})

	}
	
	function delControl(id,status) {
		if(status == 1){
			mui.confirm('你确定清除所有记录吗?', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delInfo(id,status);
				}
			});
		} else {
			mui.confirm('你确定删除该记录吗?', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delInfo(id,status);
				}
			});
		}
		
	}
	
//	PUT /ipms/clear/illegalCarRecord/{zoneId}{carId:[^/]?}/{recordId:[^/]?}
	//	清除记录操作
	function delInfo(id,status) {
		console.log('delInfo：' + id);
		console.log('status: ' + status);
		console.log(typeof status);
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		if(status){
			var url = urlBaseP + '/ipms/clear/illegalCarRecord/'+ zoneId +'/'+ id + '/';
		}else{
			var url = urlBaseP + '/ipms/clear/illegalCarRecord/'+ zoneId +'//' + id;
		}
		console.log(url);
		$.get(url).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('删除成功');
				if(!status){
					delbox(id);
				}else{
					var detail = plus.webview.getWebviewById('warn_car.html');
					mui.fire(detail, "getWarnCar");
					old_back();
				}
				
			} else {
				mui.toast('删除失败');
			}

		}).fail(function(status) {
			console.log('删除操作'+status)
			statusHandler(status);
		});
	}
	
	function delbox(id){
		var son = document.getElementById(id);
		var father = document.querySelector('.repair-all');
		father.removeChild(son);
	}

	function showReason(type) {
		var reason;
		switch(type) {
			case 0:
				reason = "正常";
				break;
			case 1:
				reason = "业主车";
				break;
			case 2:
				reason = "地上白名单";
				break;
			case 3:
				reason = "地下白名单";
				break;
			case 5:
				reason = "警车";
				break;
			case 11:
				reason = "非登记车辆, 临时车进入小区";
				break;
			case 12:
				reason = "非登记车辆, 临时车进入地下";
				break;
			case 13:
				reason = "非登记车辆, 临时车离开地下";
				break;
			case 14:
				reason = "非登记车辆, 临时车离开小区";
				break;
			case 15:
				reason = "车位已经到期进入小区";
				break;
			case 16:
				reason = "车位已经到期进入地下";
				break;
			case 17:
				reason = "车位已经到期离开地下";
				break;
			case 18:
				reason = "车位已经到期离开小区";
				break;
			case 19:
				reason = "余额不足进入小区";
				break;
			case 20:
				reason = "余额不足进入地下";
				break;
			case 21:
				reason = "余额不足离开地下";
				break;
			case 22:
				reason = "余额不足离开小区";
				break;
			case 23:
				reason = "名下车位已满进入小区";
				break;
			case 24:
				reason = "名下车位已满进入地下";
				break;
			case 25:
				reason = "名下车位已满离开地下";
				break;
			case 26:
				reason = "名下车位已满离开小区";
				break;
			case 27:
				reason = "黑名单车辆";
				break;
			case 28:
				reason = "无地下车位";
				break;

		}
		return reason;
	}

	function showCarType(carType) {
		var carname;
		switch(carType) {
			case 1:
				carname = "临时车辆";
				break;
			case 2:
				carname = "业主车辆";
				break;
			case 5:
				carname = "VIP车辆";
				break;
			case 6:
				carname = "地上白名单车辆";
				break;
			case 7:
				carname = "地下白名单车辆";
				break;
			case 8:
				carname = "黑名单车辆";
				break;

		}
		return carname;
	}
	
	function statusType(type){
		var typename;
		switch(type) {
			case 1:
				typename = "正常";
				break;
			case 2:
				typename = "锁定";
				break;

		}
		return typename;
	}
	
	mui.back = function(){
		document.querySelector('.repair-all').innerHTML = "";
		var warn = plus.webview.getWebviewById('warn_car_sub.html');
		mui.fire(warn, 'warnRefresh');
		old_back();
	}

});