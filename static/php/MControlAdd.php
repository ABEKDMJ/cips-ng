<?php
session_start();
require_once("mysql.php");
if ($_SESSION['user']['admit']==true) {
    header('Content-Type:application/json; charset=utf-8');#设置HTTP请求头
    $data=json_decode(file_get_contents("php://input"),true);
    //title,describe,lasttime,mode,status,paraid,paranum,starttime,endtime
    $title=$data["title"];
    $describe=$data["describe"];
    $lasttime=$data["lasttime"];
    $mode=$data["mode"];
    $status=$data["status"];
    $paraid=$data["paraid"];
    $paranum=$data["paranum"];
    $starttime=$data["start"];
    $endtime=$data["end"];
    $tablename=$_SESSION['user']['tablename'];

    $query1="SELECT * FROM `$tablename` WHERE title='$title'";
    $sql1 = mysqli_query( $conn, $query1 );
    if(! $sql1 )
    {
        die('无法读取数据: ' . mysqli_error($conn));
    }
    $row1 = mysqli_fetch_array($sql1, MYSQLI_ASSOC);
    #校验是否存在同名任务
    if ($row1) {
        $state=0;
        $reason="存在同名任务";
    } else {
        $query2="INSERT INTO `$tablename` ( `title`,`describe`,`lasttime`,`mode`,`status`,`paraid`,`paranum`,`start`,`end` )
        VALUES
        ( '$title','$describe','$lasttime','$mode','$status','$paraid','$paranum','$starttime','$endtime' )";
        $sql2 = mysqli_query( $conn, $query2 );
        if(! $sql2 )
        {
            $state=0;
            $reason='无法插入数据: ' . mysqli_error($conn);
        } else {
            $state=1;
        }
    }
    $arr=array("status"=>$state,"data"=>$reason,"innerid"=>"addnewmissionstatus","callbackfunc"=>1);
    $result=json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $result;
}
?>