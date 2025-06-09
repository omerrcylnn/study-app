<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;
    public function todayTasks(Request $request){
        $tasks = Task::where('user_id',$request->user()->id)
        ->whereDate('due_date',now()->toDateString())
        ->get();

        return response()->json($tasks);
    }
    public function tomorrowTasks(Request $request){
        $tasks = Task::where('user_id',$request->user()->id)
        ->whereDate('due_date',now()->addDay()->toDateString())
        ->get();

        return response()->json($tasks);
    }

    public function store (Request $request){

        $validated = $request-> validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date'=> 'nullable|date',
            'label' => 'nullable|string|max:50',
        ]);

        $task = Task::create([
            'user_id' => $request->user() ->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'due_date' => $validated['due_date'] ?? now()->toDateString(),
            'label' => $validated['label'] ?? null,
        ]);

        return response() -> json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $this -> authorize('update',$task);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'due_date' => 'sometimes|nullable|date',
            'completed' => 'sometimes|boolean',
            'label' => 'sometimes|nullable|string|max:55',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task){

        $this -> authorize('delete',$task);

        $task -> delete();

        return response()->json(['message'=>'Görev Silindi.']);
    }

    public function pastTasks(Request $request){
        return Task::where('user_id',$request->user()->id)
                    ->whereDate('due_date','<',now()->toDateString())
                    ->get();
    }

    public function upcomingTasks(Request $request){
        return Task::where('user_id', $request->user()->id)
                    ->whereDate('due_date','>',now()->toDateString())
                    ->get();
    }

}
