/*用户*/
//获取用户登录状态
function getUserState(loc){
    var feedback;
    req=new XMLHttpRequest();
    req.open("GET","/user/getUserState",true);
    req.send();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var objelem=document.getElementById("user");
            feedback=this.responseText;
        if (feedback==1) {
            result="已登录";
            objelem.removeEventListener("click",function(){jump(1,loc)});
            objelem.addEventListener("click",function(){floatwindow(0,0);if (refreshToken2!=1) {
            getUserInfo();
            }});
            callbackFunction();
        } else {
            result="未登录";
            objelem.removeEventListener("click",function(){floatwindow(0,0)});
            objelem.addEventListener("click",function(){jump(1,loc)});
        }
            document.getElementById("userstate").innerHTML = result;
        }
    }
}

//获取用户信息
function getUserInfo(){
    var feedback;
    req=new XMLHttpRequest();
    req.open("POST","/user/getUserInfo",true);
    req.send();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            feedback=this.responseText;
        if (feedback==null) {
            result="您尚未登录";
        } else {
            data = JSON.parse(feedback);
            document.getElementById("showid").innerHTML = data.Id;
            document.getElementById("showusername").innerHTML = data.Un;
        }
        refreshToken2=1;
        }
    }
}

//请求登录
function login() {
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if (username.length==0||password.length==0) {
        alert("您有登录信息未填");
    } else {
        var request = {"username":username,"password":password};
        var data=JSON.stringify(request);
        var feedback;
        log=new XMLHttpRequest();
        log.open("POST","/user/login",true);
        log.setRequestHeader("Content-type", "application/json");
        log.send(data);
        log.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            feedback = this.responseText;
            if (feedback==2) {
                setCookie("ls",1,1296000000);
                refreshToken2=0;
                var str = window.location.search;
                str = str.slice(6);
                window.location.href = "/static/views/"+str;
            } else if (feedback==0){
                document.getElementById("loginstatus").innerHTML = "您已登录";
            } else {
                document.getElementById("loginstatus").innerHTML = "登录失败";
            }
        }
    }
}
}

//请求登出
function logout(){
    var feedback;
    req=new XMLHttpRequest();
    req.open("POST","/user/logout",true);
    req.send();
    req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        feedback=this.responseText;
        if (feedback==1) {
            result="成功登出";
            refreshToken2=0;
            location.reload();
        } else {
            result="登出失败";
        }
    }
}
}
/**************************************************/
/*显示*/
//显示窗口
function floatwindow(mode,num) {
    //mode==0为专用窗口；mode==1为通用窗口，需额外请求
    if (mode==1) {
        document.getElementById("floatwindow4").style.display = "block";

    } else if(mode==0){
        document.getElementById("floatwindow"+num).style.display = "block";
    }
}

//隐藏窗口
function hidewindow(num) {
    document.getElementById("floatwindow"+num).style.display = "none";
}

//页面跳转
function jump(num,add) {
    //(0主页,1登录,2注册,3忘记密码,4,5)
  var arr=new Array("index.html","Login.html","Register.html","ForgetPassword.html","LList.html","MControl.html");
  if (typeof(add) =="undefined") {
    window.location.href=arr[num];
  } else {
    window.location.href=arr[num]+add;
  }
}
/**************************************************/

/*******Cookie********/
//设置Cookie
function setCookie(cname,cvalue,ms) {
    document.cookie = cname + "=" + cvalue + "; " + ms;
}

//读取Cookie
function getCookie(cname) {
    if (cname==null) {
        var ca = document.cookie;
        return ca;
    } else {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
          var c = ca[i].trim();
          if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
}
/*******************/