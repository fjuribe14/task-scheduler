# Task Scheduler

Servicio programador de tareas (cron daemon) encargado de la obtención y sincronización periódica de tipos de cambio de divisas en base de datos.

---

## 📋 Tabla de Contenido
- [Estructura del Código](#-estructura-del-código)
- [Herramientas y Tecnologías](#-herramientas-y-tecnologías)
- [APIs Usadas](#-apis-usadas)
- [Buenas Prácticas](#-buenas-prácticas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Guía de PM2 (Producción)](#-guía-de-pm2-producción)

---

## ⚙️ Estructura del Código

El proyecto sigue una arquitectura desacoplada y modular. A continuación se detallan los directorios y archivos principales:

- **[src/index.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/index.ts)**: Punto de entrada de la aplicación. Se encarga de inicializar Sentry y arrancar las tareas programadas (Jobs).
- **`src/config/`**: Inicialización de configuraciones base.
  - **[database.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/config/database.ts)**: Configuración condicional del driver y cliente de la base de datos (MSSQL o LibSQL/SQLite) según el proveedor.
  - **[logger.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/config/logger.ts)**: Configuración de Winston para salidas a consola coloreadas y escritura rotativa de archivos diarios en la carpeta raíz `/log/<YYYY-MM-DD>.log`.
  - **[sentry.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/config/sentry.ts)**: Integración para el reporte de excepciones en tiempo real.
- **`src/jobs/`**: Tareas programadas en el backend.
  - **[base.job.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/jobs/base.job.ts)**: Clase abstracta `Job` que inicializa cron y encapsula el manejo de errores (Sentry) y de logs (Winston).
  - **[exchange_rates.job.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/jobs/exchange/exchange_rates.job.ts)**: Job que ejecuta periódicamente la actualización de tasas de cambio de divisas.
- **`src/services/`**: Lógica de negocio y persistencia en base de datos.
  - **[tipo_cambio.service.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/services/tipo_cambio.service.ts)**: Lógica CRUD para la tabla `tipo_cambio`.
  - **[cambio_moneda.service.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/services/cambio_moneda.service.ts)**: Lógica CRUD para la tabla `cambio_moneda`.
  - **[cambio_costos_operativos.service.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/services/cambio_costos_operativos.service.ts)**: Lógica CRUD para la tabla `cambio_costos_operativos`.
  - **`exchange/`**: Adaptadores y consumos de APIs externas:
    - **[cotizave.service.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/services/exchange/cotizave.service.ts)**: Servicio cliente de CotizaVe.
    - **[dolarapi.service.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/services/exchange/dolarapi.service.ts)**: Servicio cliente de DolarAPI.
    - **[exchange_manager.service.ts](file:///c:/Users/fernando.uribe/Documents/dev/task-scheduler/src/services/exchange/exchange_manager.service.ts)**: Orquestador que intenta consumir CotizaVe como canal principal y aplica un fallback automático hacia DolarAPI ante fallos.
- **`src/schemas/`**: Mapeo de bases de datos utilizando el ORM Drizzle.
  - **`mssql/`**: Mapeo para SQL Server.
- **`src/types/`**: Definición de interfaces y contratos en TypeScript.

---

## 🛠️ Herramientas y Tecnologías

El proyecto se sustenta en tecnologías modernas enfocadas en seguridad de tipos, velocidad y mantenibilidad:

- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para robustez en tiempo de compilación.
- **Gestor de paquetes**: [pnpm](https://pnpm.io/) para optimizar almacenamiento y velocidad de instalación.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) para interactuar de forma tipada con MSSQL y SQLite.
- **Logging**: [Winston](https://github.com/winstonjs/winston) y [Winston Daily Rotate File](https://github.com/winstonjs/winston-daily-rotate-file) para control estructurado y rotativo de logs.
- **Formateador y Linter**: [Biome](https://biomejs.dev/) para análisis estático ultrarrápido y consistencia de código.
- **Scheduling**: [cron](https://github.com/node-cron/node-cron) para definir intervalos cron dinámicos.
- **Observabilidad**: [@sentry/node](https://sentry.io/) para tracking remoto de excepciones.

---

## 🔌 APIs Usadas

El sistema consulta los tipos de cambio a través de dos endpoints:

1. **CotizaVe API** (Principal): Consumida mediante `COTIZAVE_API_URL`. Requiere autenticación a través del header `X-API-Key` provisto en el archivo `.env`.
2. **DolarAPI (Venezuela)** (Fallback): Utilizada en caso de caída o indisponibilidad del servicio de CotizaVe.

---

## 📐 Buenas Prácticas

- **Principio de Responsabilidad Única (SRP)**: Los Jobs delegan toda la lógica a los Services y solo controlan cuándo ejecutarla.
- **Mecanismos de Resiliencia**: El orquestador de exchange implementa tolerancia a fallos mediante fallback para evitar interrupciones de datos.
- **Logs Estructurados y Auditoría**: Consola legible con colores para desarrollo y archivos planos legibles sin caracteres de escape para producción.
- **Tipado Estricto de TypeScript**: Evitar `any` y hacer uso de las definiciones generadas de Drizzle (`$inferInsert` e `$inferSelect`).
- **Linter Integrado**: Biome check es obligatorio antes del build, garantizando calidad del código en repositorios compartidos.

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js (v18+)
- Gestor de paquetes `pnpm`

### 2. Pasos de Instalación
Instala todas las dependencias del proyecto:
```bash
pnpm install
```

### 3. Configuración de Entorno
Copia el archivo `.env.example` y renómbralo a `.env`:
```bash
cp .env.example .env
```
Completa las credenciales de base de datos SQL Server / SQLite y las APIs de CotizaVe y DolarAPI según corresponda.

### 4. Compilar el Proyecto
Genera los archivos compilados en la carpeta `dist/`:
```bash
pnpm run build
```

### 5. Ejecutar en Desarrollo
Ejecuta con recarga automática:
```bash
pnpm run dev
```

> [!NOTE]
> **Solución a errores de protocolo TLS antiguo (Unsupported Protocol en SQL Server)**
>
> Si tienes problemas para conectarte a la base de datos SQL Server debido a protocolos TLS heredados, inicializa el entorno de la siguiente forma:
>
> **En Windows (PowerShell):**
> ```bash
> $env:NODE_OPTIONS="--tls-cipher-list=DEFAULT@SECLEVEL=0"
> pnpm run dev
> ```
> o ejecuta directamente el script provisto en `package.json`:
> ```bash
> pnpm run dev:mssql
> ```
>
> **En Linux/macOS:**
> ```bash
> export NODE_OPTIONS="--tls-cipher-list=DEFAULT@SECLEVEL=0"
> pnpm run dev
> ```

---

## 📦 Guía de PM2 (Producción)

Para la puesta en producción continua, se recomienda utilizar el administrador de procesos **PM2**.

### 1. Instalación Global de PM2
```bash
npm install -g pm2
```

### 2. Comandos Útiles de PM2

- **Iniciar el servicio**:
  ```bash
  # Para producción estándar
  pnpm run pm2:start
  
  # Para producción con SQL Server (incluye configuraciones TLS necesarias)
  pnpm run pm2:start:mssql
  ```
- **Monitorear procesos en vivo**:
  ```bash
  pm2 monit
  ```
- **Listar procesos activos**:
  ```bash
  pm2 list
  ```
- **Ver logs generados**:
  ```bash
  pm2 logs task-scheduler
  ```
- **Reiniciar/Detener/Eliminar**:
  ```bash
  pm2 restart task-scheduler
  ```
  ```bash
  pm2 stop task-scheduler
  ```
  ```bash
  pm2 delete task-scheduler
  ```
- **Guardar la lista de procesos para el inicio del servidor**:
  ```bash
  pm2 startup
  pm2 save
  ```