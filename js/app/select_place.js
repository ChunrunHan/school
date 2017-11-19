define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshContainer',
			up: getPullupOptions(pullupRefresh)
		}
	});

	var oldHtml = '';
	var newhtml = '';
	var Cpage = 0;
	var Csize = 50;
	var parkingId;
	var old_back = mui.back;
	mui.plusReady(function() {
		webviewInit();

		//	根据小区车场获取车位号
		$.receiveHandler(function(id) {
			plus.storage.setItem('sourceWeb',"owner_car_parking_add.html");
			parkingId = id;
			Cpage = 0;
			getZonesPlace(parkingId, Cpage, Csize, true);
		}, 'getCarPlace');

	});

	//	上拉加载
	function pullupRefresh() {
		console.log('上拉加载')
		Cpage++;
		getZonesPlace(parkingId, Cpage, Csize, true);
	}

	//	点击确认选择车位
	function submitSelect(id, name) {
		var sourceWeb = plus.storage.getItem('sourceWeb');
		var web = plus.webview.getWebviewById(sourceWeb);
//		var web = plus.webview.getWebviewById('owner_car_parking_add.html');
		mui.fire(web, 'sendPlace', {
			id: id,
			sn: name
		});
		mui.back();
	}

	// 获取车位号
	function getZonesPlace(parkingId, page, size, isUp) {
		console.log('车场的id:' + parkingId);
		zoneId = plus.storage.getItem('zoneId');
		bucketP = plus.storage.getItem('bucketP');
		var url = plus.storage.getItem('urlBaseP');
//		url = url + '/ipms/' + zoneId + '/'+ parkingId + '/space/list/' + page + '/' + size;
		url = url + '/ipms/searchSpace/1/'+zoneId+'/'+parkingId+'/////' + page + '/' + size;
		console.log(url); 
		$.get(url).then(function(data) {
			console.log('getZonesPlace ' + JSON.stringify(data));

			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				return $.render('tpl/select_place_data.html', data);
			} else {
				console.log('无数据')
				console.log('当前状态：' + isUp);
				if(isUp === true) {
					mui.toast('没有更多数据了');
					var lis = document.querySelectorAll('.classify-list li').length;
					if(lis == 0) {
						document.querySelector('.search-result').classList.remove('mui-hidden');
					} else {
						document.querySelector('.search-result').classList.add('mui-hidden');
					}

				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}

			$.setValue('.classify-list', newhtml);

			$.tapHandler({
				selector: '.classify-list li',
				id: 'id',
				callback: function(id) {
					console.log(id);
					id = id.split(':');
					submitSelect(id[0], id[1]);
				}
			});

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshContainer', isUp);
			console.log('获取车位信息' + status)
			statusHandler(status);
		});
	}
	
	mui.back = function() {
		document.querySelector('.classify-list').innerHTML = '';
		oldHtml = '';
		newhtml = '';
		Cpage = 0;
		document.querySelector('.search-result').classList.remove('mui-hidden');
		old_back();
	}

});