define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		beforeback: function() {
			document.getElementById('search-name').innerText = '已到期';
			return true;
		},
		subpages: [{
			url: 'expired_parking_sub.html',
			id: 'expired_parking_sub.html',
			styles: {
				top: '90px',
				bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		console.log('expired_parking plus ready');
		
		//	获取报修信息
		$.receiveHandler(function() {
			document.getElementById('search-name').innerText = '已到期';
			var sub = plus.webview.getWebviewById('expired_parking_sub.html');
			mui.fire(sub, 'expiredRefresh',{
				num: 0
			});
		}, 'getExpired');
		
		
		//	选择查询报修类型
		$.tapHandler({
			selector: '.search-one',
			callback: function(){
				var repairsub = plus.webview.getWebviewById('expired_parking_sub.html');
				mui.fire(repairsub, 'showSheet');
			}
		});
		
		window.addEventListener('showName', function(e) {
			var priorityName = e.detail.priorityName;
			document.getElementById('search-name').innerText = priorityName;
		});
		
		
		
 
	});

});