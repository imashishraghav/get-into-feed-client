<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/data/leads.json';
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
    
    $leads = json_decode(file_get_contents($dataFile), true) ?: [];
    echo json_encode(['success' => true, 'leads' => $leads]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $phone = isset($input['phone']) ? trim($input['phone']) : '';
    $company = isset($input['company']) ? trim($input['company']) : '';
    $service = isset($input['service']) ? trim($input['service']) : 'General Growth Consultation';
    $message = isset($input['message']) ? trim($input['message']) : '';
    $source = isset($input['source']) ? trim($input['source']) : 'website_form';
    
    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and email are required.']);
        exit();
    }
    
    $leadId = 'LEAD-' . rand(100000, 999999);
    $newLead = [
        'id' => $leadId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'company' => $company,
        'service' => $service,
        'message' => $message,
        'source' => $source,
        'status' => 'new',
        'createdAt' => date('c')
    ];
    
    $leads = json_decode(file_get_contents($dataFile), true) ?: [];
    array_unshift($leads, $newLead);
    file_put_contents($dataFile, json_encode($leads, JSON_PRETTY_PRINT));
    
    // Email notification
    $to = 'growth@getintofeed.com';
    $subject = '⚡ New Lead: ' . $name . ' (' . $service . ') #' . $leadId;
    $body = "New Lead Captured on Get Into Feed:\n\nName: $name\nEmail: $email\nPhone: $phone\nCompany: $company\nService: $service\nSource: $source\nMessage: $message\nReference: #$leadId\nTime: " . date('Y-m-d H:i:s');
    $mailHeaders = 'From: noreply@getintofeed.com' . "\r\n" . 'Reply-To: ' . $email . "\r\n" . 'X-Mailer: PHP/' . phpversion();
    @mail($to, $subject, $body, $mailHeaders);
    
    http_response_code(201);
    echo json_encode(['success' => true, 'leadId' => $leadId, 'message' => 'Lead captured successfully.']);
    exit();
}
