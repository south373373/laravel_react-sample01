<?php

namespace App\Http\Controllers;

use App\Models\Books;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::find(auth()->id());
        $books = Books::all();
        return Inertia::render('Books/Index',['books'=>$books,'user_id'=>$user->id,'user_name'=>$user->name,'message' => session('message')]);
    }



    // 今回は不要との事。
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request-> validate([
            'title' => 'required|max:20',
            'content' => 'required|max:100',
            'category' => 'required|max:10',
        ]);
        $book = new Books($request->input());
        $book->save();
        return redirect('books')->with([
            'message' => '登録しました',
        ]);
    }


    // 今回は不要との事。
    // public function show(Books $books)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Books $books)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $book = Books::find($id);
        $book->fill($request->input())->saveOrFail();
        return redirect('books')->with([
            'message' => '更新しました',
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $book = Books::find($id);
        $book->delete();
        return redirect('books')->with([
            'message' => '削除しました',
        ]);
    }
}
