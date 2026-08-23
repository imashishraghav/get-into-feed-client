<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/data/applications.json';
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($_GET['token']) ? $_GET['token'] : '');
    if (strpos($auth, 'growth2026') === false) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized: Invalid admin token']);
        exit();
    }
    
    $apps = json_decode(file_get_contents($dataFile), true) ?: [];
    echo json_encode(['success' => true, 'applications' => $apps]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $phone = isset($input['phone']) ? trim($input['phone']) : '';
    $role = isset($input['role']) ? trim($input['role']) : 'General Application';
    $resumeUrl = isset($input['resumeUrl']) ? trim($input['resumeUrl']) : '';
    
    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and email are required.']);
        exit();
    }
    
    $appId = 'APP-' . rand(100000, 999999);
    $newApp = [
        'id' => $appId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'role' => $role,
        'resumeUrl' => $resumeUrl,
        'createdAt' => date('c')
    ];
    
    $apps = json_decode(file_get_contents($dataFile), true) ?: [];
    array_unshift($apps, $newApp);
    file_put_contents($dataFile, json_encode($apps, JSON_PRETTY_PRINT));
    
    http_response_code(201);
    echo json_encode(['success' => true, 'applicationId' => $appId, 'message' => 'Application submitted successfully.']);
    exit();
}
