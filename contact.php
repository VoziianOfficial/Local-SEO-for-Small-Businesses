<?php
declare(strict_types=1);

function respondJson(int $status, bool $success, string $message, array $errors = []): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, max-age=0');

    $payload = [
        'success' => $success,
        'message' => $message,
    ];

    if ($errors !== []) {
        $payload['errors'] = $errors;
    }

    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function cleanText($value): string
{
    if (!is_string($value)) {
        return '';
    }

    return trim(str_replace("\0", '', $value));
}

function exceedsLength(string $value, int $maximum): bool
{
    return strlen($value) > $maximum;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respondJson(405, false, 'Only POST requests are accepted.');
}

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
$isFormData = strpos($contentType, 'multipart/form-data') === 0;
$isUrlEncoded = strpos($contentType, 'application/x-www-form-urlencoded') === 0;

if (!$isFormData && !$isUrlEncoded) {
    respondJson(415, false, 'The request content type is not supported.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength <= 0 || $contentLength > 65536) {
    respondJson(413, false, 'The request is empty or exceeds the allowed size.');
}

$configPath = __DIR__ . '/config/config.js';
$configSource = file_get_contents($configPath);

if ($configSource === false) {
    respondJson(500, false, 'Server configuration could not be read.');
}

$prefix = 'window.SITE_CONFIG =';
$trimmed = trim($configSource);

if (strncmp($trimmed, $prefix, strlen($prefix)) !== 0) {
    respondJson(500, false, 'Server configuration has an invalid format.');
}

$json = trim(substr($trimmed, strlen($prefix)));
$json = rtrim($json, ";\r\n\t ");
$config = json_decode($json, true);

if (!is_array($config) || json_last_error() !== JSON_ERROR_NONE) {
    respondJson(500, false, 'Server configuration contains invalid JSON.');
}

$recipientEmail = $config['contact']['recipientEmail'] ?? null;
$successMessage = $config['forms']['successMessage'] ?? null;
$allowedInquiryTypes = $config['forms']['inquiryTypes'] ?? null;
$allowedServices = $config['forms']['serviceOptions'] ?? null;

if (
    !is_string($recipientEmail) ||
    !filter_var($recipientEmail, FILTER_VALIDATE_EMAIL) ||
    preg_match('/[\r\n]/', $recipientEmail) ||
    !is_string($successMessage) ||
    $successMessage === '' ||
    !is_array($allowedInquiryTypes) ||
    $allowedInquiryTypes === [] ||
    !is_array($allowedServices) ||
    $allowedServices === []
) {
    respondJson(500, false, 'Server configuration is incomplete.');
}

foreach ($allowedInquiryTypes as $allowedInquiryType) {
    if (!is_string($allowedInquiryType) || $allowedInquiryType === '') {
        respondJson(500, false, 'Server configuration contains an invalid inquiry type.');
    }
}

foreach ($allowedServices as $allowedService) {
    if (!is_string($allowedService) || $allowedService === '') {
        respondJson(500, false, 'Server configuration contains an invalid service option.');
    }
}

$secureCookie = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_name('NEARLOOMSESSID');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secureCookie,
    'httponly' => true,
    'samesite' => 'Lax',
]);

if (!session_start()) {
    respondJson(500, false, 'The secure form session could not be started.');
}

$lastSubmission = isset($_SESSION['nearloom_last_submission']) ? (int) $_SESSION['nearloom_last_submission'] : 0;
if ($lastSubmission > 0 && (time() - $lastSubmission) < 30) {
    respondJson(429, false, 'Please wait briefly before sending another request.');
}

$honeypot = cleanText($_POST['company'] ?? '');
if ($honeypot !== '') {
    respondJson(400, false, 'The request could not be processed.');
}

