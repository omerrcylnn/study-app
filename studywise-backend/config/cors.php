<?php

return [
    'paths' => ['register', 'login', 'logout','sanctum/csrf-cookie','api/*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_headers' => ['*'],
    'allowed_methods' => ['*'],
    'supports_credentials' => true,
];