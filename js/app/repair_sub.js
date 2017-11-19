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
	var num = 1;
	var newhtml = '';
	var oldHtml = '';
	var priorityName = '已报修';
	var old_back = mui.back;
	mui.plusReady(function() {
		console.log('#repair_sub plus ready');
		webviewInit();

//		$.tapHandler('.red-record', 'repair_sub_detail.html');

		//	主动下拉刷新
		window.addEventListener('repairRefresh', function(e) {
//			alert(e.detail.num);
			newhtml = '';
			oldHtml = '';
			num = e.detail.num;
			showText(num);
			mui('#pullrefresh').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
		});
		
		window.addEventListener('showSheet', function(e) {
			mui('#sheet1').popover('toggle');
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
						priorityName = '全部状态';
						break;
					case 1:
						priorityName = '已报修';
						break;
					case 2:
						priorityName = '已接单';
						break;
					case 4:
						priorityName = '待解决';
						break;
					case 5:
						priorityName = '已解决';
						break;
					case 6:
						priorityName = '已拒绝';
						break;
				}
				var repairsub = plus.webview.getWebviewById('repair.html');
				mui.fire(repairsub, 'showName',{
					priorityName: priorityName
				});
				newhtml = '';
				oldHtml = '';
				document.querySelector(".repair-all").innerHTML = '';
				page = 0;
				getUserRepair(page, size, false);
				mui('#sheet1').popover('toggle');
			}
		});
		
		
		function showText(num){
			num = parseInt(num);
			switch(num){
					case 0:
						priorityName = '全部状态';
						break;
					case 1:
						priorityName = '已报修';
						break;
					case 2:
						priorityName = '已接单';
						break;
					case 4:
						priorityName = '待解决';
						break;
					case 5:
						priorityName = '已解决';
						break;
					case 6:
						priorityName = '已拒绝';
						break;
				}
				var repairsub = plus.webview.getWebviewById('repair.html');
				mui.fire(repairsub, 'showName',{
					priorityName: priorityName
				});
		}

	});

	//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		getUserRepair(0, size, false);
	}

	//	上拉加载
	function pullupRefresh() {
		page++;
		getUserRepair(page, size, true);
	}

	//	获取所有报修列表(根据小区id)
	function getUserRepair(page, size, isUp) {
		console.log('getUserRepair(' + page + ',' + size + ',' + isUp + ')');
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		bucketP = plus.storage.getItem('bucketP');
		zoneName = plus.storage.getItem('zoneName');
		zoneId = plus.storage.getItem('zoneId');
		var url = urlBaseP + '/repair/search/' + zoneId + '/'+ num +'/' + page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getUserRepair ' + JSON.stringify(data));
			if(data != null && data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(index, item) {
					item.expectTime = formatDate(item.expectTime);
					item.zoneName = zoneName;
					switch(item.status) {
						case 1:
							item.statusImg = 'images/baoxiu.svg';
							item.statusText = '已报修';
							item.color = 'auto-color';
							break;
						case 2:
							item.statusImg = 'images/baoxiu.svg';
							item.statusText = '已接单';
							item.color = 'auto-color';
							break;
						case 3:
							item.statusImg = 'images/baoxiu.svg';
							item.statusText = '已分配';
							item.color = 'auto-color';
							break;
						case 4:
							item.statusImg = 'images/jiejue.svg';
							item.statusText = '待解决';
							item.color = 'repair-color';
							break;
						case 5:
							item.statusImg = 'images/true.svg';
							item.statusText = '已解决'
							item.color = 'success-color';
							break;
						case 6:
							item.statusImg = 'images/jiejue.svg';
							item.statusText = '已拒绝'
							item.color = 'reject-color';
							break;
						case 7:
							item.statusImg = 'images/baoxiu.svg';
							item.statusText = '已撤销';
							item.color = 'auto-color';
							break;
						case 8:
							item.statusImg = 'images/true.svg';
							item.statusText = '已评价';
							item.color = 'success-color';
							break;
					}
					if(item.user.avatar != '' || item.user.avatar != undefined){
						item.avatar = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + item.user.userSsoId + '/' + item.user.avatar + '.jpg';
					}else{
						item.avatar = 'images/default_header.png'
					}
					
					
				})

				return $.render('tpl/repair_sub_data.html', data)
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.repair-all li');
				} else {
					document.querySelector(".repair-all").innerHTML = '';
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

			$.setValue('.repair-all', newhtml);

			//			//	点击报修跳转到报修详情
			$.tapHandler({
				selector: '.repair-all li .box-top',
				url: 'repair_sub_detail.html',
				id: 'repairId',
				event: 'getRepairInfo'
			});
			
			//	拨打电话
			$.tapHandler({
				selector: '.bot-call',
				id:'tel',
				callback: function(id) {
					plus.device.dial(id);
					pickerBlur();
				}
			});
			

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#pullrefresh', isUp);
			console.log('按照页数刷新报修列表' + status);
			plus.nativeUI.closeWaiting();
			if(status == 204 || status == null){
				showTag('.repair-all li');
			}else{
				statusHandler(status);
			}

			
		});
	}

});