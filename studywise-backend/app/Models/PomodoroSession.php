<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PomodoroSession extends Model
{
    protected $fillable = [
        'user_id','type','start_time','end_time','duration'
    ];
    
}
