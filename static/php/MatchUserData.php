<?php
session_start();
require_once("mysql.php");

$data = json_decode(file_get_contents("php://input"),true);

$username = $data["username"];
$email = $data["email"];

$query="SELECT * FROM `userdata` WHERE `username`=$username";
$sql = mysqli_query( $conn, $query );
if(! $sql )
{
    die('无法读取数据: ' . mysqli_error($conn));
}
$row = mysqli_fetch_array($sql, MYSQLI_ASSOC);
if ($row==null) {
    echo 0;
} else {
    if ($row["email"]==$email) {
        echo 2;
    } else {
        echo 1;
    }
}
?>