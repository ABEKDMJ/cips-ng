/********Canvas********/
var uniratio=10;//全局变量（适配参数）

//绘制时间轴
function drawCanvas(){
    var intervalDay;
    var dateStr;
    if (obj.starttime[0]==null) {
        intervalDay = 0;
    } else {
        intervalDay = GetNumberOfDays(obj.starttime[0],nowformatdate);
    }
    var i=0;
    var distance = GetNumberOfDays(obj.starttime[0],sortByTime(obj.tail)[obj.tail.length-1].end)+3;

    var canvas = document.getElementById("timeline");
    canvas.width = document.getElementById("innershowpanel").scrollWidth;
    var context= canvas.getContext("2d");  

    var devicePixelRatio = window.devicePixelRatio || 1
    var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1
    var ratio = devicePixelRatio / backingStoreRatio
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    context.font = context.font.replace(
        /(\d+)(px|em|rem|pt)/g,
        function(w, m, u) {
          return (m * ratio) + u;
        }
      );

    context.scale(ratio, ratio);
    context.fillStyle="#AEAEB2";
    context.fillRect(0,76,distance*100,2);

    while(i<=distance){
        dateStr = GetDateStr(i-intervalDay);
        year = dateStr.y;
        month = dateStr.m;
        day = dateStr.d;
        if (year==nowBrokenDate[0] && month==nowBrokenDate[1] && day==nowBrokenDate[2]) {
            context.fillStyle = "#DC143C";
            context.fillRect(i*4*uniratio,47,3.2,31);
            context.font = "23px Arial";
            context.fillText(day,i*4*uniratio,42);
        } else {
            context.fillStyle = "#AEAEB2";
            context.fillRect(i*4*uniratio,57,1.8,20);
            context.font = "17px Arial";
            context.fillText(day,i*4*uniratio,52);
        }
        if (day==1) {
            context.fillText(month,i*4*uniratio,33); 
        }
        if (month==1 && day==1) {
            context.fillText(year,i*4*uniratio,15); 
        }
        i++;
    }
    context.font = context.font.replace(
        /(\d+)(px|em|rem|pt)/g,
        function(w, m, u) {
          return (m / ratio) + u;
        }
      );
}
/*********************/

/********CoreAlgorithm********/
//二维排序
function arrSorting(priobj) {
    var result = new Object();
    var arr = new Array;
    var tail = new Array;
    var meta = new Array;
    var starttime = new Array;
    var i = 0;
    var big = 1;
    var small = 0;
    var temp;
    var token  = false;
    var target = priobj.length;
    var count = 0;
    while(arr.length<target && i<target**2){
        if(priobj[i].paranum==small && priobj[i].paraid==big && i!=priobj.length-1){
            //console.log("act!pop!i!=priobj.length-1");
            arr.push(priobj[i]);
            if (priobj[i].status!=5) {
                starttime.push(priobj[i].start);
                temp = priobj[i];
            }
            priobj.splice(i,1);
            token = true;
            small++;
            count = 0;
        } else if(priobj[i].paranum==small && priobj[i].paraid==big && i==priobj.length-1){
            //console.log("act!pop!i==priobj.length-1");
            arr.push(priobj[i]);
            if (priobj[i].status!=5) {
                starttime.push(priobj[i].start);
                temp = priobj[i];
            }
            priobj.splice(i,1);
            token = true;
            small++;
            i = 0;
            meta.push(small);
            count = 0;
        } else if(i==priobj.length-1 && token==true){
            //console.log("act!token!=true");
            i = 0;
            token = false;
            count = 0;
        } else if(i==priobj.length-1 && token==false){
            //console.log("act!token==false");
            if (arr[arr.length-1].mode!=2) {
                tail.push(temp);
            }
            meta.push(small);
            big++;
            small = 0;
            i = 0;
            count++;
            if (count>=target**2) {
                break;
            }
        } else {
            //console.log("continue!");
            i++;
        }
    }
    if (arr[arr.length-1].mode!=2) {
        tail.push(arr[arr.length-1]);
    }
    result.obj = arr;
    result.meta = meta;
    result.tail = tail;
    result.starttime = starttime;
    return result;
}

//按照结束时间排序
function sortByTime(arr) {
    do {
        var swapped = false;    
        for (var i = 0; i < arr.length-1; i++) {
          if (arr[i].end > arr[i+1].end) {
            var temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
            swapped = true;
          }
        }
      } while(swapped); 
    return arr;
}

//直接排序
function directSort(arr) {
    do {
        var swapped = false;    
        for (var i = 0; i < arr.length-1; i++) {
          if (arr[i] > arr[i+1]) {
            var temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
            swapped = true;
          }
        }
      } while(swapped); 
    return arr;
}

