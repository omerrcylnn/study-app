<?php

namespace App\Services;

use App\Models\User;

class LevelService{
    public static function updateLevel(User $user){
        $xp = $user->xp;
        $level = 1;

        while($xp >=self::xpRequired($level + 1)){
            $level++;
        }
        if($level !== $user->level){
            $user->level = $level;
            $user->save();
        }
    }

    public static function xpRequired($level){
        return ($level * ($level + 1) / 2) * 100;
    }
}