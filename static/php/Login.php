<?php
session_start();
require("mysql.php");
if ($_SESSION['user']['admit']==true) {
    echo "您已登录，请退出";
    exit;
} else {
    $data=json_decode(file_get_contents("php://input"),true);
    $username = $data['username'];
    $password = md5($data['password']);
    #查询对应用户名和密码
    $sql1 = mysqli_query( $conn, "SELECT * FROM `userdata` WHERE `username`='$username' AND `password`='$password'" );
    if(! $sql1 )
    {
        die('无法读取数据: ' . mysqli_error($conn));
    }
    $row1 = mysqli_fetch_array($sql1, MYSQLI_ASSOC);
    #校验用户名和密码
    if (!$row1) {
        echo "用户名或密码错误";
    } else {
        $userid=$row1['Id'];
        $tablename=$row1['tablename'];
        $_SESSION['user']=array('userid'=>$userid,'admit'=>true,'tablename'=>$tablename);
        if ($_SESSION['user']['admit']==true && $_SESSION['user']['userid']==$userid) {
            echo 1;
        } else {
            echo 0;
        }
    }
}
?>