//获取当前日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var result = [currentdate,year,month,strDate];
    return result;
}

//日期加一定天数
function dateAddDays(dateStr,dayCount) {
    var tempDate=new Date(dateStr.replace(/-/g,"/"));//把日期字符串转换成日期格式
    var resultDate=new Date((tempDate/1000+(86400*dayCount))*1000);//增加n天后的日期
    var resultDateStr=resultDate.getFullYear()+"-"+(resultDate.getMonth()+1)+"-"+(resultDate.getDate());//将日期转化为字符串格式
    return resultDateStr;
}

//日期相减获得天数
function GetNumberOfDays(date1,date2) {
    //date1：开始日期，date2结束日期
    var a1 = Date.parse(new Date(date1));
    var a2 = Date.parse(new Date(date2));
    var day = parseInt((a2-a1)/ (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
    return day
};

//逐天输出日期
function GetDateStr(AddDayCount) {   
    var dd = new Date();
    var date = new Object;
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
    var y = dd.getFullYear();   
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();//获取当前几号
    date.y = y;
    date.m = m;
    date.d = d;
    return date;   
}  

//计算任务结束时间
function predictEndTime() {
    var endTime
    var startTime = document.getElementById("starttime").value;
    var lastTime = document.getElementById("lasttime").value;
    var paraBlock = document.getElementById("parablock").value;
    if (startTime==0 && paraBlock==0) {
        startTime = nowformatdate;
    } else if (startTime==0 && paraBlock!=0){
        startTime = getBlockData(paraBlock).end;
    }
    endTime = dateAddDays(startTime,lastTime);
    document.getElementById("pdendtime").innerHTML=endTime;
}

//计算任务当前应有的状态
function predictStatus(priobj) {
    var startTime;
    var endTime;
    var targetId = new Array;
    var targetStatus = new Array;
    var result =  new Object;
    for (let i = 0; i < priobj.length; i++) {
        startTime = priobj[i].start;
        endTime = priobj[i].end;
        state = priobj[i].status;
        if (endTime < nowformatdate && GetNumberOfDays(endTime,nowformatdate)<=30) {
            targetStatus.push(4);
            targetId.push(priobj[i].Id);
        } else if (startTime < nowformatdate && endTime > nowformatdate) {
            targetStatus.push(2);
            targetId.push(priobj[i].Id);
        } else if (endTime == nowformatdate) {
            targetStatus.push(3);
            targetId.push(priobj[i].Id);
        } else if (GetNumberOfDays(endTime,nowformatdate)>60) {
            targetStatus.push(5);
            targetId.push(priobj[i].Id);
        } else {
            targetStatus.push(1);
            targetId.push(priobj[i].Id);
        }
    }
    result.id = targetId;
    result.status = targetStatus;
    return result;
}

//获取指定并行任务行的结束时间
function getBlockData(num) {
    for (let i = 0; i < obj.tail.length; i++) {
        if (obj.tail[i].paraid==num) {
            return obj.tail[i];
        }
    }
}

function getNewDateByLastTime(para) {
    var originobj = obj.obj;
    /*
    for (let i = 0; i < obj.obj.length; i++) {
        var innerobj =new Object;
        innerobj.Id = obj.obj[i].Id;
        innerobj.start = obj.obj[i].start;
        innerobj.end = obj.obj[i].end;
        innerobj.paraid = obj.obj[i].paraid;
        innerobj.paranum = obj.obj[i].paranum;
        priobj.push(innerobj);
    }
    */
    var priobj = handleMissionObj().obj;
    var tparaid;
    var tparanum;
    var tinterval;
    var id = new Array;
    var newstart = new Array;
    var newend = new Array;
    var result = new Object;
    for (let i = 0; i < para.paraid.length; i++) {
        tparaid = para.paraid[i];
        tparanum = para.paranum[i];
        tinterval = para.interval[i];
        for (let ia = 0; ia < priobj.length; ia++) {
            if (priobj[ia].paraid == tparaid && priobj[ia].paranum == tparanum) {
                priobj[ia].end = dateAddDays(priobj[ia].end,tinterval);
            }
            if (priobj[ia].paraid == tparaid && priobj[ia].paranum > tparanum) {
                priobj[ia].start = dateAddDays(priobj[ia].start,tinterval);
                priobj[ia].end = dateAddDays(priobj[ia].end,tinterval);
            }
        } 
    }
    for (let i = 0; i < priobj.length; i++) {
        if (priobj[i].start!=originobj[i].start || priobj[i].end!=originobj[i].end) {
            id.push(priobj[i].Id);
            newstart.push(priobj[i].start);
            newend.push(priobj[i].end);
        }
    }
    result.id = id;
    result.start = newstart;
    result.end = newend;
    return result;
}

//随机获取颜色
function getRandomColor(num) {
    var colorpool=new Array("#007AFF","#A2845E","#32ADE6","#34C759","#5856D6","#00C7BE","#FF9500","#FF2D55"
        ,"#AF52DE","#FF3B30","#30B0C7","#FFCC00","#0A84FF","#AC8E68","#64D2FF","#30D158","#5E5CE6","#66D4CF","#AFEEEE","#6495ED");//前18个为APPLE官方推荐用色
        var greypool=new Array("#8E8E93","#AEAEB2","#636366","#C7C7CC","#D1D1D6");
    var bgcolor;
    var Ranoperator;
    var colorid;
    if (num==0) {//0为灰色
        Ranoperator=Math.floor(Math.random()*5); 
        while(Ranoperator==colorid) {
            Ranoperator=Math.floor(Math.random()*5); 
        }
        colorid=Ranoperator;
        bgcolor=greypool[Ranoperator];//随机获取彩色颜色
    } else {//1为彩色
        Ranoperator=Math.floor(Math.random()*20); 
        while(Ranoperator==colorid) {
            Ranoperator=Math.floor(Math.random()*20); 
        }
        colorid=Ranoperator;
        bgcolor=colorpool[Ranoperator];//随机获取彩色颜色
    }
    return bgcolor;
}
/*********************/

//Mission
var nowformatdate;//全局变量（当前日期字符串）
var nowBrokenDate;//全局变量（当前日期数组）
var obj;//全局变量（全局已排序任务）
var missionData;//全局变量（返回结果）
var recycleobj;//全局变量（返回回收箱结果）
var scrollposition;//全局变量（锚点）
var refreshToken1;//全局变量（页面内容刷新状态）
var refreshToken2;//全局变量（用户状态刷新状态）
var avaheight;//全局变量（任务显示可用高度）

function getobj(){
    console.log(nowformatdate);
    console.log(recycleobj);
    console.log(obj);
    console.log(getCookie());
}

//获取任务数据
function getMissionObj(para) {
    show=new XMLHttpRequest();
    show.open("POST","/mcontrol/showMission",true);
    show.send();
    show.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        missionData=this.responseText;;
        if (missionData!=null && para==true) {
            obj = arrSorting(JSON.parse(missionData));
            var cok = getCookie("aus");
            if (cok==1) {
                showMission();
            } else {
                autoUpdateStatus();
            }
        }
    }
}
}

