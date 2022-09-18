<?php
session_start();
require("mysql.php");
if (!isset($_SESSION)) {
    $_SESSION['user']['admit']=false;
}

if ($_SESSION['user']['admit']==true) {
    $result="您已登录，请退出后重新注册";
    exit;
} else {
    if ($_SESSION['user']['authentication']!=true) {
        $result="您尚未通过认证";
    } else {
        $data=json_decode(file_get_contents("php://input"),true);
        $username=$_SESSION['user']['username'];
        $password = md5($data['password']);
        $confirmpass = md5($data['confirmpass']);

        if ($password==$confirmpass) {
            $sql1 = mysqli_query( $conn, "UPDATE `userdata`
            SET `password`='$password'
            WHERE `username`='$username'");
            if(! $sql1 )
            {
                die('无法更新数据: ' . mysqli_error($conn));
            }
            $row1 = mysqli_fetch_array($sql1, MYSQLI_ASSOC);
            if (!$row1) {
                $result="密码修改失败";
            } else {
                $result="密码修改成功";
            }
        } elseif ($password!=$confirmpass) {
            $result="您两次输入的密码不一致";
        }
    }
    echo $result;
}
?>