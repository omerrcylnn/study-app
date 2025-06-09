<?php

return [
    'paths' => ['register', 'login', 'logout','sanctum/csrf-cookie','api/*'],
    'allowed_origins' => ['http://localhost:5173','https://study-app-tawny.vercel.app/'],
    'allowed_headers' => ['*'],
    'allowed_methods' => ['*'],
    'supports_credentials' => true,
];