//任务数据中间处理
function handleMissionObj() {
    var result = arrSorting(JSON.parse(missionData));
    return result;
}

//展示任务
function showMission() {
    deletement('paramissionblock');
    var mission;
    var blockid = 1;
    var p = 0;
    var interval;
    for (let i = 0; i < obj.obj.length; i++) {
        mission = obj.obj[i];
        if (mission.status!=5) {
            if (mission.paraid>blockid) {
                blockid = mission.paraid;
            }
            if (mission.paraid==blockid) {
                //创建并行任务容器
                var belem = document.createElement('div'); //1、创建元素
                belem.setAttribute("id","parablock"+blockid);
                belem.setAttribute("class","paramissionblock");
                document.getElementById('innershowpanel').appendChild(belem); //2、找到父级元素；3、在末尾中添加元素
                creatPlaceholder(i,belem)//创建占位符
                blockid++;
            }

            if (i>=1) {
                lastmission = obj.obj[i-1-p];
                if (lastmission!=null && lastmission.lasttime!=-1) {
                    interval = GetNumberOfDays(lastmission.end,mission.start);
                    //创建占位块
                    if (interval>0 && mission.mode!=0 && mission.mode!=2) {
                        var interstyle = "width:"+interval*4*uniratio+"px;"+"visibility:hidden;";//设置占位块样式
                        //创建占位块
                        var interelem = document.createElement('div'); //1、创建元素
                        interelem.setAttribute("style",interstyle);
                        interelem.setAttribute("class","missionblock");
                        belem.appendChild(interelem); //2、找到父级元素；3、在末尾中添加元素
                    }
                }
            }

            if (mission.lasttime==-1) {
                var foreverelementstyle = "width:100%;"+"background-color:#DC143C;";//设置任务块样式
                //创建任务块
                var elem = document.createElement('div'); //1、创建元素
                elem.innerHTML=mission.title;
                elem.setAttribute("id","missionblock"+mission.Id);
                elem.setAttribute("style",foreverelementstyle);
                elem.setAttribute("class","missionblock");
                elem.setAttribute("onclick","getDetails"+"("+i+")");
                belem.appendChild(elem);; //2、找到父级元素；3、在末尾中添加元素
            } else {
                if (mission.status==2 || mission.status==3) {//进行中和即将结束的任务

                var resttime = GetNumberOfDays(nowformatdate,mission.end);
                if (resttime<0) {
                    resttime = 0;
                }
                var pasttime = mission.lasttime-resttime;
                var pastcolor = getRandomColor(0);
                var restcolor = getRandomColor(1);
                var paststyle = "width:"+pasttime*2*uniratio+"px;"+"background-color:"+pastcolor+";"
                +"padding-left:"+pasttime*1*uniratio+"px;"+"padding-right:"+pasttime*10+"px;";//设置任务块样式
                var reststyle = "width:"+resttime*2*uniratio+"px;"+"background-color:"+restcolor+";"
                +"padding-left:"+resttime*1*uniratio+"px;"+"padding-right:"+resttime*10+"px;";//设置任务块样式
                //创建任务块已完成部分
                var pastelem = document.createElement('div'); //1、创建元素
                pastelem.setAttribute("id","missionblock"+mission.Id+"past");
                pastelem.setAttribute("style",paststyle);
                pastelem.setAttribute("class","missionblock");
                pastelem.setAttribute("onclick","getDetails"+"("+i+")");
                belem.appendChild(pastelem); //2、找到父级元素；3、在末尾中添加元素
                //创建任务块未完成部分
                var restelem = document.createElement('div'); //1、创建元素
                restelem.innerHTML=mission.title;
                restelem.setAttribute("id","missionblock"+mission.Id+"rest");
                restelem.setAttribute("style",reststyle);
                restelem.setAttribute("class","missionblock");
                restelem.setAttribute("onclick","getDetails"+"("+i+")");
                belem.appendChild(restelem); //2、找到父级元素；3、在末尾中添加元素
                scrollposition="missionblock"+mission.Id+"rest";
            } else {
                if (mission.status==4) {//已结束的任务
                    var bgcolor=getRandomColor(0);
                } else {
                    var bgcolor=getRandomColor(1);
                }
                var elementstyle="width:"+mission.lasttime*2*uniratio+"px;"+"background-color:"+bgcolor+";"
                +"padding-left:"+mission.lasttime*1*uniratio+"px;"+"padding-right:"+mission.lasttime*10+"px;";//设置任务块样式
    
                //创建任务块
                var elem = document.createElement('div'); //1、创建元素
                elem.innerHTML=mission.title;
                elem.setAttribute("id","missionblock"+mission.Id);
                elem.setAttribute("style",elementstyle);
                elem.setAttribute("class","missionblock");
                elem.setAttribute("onclick","getDetails"+"("+i+")");
                belem.appendChild(elem);; //2、找到父级元素；3、在末尾中添加元素
                p = 0;
            } 
            }
    
        } else {
            p++;
        }
    }
    addMissionWindow();
    creatSenseArea();
    drawCanvas();
    extendView();
    position();
}

