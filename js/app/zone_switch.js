define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		beforeback: function() {
			pickerBlur();
			return true;
		}
	});

	var sn = ''; // 摄像头编号
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		zoneName = plus.storage.getItem('zoneName');
		document.getElementById('select-zone').value = zoneName;
		
		mui.preload({
			url: 'select_switch.html',
			id: 'select_switch.html'
		})

		//	开闸放行
		$.tapHandler({
			selector: '.switch-commit',
			callback: function() {
				pickerBlur();
				var name = document.getElementById('select-switch').value;
				if(sn == "" && name == ""){
					mui.toast('请选择道闸');
					return;
				}else{
//					alert("摄像头编号：" + sn);
					openSwitch(sn);
				}
				
			}
		});

		//	选择道闸
		$.tapHandler({
			selector: '#select-switch',
			url: 'select_switch.html',
			event: 'getSwitch'
		});

		window.addEventListener('showSwitch', showSwitch);

	});
	
	//	处理返回来的道闸数据
	function showSwitch(e) {
		sn = e.detail.sn;
		var name = e.detail.name;
//		alert("sn: " + sn);
		console.log(typeof sn);
//		alert('name: ' +  name);
		document.getElementById('select-switch').value = name;
	}

	var old_back = mui.back;
	mui.back = function() {
		document.getElementById('select-switch').value = "";
		sn = "";
		old_back();
	}
	
	//	开闸放行操作
	function openSwitch(sn){
		plus.nativeUI.showWaiting();
		console.log('打开的摄像头sn: ' + sn);	
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + "/ipms/send/pass/"+ sn;
		console.log(url);
		$.get(url).then(function(data) { 
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code == 0){
				mui.toast('开闸成功');
			}else{
				mui.toast('开闸失败');
			}
		}).fail(function(status){
			console.log('开闸操作：'+ status);
			statusHandler(status);
		})
		
	}

});