$fields = [
    'fullName' => cleanText($_POST['fullName'] ?? ''),
    'email' => cleanText($_POST['email'] ?? ''),
    'businessName' => cleanText($_POST['businessName'] ?? ''),
    'website' => cleanText($_POST['website'] ?? ''),
    'serviceArea' => cleanText($_POST['serviceArea'] ?? ''),
    'inquiryType' => cleanText($_POST['inquiryType'] ?? ''),
    'service' => cleanText($_POST['service'] ?? ''),
    'message' => cleanText($_POST['message'] ?? ''),
    'privacyConsent' => cleanText($_POST['privacyConsent'] ?? ''),
    'sourcePage' => cleanText($_POST['sourcePage'] ?? ''),
];

$errors = [];

if ($fields['fullName'] === '' || exceedsLength($fields['fullName'], 120)) {
    $errors['fullName'] = 'Enter a full name of no more than 120 characters.';
}

if (
    $fields['email'] === '' ||
    exceedsLength($fields['email'], 254) ||
    preg_match('/[\r\n]/', $fields['email']) ||
    !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)
) {
    $errors['email'] = 'Enter a valid email address.';
}

if ($fields['businessName'] === '' || exceedsLength($fields['businessName'], 160)) {
    $errors['businessName'] = 'Enter a business name of no more than 160 characters.';
}

if ($fields['website'] !== '') {
    $websiteValid = filter_var($fields['website'], FILTER_VALIDATE_URL);
    $websiteScheme = strtolower((string) parse_url($fields['website'], PHP_URL_SCHEME));
    if (!$websiteValid || !in_array($websiteScheme, ['http', 'https'], true) || exceedsLength($fields['website'], 300)) {
        $errors['website'] = 'Enter a valid website address beginning with http:// or https://.';
    }
}

if ($fields['serviceArea'] === '' || exceedsLength($fields['serviceArea'], 180)) {
    $errors['serviceArea'] = 'Enter a city or service area of no more than 180 characters.';
}

if (!in_array($fields['inquiryType'], $allowedInquiryTypes, true)) {
    $errors['inquiryType'] = 'Select a valid inquiry type.';
}

if (!in_array($fields['service'], $allowedServices, true)) {
    $errors['service'] = 'Select a valid service.';
}

if (strlen($fields['message']) < 20 || exceedsLength($fields['message'], 4000)) {
    $errors['message'] = 'Enter a message between 20 and 4000 characters.';
}

if ($fields['privacyConsent'] !== 'accepted') {
    $errors['privacyConsent'] = 'Privacy consent is required.';
}

if (exceedsLength($fields['sourcePage'], 180)) {
    $errors['sourcePage'] = 'The source page value is invalid.';
}

if ($errors !== []) {
    respondJson(422, false, 'Please correct the highlighted fields and try again.', $errors);
}

$subject = 'Nearloom website inquiry: ' . $fields['inquiryType'];
$emailBody = implode("\n", [
    'New Nearloom website inquiry',
    '',
    'Full Name: ' . $fields['fullName'],
    'Email Address: ' . $fields['email'],
    'Business Name: ' . $fields['businessName'],
    'Website: ' . ($fields['website'] !== '' ? $fields['website'] : 'Not provided'),
    'City or Service Area: ' . $fields['serviceArea'],
    'Inquiry Type: ' . $fields['inquiryType'],
    'Service: ' . $fields['service'],
    'Source Page: ' . ($fields['sourcePage'] !== '' ? $fields['sourcePage'] : 'Not provided'),
    'Privacy Consent: Accepted',
    '',
    'Message:',
    $fields['message'],
]);

$headers = [
    'From: Nearloom Website <' . $recipientEmail . '>',
    'Reply-To: ' . $fields['email'],
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Content-Type-Options: nosniff',
];

$mailSent = @mail($recipientEmail, $subject, $emailBody, implode("\r\n", $headers));

if (!$mailSent) {
    respondJson(500, false, 'The server could not send your request. Your information has not been confirmed as delivered.');
}

$_SESSION['nearloom_last_submission'] = time();
respondJson(200, true, $successMessage);