window.onload=function(){
    nowformatdate = getNowFormatDate()[0];
    nowBrokenDate = getNowFormatDate().slice(1);
    avaheight = window.screen.availHeight-document.getElementById("header").offsetHeight-document.getElementById("bottom").offsetHeight;
    getUserState("?back=MControl.html");//参数为登陆后返回地址
}

//删除任务
function deleteMission(num) {
    var newobj=new Object;
    var targetid=obj.obj[num].Id;
    var targettime=obj.obj[num].lasttime;
    var targetparaid=obj.obj[num].paraid;
    var targetparanum=obj.obj[num].paranum;
    newobj.id = targetid;
    newobj.lasttime = targettime;
    newobj.paraid = targetparaid;
    newobj.paranum = targetparanum;
    sendNew(newobj,"MControlDelete.php",missionWindowResults,true);
    refreshToken1 = 0;
}

//用户修改任务前端接口
function editMissionFront(id,num) {
    var result = new Array;
    var targetObj = new Object;
    targetObj.id = id;
    targetObj.num = num;
    targetObj.title = document.getElementById("edittitle").value;
    targetObj.describe = document.getElementById("editdescribe").value;
    targetObj.lasttime = document.getElementById("editlasttime").value;
    targetObj.interval = lasttime-obj.obj[num].lasttime;
    result.push(targetObj);
    editMission(result)
}

