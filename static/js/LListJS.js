window.onload = function(){
  getfile()
}

//监听
var newbutton=document.getElementById("newbutton");
newbutton.onclick=floatwindowon();

var cancelbutton=document.getElementById("cancelbutton");
cancelbutton.onclick=floatwindowoff();

var getfile=document.getElementById("getfile");
getfile.onclick=getfile();

var savebutton=document.getElementById("savebutton");
savebutton.onclick=save();


//显示效果
function floatwindowon() {
  document.getElementById("floatwindow").style.visibility = "visible";
}

function floatwindowoff() {
  document.getElementById("floatwindow").style.visibility = "hidden";
}

function savefile() {
  var textinput = document.getElementById('textinput').value;
  document.getElementById("textshow").innerHTML = textinput;
}

function save(){
  var xmlHttp="writefile";
  xmlHttp=new XMLHttpRequest();
  xmlHttp.open("GET","http://localhost/experimentphp.php",true);
  xmlHttp.send(null);
}

//发送请求
function getfile(){
var requestsend="getfile";
var url="http://localhost/experimentphp.php";
url=url+"?q=showfile";
url=url+"&sid="+Math.random();
var xmlHttp=new XMLHttpRequest();
xmlHttp.onreadystatechange=stateChanged;
xmlHttp.open("GET",url,true);
xmlHttp.send(null);
}

function stateChanged(){
if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 {
 document.getElementById("showfile").innerHTML=xmlHttp.responseText;
 }
}