define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var build = "";
	var unit = "";
	var floor = "";
	var house = "";
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('#owner_pay plus ready');
		plus.screen.lockOrientation("portrait-primary");

		zoneName = plus.storage.getItem('zoneName');
		document.getElementById('select-zone').value = zoneName;

		//	楼栋
		$.tapHandler({
			selector: '#select-build',
			url: 'select_build.html',
			event: 'getPayBuilding'
		});

		//	单元
		mui("body").on('tap', '#select-unit', function() {
			if(build == "") {
				mui.toast('请选择楼栋')
			} else {
				var sub = plus.webview.getWebviewById('select_unit.html');
				mui.fire(sub, 'getUnit', {
					build: build
				});
				mui.openWindow({
					url: 'select_unit.html',
					id: 'select_unit.html'
				});
			}

		});

		//	楼层
		mui("body").on('tap', '#select-floor', function() {
			if(build == "") {
				mui.toast('请选择楼栋');
			} else if(unit == "") {
				mui.toast('请选择单元');
			} else {
				var sub = plus.webview.getWebviewById('select_floor.html');
				mui.fire(sub, 'getFloor', {
					build: build,
					unit: unit
				});
				mui.openWindow({
					url: 'select_floor.html',
					id: 'select_floor.html'
				});
			}

		});

		// 	房屋
		mui("body").on('tap', '#select-house', function() {
			if(build == "") {
				mui.toast('请选择楼栋');
			} else if(unit == "") {
				mui.toast('请选择单元');
			} else if(floor == "") {
				mui.toast('请选择楼层')
			} else {
				var sub = plus.webview.getWebviewById('select_house.html');
				mui.fire(sub, 'getHouse', {
					build: build,
					unit: unit,
					floor: floor
				});
				mui.openWindow({
					url: 'select_house.html',
					id: 'select_house.html'
				});
			}

		});

		//	接受楼栋
		window.addEventListener('sendBuild', getBuild);
		//	接受单元
		window.addEventListener('sendUnit', getUnit);
		//	接受楼层
		window.addEventListener('sendFloor', getFloor);
		//	接受房屋
		window.addEventListener('sendHouse', getHouse);

		mui('.mui-content').on('keyup', '#submit-money', function() {
			var m = /^((0?)|([1-9]\d*?))(.\d{1,2})?$/;
			if(m.test(this.value)) {

			} else {
				mui.toast('最多保留两位小数');
				this.value = '';
			}
		});

		//	确认充值
		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				pickerBlur();
				var money = document.getElementById('submit-money').value;
				if(build == "") {
					mui.toast('请选择楼栋');
					return;
				} else if(unit == "") {
					mui.toast('请选择单元');
					return;
				} else if(floor == "") {
					mui.toast('请选择楼层');
					return;
				} else if(house == "") {
					mui.toast('请选择房屋');
					return;
				} else if(money == "") {
					mui.toast('金额不能为空');
					return;
				} else {
					var info = build + '-' + unit + '-' + house;
					confirmMoney(info, money);
				}

			}
		});

	});

	function getBuild(e) {
		build = e.detail.build;
		document.getElementById('select-build').value = build + '号楼';
	}

	function getUnit(e) {
		unit = e.detail.unit;
		document.getElementById('select-unit').value = unit + '单元';
	}

	function getFloor(e) {
		floor = e.detail.floor;
		document.getElementById('select-floor').value = floor + '楼层';
	}

	function getHouse(e) {
		house = e.detail.house;
		document.getElementById('select-house').value = house + '室';
	}

	mui.back = function() {
		build = "";
		unit = "";
		floor = "";
		house = "";
		document.getElementById('submit-money').value = '';
		document.getElementById('select-build').value = '';
		document.getElementById('select-unit').value = '';
		document.getElementById('select-floor').value = '';
		document.getElementById('select-house').value = '';
		old_back();
	}

	//	确认充值信息
	function confirmMoney(user, money) {
		mui.confirm('你确定给\n' + user + '\n充值' + money + '元', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					money = parseInt(money)
					getHouseId(build,unit,floor,house,money)
				}
			});
	}
	
	//	获取房屋id
	function getHouseId(build,unit,floor,house,money){
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/house/searchOne/' + zoneId + "/" + build + "/" + unit + "/" + floor + "/" + house;
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			if(data.errCode == 0){
				var houseId = data.data.id;
				submitMoney(houseId,money);
				
			}else{
				mui.toast('充值失败');
			}
			
		}).fail(function(status){
			console.log('获取房屋id' + status);
			statusHandler(status);
		})
		
	}

	//	充值操作
	function submitMoney(houseId,money) {
		plus.nativeUI.showWaiting();
		userId = plus.storage.getItem('userId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var nowtime = Date.parse(new Date());
		var url = urlBaseP + "/ipms/recharge/car"; 
		var json = {
			houseId: houseId,
			chargeType: 2,
			money: money,
			recordTime: nowtime,
			userId: userId
		}
		console.log(JSON.stringify(json))
		$.post(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('充值返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('充值成功');
				mui.back();
			} else {
				mui.toast('充值失败');
			}
		}).fail(function(status) {
			console.log('续租缴费'+ status);
			statusHandler(status);
		});
	}

});