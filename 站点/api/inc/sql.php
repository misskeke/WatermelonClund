<?php
function diemyerror(){
	die("sqlerror");
}
$mys = new mysqli("localhost", "root", "0000", "websjiecao");
if (mysqli_connect_errno()) {
	diemyerror();
}
