<?php
session_start();
require_once("mysql.php");
if ($_SESSION['user']['admit']==true) {
    header('Content-Type:application/json; charset=utf-8');#设置HTTP请求头
    $data=json_decode(file_get_contents("php://input"),true);
    //$title=$data["title"];
    //$describe=$data["describe"];
    //$lasttime=$data["lasttime"];
    //$mode=$data["mode"];
    //$status=$data["status"];
    //$paraid=$data["paraid"];
    //$paranum=$data["paranum"];
    //$starttime=$data["start"];
    //$endtime=$data["end"];
    $tablename=$_SESSION['user']['tablename'];

    $key=array("title","describe","lasttime","mode","status","paraid","paranum","start","end");
    $strl=strlen($str);

    for ($i=0; $i < count($key); $i++) {
        $smallarr = $data[$key[$i]];
        if ($smallarr!=null) {
            /*
            if ($i==2) {//自动根据持续时间更新开始和结束时间
                $query1 = "SELECT `paraid`,`paranum`,`lasttime` FROM `$tablename` WHERE `Id`=".$data["id"][$ia];
                $sql1 = mysqli_query( $conn, $query1 );
                $row1 = mysqli_fetch_array($sql1, MYSQLI_ASSOC);
                $query2 = "SELECT `Id`,`start`,`end` FROM `$tablename` WHERE `paraid`=".$row1["paraid"]." AND `paranum`>".$row1["paranum"];
                $sql2 = mysqli_query( $conn, $query2 );
                if ($smallarr[$ia]>=$row1["paranum"]) {
                    $intervalLasttime = $smallarr[$ia]-$row1["paranum"];
                    $strto = '+'.$intervalLasttime.'day';
                } else {
                    $intervalLasttime = $row1["paranum"]-$smallarr[$ia];
                    $strto = '-'.$intervalLasttime.'day';
                }
                if ($sql2) {
                    while ($row2 = mysqli_fetch_array($sql2, MYSQLI_ASSOC)) {
                        $targetId.=$row2['Id'];
                        $curstart = $row2['start'];
                        $curend = $row2['end'];
                        $newstart = date('Y-m-d',strtotime($curstart.$strto));
                        $newend = date('Y-m-d',strtotime($curend.$strto));
                        $startitem.="WHEN ".$targetid." THEN '$newstart' ";
                        $enditem.="WHEN ".$targetid." THEN '$newend' ";
                    }
                    $datequery = "UPDATE `$tablename` SET `start`=CASE id ".$startitem."END,`end`=CASE id ".$enditem." END WHERE Id IN "."("."$targetId".")";
                    $sql4 = mysqli_query( $conn, $datequery );
                }
            }
            */
            $item.="`".$key[$i]."`"."="."CASE id ";
            for ($ia=0; $ia < count($smallarr); $ia++) {
                if ($smallarr[$ia]!=null) {
                    if ($smallarr[$ia]=="&#31354") {
                        $smallarr[$ia]="";
                    }
                $item.="WHEN ".$data["id"][$ia]." THEN '$smallarr[$ia]' ";
                }
                if ($ia==count($smallarr)-1) {
                    $item.="END,";
                }        
            }
        }
    }
    $item = substr($item,0,strlen($item)-1);

    for ($i=0; $i < count($data["id"]); $i++) { 
        $condition.=$data["id"][$i].",";
    }
    $condition = substr($condition,0,$strl-1);
    $query3 = "UPDATE `$tablename` SET ".$item." WHERE Id IN "."("."$condition".")";

    /*
        if($data[$key[$i]]!=null){
            $item.="`".$key[$i]."`"."='".$data[$key[$i]]."',";
        } elseif($data[$key[$i]]!=null && $i==count($data)-1){
            $item.="`".$key[$i]."`"."="."'".$data[$key[$i]]."'";
        } elseif($data[$key[$i]]==null && $i==count($data)-1){
            $item=substr($item,0,-1);
        }
    }
    */

    //$query = 'UPDATE `$tablename` SET '.$item.'WHERE Id='.$id;
    $sql3 = mysqli_query( $conn, $query3 );
    if(! $sql3  )
    {
        $state=0;
        $reason='无法更新数据: ' . mysqli_error($conn);
    } else {
        $state=1;
    }
    $arr=array("status"=>$state,"data"=>$reason,"innerid"=>"editstatus");
    $result=json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $result;
}
?>