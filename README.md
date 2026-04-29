# 🍬 Xuxemons

> Aplicación web gamificada donde los jugadores coleccionan criaturas llamadas Xuxemons, las hacen crecer con xuxes, gestionan su inventario e interactúan con otros jugadores mediante amigos, batallas y chat.

**Desarrollado por:** Olaya | Ares | Deivid  
**Ciclo:** CFGS Desenvolupament d'Aplicacions Web — iLERNA

---

## 📋 Descripción

Xuxemons es una plataforma web gamificada construida con **Laravel**, **Angular** y **Docker**. Los jugadores pueden:

- Registrarse y gestionar su perfil
- Coleccionar y hacer evolucionar Xuxemons
- Gestionar su mochila (inventario) con xuxes y vacunas
- Añadir amigos, chatear y retarlos a batalla
- Recibir recompensas diarias automáticas

El sistema incluye dos roles: **jugador** y **administrador**, con paneles diferenciados y autenticación mediante **JWT**.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular + TypeScript |
| Backend | Laravel (PHP) |
| Base de datos | MySQL |
| Autenticación | JWT |
| Despliegue | Docker + Docker Compose |

---

## 🚀 Instalación y puesta en marcha

### Requisitos previos

Solo necesitas tener instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

No es necesario tener PHP, Node ni MySQL instalados localmente.

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/333ares/Xuxemons.git
cd Xuxemons
```

**2. Configurar las variables de entorno**

```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

**3. Levantar los contenedores**

```bash
docker-compose up -d --build
```

**4. Acceder a la aplicación**

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8000/api |

---

## ⚙️ Variables de entorno

### Backend (Laravel)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `APP_KEY` | Clave de cifrado de Laravel | Generada con `php artisan key:generate` |
| `DB_CONNECTION` | Tipo de base de datos | `mysql` |
| `DB_HOST` | Host de la base de datos | `db` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_DATABASE` | Nombre de la base de datos | `xuxemons` |
| `DB_USERNAME` | Usuario de la base de datos | `xuxemons_user` |
| `DB_PASSWORD` | Contraseña de la base de datos | `1234` |
| `JWT_SECRET` | Clave para firmar tokens JWT | Generada con `php artisan jwt:secret` |

### Frontend (Angular)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `API_URL` | URL base de la API | `http://localhost:8000/api` |

---

## 🎮 Funcionalidades principales

### Usuario jugador
- Registro e inicio de sesión con JWT
- Xuxedex: colección de Xuxemons con filtros por tipo y tamaño
- Mochila: inventario de 20 espacios con objetos apilables y no apilables
- Alimentar Xuxemons para hacerlos evolucionar (Pequeño → Mediano → Grande)
- Sistema de enfermedades y vacunas
- Recompensas diarias automáticas (xuxes y Xuxemons)
- Amigos: buscar, añadir, chatear y retar a batalla
- Batallar contra amigos con sistema de dados y modificadores por tipo y tamaño

### Administrador
- Gestión de jugadores: añadir xuxes, objetos y Xuxemons
- Configuración de parámetros del juego: xuxes por nivel, probabilidades de infección, horarios de recompensas diarias
- Panel de estadísticas globales

---

## 🔐 Seguridad

- Autenticación con **JWT** (tokens de 2h con auto-login si el token sigue vigente)
- Protección de rutas con `AuthGuard` y `AdminGuard` en Angular
- Middleware de roles en Laravel (`auth`, `admin`)
- Contraseñas encriptadas con bcrypt

---

## 🐳 Comandos Docker útiles

```bash
# Levantar la aplicación
docker-compose up -d --build

# Parar los contenedores
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Acceder al contenedor de Laravel
docker-compose exec backend bash

# Parar y eliminar volúmenes (borra los datos)
docker-compose down -v
```

---

## 📄 Documentación

La documentación completa del proyecto está disponible en la raíz del repositorio:

- `Guia_tecnica.pdf` — Arquitectura, modelo de datos y casos de uso
- `Manual_usuario.pdf` — Guía de uso para usuarios no técnicos

---

*Proyecto desarrollado como repte final del CFGS DAW en iLERNA — Olaya | Ares | Deivid*