//统一处理修改任务请求
function editMission(arr) {
    var newobj = new Object;
    var targetId = new Array;
    var targetStart = new Array;
    var targetEnd = new Array;
    var targetTitle = new Array;
    var targetDescribe = new Array;
    var targetLasttime = new Array;

    var id;
    var num;
    var title;
    var describe;
    var lasttime;
    var interval;

    for (let i = 0; i < arr.length; i++) {
        id = arr[i].id;
        num = arr[i].num;
        title = arr[i].title;
        describe = arr[i].describe;
        lasttime = arr[i].lasttime;
        interval = arr[i].interval;

        console.log(interval);
        
        if (interval!=0) {
            var data = new Object;
            data.paraid = [obj.obj[num].paraid];
            data.paranum = [obj.obj[num].paranum];
            data.interval = [interval];

            var result = getNewDateByLastTime(data);
            for (let i = 0; i < result.id.length; i++) {
                targetId.push(result.id[i]);
                targetStart.push(result.start[i]);
                targetEnd.push(result.end[i]);
                targetTitle.push(null);
                targetLasttime.push(null);
                targetDescribe.push(null);
                newobj.start = targetStart;
                newobj.end = targetEnd;
            }
        }

        targetId.push(id);
        if (title!=obj.obj[num].title) {
            targetTitle.push(title);
            newobj.title = targetTitle;
        } else {
            targetTitle.push(null);
        }
        if (describe!=obj.obj[num].describe) {
            if (describe=="") {
                describe="&#31354";
            }
            targetDescribe.push(describe);
            newobj.describe = targetDescribe;
        } else {
            targetDescribe.push(null);
        }
        if (lasttime!=obj.obj[num].lasttime) {
            targetLasttime.push(lasttime);
            newobj.lasttime = targetLasttime;
        } else {
            targetLasttime.push(null);
        }
        targetStart.push(null);
        targetEnd.push(null);

        newobj.id = targetId;
        sendNew(newobj,"MControlEdit.php",missionWindowResults,true);
    }
}

//结束任务
function stopMission(id,num) {
    var result = new Array;
    var targetObj = new Object;
    var newlasttime = GetNumberOfDays(obj.obj[num].start,nowformatdate);
    targetObj.id = id;
    targetObj.num = num;
    targetObj.end = nowformatdate;
    targetObj.lasttime = newlasttime;
    targetObj.status = 4;
    targetObj.interval = obj.obj[num].lasttime-newlasttime;
    result.push(targetObj);
    editMission(result);
}

//统一POST请求接口
function sendNew(newobj,loc,callbackFunc,sendpara) {//传入的对象,请求目标地址,回调函数,是否将结果传入回调函数参数
    var data = JSON.stringify(newobj);
    var feedback;
    newReq=new XMLHttpRequest();
    newReq.open("POST",loc,true);
    newReq.setRequestHeader("Content-type", "application/json");
    newReq.send(data);
    newReq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        feedback=this.responseText;
        if (sendpara==true) {
            callbackFunc(feedback);
        } else {
            callbackFunc();
        }
    }
}
}

//判断并行表单填写状况并设置任务参数
function addNewMission(){
    var priobj=obj;

    var title=document.getElementById("title").value;//获取任务标题
    var describe=document.getElementById("describe").value;//获取任务描述
    var lasttime=document.getElementById("lasttime").value;//获取任务持续时间
    var mode=document.getElementById("mode").value;//获取任务模式
    var inputtime=document.getElementById("starttime").value;//获取手动设置的日期
    var inputparablock=document.getElementById("parablock").value;//获取手动设置的并行任务块

    var paraid;
    var lastparanum;
    var paranum;

    var newobj=new Object;

    if (title.length==0) {
        alert("您未填写任务名称");
    } else if (lasttime.length==0) {
        alert("您未填写任务持续时间");
    } else if (lasttime>1000) {
        alert("持续时间不得大于1000，请勾选forever");
    } else if (mode.length==0) {
        alert("您未选择任务模式");
    } else {
        if (priobj==null) {
            paraid=1;
            paranum=0;
            mode=0;
            if (inputtime==0) {
                starttime=nowformatdate;
            } else {
                starttime=inputtime;
            }

        } else {
            var temp=sortByTime(priobj.tail);

            if (mode==0 || mode==2) {//此时为并行或单独并行
            paraid=parseInt(priobj.obj[priobj.obj.length-1].paraid)+1;
            paranum=0;
            if (inputtime==0) {
                starttime=nowformatdate;
            } else {
                starttime=inputtime;
            }
        } else if (mode==1) {//此时为串行

            var index=0;
            for (let i = 0; i < temp[0].paraid; i++) {
                index+=priobj.meta[i];
            }
            if (inputparablock==0) {
                paraid = temp[0].paraid;//获取任务行id
                lastparanum = priobj.obj[index-1].paranum;;//获取任务行内前一项编号
                paranum = parseInt(lastparanum)+1;//获取任务行内编号
                if (inputtime==0) {
                    if (temp[0].end<nowformatdate) {
                        starttime=nowformatdate;
                    } else {
                        starttime=temp[0].end;//获取最近串行任务结束时间
                    }
                } else {
                    if (inputtime<temp[0].end) {
                        alert("选择的时间过早，可延后开始时间或选择并行任务模式");
                    } else {
                        starttime=inputtime;
                    }
                }
            } else {
                var selectedBlock = getBlockData(inputparablock);
                if (inputtime==0) {
                    starttime = selectedBlock.end;
                    paraid = inputparablock;
                    lastparanum = selectedBlock.paranum;//获取任务行内前一项编号
                    paranum = parseInt(lastparanum)+1;//获取任务行内编号
                } else {
                    if (inputtime<selectedBlock.end) {
                        alert("选择的时间过早，可延后开始时间或更换任务行");
                    } else {
                        starttime = inputtime;
                        paraid = inputparablock;
                        lastparanum = selectedBlock.paranum;//获取任务行内前一项编号
                        paranum = parseInt(lastparanum)+1;//获取任务行内编号
                    }
                }
            }
        } else {
            alert("参数错误");
        }
        }
        
        var endtime = dateAddDays(starttime,lasttime);//统一计算结束时间

        if (document.getElementById("lasttimecheck").checked==true) {
            paraid=parseInt(priobj.obj[priobj.obj.length-1].paraid)+1;
            paranum=0;
            lasttime = -1;
            endtime = "1970-01-01";
            mode = 2;
        }

        var status;
        if (starttime!=nowformatdate) {
            status = 1;//不在当天开始则未开始1
        } else {
            status = 2;//在当天开始则进行中2
        }
        newobj.title = title;
        newobj.describe = describe;
        newobj.lasttime = lasttime;
        newobj.mode = mode;
        newobj.status = status;
        newobj.paraid = paraid;
        newobj.paranum = paranum;
        newobj.start = starttime;
        newobj.end = endtime;
        sendNew(newobj,"MControlAdd.php",missionWindowResults,true);
    }
}

