define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#pullrefresh',
			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});

	var page = 0;
	var size = 12;
	var num = 0;
	var newhtml = '';
	var oldHtml = '';
	var priorityName = '已到期';
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('expired_parking_sub plus ready');
		webviewInit();


		//	主动下拉刷新
		window.addEventListener('expiredRefresh', function(e) {
//			alert(e.detail.num);
			num = e.detail.num;
			mui('#pullrefresh').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
		});
		
		
		window.addEventListener('showSheet', function(e) {
			mui('#pullrefresh').pullRefresh().scrollTo(0,0,100);
			mui('#popover').popover('toggle');
		});
		
		
		//	报修数据显示显示
		$.tapHandler({
			selector: '.priority-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				num = parseInt(id);
				switch(num){
					case 0:
						priorityName = '已到期';
						break;
					case 1:
						priorityName = '一天内到期';
						break;
					case 2:
						priorityName = '两天内到期';
						break;
					case 3:
						priorityName = '三天内到期';
						break;
					case 4:
						priorityName = '四天内到期';
						break;
					case 5:
						priorityName = '五天内到期';
						break;
					case 6:
						priorityName = '六天内到期';
						break;
					case 7:
						priorityName = '一周内到期';
						break;
				}
				var repairsub = plus.webview.getWebviewById('expired_parking.html');
				mui.fire(repairsub, 'showName',{
					priorityName: priorityName
				});
				newhtml = '';
				oldHtml = '';
				document.querySelector(".zone-area").innerHTML = '';
				page = 0;
				getExpiredPark(page, size, false);
				mui('#popover').popover('toggle');
			}
		});

	});

	//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		getExpiredPark(0, size, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		getExpiredPark(page, size, true);
	}

	//	获取到期车位
	function getExpiredPark(page, size, isUp) {
		console.log('getExpiredPark(' + page + ',' + size + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		bucketP = plus.storage.getItem('bucketP');
		zoneName = plus.storage.getItem('zoneName');
		zoneId = plus.storage.getItem('zoneId');
//		var url = urlBaseP + '/repair/search/' + zoneId + '/'+ num +'/' + page + '/' + size;
		var status = parseInt(num) * 86400 * 1000;
		var url = urlBaseP+ '/ipms/list/nearDeadline/parkingSpace/'+zoneId+'/'+ status +'/'+page+'/'+size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getUserRepair ' + JSON.stringify(data));
			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(index, item) {
					item.endTime = formatDate(item.endTime);
					console.log(num)
					switch(num) {
						case 0:
							item.imgs = 'images/reject.svg';
							break;
						case 1:
							item.imgs = 'images/1.svg';
							break;
						case 2:
							item.imgs = 'images/2.svg';
							break;
						case 3:
							item.imgs = 'images/3.svg';
							break;
						case 4:
							item.imgs = 'images/4.svg';
							break;
						case 5:
							item.imgs = 'images/5.svg';
							break;
						case 6:
							item.imgs = 'images/6.svg';
							break;
						case 7:
							item.imgs = 'images/7.svg';
							break;
					}
					
				})

				return $.render('tpl/expired_parking_sub_data.html', data)
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.zone-area li');
				} else {
					document.querySelector(".zone-area").innerHTML = '';
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

			$.setValue('.zone-area', newhtml);

			//	点击跳转到详情
			$.tapHandler({
				selector: '.zone-area li',
				url: 'expired_parking_detail.html',
				id: 'info',
				event: 'getInfo'
			});
			

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			showTag('.zone-area li');
			stopDownRefresh('#pullrefresh', isUp);
			console.log('获取到期车位' + status);
			statusHandler(status);
		});
	}

});