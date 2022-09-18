<?php
session_start();

header('Content-Type:text/html;charset=utf-8');
//$data=json_decode(file_get_contents("php://input"),true);
$loc=$_GET["loc"];
/*
if (isset($_SESSION['user'])) {
    if ($_SESSION['user']["admin"]==true) {
        $i=true;
    } else {
        $_SESSION['user']["admin"]==false;
        echo "你还未登录";
    }
    
} else {
    $_SESSION['user']=array('admit'=>false);
    echo "你还未登录";
}
*/
if ($_SESSION['user']['authentication']==true) {
    //$result="refresh:0;".$loc;
    //header($result); 
    $result=file_get_contents($loc);
    echo $result;
}

?>
