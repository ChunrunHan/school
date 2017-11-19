define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
	});

	mui.plusReady(function() {
		console.log('#white_record ready');
		plus.screen.lockOrientation("portrait-primary");

		//创建子页面，首个选项卡页面显示，其它均隐藏；
		var self = plus.webview.currentWebview();
		var subpages = ['white_record_up.html', 'white_record_down.html', 'white_record_vip.html'];
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
		span[0].addEventListener("tap", up);

		//	已通过
		span[1].addEventListener("tap", down);

		//	已失败
		span[2].addEventListener("tap", vip);

		//	默认显示
		$.receiveHandler(function() {
			showUp();
		}, 'showUp');

		//	地上
		function up() {
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			sub2.hide();
			var whiteup = plus.webview.getWebviewById('white_record_up.html');
			mui.fire(whiteup, 'up');

		}

		//	地下
		function down() {
			delselect(span);
			span[1].classList.add('btn-orange-active');
			sub0.hide();
			sub1.show();
			sub2.hide();
			var whitedown = plus.webview.getWebviewById('white_record_down.html');
			mui.fire(whitedown, 'down');
		}

		//	vip
		function vip() {
			delselect(span);
			span[2].classList.add('btn-orange-active');
			sub0.hide();
			sub1.hide();
			sub2.show();
			var whitevip = plus.webview.getWebviewById('white_record_vip.html');
			mui.fire(whitevip, 'vip');
		}

		//	默认显示地上
		function showUp() {
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			sub2.hide();
			var whiteup = plus.webview.getWebviewById('white_record_up.html');
			mui.fire(whiteup, 'up');
		}

		// 添加车辆后的刷新
		window.addEventListener('goup', up);
		window.addEventListener('godown', down);
		window.addEventListener('govip', vip);

		function delselect(span) {
			for(var i = 0; i < span.length; i++) {
				span[i].classList.remove('btn-orange-active');
			}
		}

		$.tapHandler({
			selector: '.icon-add',
			url: 'white_record_add.html'
		});
		var old_back = mui.back;
		mui.back = function() {
			sub0.show();
			sub1.hide();
			sub2.hide();
			old_back();
		}

	});

	

});