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
		console.log('#owner_car plus ready');
		plus.screen.lockOrientation("portrait-primary");
		
		mui.preload({
			url: 'owner_car_detail.html',
			id: 'owner_car_detail.html'
		});
		mui.preload({
			url: 'owner_car_parking_add.html',
			id: 'owner_car_parking_add.html'
		});
	
		//	小区
		zoneName = plus.storage.getItem('zoneName');
		document.getElementById('select-zone').value = zoneName;
		
		//	楼栋
		$.tapHandler({
			selector: '#select-build',
			url: 'select_build.html',
			event: 'getBuilding'
		});
		
		//	单元
		mui("body").on('tap', '#select-unit', function() {
			if(build == ""){
				mui.toast('请选择楼栋')
			}else{
				var sub = plus.webview.getWebviewById('select_unit.html');
				mui.fire(sub, 'getUnit',{
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
			if(build == ""){
				mui.toast('请选择楼栋');
			}else if(unit == ""){
				mui.toast('请选择单元');
			}else{
				var sub = plus.webview.getWebviewById('select_floor.html');
				mui.fire(sub, 'getFloor',{
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
			if(build == ""){
				mui.toast('请选择楼栋');
			}else if(unit == ""){
				mui.toast('请选择单元');
			}else if(floor == ""){
				mui.toast('请选择楼层')
			}else{
				var sub = plus.webview.getWebviewById('select_house.html');
				mui.fire(sub, 'getHouse',{
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

		//	查询
		mui("body").on('tap', '.switch-commit', function() {
			if(build == ""){
				mui.toast('请选择楼栋');
				return;
			}else if(unit == ""){
				mui.toast('请选择单元');
				return;
			}else if(floor == ""){
				mui.toast('请选择楼层');
				return;
			}else if(house == ""){
				mui.toast('请选择房屋');
				return;
			}else{
				getHouseId(build,unit,floor,house);
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

	});
	
	function getBuild(e){
		build = e.detail.build;
		document.getElementById('select-build').value = build + '号楼';
	}
	function getUnit(e){
		unit = e.detail.unit;
		document.getElementById('select-unit').value = unit + '单元';
	}
	function getFloor(e){
		floor = e.detail.floor;
		document.getElementById('select-floor').value = floor + '楼层';
	}
	function getHouse(e){
		house = e.detail.house;
		document.getElementById('select-house').value = house + '室';
	}
	
	mui.back = function() {
		clearINput();
		old_back();
	}
	//	获取房屋ID
	function getHouseId(build,unit,floor,house){
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/house/searchOne/' + zoneId + "/" + build + "/" + unit + "/" + floor + "/" + house;
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			if(data.errCode == 0){
				var houseId = data.data.id;
				var housePt = data.data.building + '-' + data.data.unit + '-' + data.data.room;
				var sub = plus.webview.getWebviewById('owner_car_detail.html');
				mui.fire(sub, 'getOwnerInfo',{
					houseId: houseId,
					housePt: housePt
					
				});
				clearINput();
				mui.openWindow({
					url: 'owner_car_detail.html',
					id: 'owner_car_detail.html'
				});
			}else{
				mui.toast('查询失败');
			}
			
		}).fail(function(status){
			console.log('获取房屋id' + status);
			statusHandler(status);
		})
		
	}
	
	function clearINput(){
		build = "";
		unit = "";
		floor = "";
		house = "";
		document.getElementById('select-build').value = '';
		document.getElementById('select-unit').value = '';
		document.getElementById('select-floor').value = '';
		document.getElementById('select-house').value = '';
	}
	

});