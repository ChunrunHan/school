define(['mui', 'mall','md5'], function(mui, $, md5) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var old_back = mui.back;
	
	//	提交申请注册
		$.tapHandler({
			selector: '.seller-save',
			callback: function() {
				getUserInfo();
			}
		});
		
		
		//	提交数据
	function getUserInfo() {
		var username = document.getElementById('name').value;
		var mobile = document.getElementById('mobile').value;
		var password = document.getElementById('password').value;
		var repassword = document.getElementById('repassword').value;
		if(username == ''|| mobile == ''|| password == ''){
			mui.alert('用户名、手机号、密码不能为空');
		}else{
			if(repassword == ''){
				mui.alert('请输入确认密码');
			}else{
				if(password != repassword){
					mui.alert('两次输入的密码不一致，请重新输入');
				}else{
					password = md5(password);
					if(checkMobile(mobileP)) {
						console.log('手机号：' + mobileP);
						var json = {
							username: username,
							mobile: mobile,
							password: password
						}
						console.log(json);
						userRegion(json)
					}
					
				}
			}
		}
		

		


	}

	//	用户注册函数
	function userRegion(data) {
		console.log('获取的数据：' + JSON.stringify(data));
		var url =  urlBase + '/user/regist';
		$.post(url, data).then(function(data) {
			console.log(data);
			console.log(JSON.stringify(data));
			mui.alert(data.errMsg);
		}).fail(function(status) {
			statusHandler(status);
			console.log(status);
		});
	}
	
	
	
	mui.plusReady(function() {
		console.log('seller_edit plus ready');
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		});

		

		

	});

	

//	//	商家入驻申请提交
//	function sellerSettledDoAdd(data) {
//		console.log('获取的数据：' + JSON.stringify(data));
//		plus.nativeUI.showWaiting('提交中');
//		urlBase = plus.storage.getItem('urlBase');
//		var url = urlBase + '/seller/settlement';
//		$.post(url, data).then(function(data) {
//			plus.nativeUI.closeWaiting();
//			if(data.code === 0) {
//				mui.toast('申请填写成功');
//				var ws = plus.webview.currentWebview();
//				plus.webview.close(ws);
//				mui.openWindow({
//					url: 'seller_application_success.html',
//					id: 'seller_application_success.html'
//				});
//			} else {
//				mui.toast('申请填写失败，请联系客服');
//			}
//		}).fail(function(status) {
//			statusHandler(status);
//		});
//	}

	mui.back = function() {
		pickerBlur();
		clearinput();
		old_back();
	}

	//	清空数据内容
	function clearinput() {
		document.getElementById('name').value = '';
		document.getElementById('mobile').value = '';
		document.getElementById('password').value = '';
		document.getElementById('repassword').value = '';
	}

});