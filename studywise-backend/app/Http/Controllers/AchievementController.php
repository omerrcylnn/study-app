<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Achievement;

class AchievementController extends Controller
{
    public function userAchievements()
{
    $user = Auth::user();
    $userAchievements = $user->achievements()->pluck('achievements.id')->toArray();
    $earnedMap = $user->achievements()->withPivot('earned_at')->get()->keyBy('id');

    $all = Achievement::all()->map(function ($achievement) use ($userAchievements, $earnedMap, $user) {
    $earned = $earnedMap->get($achievement->id);

    // Progress hesaplama
        $progress = 0;
        switch ($achievement->code) {
            case 'first_pomodoro':
                $progress = $user->pomodoroSessions()->count();
                break;

            case 'daily_four':
                $progress = $user->pomodoroSessions()->whereDate('start_time', now())->count();
                break;

            case 'weekly_twenty':
                $progress = $user->pomodoroSessions()
                    ->whereBetween('start_time', [now()->startOfWeek(), now()->endOfWeek()])
                    ->count();
                break;
        }

        return [
            'code' => $achievement->code,
            'name' => $achievement->name,
            'description' => $achievement->description,
            'icon' => $achievement->icon,
            'earned' => in_array($achievement->id, $userAchievements),
            'earned_at' => $earned?->pivot?->earned_at,
            'target' => $achievement->target,
            'progress' => min($progress, $achievement->target), // max aşmasın
        ];
    });

    return response()->json($all);
}

public function summary(){
    $user = Auth::user();
    $earnedMap = $user->achievements()->withPivot('earned_at')->get()->keyBy('id');

    $all = Achievement::all()->map(function ($achievement) use ($earnedMap) {
        return [
            'code' => $achievement->code,
            'name' => $achievement->name,
            'description' => $achievement->description,
            'icon' => $achievement->icon,
            'earned' => $earnedMap->has($achievement->id),
            'earned_at' => optional($earnedMap->get($achievement->id))->pivot->earned_at,
        ];
    });

    $earnedCount = $all->where('earned', true)->count();
    $totalCount = $all->count();
    $progress = $totalCount > 0 ? round(($earnedCount / $totalCount) * 100) : 0;

    return response()->json([
        'total' => $totalCount,
        'earned' => $earnedCount,
        'progress' => $progress,
        'achievements' => $all
    ]);
}
}
