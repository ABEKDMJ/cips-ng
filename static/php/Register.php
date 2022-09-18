<?php
session_start();
require("mysql.php");
if (!isset($_SESSION)) {
    $_SESSION['user']['admit']=false;
}

if ($_SESSION['user']['admit']==true) {
    echo "您已登录，请退出后重新注册";
    exit;
} else {
    $data=json_decode(file_get_contents("php://input"),true);
    $username = $data['username'];
    $password = md5($data['password']);
    $confirmpass = md5($data['confirmpass']);
    $tablename = md5($username);

    if ($password==$confirmpass) {
        $sql1 = mysqli_query( $conn, "SELECT username FROM userdata WHERE username='$username'" );
        if(! $sql1 )
        {
            die('无法读取数据: ' . mysqli_error($conn));
        }
        $sql1 = mysqli_fetch_array($sql1, MYSQLI_ASSOC);

        if (!$sql1) {
            $sql2 = mysqli_query( $conn, "INSERT INTO userdata (username, password,tablename,email) VALUES ('$username', '$password','$tablename','')");
            if(! $sql2 )
            {
                die('无法插入数据: ' . mysqli_error($conn));
            }
            $query4='CREATE TABLE `'.$tablename.'` (
                Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `title` VARCHAR(255),
                `describe` TEXT,
                `lasttime` INT(5),
                `mode` INT(1),
                `status` INT(1),
                `paraid` INT(11),
                `paranum` INT(11),
                `start` DATE,
                `end` DATE
            )';
            $sql3 = mysqli_query( $conn, "SELECT * FROM userdata WHERE username='$username'");
            if ($sql3) {
                $sql4 = mysqli_query($conn,$query4);
                if(! $sql4 )
                {
                    die('无法创建数据表: ' . mysqli_error($conn));
                } else {
                    echo "注册成功";
                }
            } else {
                echo "注册失败";
            }
        } else {
            echo "用户名已被占用";
        }

    } elseif ($password!=$confirmpass) {
        echo "您两次输入的密码不一致";
    }
}
?>