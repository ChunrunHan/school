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

	mui.plusReady(function() {
		console.log('userauth_failed plus ready');
		webviewInit();

		//	主动下拉刷新
		window.addEventListener('failed', function() {
			console.log('failed刷新')
			mui('#pullrefresh').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
		});
	});

		//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		getUserFailed(page, size, false);
	}
	//	上拉加载
	function pullupRefresh() {
		page++;
		getUserFailed(page, size, true);
	}

	//获取所有订单列表
	function getUserFailed(page, size, isUp) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/validation/info/search/2/'+ zoneId +'///'+ page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('获取已验证房屋列表：' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.errCode === 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(k, v) {
					v.submitTime = formatDate(v.submitTime);
					console.log(v.submitTime);
				});
				return $.render('tpl/userauth_failed_data.html', data);
			} else if(data.errCode === 9) {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.userauth-list li');
				} else {
					document.querySelector(".userauth-list").innerHTML = '';
					document.querySelector('.search-result').classList.remove('mui-hidden');
				}
			}

		}).then(function(html){
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
			
			$.setValue('.userauth-list', newhtml);
			
		}).fail(function(status) {
			stopDownRefresh('#pullrefresh', isUp);
			console.log('got fail status:' + status);
			statusHandler(status);
		});
	}

});
