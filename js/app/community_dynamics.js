define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
//		beforeback: function() {
//			var categorySubView = plus.webview.getWebviewById('goods_category_sub.html');
//			mui.fire(categorySubView, 'fireRefresh');
//			return true;
//		},
		subpages: [{
			url: 'community_dynamics_sub.html',
			id: 'community_dynamics_sub.html',
			styles: {
				top: '45px',
				bottom: '0px'
			}
		}]
	});

	mui.plusReady(function() {
		console.log('#community_dynamics plusReady()');
		plus.screen.lockOrientation("portrait-primary");
		
		//	获取社区动态
		$.receiveHandler(function() {
			var communitysub = plus.webview.getWebviewById('community_dynamics_sub.html');
			mui.fire(communitysub, 'communityRefresh');
		}, 'getCoumunityDynamics');
		
//		mui.preload({
//			url: 'goods_edit.html',
//			id: 'goods_edit.html'
//		});
//		mui.preload({
//			url: 'goods_add.html',
//			id: 'goods_add.html'
//		});
		//		$.tapHandler('.icon-add', 'goods_add.html');
		$.tapHandler({
			selector: '.icon-add',
			url: 'community_dynamics_add.html'
		});

		var old_back = mui.back;
		mui.back = function() {
//			var sub = plus.webview.getWebviewById('goods_list_sub.html');
//			mui.fire(sub, 'delete');
			old_back();
		}

		//	接受goods_category_sub发来的categoryId;
//		$.receiveHandler(function(id, extra) {
//			plus.storage.setItem('categoryPriority', id);
//			console.log(plus.storage.getItem('categoryPriority'));
//			var category = id.split(':');
//			var categoryId = category[0];
//			var categoryName = category[1];
//			document.getElementById('category').innerText = categoryName;
//			var sub = plus.webview.getWebviewById('goods_list_sub.html');
//			mui.fire(sub, 'searchGoods');
//		}, 'sendId');

	});

});