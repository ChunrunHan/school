define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	mui.plusReady(function() {
		console.log('about plus ready');
		plus.screen.lockOrientation("portrait-primary");
		//客服电话
		document.getElementById("call").addEventListener('tap', function() {
			plus.device.dial("17863253292");
		});
	});

});