//获取任务详情
function getDetails(num) {
    floatwindow(0,3)
    if (obj.obj[num].start<nowformatdate && nowformatdate<obj.obj[num].end) {
        var belem = document.createElement('input'); //1、创建元素
        belem.setAttribute("id","finishbutton");
        belem.setAttribute("class","sidecontrolblock");
        belem.setAttribute("onclick","stopMission"+"("+obj.obj[num].Id+","+num+")");
        belem.setAttribute("type","button");
        belem.setAttribute("value","结束任务");
        document.getElementById('floatwindow3').appendChild(belem); //2、找到父级元素；3、在末尾中添加元素
    } else {
        deletement("sidecontrolblock");
    }

    document.getElementById("deletebutton").setAttribute("onclick","deleteMission"+"("+num+")");
    document.getElementById("editbutton").setAttribute("onclick","editMissionWindow"+"("+num+")");

    document.getElementById("showtitle").innerHTML=obj.obj[num].title;
    document.getElementById("showdescribe").innerHTML=obj.obj[num].describe;
    document.getElementById("showlasttime").innerHTML=obj.obj[num].lasttime;
    if (obj.obj[num].lasttime==-1) {
        document.getElementById("showlasttime").innerHTML="forever";
    }
    document.getElementById("showmode").innerHTML=obj.obj[num].mode;
    document.getElementById("showstart").innerHTML=obj.obj[num].start;
    document.getElementById("showend").innerHTML=obj.obj[num].end;

    //if (document.getElementById("missionblock"+num)==null) {
    //    document.getElementById("floatwindow3").style.borderColor=document.getElementById("missionblock"+num+"rest").style.backgroundColor;
    //} else {
    //    document.getElementById("floatwindow3").style.borderColor=document.getElementById("missionblock"+num).style.backgroundColor;
    //}
    if (obj.obj[num].mode==0) {
        document.getElementById("showmode").innerHTML="并行";
    } else if(obj.obj[num].mode==1){
        document.getElementById("showmode").innerHTML="串行";
    }
}

//获取回收站任务
function getRecycleList(){
    var feedback;
    relireq=new XMLHttpRequest();
    relireq.open("GET","/mcontrol/getRecycleList",true);
    relireq.send();
    relireq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        feedback=this.responseText;
        var result = JSON.parse(feedback);
        if (result.status=="error") {
            document.getElementById("recyclelist").innerHTML = result.reason;
        } else {
            recycleobj = result.recycleobj;
            showRecycleList();
        }
    }
}
}

