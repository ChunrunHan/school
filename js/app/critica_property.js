define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
//		beforeback: function() {
//			var categorySubView = plus.webview.getWebviewById('goods_category_sub.html');
//			mui.fire(categorySubView, 'fireRefresh');
//			return true;
//		},
		subpages: [{
			url: 'critica_property_sub.html',
			id: 'critica_property_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('#critica_property plusReady()');

		plus.screen.lockOrientation("portrait-primary");
		
		//	获取批评物业信息
		$.receiveHandler(function() {
			var criticasub = plus.webview.getWebviewById('critica_property_sub.html');
			mui.fire(criticasub, 'criticaRefresh');
		}, 'getCritica');
		
		//		$.tapHandler('.icon-add', 'goods_add.html');
		$.tapHandler({
			selector: '.icon-add',
			url: 'critical_property_add.html'
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