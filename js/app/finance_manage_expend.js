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
		console.log('#finance_manage_expend plus ready');
		webviewInit();
		
		//	主动下拉刷新
		window.addEventListener('expend', function() {
			console.log('支出刷新')
			mui('#pullrefresh').pullRefresh().pulldownLoading();
			var contentWebview = plus.webview.currentWebview();
			contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
		});
	});
	
	//	下拉刷新
	function pulldownRefresh() {
		page = 0;
		getExpendList(page, size, false);
	}
	//	上拉加载
	function pullupRefresh() {
		page++;
		getExpendList(page, size, true);
	}

		// 获取收入详细列表
	function getExpendList(page, size, isUp) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/ywh/finance/1/list/"+ page +'/' + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('获取支出详细列表 ' + JSON.stringify(data));
			if(data != null && data.length !== 0) {
				document.querySelector('.search-result').style.display = 'none';
				mui.each(data,function(index,item){
					console.log(item.eventTime);
					item.eventTime = formatDay(item.eventTime);
					item.sign = '-';
					item.signName = '支出';
					switch(item.financeCategoryId){
						case 5:
							item.img = 'images/o-jichu.svg';
							break;
						case 6:
							item.img = 'images/o-wyf.svg';
							break;
						case 7:
							item.img = 'images/o-bangong.svg';
							break;
						case 8:
							item.img = 'images/o-jsq.svg';
							break;
					}
					
				});
				var json = {
					dataList: data
				}
				return $.render('tpl/finance_manage_income_data.html', json);
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.income-list li');
				} else {
					document.querySelector(".income-list").innerHTML = '';
					document.querySelector('.search-result').style.display = 'block';
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

			$.setValue('.income-list', newhtml);

			//	查看详情
			$.tapHandler({
				selector: '.income-list li',
				url: 'finance_manage_detail.html',
				id: 'id',
				event: 'getIncomeInfo'
			});


			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#pullrefresh', isUp);
			console.log('获取收入详细列表' + status);
			plus.nativeUI.closeWaiting();
			if(status == 204 || status == null){
				mui.toast('没有更多数据了');
			}else{
				statusHandler(status);
			}
			
		});
	}

});