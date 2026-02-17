<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function registroUsuario(Request $request)
    {
        // Validamos que los datos sean correctos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|unique',
            'password' => 'required'
        ]);

        // Si falla mostramos error
        if ($validator->fails()) {
            return response(
                [
                    'message' => 'error',
                    'errors' => $validator->errors()
                ],
                400
            );
        }

        // Creamos usuario
        User::create($request->only([
            'name',
            'surname',
            'email',
            'id'
        ]));
    }
}
