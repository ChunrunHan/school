define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshContainer',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});

	var old_back = mui.back;
	var cameraID;
	var page = 0;
	mui.plusReady(function() {
		webviewInit();
		//	根据小区ID和摄像头序列号获取最近的进出车辆列表
		window.addEventListener('carRefresh', function(e) {
			cameraID = e.detail.id;
			page = 0;
			mui('#refreshContainer').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#refreshContainer').pullRefresh().scrollTo(0,0,100)");
		});

	});

	//	下拉刷新
	function pulldownRefresh() {
		console.log('pulldownRefresh()');
		page = 0;
		getZonesCar(page, pageSize, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		getZonesCar(page, pageSize, true);
	}

	//	获取入口车辆
	function getZonesCar(page, pageSize, isUp) {
//		alert('获取入口车辆啊')
		console.log('getZonesCar(' + page + ',' + pageSize + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/getRecentCar/' + zoneId + '/' + cameraID + '/' + page + '/' + pageSize;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取车信息：' + JSON.stringify(data));

			if(data.errCode === 0) {
				var data1 = data.dataList;
				mui.each(data1,function(index,item){
					item.recordTime = formatDate(item.recordTime);
				})
				document.querySelector('.search-result').classList.add('mui-hidden');
				return $.render('tpl/select_carnum_data.html', data);
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.classify-list li');
				} else {
					document.querySelector(".classify-list").innerHTML = '';
					document.querySelector('.search-result').classList.remove('mui-hidden');
				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);

			} else {
				newhtml = html || '';
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}
			console.log(newhtml);
			$.setValue('.classify-list', newhtml);

			//	跳转到详情
			$.tapHandler({
				selector: '.classify-list li',
				id: 'num',
				callback: function(id) {
					console.log(id);
					id = id.split(':');
					submitSelect(id[0], id[1]);
				}
			});

		}).fail(function(status) {
			stopDownRefresh('#refreshContainer', isUp);
			console.log('获取的入口车辆信息' + status)
			statusHandler(status);
		});
	}

	//	点击确认选择入口
	function submitSelect(id, name) {
		var web = plus.webview.getWebviewById('temporary_vehicle_add.html');
		mui.fire(web, 'sendCar', {
			id: id,
			name: name
		});
		mui.back();
	}

	mui.back = function() {
		document.querySelector('.classify-list').innerHTML = '';
		document.querySelector('.search-result').classList.remove('mui-hidden');
		old_back();
	}

});