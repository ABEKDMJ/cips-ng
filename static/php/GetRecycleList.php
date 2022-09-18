<?php
session_start();
require_once("mysql.php");

$tablename=$_SESSION['user']['tablename'];

$query="SELECT * FROM `$tablename` WHERE `status`=5";
$sql = mysqli_query( $conn, $query );
$arr1=array();
    if(! $sql )
    {
        $state=0;
        $reason='无法读取数据: ' . mysqli_error($conn);
    }
    while ($row = mysqli_fetch_array($sql, MYSQLI_ASSOC)) {
        $state=1;
        array_push($arr1,$row);
    }
    $arr2=array("status"=>$state,"data"=>$reason,"recycleobj"=>$arr1);
    $result=json_encode($arr2,JSON_UNESCAPED_UNICODE);
    echo $result;
?>