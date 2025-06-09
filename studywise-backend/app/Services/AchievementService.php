<?php

namespace App\Services;

use App\Models\Achievement;

class AchievementService
{
    public static function checkAndGrant($user)
    {
        $now = now();

        // ✅ İlk Pomodoro
        if (
            $user->pomodoroSessions()
                ->where('type', 'focus')
                ->count() >= 1
        ) {
            static::grant($user, 'first_pomodoro');
        }

        // ✅ Günlük 4 Pomodoro
        $todayCount = $user->pomodoroSessions()
            ->where('type', 'focus')
            ->whereDate('start_time', $now->toDateString())
            ->count();

        if ($todayCount >= 4) {
            static::grant($user, 'daily_four');
        }

        // ✅ 3 gün üst üste odak
        $daysWithPomodoro = $user->pomodoroSessions()
            ->where('type', 'focus')
            ->selectRaw('DATE(start_time) as day')
            ->distinct()
            ->pluck('day')
            ->sort()
            ->values();

        $streak = 1;
        for ($i = 1; $i < $daysWithPomodoro->count(); $i++) {
            $prev = \Carbon\Carbon::parse($daysWithPomodoro[$i - 1]);
            $curr = \Carbon\Carbon::parse($daysWithPomodoro[$i]);

            if ($curr->diffInDays($prev) === 1) {
                $streak++;
                if ($streak >= 3) {
                    static::grant($user, 'streak_three');
                    break;
                }
            } else {
                $streak = 1;
            }
        }

        // ✅ Haftalık 20 Pomodoro
        $weeklyCount = $user->pomodoroSessions()
            ->where('type', 'focus')
            ->whereBetween('start_time', [
                $now->copy()->startOfWeek(),
                $now->copy()->endOfWeek()
            ])
            ->count();

        if ($weeklyCount >= 20) {
            static::grant($user, 'weekly_twenty');
        }
    }

    public static function grant($user, $code)
    {
        $achievement = Achievement::where('code', $code)->first();
        if (!$achievement) return;

        if (!$user->achievements->contains($achievement->id)) {
            $user->achievements()->attach($achievement->id, ['earned_at' => now()]);
        }
    }
}