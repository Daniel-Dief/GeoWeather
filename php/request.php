<?php

require_once("./connection.php");
$citie = filter_input(INPUT_POST, "citie", FILTER_SANITIZE_SPECIAL_CHARS);

$sql = "SELECT * FROM cities WHERE name='$citie'";
$dbReturn = $connection->query($sql);


foreach ($dbReturn as $r){
    echo '[{"country":"' . $r['country'] . '"}]';
    break;
}