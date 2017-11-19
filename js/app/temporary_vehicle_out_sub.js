define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshContainer',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});
	var page = 0;
	mui.plusReady(function() {

		console.log('#temporary_vehicle_out_sub plusReady()');
		webviewInit();
		
		
		//	新增临时车辆
		$.tapHandler({
			selector: '.tel-list li',
			url:'temporary_vehicle_detail.html'
		});


		//	主动下拉刷新
		window.addEventListener('showOut', function() {
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

	//	获取临时停车信息
	function getData(page, pageSize, isUp) {
		console.log('getData(' + page + ',' + pageSize + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
//		var url = urlBaseP + '/ipms/1/' + zoneId + '///////searchCar/list/' + page + '/' + pageSize;
		var url = urlBaseP + '/ipms/'+ zoneId +'/2/list/tempCarRecord/'+ page +'/'+ pageSize;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取的临时车信息：' + JSON.stringify(data));

			if(data.errCode === 0) {
				mui.each(data.dataList,function(index,item){
//					console.log(item.status);
//					switch(item.status){
//						case 2:
//							item.imgs = 'images/red-warn.svg';
//							break;
//						default:
//							item.imgs = 'images/car.svg';
//							break;
//					}
					item.enterTime = formatDate(item.enterTime);
					item.subweb = 'out'; 
				})
				document.querySelector('.search-result').classList.add('mui-hidden');
				return $.render('tpl/temporary_vehicle_sub_data.html', data);
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

			//	跳转到详情
			$.tapHandler({
				selector: '.tel-list li',
				url: 'temporary_vehicle_detail.html',
				id: 'id',
				event: 'showCarInfo'
			});

			//	点击每个列表跳转到edit，并发送分类名称和优先级数据
//			$.tapHandler({
//				selector: '.goods-list',
//				url: 'category_edit.html',
//				id: 'category',
//				event: 'editClass'
//			});

		}).fail(function(status) {
			stopDownRefresh('#refreshContainer', isUp);
			console.log('获取的临时车信息'+ status)
			statusHandler(status);
		});
	}

});