<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DailyLogin extends Model
{
    use HasFactory;
    protected $table = 'daily_logins';
    protected $fillable = [
        'user_id',
        'login_date',
    ];

    public $timestamp = false;

}
