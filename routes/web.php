<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BooksController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 追記
    Route::get('/books', [BooksController::class, 'index'])->name('books.index');
    Route::post('/books/store', [BooksController::class, 'store'])->name('books.store');
    Route::put('/books/update/{id}', [BooksController::class, 'update'])->name('books.update');
    Route::delete('/books/destroy/{id}', [BooksController::class, 'destroy'])->name('books.destroy');

});

require __DIR__.'/auth.php';