//展示回收箱任务
function showRecycleList() {
    deletement("remissionblock");
    var mission;
    for (let i = 0; i < recycleobj.length; i++) {
        mission=recycleobj[i];
        //创建回收中任务
        var belem = document.getElementById('recyclelist');
        var reelem = document.createElement('div'); //1、创建元素
        reelem.setAttribute("id","remissionblock"+mission.Id);
        reelem.setAttribute("class","remissionblock");
        reelem.innerHTML=mission.title;
        //reelem.setAttribute("onclick","getDetails"+"("+i+")");
        belem.appendChild(reelem); //2、找到父级元素；3、在末尾中添加元素

        //创建回收中任务内分块1
        var inelem1 = document.createElement('input'); //1、创建元素v
        inelem1.setAttribute("id","recoverMission"+mission.Id);
        inelem1.setAttribute("class","inremissionblock");
        inelem1.setAttribute("type","button");
        inelem1.setAttribute("onclick","recoverMission"+"("+i+")");
        inelem1.setAttribute("value","恢复");
        reelem.appendChild(inelem1); //2、找到父级元素；3、在末尾中添加元素

        //创建回收中任务内分块2
        var inelem2 = document.createElement('input'); //1、创建元素
        inelem2.setAttribute("id","deleteMissionforever"+mission.Id);
        inelem2.setAttribute("class","inremissionblock");
        inelem2.setAttribute("type","button");
        inelem2.setAttribute("onclick","deleteMissionforever"+"("+i+")");
        inelem2.setAttribute("value","删除");
        reelem.appendChild(inelem2); //2、找到父级元素；3、在末尾中添加元素
    }
    refreshToken1 = 1;
}

//更新任务状态
function autoUpdateStatus() {
    var newObj = new Object;
    var result = predictStatus(obj.obj);

    if (result.id[0]!=null) {
        newObj.id=result.id;
        newObj.status=result.status;
        sendNew(newObj,"MControlEdit.php",showMission,true)
    } else {
        showMission();
    }
    var cok = getCookie("aus");
    if (cok=="") {
        console.log("SET COOKIE");
        var today = new Date();
        var date1 = new Date();
        date1.setDate(today.getDate()+1);
        var tomorrow = new Date(new Date(date1.toLocaleDateString()).getTime());
        var intervalSecond = tomorrow-today;
        setCookie("aus",1,intervalSecond);
    }
}

//恢复回收中任务
function recoverMission(num) {
    var priobj = recycleobj[num];
    var inputObj = new Array(priobj);

    var newobj = new Object;
    var targetStatus = predictStatus(inputObj).status[0];
    var targetId = priobj.Id;
    var targettime = priobj.lasttime;
    var targetparaid = priobj.paraid;
    var targetparanum = priobj.paranum;
    newobj.id = targetId;
    newobj.status = targetStatus;
    newobj.lasttime = targettime;
    newobj.paraid = targetparaid;
    newobj.paranum = targetparanum;

    sendNew(newobj,"MControlRecoverMission.php",missionWindowResults,true);
    refreshToken1 = 0;
}

//永久删除任务
function deleteMissionforever(num) {
    var data = new Object();
    var arr = new Array();
    if (num=="all") {
        for (let i = 0; i < recycleobj.length; i++) {
            arr.push(recycleobj[i].Id);
        }
    } else {
        arr.push(recycleobj[num].Id);
    }
    data.id = arr;
    sendNew(data,"MControlClearBin.php",missionWindowResults,true);
    refreshToken1 = 0;
}
/*********************/

/******Display******/
//锚定到今日的任务
function position() {
    //document.getElementById(scrollposition).scrollIntoView({inline:"start"});
    document.getElementById('innershowpanel').scrollLeft = document.getElementById(scrollposition).offsetLeft;
}

//新建任务浮窗
function addMissionWindow() {
    deletement("paraBlockOption");
    var belem = document.getElementById("parablock");
    for (let i = 0; i < obj.tail.length; i++) {
        var elem = document.createElement('option'); //1、创建元素
        elem.innerHTML=obj.tail[i].paraid;
        elem.setAttribute("value",obj.tail[i].paraid);
        elem.setAttribute("class","paraBlockOption");
        belem.appendChild(elem);; //2、找到父级元素；3、在末尾中添加元素
    }
}

//修改任务详情浮窗
function editMissionWindow(num) {
    document.getElementById("edittitle").setAttribute("value",obj.obj[num].title);
    document.getElementById("editdescribe").setAttribute("value",obj.obj[num].describe);
    document.getElementById("editlasttime").setAttribute("value",obj.obj[num].lasttime);
    document.getElementById("savebutton").setAttribute("onclick","editMissionFront"+"("+obj.obj[num].Id+","+num+")");
    document.getElementById("backbutton").addEventListener("click", function () {
    hidewindow(5);
    floatwindow(0,3);
    });
    document.getElementById("editmode").innerHTML = obj.obj[num].mode;
    document.getElementById("editstart").innerHTML = obj.obj[num].start;
    document.getElementById("editend").innerHTML = obj.obj[num].end;
    hidewindow(3);
    floatwindow(0,5);
}

