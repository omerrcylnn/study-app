<?php

namespace App\Http\Controllers;

use App\Services\LevelService;
use Illuminate\Http\Request;
use App\Models\PomodoroSession;
use App\Services\AchievementService;

class PomodoroSessionController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'type' => 'required|in:focus,break',
        'start_time' => 'required|date',
        'end_time' => 'required|date|after_or_equal:start_time',
        'duration' => 'required|integer|min:1'
    ]);

    $user = $request->user();

    $session = PomodoroSession::create([
        'user_id' => $request->user()->id,
        'type' => $request->type,
        'start_time' => $request->start_time,
        'end_time' => $request->end_time,
        'duration' => $request->duration,
    ]);

    if($request->type === 'focus'){
        $xpEarned = 20;
        $coinEarned = 10;

        $user->xp += $xpEarned;
        $user->coins += $coinEarned;
        $user->save();
        LevelService::updateLevel($user);
    }

    AchievementService::checkAndGrant($request->user());

    return response()->json($session);
}
}
