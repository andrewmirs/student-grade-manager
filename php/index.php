<?php

$output = [
    "success" => false
];

require('config/mysql_connect.php');

$action = $_GET['action'];

switch($action) {
    case 'create':
        require('create.php');
        break;
    case 'read':
        require('read.php');
        break;
    case 'update':
        require('update.php');
        break;
    case 'delete':
        require('delete.php');
        break;
}

$output = json_encode($output);

print $output;

?>