//统一任务窗口变化处理接口
function missionWindowResults(feedback) {
    var result = JSON.parse(feedback);
    if (result.status==1) {
        if (result.callbackfunc==1) {
            getMissionObj(true);
            hidewindow(1);
        }
        if (result.callbackfunc==2) {
            getMissionObj(true);
            hidewindow(3);
        }
        if (result.callbackfunc==3) {
            getMissionObj(true);
            hidewindow(5);
            floatwindow(0,3);
        }
        if (result.callbackfunc==4) {
            getRecycleList();
            getMissionObj(true);
        }
        if (result.callbackfunc==5) {
            getRecycleList();
            getMissionObj(true);
        }
    }

    if (result.innerid!=null) {
        document.getElementById(result.innerid).innerHTML = result.data;
    }
}

//删除全部元素
function deletement(classname) {
    var paras = document.getElementsByClassName(classname);
    for(i=paras.length-1;i>=0;i--){
        if (paras[i] != null)
            paras[i].parentNode.removeChild(paras[i]);
    }
}

//创建占位块
function creatPlaceholder(num,fatherelem) {
    var priobj=obj;
    var temp=directSort(priobj.starttime);
    var earliesttime=temp[0];
    var blockstarttime=priobj.obj[num].start;
    var interval=GetNumberOfDays(earliesttime,blockstarttime);
    var elementstyle="width:"+interval*4*uniratio+"px;"+"visibility:hidden;";//设置任务块样式
    //创建占位符
    var pelem = document.createElement('div'); //1、创建元素
    pelem.setAttribute("style",elementstyle);
    pelem.setAttribute("class","missionblock");
    fatherelem.appendChild(pelem); //2、找到父级元素；3、在末尾中添加元素
}

//创建接触滑动区
function creatSenseArea() {
    deletement("sensearea");
    var outercon = document.getElementById('showpanel');
    var leftsensearea = document.createElement('div'); //1、创建元素
    leftsensearea.setAttribute("id","leftsensearea");
    leftsensearea.setAttribute("class","sensearea");
    outercon.appendChild(leftsensearea); //2、找到父级元素；3、在末尾中添加元素
    var rightsensearea = document.createElement('div'); //1、创建元素
    rightsensearea.setAttribute("id","rightsensearea");
    rightsensearea.setAttribute("class","sensearea");
    outercon.appendChild(rightsensearea); //2、找到父级元素；3、在末尾中添加元素

    document.getElementById('leftsensearea').onmouseenter=function(){sideMove(0);};
    document.getElementById('rightsensearea').onmouseenter=function(){sideMove(1);};
    document.getElementById('leftsensearea').onmouseleave=function(){cancelSideMove();};
    document.getElementById('rightsensearea').onmouseleave=function(){cancelSideMove();};
}

//侧边滚动
function sideMove(side) {
    var box = document.getElementById('innershowpanel');
    if (side==0) {
        time = setInterval(function(){
            var oldL = box.scrollLeft;
            var newL = oldL-2;
            box.scrollLeft = newL;
        },5)
    } else {
        time = setInterval(function(){
            var oldL = box.scrollLeft;
            var newL = oldL+2;
            box.scrollLeft = newL;
        },5)
    }
}

//清除侧边滚动
function cancelSideMove() {
    clearInterval(time);
}

//底栏移动
function extendView() {
    var showheight = document.getElementById("showpanel").clientHeight;
    if (showheight>avaheight) {
        document.getElementById("bottom").style.position = "static";
    } else {
        document.getElementById("bottom").style.position = "fixed";
    }
}
/*********************/

/*******Test********/
function missionShake() {
    var parentObj=document.getElementsByClassName("missionblock")
    parentObj.addEventListener("touchstart", function (e) {
        console.log('touchstart');
        timer = setTimeout(function () {
            console.log('LongPress');
            e.preventDefault();
            LongPress(parentObj);
        }, 3000);
    });
    parentObj.addEventListener("touchmove", function (e) {
        console.log('touchmove');
        clearTimeout(timer);
        timer = 0;
    });
    parentObj.addEventListener("touchend", function (e) {
        console.log('touchend');
        clearTimeout(timer);
        //if (timer != 0) {
        //    alert('这是点击，不是长按');
        //}
        return false;
    });
}

function missionTouch() {
    //var obj=document.getElementsByClassName("missionblock")
    var pointer=document.getElementById("missionblock1")
    pointer.onmousedown=function() {console.log("running...")}
    //pointer.onmousedown=setTimeout(timer1=function(){console.log("start to delete")},3000)
    pointer.onmouseup=clearTimeout(timer1)
}

//功能回调函数
function callbackFunction(){
    getMissionObj(true)
}
/*******************/