<?php
session_start();
header('Content-Type:text/plain;charset=utf-8');

if ($_SESSION['user']['admit']==true) {
    $result=1;
} else {
    $result=0;
}
echo $result;
?>