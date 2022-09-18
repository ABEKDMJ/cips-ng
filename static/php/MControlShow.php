<?php
session_start();
require_once("mysql.php");

if ($_SESSION['user']['admit']==true) {
    $tablename=$_SESSION['user']['tablename'];
    $query="SELECT * FROM `$tablename`";
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
}
?>