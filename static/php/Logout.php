<?php
session_start();
if ($_SESSION['user']['admit']==true) {
    unset($_SESSION['user']['id']);
    $_SESSION['user']['admit']=false;
    $result=1;
} else {
    $result=0;
}
echo $result;
?>