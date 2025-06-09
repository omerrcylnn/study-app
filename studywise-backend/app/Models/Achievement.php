<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = ['code', 'name', 'description', 'icon'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_achievements')->withTimestamps()->withPivot('earned_at');
    }
}
