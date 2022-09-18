<?php
session_start();
header('Content-Type:text/html;charset=utf-8');
$router=$_GET['p'];

if ($_SESSION['user']['admit']==true) {
    $result=file_get_contents($loc);
    echo $result;
} else {
    echo "您尚未登录";
}
?>