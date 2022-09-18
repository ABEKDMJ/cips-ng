<?php
session_start();
require_once("mysql.php");
if ($_SESSION['user']['admit']==true) {
    header('Content-Type:application/json; charset=utf-8');#设置HTTP请求头
    $data = json_decode(file_get_contents("php://input"),true);
    $id = $data["id"];
    $tablename = $_SESSION['user']['tablename'];

    for ($i=0; $i < count($id); $i++) { 
        $query0="SELECT `paraid`,`paranum` FROM `$tablename` WHERE `Id`=".$id[$i];
        $sql0 = mysqli_query( $conn, $query0 );
        $row0 = mysqli_fetch_array($sql0, MYSQLI_ASSOC);
        $paraid = $row0['paraid'];
        $paranum = $row0['paranum'];

        $query1="SELECT Id,`paranum` FROM `$tablename` WHERE `paraid`='$paraid' AND `paranum`>'$paranum'";
        $sql1 = mysqli_query( $conn, $query1 );
        if ($row = mysqli_fetch_array($sql1, MYSQLI_ASSOC)) {
            $query4="UPDATE `$tablename` SET `paranum`=CASE id ";
            $selectedid=$row['Id'];
            $curparanum=(int)$row['paranum'];
            $newparanum=$curparanum-1;
            $query4.="WHEN $selectedid THEN '$newparanum' ";
            $condition1.="$selectedid".",";

            while ($row = mysqli_fetch_array($sql1, MYSQLI_ASSOC)) {
                $selectedid=$row['Id'];
                $curparanum=(int)$row['paranum'];
                $newparanum=$curparanum-1;
                $query4.="WHEN $selectedid THEN '$newparanum' ";
                $condition1.="$selectedid".",";
            }
            $strl=strlen($str);
            $condition1 = substr($condition1,0,$strl-1);
            $query4.="END "."WHERE Id IN "."("."$condition1".")";
            $sql4 = mysqli_query( $conn, $query4 );
            if ($sql4) {
                $token = 1;
            }
        } else {
            $token = 1;
        }
        $query2 = "DELETE FROM `$tablename` WHERE `Id`=".$id[$i];

        /*
        for ($i=0; $i < count($id); $i++) { 
            $condition2.=$id[$i].",";
        }
        $condition2 = substr($condition2,0,strlen($condition2)-1);
        $query2 = "DELETE FROM `$tablename` WHERE Id in ($condition2)";
        */
        $sql2 = mysqli_query( $conn, $query2 );
        //var_dump($query2);
        //var_dump($query4);
        if($sql2 && $token == 1)
        {
            $state=1;
            $reason=null;
        } else {
            $state=0;
            $reason.="Id为".$id[$i]."的删除数据失败". mysqli_error($conn);
        }
    }
    $arr = array("status"=>$state,"data"=>$reason,"callbackfunc"=>5);
    $result = json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $result;
}
?>