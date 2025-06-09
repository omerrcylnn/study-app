<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PomodoroSession;
use Carbon\Carbon;
use App\Models\Task;

class PomodoroStatsController extends Controller
{
    public function today()
    {
        $user = Auth::user();
        $today = Carbon::today();

        $sessions = PomodoroSession::where('user_id', $user->id)
            ->where('type', 'focus')
            ->whereDate('created_at', $today)
            ->get();

        return response()->json([
            'count' => $sessions->count(),
            'totalMinutes' => round($sessions->sum('duration') / 60),
        ]);
    }

    public function weekly()
    {
        $user = Auth::user();
        $start = Carbon::now()->subDays(6)->startOfDay(); // 7 gün

        $sessions = PomodoroSession::where('user_id', $user->id)
            ->where('type', 'focus')
            ->where('created_at', '>=', $start)
            ->get()
            ->groupBy(function ($session) {
                return Carbon::parse($session->created_at)->format('D');
            });

        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $data = [];

        foreach ($days as $day) {
            $data[] = [
                'day' => $day,
                'count' => isset($sessions[$day]) ? count($sessions[$day]) : 0,
            ];
        }

        return response()->json($data);
    }

    public function focusBreakRatio()
    {
        $user = Auth::user();

        $sessions = PomodoroSession::where('user_id', $user->id)
            ->get()
            ->groupBy('type');

        return response()->json([
            [
                'type' => 'Focus',
                'label' => 'Odaklanma',
                'seconds' => optional($sessions['focus'] ?? collect())->sum('duration'),
            ],
            [
                'type' => 'Break',
                'label' => 'Mola',
                'seconds' => optional($sessions['break'] ?? collect())->sum('duration'),
            ],
        ]);
    }
    public function labelStats(Request $request)
{
    $userId = $request->user()->id;

    $labels = Task::where('user_id', $userId)
        ->selectRaw('label, COUNT(*) as total_tasks, SUM(completed) as completed_tasks')
        ->groupBy('label')
        ->get()
        ->map(function ($row) {
            return [
                'label' => $row->label ?? 'Etiketsiz',
                'total_tasks' => $row->total_tasks,
                'completed_tasks' => $row->completed_tasks,
                'completion_rate' => round(($row->completed_tasks / max($row->total_tasks, 1)) * 100, 1),
            ];
        });

    return response()->json($labels);
}
}