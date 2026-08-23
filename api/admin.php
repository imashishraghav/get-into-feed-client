<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$password = isset($input['password']) ? trim($input['password']) : '';

if ($password === 'growth2026') {
    echo json_encode([
        'success' => true,
        'token' => 'growth2026',
        'user' => [
            'username' => 'admin',
            'role' => 'Administrator',
            'agency' => 'Get Into Feed',
            'office' => 'Noida Corporate HQ'
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid admin passcode.']);
}
