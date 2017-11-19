define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
	});

	mui.plusReady(function() {
		console.log('userauth plus ready');
		plus.screen.lockOrientation("portrait-primary");

		//创建子页面，首个选项卡页面显示，其它均隐藏；
		var self = plus.webview.currentWebview();
		var subpages = ['userauth_pending.html', 'userauth_passed.html','userauth_failed.html'];
		var subpage_style = {
			top: '45px',
			bottom: '0px'
		};
		//	获得按钮
		var span = document.querySelectorAll("#deal-control-box span");
		//	创建webview
		var sub0 = plus.webview.create(subpages[0], subpages[0], subpage_style, {});
		var sub1 = plus.webview.create(subpages[1], subpages[1], subpage_style, {});
		var sub2 = plus.webview.create(subpages[2], subpages[2], subpage_style, {});
		//	添加到父页面中
		self.append(sub0);
		self.append(sub1);
		self.append(sub2);
		
		//	待审核
		span[0].addEventListener("tap", pending);

		//	已通过
		span[1].addEventListener("tap", passed);
		
		//	已失败
		span[2].addEventListener("tap", failed);
		
		//	默认显示
		$.receiveHandler(function() {
			showpend();
		}, 'showpend');

		//	待审核
		function pending() {
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			sub2.hide();
			var authpending = plus.webview.getWebviewById('userauth_pending.html');
			mui.fire(authpending, 'pend');
			
		}
		
		//	已通过
		function passed() {
			delselect(span);
			span[1].classList.add('btn-orange-active');
			sub0.hide();
			sub1.show();
			sub2.hide();
			var authpassed = plus.webview.getWebviewById('userauth_passed.html');
			mui.fire(authpassed, 'passed');
		}
		
		//	已失败
		function failed() {
			delselect(span);
			span[2].classList.add('btn-orange-active');
			sub0.hide();
			sub1.hide();
			sub2.show();
			var authfailed = plus.webview.getWebviewById('userauth_failed.html');
			mui.fire(authfailed, 'failed');
		}
		
		//	默认显示待审核
		function showpend(){
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			sub2.hide();
			var authpending = plus.webview.getWebviewById('userauth_pending.html');
			mui.fire(authpending, 'pend');
		}
		
		function delselect(span){
			for(var i=0;i<span.length;i++){
				span[i].classList.remove('btn-orange-active');
			}
		}
		window.addEventListener('pendRefresh',showpend);
		
		var old_back = mui.back;
		mui.back = function() {
			sub0.show();
			sub1.hide();
			sub2.hide();
			old_back();
		}

	});

});