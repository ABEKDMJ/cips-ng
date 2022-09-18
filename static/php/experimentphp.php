<?php
$requestlisten = $_GET["requestsend"];//获取http请求标识

switch ($requestlisten) {
  case 'writefile'://写入文件
  $textinput = $_GET["textinput"];
  $titleinput = $_GET["titleinput"];
  $filename=$titleinput.".txt";
  //$checkfile = file_exists("$filename");//检查文件
  $myfile = fopen("$filename", "w");
  $textsave="###name#".$filename."#name###".$textinput;
  echo $textsave;
  fwrite($myfile, $textsave);
  fclose($myfile);

  $fileindex="fileindex.txt";
  $myfileindex = fopen("$fileindex", "w");
  $userfileindex=file_get_contents("$fileindex");
  if ($userfileindex="") {
    fwrite($myfileindex, $filename);
    fclose($myfileindex);
  } else {
    fwrite($myfileindex, $filename."\n");
    fclose($myfileindex);
  }
    break;


    case 'readfile'://读取文件
      // code...
    break;

    
    case 'showfile'://读取文件列表
    $showfile = $_GET["q"];
    if ($shwofile == "showfile") {
      $response = "i get it";
      $response = $userfileindex;
    }
    break;

  default:
    // code...
    break;
}

?>
