<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Ana sayfa (gerekirse kullanılır)
Route::get('/', function () {
    return view('welcome');
});

// React'tan gelen kayıt istekleri için cookie + csrf destekli route
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class,'login']);
Route::post('/logout',[AuthController::class, 'logout']);