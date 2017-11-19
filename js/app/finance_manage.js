define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
	});

	mui.plusReady(function() {
		console.log('#finance_manage ready');
		plus.screen.lockOrientation("portrait-primary");

		//创建子页面，首个选项卡页面显示，其它均隐藏；
		var self = plus.webview.currentWebview();
		var subpages = ['finance_manage_income.html', 'finance_manage_expend.html'];
		var subpage_style = {
			top: '45px',
			bottom: '0px'
		};
		//	获得按钮
		var span = document.querySelectorAll("#deal-control-box span");
		//	创建webview
		var sub0 = plus.webview.create(subpages[0], subpages[0], subpage_style, {});
		var sub1 = plus.webview.create(subpages[1], subpages[1], subpage_style, {});
		//	添加到父页面中
		self.append(sub0);
		self.append(sub1);

		//	收入
		span[0].addEventListener("tap", In);

		//	支出
		span[1].addEventListener("tap", Out);


		//	默认显示
		$.receiveHandler(function() {
			showIn();
		}, 'showIncome');

		//	收入
		function In() {
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			var income = plus.webview.getWebviewById('finance_manage_income.html');
			mui.fire(income, 'income');
			document.querySelector('.icon-add').setAttribute('signName','收入,1');
		}

		//	支出
		function Out() {
			delselect(span);
			span[1].classList.add('btn-orange-active');
			sub0.hide();
			sub1.show();
			var expend = plus.webview.getWebviewById('finance_manage_expend.html');
			mui.fire(expend, 'expend');
			document.querySelector('.icon-add').setAttribute('signName','支出,2');
		}

		//	默认收入
		function showIn() {
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			var income = plus.webview.getWebviewById('finance_manage_income.html');
			mui.fire(income, 'income');
			document.querySelector('.icon-add').setAttribute('signName','收入,1');
		}

		function delselect(span) {
			for(var i = 0; i < span.length; i++) {
				span[i].classList.remove('btn-orange-active');
			}
		}
		
		window.addEventListener('incomeRefresh', In);
		window.addEventListener('expendRefresh', Out);

		$.tapHandler({
			selector: '.icon-add',
			url: 'finance_manage_add.html',
			id: 'signName',
			event: 'sendSignName'
		});
		
		var old_back = mui.back;
		mui.back = function() {
			sub0.show();
			sub1.hide();
			old_back();
		}

	});

	

});