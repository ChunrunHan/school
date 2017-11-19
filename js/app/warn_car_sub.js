define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshContainer',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});

	mui.plusReady(function() {
		console.log('#warn_car_sub plusReady()');
		webviewInit();
		
		mui.preload({
			url: 'warn_car_sub_detail.html',
			id: 'warn_car_sub_detail'
		})
		

		//	主动下拉刷新
		window.addEventListener('warnRefresh', function() {
			mui('#refreshContainer').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#refreshContainer').pullRefresh().scrollTo(0,0,100)");
		});

	});

	//	下拉刷新
	function pulldownRefresh() {
		console.log('pulldownRefresh()');
		page = 0;
		getData(page, pageSize, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		getData(page, pageSize, true);
	}

	//	获取异常车辆信息
	function getData(page, pageSize, isUp) {
		console.log('getData(' + page + ',' + pageSize + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/list/illegal/car/' + zoneId + '/' + page + '/' + pageSize;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('所有的异常车辆信息(' + JSON.stringify(data) + ')');

			if(data.errCode === 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList,function(index,item){
					switch(item.status){
						case 0:
							item.status = 'images/normal.svg';
							item.eventid = 'blackcar'
							break;
						case 1: 
							item.status = 'images/normal.svg';
							item.eventid = 'blackcar'
							break;
						case 2:
							item.status = 'images/lock.svg';
							item.eventid = 'color-gery'
							break;
					}
				})
				return $.render('tpl/warn_car_sub_data.html', data);
			} else if(data.errCode === 9) {
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
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);

			} else {
				newhtml = html || '';
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}
			
			$.setValue('.tel-list', newhtml);

			//	点击详情，查看详情
			$.tapHandler({
				selector: '.more-info',
				url: 'warn_car_sub_detail.html',
				id: 'carId',
				event: 'showCarInfo'
			});
			
			//	添加到黑名单车辆
			$.tapHandler({
				selector: '.tel-list #blackcar',
				id:'carid',
				callback: function(id) {
					id = id.split(':');
					var carid = id[0];
					var carnum = id[1];
					delControl(carid,carnum);
				}
			});

		}).fail(function(status) {
			stopDownRefresh('#refreshContainer', isUp);
			console.log('获得报警车辆： '+ status)
			statusHandler(status);
		});
	}
	
	function delControl(carid,carnum) {
		console.log('carid(' + carnum + ')');
		mui.confirm('你确定将' +carnum + '加入黑名单车辆?', '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					addBlackCar(carid,carnum);
				}
			});
	}
	
	//	添加到黑名单车辆
	function addBlackCar(id,carnum) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/car';
		console.log(url);
		var json = {
			id: id,
			zoneId: zoneId,
			carNum: carnum,
			type: 1,
			status: 2,
			houseId: 0
		};
		console.log(JSON.stringify(json))
		$.put(url, json).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('添加到黑名单车辆返回数据 :' + JSON.stringify(data));
			if(data.code === 0) {
				mui.toast('添加黑名单成功');
				mui('#pullrefresh').pullRefresh().pulldownLoading();
			} else {
				mui.toast(data.message);
			}
		}).fail(function(status) {
			statusHandler(status);
		});
	}

});