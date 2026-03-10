<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Xuxemons;

class UserController extends Controller
{
    public function listarInfo(Request $request)
    {
        // Buscamos usuario por id
        $usuario = $request->user();

        if (!$usuario) {
            // Si no lo encuentra, mostramos error
            return response()->json([
                'message' => 'error',
                'usuario' => 'No existe un usuario con ese ID'
            ], 400);
        }
        // Si se encuentra se muestra su información
        return response()->json([
            'message' => 'success',
            'usuario' => $usuario
        ], 200);
    }

    public function actualizarUsuario(Request $request)
    {
        // Comprobamos que todos los datos del usuario son validos
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string',
            'surname' => 'nullable|string',
            'email' => 'nullable|unique:users,email',
            'password' => 'nullable'
        ]);

        // Si no son validos, devolvemos error
        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Recogemos los datos del usuario que ha hecho la petición
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json([
                'message' => 'error',
                'usuario' => 'No existe ningún usuario con ese ID'
            ], 404);
        }

        // Cogemos los datos que nos haya pasado el usuario
        $datos = $request->only([
            'name',
            'surname',
            'email',
            'password'
        ]);

        // Si la password no esta vacia, la encriptamos
        if (!empty($datos['password'])) {
            $datos['password'] = bcrypt($datos['password']);
        } else {
            unset($datos['password']);
        }

        // Actualizamos datos
        $usuario->update($datos);

        // Mostramos usuario actualizado
        return response()->json([
            'message' => 'success',
            'usuario' => $usuario
        ], 200);
    }

    public function borrarUsuario(Request $request)
    {
        // Recogemos los datos del usuario que ha hecho la petición
        $usuario = $request->user();

        // Si no se ha encontrado, se devuelve error
        if (!$usuario) {
            return response()->json([
                'message' => 'error',
                'usuario' => 'No existe ningún usuario con ese ID'
            ], 404);
        }

        // Si se encuentra, se borra
        $usuario->delete();

        // Y se muestra mensaje de exito
        return response()->json([
            'message' => 'success',
            'usuario' => 'El usuario se ha borrado correctamente'
        ], 200);
    }

    public function navegadorXuxemons(Request $request)
    {
        // Validamos que los datos sean validos
        $validator = Validator::make($request->all(), [
            'nav' => 'required|string'
        ]);

        // Si no lo son, devolvemos error
        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Cogemos el contenido del navegador
        $buscar = $request->nav;

        // Buscamos los xuxemons del usuario que coincidan con el nombre que ha puesto
        $xuxemons = Xuxemons::where('user_id', $request->user()->id)
            ->where('name', 'LIKE', "%{$buscar}%")
            ->get();

        // Si no se encuentram devovlemos error
        if (count($xuxemons) <= 0) {
            return response()->json([
                'message' => 'error',
                'errors' => 'Sin resultados, prueba a buscar otro xuxemon...'
            ], 404);

            // Si se encuentran, devolvemos la lista
        } else {
            return response()->json([
                'message' => 'success',
                'xuxemons' => $xuxemons
            ], 201);
        }
    }
}
