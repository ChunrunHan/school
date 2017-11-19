define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		beforeback: function() {
			document.getElementById('search-name').innerText = '已报修';
			var index = plus.webview.getWebviewById('index.html');
			mui.fire(index, 'showUserRepair');
			return true;
		},
		subpages: [{
			url: 'repair_sub.html',
			id: 'repair_sub.html',
			styles: {
				top: '90px',
				bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		console.log('#repair plus ready');
		
		//	获取报修信息
		$.receiveHandler(function() {
			var repairsub = plus.webview.getWebviewById('repair_sub.html');
			mui.fire(repairsub, 'repairRefresh',{
				num: 1
			});
		}, 'getRepair');
		
		//	推送获取新的订单数
		window.addEventListener('getDealRepair', function() {
			var repairsub = plus.webview.getWebviewById('repair_sub.html');
			mui.fire(repairsub, 'repairRefresh',{
				num: 1
			});
		});
		
		
		//	选择查询报修类型
		$.tapHandler({
			selector: '.search-one',
			callback: function(){
				var repairsub = plus.webview.getWebviewById('repair_sub.html');
				mui.fire(repairsub, 'showSheet');
			}
		});
		
		window.addEventListener('showName', function(e) {
			var priorityName = e.detail.priorityName;
			document.getElementById('search-name').innerText = priorityName;
		});
		
		
		

	});

});