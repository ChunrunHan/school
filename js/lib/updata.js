define(['mui', 'mall'], function(mui, $) {
//	var updataUrl;
//	var version;
//	var appMd5;
	function setUrl(urlBase) {
		console.log('检查更新啊');
		//获取当前版本号
		plus.runtime.getProperty(plus.runtime.appid, function(appinfo) {
			version = appinfo.version;
		});

		//获取当前系统
		system = plus.os.name;
		isAndroid = system === 'Android';

		console.log(urlBase);

		//配置接口
		if(isAndroid) {
			url = urlBase + '/update/1';
		} else {
			url = urlBase + '/update/0';
		}

	}

	function inquiryUpdata(e) {
		if(e.index == 0) {

			if(isAndroid) {
				// 	调用安卓升级安装插件
				PropertyPluginFn();
//				alert('version ： ' + version +"urlBase:　"　+ urlBase + "appMd5: " + appMd5)
//				alert('version ： ' + typeof version +"urlBase:　"　+ typeof urlBase + "appMd5: " + typeof appMd5)
				plus.PropertyPlugin.DownLoad(version,updataUrl,appMd5);
				
//				//	mui升级安装
//				dtask = plus.downloader.createDownload(updataUrl, {}, function(d, status) {
//					if(status == 200) {
//						var path = d.filename;
//
//						console.log(path);
//						plus.runtime.install(path);
//					} else {
//						alert("下载失败: " + status);
//					}
//				});
//				dtask.start();
			} else {
				plus.runtime.openURL(updataUrl);
			}
		}
	}

	function compareVersion(v1, v2) {
		//		v1 本地 v2 服务器
		var ov = v1;
		var nv = v2;
		
		if(!ov || !nv || ov == "" || nv == "") {
			return false;
		}
		var b = false,
			ova = ov.split("."),
			nva = nv.split(".");
		for(var i = 0; i < ova.length && i < nva.length; i++) {
			var so = ova[i],
				no = parseInt(so),
				sn = nva[i],
				nn = parseInt(sn);
			if(nn > no || sn.length > so.length) {
				return true;
			} else if(nn < no) {
				return false;
			}
		}
		if(nva.length > ova.length && 0 == nv.indexOf(ov)) {
			return true;
		}

	}

	return {
		setUrl: setUrl,
		updata: function(d,n) {
			console.log('检查更新url: ' + url);
			$.get(url).then(function(data) {
				console.log(JSON.stringify(data));
//				if(data.errCode === 0) {
					updataUrl = data.appUrl;
					console.log('hahah');
					appMd5 = data.appMd5;
					//有新版本
					console.log("强制更新： " + compareVersion(version, data.version));
					isNew = compareVersion(version, data.version)

					//强制更新
					forceUpdate = data.forceUpdate;
					console.log("isForce : " + forceUpdate)

					if(isNew) {
						console.log('isForce: '+ forceUpdate);
						if(forceUpdate) {
							if(n==1){
								plus.nativeUI.alert(data.updateMsg, inquiryUpdata, '发现新版本', '立即更新');
							}else{
								plus.nativeUI.confirm(data.updateMsg, inquiryUpdata, '发现新版本', ['立即升级', '下次提醒']);
							}
						}else{
							plus.nativeUI.confirm(data.updateMsg, inquiryUpdata, '发现新版本', ['立即升级', '下次提醒']);
						}
					} else {
						if(d !== true) {
							mui.toast('当前已经是最新版本');
						}

					}
//				}
			}).fail(function(status) {
				console.log(status);
			})
		}
	}
})