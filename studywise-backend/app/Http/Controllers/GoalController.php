<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Goal;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class GoalController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        return auth()->user()->goals()->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
        ]);

        $goal = auth()->user()->goals()->create($validated);
        return response()->json($goal, 201);
    }

    public function update(Request $request, Goal $goal)
    {
        $this->authorize('update', $goal); // optional
        $goal->update($request->only(['text', 'completed']));
        return response()->json($goal);
    }

    public function destroy(Goal $goal)
    {
        $this->authorize('delete', $goal); // optional
        $goal->delete();
        return response()->json(['message' => 'Silindi']);
    }
}
