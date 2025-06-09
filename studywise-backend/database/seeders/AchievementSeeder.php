<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'code' => 'first_pomodoro',
                'name' => 'İlk Adım 🎉',
                'description' => 'İlk Pomodoro’nu tamamladın!',
                'icon' => '🎉',
                'target' => 1,
            ],
            [
                'code' => 'daily_four',
                'name' => 'Odak Günü 💪',
                'description' => 'Bir gün içinde 4 Pomodoro bitirdin.',
                'icon' => '💪',
                'target' => 4,
            ],
            [
                'code' => 'streak_three',
                'name' => 'Seri Başladı 🔥',
                'description' => '3 gün üst üste Pomodoro yaptın.',
                'icon' => '🔥',
                'target' => 3,
            ],
            [
                'code' => 'weekly_twenty',
                'name' => 'Haftalık Kahraman 🏆',
                'description' => 'Bir haftada 20 Pomodoro tamamladın.',
                'icon' => '🏆',
                'target' => 20,
            ],
        ];

        foreach ($achievements as $data) {
            Achievement::updateOrCreate(
                ['code' => $data['code']], // arama kriteri
                $data + ['updated_at' => now()] // değerleri güncelle
            );
        }
    }
}