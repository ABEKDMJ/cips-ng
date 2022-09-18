<?php
require_once("mysql.php");
header('Content-Type:application/json; charset=utf-8');#设置HTTP请求头
$data=json_decode(file_get_contents("php://input"),true);
$missionid=$data["missionid"];


$query="SELECT * FROM `probar` WHERE id='$missionid'";
$sql = mysqli_query( $conn, $query );
$arr1=array();
    if(! $sql )
    {
        die('无法读取数据: ' . mysqli_error($conn));
    }
    while ($row = mysqli_fetch_array($sql, MYSQLI_ASSOC)) {
        array_push($arr1,$row);
    }
    $result=json_encode($arr1,JSON_UNESCAPED_UNICODE);
    echo $result;
?>