<?php

use App\Http\Controllers\PomodoroSessionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\PomodoroStatsController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\userController;
// Şu an CSRF uyumu için register route'u web.php'de tanımlandı.
// API endpoint'leri ileride burada tanımlanacak.

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/stats/today', [PomodoroStatsController::class, 'today']);
    Route::get('/stats/weekly', [PomodoroStatsController::class, 'weekly']);
    Route::get('/stats/focus-break-ratio', [PomodoroStatsController::class, 'focusBreakRatio']);
    Route::get('/tasks/today',[TaskController::class,'todayTasks']);
    Route::post('/tasks',[TaskController::class,'store']);
    Route::put('/tasks/{task}',[TaskController::class,'update']);
    Route::delete('/tasks/{task}',[TaskController::class,'destroy']);
    Route::get('/tasks/past',[TaskController::class,'pastTasks']);
    Route::get('/tasks/upcoming',[TaskController::class,'upcomingTasks']);
    Route::get('/tasks/today',[TaskController::class,'todayTasks']);
    Route::get('/tasks/tomorrow',[TaskController::class,'tomorrowTasks']);
    Route::post('/pomodoro',[PomodoroSessionController::class,'store']);
    Route::get('/user/achievements',[AchievementController::class,'userAchievements']);
    Route::get('/achievements/summary',[AchievementController::class,'summary']);
    Route::get('/stats/by-label',[PomodoroStatsController::class,'labelStats']);
    Route::get('/goals', [GoalController::class, 'index']);
    Route::post('/goals', [GoalController::class, 'store']);
    Route::put('/goals/{goal}', [GoalController::class, 'update']);
    Route::delete('/goals/{goal}', [GoalController::class, 'destroy']);
    Route::post('/user/daily-login',[UserController::class,'handleDailyLogin']);
});