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
		console.log('userauth_pending plus ready');
		webviewInit();

		//	主动下拉刷新
		window.addEventListener('pend', function() {
			console.log('pengding刷新')
			mui('#pullrefresh').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
		});
	});

	//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		getUserPending(page, size, false);
	}
	//	上拉加载
	function pullupRefresh() {
		page++;
		getUserPending(page, size, true);
	}

	//	获取所有订单列表
	function getUserPending(page, size, isUp) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/validation/info/search/0/'+ zoneId +'///'+ page + '/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('获取待审核房屋列表：' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.errCode === 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(k, v) {
					v.submitTime = formatDate(v.submitTime);
					console.log(v.submitTime);
				});
				return $.render('tpl/userauth_pending_data.html', data);
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
					//	通过验证请求
					$.tapHandler({
						selector: '#auth-pass',
						stopPropagation: true,
						id: 'recordId',
						callback: function(id) {
							plus.nativeUI.showWaiting('提交中');
							console.log(id);
							sentPass(id,1);
							return false;
						}
					})

					//	拒绝
					$.tapHandler({
						selector: '#auth-reject',
						stopPropagation: true,
						id: 'recordId',
						callback: function(id) {
							plus.nativeUI.showWaiting('提交中');
							console.log(id);
							sentPass(id,2);
							return false;
						}
					})
		}).fail(function(status) {
			stopDownRefresh('#pullrefresh', isUp);
			console.log('got fail status:' + status);
			statusHandler(status);
		});
	}
	
	//	验证房屋发送请求
	function sentPass(recordId,status) {
		console.log('recordId：' + recordId +'status: '+ status);
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/validation/info/'+recordId+'/'+ status;
		console.log(url);
		$.put(url).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('提交成功');
				mui('#pullrefresh').pullRefresh().pulldownLoading();
			} else {
				mui.toast('提交失败');
			}

		}).fail(function(status) {
			console.log('验证房屋发送请求' +status)
			statusHandler(status);
		});
	}

});