<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$laravelDir = file_exists(__DIR__ . '/laravel/vendor/autoload.php')
    ? __DIR__ . '/laravel'
    : (file_exists(__DIR__ . '/../laravel/vendor/autoload.php') ? __DIR__ . '/../laravel' : '/home/u221467171/domains/getintofeed.com/laravel');

if (file_exists($maintenance = $laravelDir . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $laravelDir . '/vendor/autoload.php';

$app = require_once $laravelDir . '/bootstrap/app.php';

// Normalize SCRIPT_NAME so Laravel generates clean URLs without script filename
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

$request = Request::capture();

$app->handleRequest($request);
