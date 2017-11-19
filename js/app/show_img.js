define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	mui.plusReady(function() {
		console.log('#show_img plus ready');
		//	mui禁止横屏显示,仅支持竖屏显示
		webviewInit();

		//	接受传过来的参数
		var self = plus.webview.currentWebview();
		var path = self.path;
		
		//	图片显示
		var img = document.querySelector('.img-show');
		var imgWidth = plus.display.resolutionWidth;
		img.setAttribute('width', imgWidth + 'px');
		img.setAttribute('height', 'auto');
		path = path.split("!");
		img.setAttribute('src', path[0]);
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show();
		//	点击区域返回
		mui(".box").on('tap', '.img-show', function() {
			mui.back();
		})
		mui("html").on('tap', 'body', function() {
			mui.back();
		})
	});

});