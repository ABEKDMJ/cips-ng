<?php
session_start();
require_once("mysql.php");
header('Content-Type:application/json; charset=utf-8');#设置HTTP响应头
if ($_SESSION['user']['admit']==true) {
    $userid=$_SESSION['user']['userid'];
    $query="SELECT Id,`username` FROM `userdata` WHERE id='$userid'";
    $sql = mysqli_query( $conn, $query );
    $arr=array();
    if(! $sql )
    {
        die('无法读取数据: ' . mysqli_error($conn));
    }
    while ($row = mysqli_fetch_array($sql, MYSQLI_ASSOC)) {
        array_push($arr,$row);
    }
    $result=json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $result;
}
?>