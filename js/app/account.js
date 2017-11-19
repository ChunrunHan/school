define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	mui.plusReady(function() {
		console.log('account plus ready');
		plus.screen.lockOrientation("portrait-primary");

		//	跳转修改密码页面
		$.tapHandler('.goforget', 'forget_password.html');

		//	跳转修改手机号页面
		$.tapHandler('.gomodify', 'modify_mobile.html');
	})

});