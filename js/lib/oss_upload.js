/**
 * Created by lenovo on 2017/1/3.
 */

function ossUpload(){
    $.when(stsValidate()).done(function(){
        var accessKeyId = sessionStorage.getItem('admin_accessKeyId');
        var accessKeySecret = sessionStorage.getItem('admin_accessKeySecret');
        var stsToken = sessionStorage.getItem('admin_stsToken');
        //alert(accessKeyId);
        //alert(accessKeySecret);
        //alert(stsToken);
        var client = new OSS.Wrapper({
            region: admin_region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            stsToken: stsToken,
            bucket: admin_bucket
        });
        //dumpObject(client);
        var file =  document.getElementById('uploadFile').files[0]; 
        
        //dumpObject(file)
        alert(sessionStorage.getItem('user_id'));
        var uploadFile = '/'+sessionStorage.getItem('user_id')+'/'+'111111111.jpg';
        client.multipartUpload(uploadFile, file,{
            headers: {
                'Content-Disposition': ''
            }
        }, {
            progress: function(p) {
            console.log('Progress: ' + p);
        }
    }).then(function (result) {
            dumpObject(result.res);
        console.log(result);
    }).catch(function (err) {
        console.log(err);
    });
    });
}

function ossDelete(){
    $.when(stsValidate()).done(function(){
        var accessKeyId = sessionStorage.getItem('admin_accessKeyId');
        var accessKeySecret = sessionStorage.getItem('admin_accessKeySecret');
        var stsToken = sessionStorage.getItem('admin_stsToken');
        //alert(accessKeyId);
        //alert(accessKeySecret);
        //alert(stsToken);
        var client = new OSS.Wrapper({
            region: admin_region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            stsToken: stsToken,
            bucket: admin_bucket
        });
        //dumpObject(client);
        var file =  document.getElementById('uploadFile').files[0];
        dumpObject(file);
        alert(sessionStorage.getItem('user_id'));
        var uploadFile = '/'+sessionStorage.getItem('user_id')+'/'+'1.jpg';
        client.delete(uploadFile,
            {
                progress: function(p) {
                console.log('Progress: ' + p);
                }
            }).then(function (result) {
                dumpObject(result.res);
                console.log(result);
            }).catch(function (err) {
                console.log(err);
            });
    });
}

function ossGet(images,userId){
    // alert(fileName)
    // alert(userId)
    layer.closeAll();
    var index = layer.load(2);
    var accessKeyId = sessionStorage.getItem('admin_accessKeyId');
    var accessKeySecret = sessionStorage.getItem('admin_accessKeySecret');
    var stsToken = sessionStorage.getItem('admin_stsToken');
    //获取头像
    var client = new OSS.Wrapper({
        region: admin_region,
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        stsToken: stsToken,
        bucket: admin_bucket
    });
    var objectKey = '/'+userId+'/'+val+'.jpg';
    //alert(objectKey)
    var result = client.signatureUrl(objectKey, {
        expires: 3600
    });
    // var htmls = '';
    // $.each(images, function (key, val) {
    //     //alert(val)
    //     var objectKey = '/'+userId+'/'+val+'.jpg';
    //     //alert(objectKey)
    //     var result = client.signatureUrl(objectKey, {
    //         expires: 3600
    //     });
    //     //var src = result;
    //     htmls +=  "<a href='"+ result +"' target='_blank'><img src='" + result + "' class='img-responsive' width='200' height='100' style='max-height: 100px;max-width: 200px'/></a>" + "<br/>";
    // });
    // $("#imgSpan").html(htmls);
    //$("#imageSee").attr('src',result);
    layer.closeAll();
}