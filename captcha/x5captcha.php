<?php
include("../res/x5engine.php");
$nameList = array("8p8","g7g","vzw","gfg","ljs","fe4","ktz","hss","lsc","xye");
$charList = array("7","Z","3","H","P","2","U","F","U","W");
$cpt = new X5Captcha($nameList, $charList);
//Check Captcha
if ($_GET["action"] == "check")
	echo $cpt->check($_GET["code"], $_GET["ans"]);
//Show Captcha chars
else if ($_GET["action"] == "show")
	echo $cpt->show($_GET['code']);
// End of file x5captcha.php
