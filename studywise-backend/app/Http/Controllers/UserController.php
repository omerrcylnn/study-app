<?php

namespace App\Http\Controllers;

use App\Services\LevelService;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Http\Request;
use App\Models\DailyLogin;
use Illuminate\Support\Facades\DB;

class userController extends Controller
    {
        public function handleDailyLogin(Request $request){
            $user = $request->user();
            $today = now()->toDateString();

            $alreadyLogged = DailyLogin::where('user_id',$user->id)
                ->whereDate('login_date',$today)
                ->exists();

            if($alreadyLogged){
                return response() -> json(['status' => 'already_claimed',
                                                'message' => 'Günlük Bonus Alındı.']);
            }

            DB::transaction(function()use($user, $today){
                DailyLogin::create([
                    'user_id' => $user->id,
                    'login_date' => $today
                ]);

                $user->xp += 15;
                $user->coins +=10;
                $user->save();
                LevelService::updateLevel($user);
            });

            return response() -> json([
                'status' => 'claimed',
                'message' => 'günlük giriş bonusu verildi bonus',
                'user'=>$user
            ]);
        }
    }
   
