<?php
//163邮箱授权码：HRNNHPNHZYSRDEMF
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';
header('Content-Type:application/plain; charset=utf-8');#设置HTTP响应头

if (!$_SESSION['user']['admit']) {
    $_SESSION['user']['admit']=false;
}

if (!$_SESSION['user']['admit']==false) {
    echo "您已登录，请退出后重新注册";
    exit;
} else {
    $topic = "请查看您的验证码";
    $data = json_decode(file_get_contents("php://input"));
    $content = rand(100000,999999);
    $_SESSION['user']["vcode"]=$content;
    $_SESSION['user']["username"]=$data["username"];


    $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
    try {
        //服务器配置
        $mail->CharSet ="UTF-8";                     //设定邮件编码
        $mail->SMTPDebug = 0;                        // 调试模式输出
        $mail->isSMTP();                             // 使用SMTP
        $mail->Host = 'smtp.163.com';                // SMTP服务器
        $mail->SMTPAuth = true;                      // 允许 SMTP 认证
        $mail->Username = 'dengjunmin44@163.com';                // SMTP 用户名  即邮箱的用户名
        $mail->Password = 'HRNNHPNHZYSRDEMF';             // SMTP 密码  部分邮箱是授权码(例如163邮箱)
        $mail->SMTPSecure = 'ssl';                    // 允许 TLS 或者ssl协议
        $mail->Port = 465;                            // 服务器端口 25 或者465 具体要看邮箱服务器支持

        $mail->setFrom('dengjunmin44@163.com', 'System');  //发件人
        $mail->addAddress($data["addr"], 'User');  // 收件人
        //$mail->addAddress('ellen@example.com');  // 可添加多个收件人
        //$mail->addReplyTo('dengjunmin44@163.com', 'info'); //回复的时候回复给哪个邮箱 建议和发件人一致
        //$mail->addCC('cc@example.com');                    //抄送
        //$mail->addBCC('bcc@example.com');                    //密送

        //发送附件
        // $mail->addAttachment('../xy.zip');         // 添加附件
        // $mail->addAttachment('../thumb-1.jpg', 'new.jpg');    // 发送附件并且重命名

        //Content
        $mail->isHTML(true);                                  // 是否以HTML文档格式发送  发送后客户端可直接显示对应HTML内容
        $mail->Subject = $topic;
        $mail->Body    = $content;
        $mail->AltBody = '如果邮件客户端不支持HTML则显示此内容';

        $mail->send();
        echo '验证码已发送';
    } catch (Exception $e) {
        echo '验证码发送失败: ', $mail->ErrorInfo;
    }
}
?>