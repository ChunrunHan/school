define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		subpages: [{
			url: 'advise_property_sub.html',
			id: 'advise_property_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('#advise_property plusReady()');

		plus.screen.lockOrientation("portrait-primary");
		
		//	获取建议物业信息
		$.receiveHandler(function() {
			var advisesub = plus.webview.getWebviewById('advise_property_sub.html');
			mui.fire(advisesub, 'adviseRefresh');
		}, 'getAdivise');
		


//		mui.preload({
//			url: 'goods_add.html',
//			id: 'goods_add.html'
//		});
		//		$.tapHandler('.icon-add', 'goods_add.html');
		$.tapHandler({
			selector: '.icon-add',
			url: 'advise_property_add.html'
		});

		var old_back = mui.back;
		mui.back = function() {
			var sub = plus.webview.getWebviewById('goods_list_sub.html');
			mui.fire(sub, 'delete');
			old_back();
		}

		//	接受goods_category_sub发来的categoryId;
		$.receiveHandler(function(id, extra) {
			plus.storage.setItem('categoryPriority', id);
			console.log(plus.storage.getItem('categoryPriority'));
			var category = id.split(':');
			var categoryId = category[0];
			var categoryName = category[1];
			document.getElementById('category').innerText = categoryName;
			var sub = plus.webview.getWebviewById('goods_list_sub.html');
			mui.fire(sub, 'searchGoods');
		}, 'sendId');

	});

});