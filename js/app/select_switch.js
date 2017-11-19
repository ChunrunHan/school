define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshList',
//			down: getPulldownOptions(pulldownRefresh),
			up: getPullupOptions(pullupRefresh)
		}
	});
	var checkedNum = [];
	var oldHtml = "";
	var newhtml = "";
	var size = 12;
	var old_back = mui.back;
	mui.plusReady(function() {
		webviewInit();

		//	自动刷新
		$.receiveHandler(function() {
			
			getZoneSwitch(0,size,true);
		}, 'getSwitch');
		

	});
	
	function pulldownRefresh() {
		page = 0;
		getZoneSwitch(page,size,false);
	}
	
	function pullupRefresh() {
		page++;
		getZoneSwitch(page,size,true);
	}

	//获取小区列表
	function getZoneSwitch(page,size,isUp) {
		console.log('select switch getZoneSwitch');
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/ipms/'+ zoneId +'/camera/list/'+ page +'/'+ size;
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('小区获取摄像机列表：' + JSON.stringify(data));
			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				return $.render('tpl/select_switch_data.html', data);
			} else if(data.errCode === 9){
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
				mui('#refreshList').pullRefresh().endPullupToRefresh(false);
			} else {
				newhtml = html || '';
				mui('#refreshList').pullRefresh().endPulldownToRefresh();

			}
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}

			$.setValue('.classify-list', newhtml);

			//	点击道闸获取道闸sn
			$.tapHandler({
				selector: '.classify-list li',
				id: 'sn',
				callback: function(id){
//					alert(id);
					id = id.split(":");
					var sn = id[0];
					var name = id[1];
					var zoneSwitch = plus.webview.getWebviewById('zone_switch.html');
					mui.fire(zoneSwitch,'showSwitch',{
						sn: sn,
						name: name
					});
					oldHtml = "";
					newhtml = "";
					old_back();
					
				}
			});

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取道闸列表' + status);
			statusHandler(status);
		});
		
		
	}
	
	
	mui.back = function() {
		oldHtml = "";
		newhtml = "";
		document.querySelector('.classify-list').innerHTML = "";
		old_back();
	}
	
});