define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能

	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		//创建子页面，首个选项卡页面显示，其它均隐藏；
		var self = plus.webview.currentWebview();
		var subpages = ['temporary_vehicle_in_sub.html', 'temporary_vehicle_out_sub.html','temporary_vehicle_warn_sub.html'];
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
		
		//	进场
		span[0].addEventListener("tap", inCar);

		//	已出场
		span[1].addEventListener("tap", outCar);
		
		//	报警
		span[2].addEventListener("tap", warnCar);
		
		//	默认显示进场
		$.receiveHandler(function() {
			showInCar();
		}, 'getIn');

		//	进场
		function inCar() {
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			sub2.hide();
			var inSub = plus.webview.getWebviewById('temporary_vehicle_in_sub.html');
			mui.fire(inSub, 'showIn');
			
		}
		
		//	出场
		function outCar() {
			delselect(span);
			span[1].classList.add('btn-orange-active');
			sub0.hide();
			sub1.show();
			sub2.hide();
			var outSub = plus.webview.getWebviewById('temporary_vehicle_out_sub.html');
			mui.fire(outSub, 'showOut');
		}
		
		//	报警
		function warnCar() {
			delselect(span);
			span[2].classList.add('btn-orange-active');
			sub0.hide();
			sub1.hide();
			sub2.show();
			var warnSub = plus.webview.getWebviewById('temporary_vehicle_warn_sub.html');
			mui.fire(warnSub, 'showWarn');
		}
		
		//	默认显示进场
		function showInCar(){
			delselect(span);
			span[0].classList.add('btn-orange-active');
			sub0.show();
			sub1.hide();
			sub2.hide();
			var inSub = plus.webview.getWebviewById('temporary_vehicle_in_sub.html');
			mui.fire(inSub, 'showIn');
		}
		
		window.addEventListener('showin', showInCar);
		window.addEventListener('showout', outCar);
		window.addEventListener('showwarn', warnCar);
		
		
		
//		添加临时车辆
		$.tapHandler({
			selector: '.icon-add',
			url: 'temporary_vehicle_add.html',
			event: 'showNowTime'
		});
		
		//	获取临时车辆信息
//		$.receiveHandler(function() {
////			var sub = plus.webview.getWebviewById('temporary_vehicle_sub.html');
////			mui.fire(sub, 'temRefresh');
//			
//		}, 'getTemporary');
		
		var old_back = mui.back;
		mui.back = function() {
			sub0.show();
			sub1.hide();
			sub2.hide();
			old_back();
		}
		
		
		

	})

	function delselect(span){
			for(var i=0;i<span.length;i++){
				span[i].classList.remove('btn-orange-active');
			}
		}

	


});