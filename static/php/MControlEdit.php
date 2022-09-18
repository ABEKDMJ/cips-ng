<?php
session_start();
require_once("mysql.php");
if ($_SESSION['user']['admit']==true) {
    header('Content-Type:application/json; charset=utf-8');#设置HTTP请求头
    $data=json_decode(file_get_contents("php://input"),true);
    $tablename=$_SESSION['user']['tablename'];

    $key=array("title","describe","lasttime","mode","status","paraid","paranum","start","end");
    $strl=strlen($str);

    for ($i=0; $i < count($key); $i++) {
        $smallarr = $data[$key[$i]];
        if ($smallarr!=null) {
            $item = "`".$key[$i]."`"."="."CASE id ";
            $condition = "";
            for ($ia=0; $ia < count($smallarr); $ia++) {
                if ($smallarr[$ia]!=null) {
                    if ($smallarr[$ia]=="&#31354") {
                        $smallarr[$ia]="";
                    }
                $item.="WHEN ".$data["id"][$ia]." THEN '$smallarr[$ia]' ";
                $condition.=$data["id"][$ia].",";
                }
                if ($ia==count($smallarr)-1) {
                    $item.="END ";
                }        
            }
            $item = substr($item,0,strlen($item)-1);
            $condition = substr($condition,0,$strl-1);
            $query = "UPDATE `$tablename` SET ".$item." WHERE Id IN "."("."$condition".")";
            $sql = mysqli_query( $conn, $query );
            if (!$sql) {
                $state=0;
                $reason='无法更新数据: ' . mysqli_error($conn);
                } else {
                $state=1;
            }
        }
    }

    $arr=array("status"=>$state,"data"=>$reason,"innerid"=>"editstatus","callbackfunc"=>3);
    $result=json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $result;
}
?>