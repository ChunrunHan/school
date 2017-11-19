define(['mui', 'mall'], function(mui, $) {
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		},
		swipeBack: true //启用右滑关闭功能
	});
	
	var page = 0;
	var size = 20;
	var houseid;
	mui.plusReady(function() {
		console.log('#white_record_down plus ready');
		webviewInit();
		
		//	主动下拉刷新
		window.addEventListener('down', function() {
			console.log('地下车辆刷新')
			mui('#pullrefresh').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
		});
	});
	
	//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		getCarDownList(page, size, false);
	}
	//	上拉加载
	function pullupRefresh() {
		page++;
		getCarDownList(page, size, true);
	}

	// 获取地下车位列表
	function getCarDownList(page, size, isUp) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/ipms/car/blackWhiteList/4/" + zoneId + "//" + page + "/" + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getCarUpList ' + JSON.stringify(data));
			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				return $.render('tpl/white_record_data.html', data);
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.tel-list li');
				} else {
					document.querySelector(".tel-list").innerHTML = '';
					document.querySelector('.search-result').classList.remove('mui-hidden');
				}
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			} else {
				newhtml = html || '';
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();

			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}

			$.setValue('.tel-list', newhtml);

			//	删除车辆
			$.tapHandler({
				selector: '.white-del',
				stopPropagation: true,
				id: 'carid',
				callback: function(id) {
					id = id.split(':');
					var carid = id[0];
					var carnum = id[1];
					houseid = id[2];
					delControl(carid,carnum);
				}
			});


			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#pullrefresh', isUp);
			console.log('获取地下车辆列表' + status)
			statusHandler(status);
		});
	}
	
	//	删除地下车辆请求
	function delCarnum(id,carnum) {
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/car';
		console.log(url);
		var json = {
			id: id,
			zoneId: zoneId,
			carNum: carnum,
			type: 1,
			status: 1,
			houseId: 0
		};
		console.log(JSON.stringify(json))
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('删除车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('删除成功');
				mui('#pullrefresh').pullRefresh().pulldownLoading();

			} else {
				mui.toast(data.message);
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}
	
	function delControl(carid,carnum) {
		console.log('delgoods(' + carnum + ')');
		//	弹出删除框
		mui.confirm('你确定删除' +carnum + '?', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					delCarnum(carid,carnum);
				}
			});
	}

});