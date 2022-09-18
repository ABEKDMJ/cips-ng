<?php
session_start();
require_once("mysql.php");
if ($_SESSION['user']['admit']==true) {
    header('Content-Type:application/json; charset=utf-8');#设置HTTP请求头
    $data=json_decode(file_get_contents("php://input"),true);
    $id=$data["id"];
    $lasttime=$data["lasttime"];
    $paraid=$data["paraid"];
    $paranum=$data["paranum"];
    $tablename=$_SESSION['user']['tablename'];

    $query5="UPDATE `$tablename` SET `status`=5 WHERE id=$id";

    $query1="SELECT Id,`start`,`end`,`paranum` FROM `$tablename` WHERE `paraid`='$paraid' AND `paranum`>'$paranum'";
    $sql1 = mysqli_query( $conn, $query1 );
    if ($row = mysqli_fetch_array($sql1, MYSQLI_ASSOC)) {
        $query2="UPDATE `$tablename` SET `start`=CASE id ";
        $query3="UPDATE `$tablename` SET `end`=CASE id ";
        //$query4="UPDATE `$tablename` SET `paranum`=CASE id ";
        $selectedid=$row['Id'];
        $curstart=$row['start'];
        $curend=$row['end'];
        //$curparanum=(int)$row['paranum'];
        $newstart=date('Y-m-d',strtotime($curstart.'-'.$lasttime.'day'));
        $newend=date('Y-m-d',strtotime($curend.'-'.$lasttime.'day'));
        //$newparanum=$curparanum-1;
        $query2.="WHEN $selectedid THEN '$newstart' ";
        $query3.="WHEN $selectedid THEN '$newend' ";
        //$query4.="WHEN $selectedid THEN '$newparanum' ";
        $condition.="$selectedid".",";

        while ($row = mysqli_fetch_array($sql1, MYSQLI_ASSOC)) {
            $selectedid=$row['Id'];
            $curstart=$row['start'];
            $curend=$row['end'];
            //$curparanum=(int)$row['paranum'];
            $newstart=date('Y-m-d',strtotime($curstart.'-'.$lasttime.'day'));
            $newend=date('Y-m-d',strtotime($curend.'-'.$lasttime.'day'));
            //$newparanum=$curparanum-1;
            $query2.="WHEN $selectedid THEN '$newstart' ";
            $query3.="WHEN $selectedid THEN '$newend' ";
            //$query4.="WHEN $selectedid THEN '$newparanum' ";
            $condition.="$selectedid".",";
        }
        $strl=strlen($str);
        $condition = substr($condition,0,$strl-1);
        $query2.="END "."WHERE Id IN "."("."$condition".")";
        $query3.="END "."WHERE Id IN "."("."$condition".")";
        //$query4.="END "."WHERE Id IN "."("."$condition".")";

        $sql2 = mysqli_query( $conn, $query2 );
        $sql3 = mysqli_query( $conn, $query3 );
        //$sql4 = mysqli_query( $conn, $query4 );
        $sql5 = mysqli_query( $conn, $query5 );
        if($sql2 && $sql3 && $sql5) //&& $sql4
        {
            $state=1;
        } else {
            $state=0;
            $reason="更新数据失败". mysqli_error($conn);
        }
    } else {
        $sql5 = mysqli_query( $conn, $query5 );
        if($sql5)
        {
            $state=1;
        } else {
            $state=0;
            $reason="更新数据失败". mysqli_error($conn);
        }
    }
    $callBackBist = array("hidewindow(3)");
    $arr=array("status"=>$state,"data"=>$reason,"innerid"=>"missionstatus","callbackfunc"=>2);
    $result=json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $result;
    /*
    $query="UPDATE `$tablename` SET `status`='3' WHERE Id='$id'";
    $sql = mysqli_query( $conn, $query );
    if(! $sql1 )
    {
        die('无法更新数据: ' . mysqli_error($conn));
    }
        $row = mysqli_fetch_array($sql, MYSQLI_ASSOC);
        if (!$row) {
            $state="error";
            $reason='无法删除数据，原因是:' . mysqli_error($conn);
        } else {
            $state="success";
            $reason=null;
        }
        $arr=array("status"=>$state,"data"=>$reason);
        $result=json_encode($arr,JSON_UNESCAPED_UNICODE);
        echo $result;
    */
}
?>