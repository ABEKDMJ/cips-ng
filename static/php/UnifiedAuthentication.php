<?php
session_start();
require("mysql.php");
if (!isset($_SESSION)) {
    $_SESSION['user']['admit']=false;
}

if ($_SESSION['user']['admit']==true) {
    echo "您已登录，请退出";
    exit;
} else {
    $data=json_decode(file_get_contents("php://input"),true);
    $inputvcode = $data['vcode'];
    $vcode = $_SESSION['user']['vcode'];
    if ($vcode==$inputvcode) {
        $_SESSION['user']['authentication']=true;
        echo 1;
    } else {
        echo 0;
    }
}
?>