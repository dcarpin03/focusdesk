# FocusDesk

**Aplicación de escritorio para la gestión de tareas y sesiones de estudio o trabajo.**

FocusDesk es un proyecto personal desarrollado con **Electron, React y TypeScript**, cuyo objetivo es proporcionar una herramienta sencilla para organizar tareas, registrar el tiempo dedicado a diferentes actividades y consultar un historial de sesiones.

La aplicación funciona localmente y utiliza almacenamiento persistente, sin necesidad de disponer de un servidor o una base de datos externa.

**Estado:** Prototipo funcional en desarrollo.

## Funcionalidades

### Cronómetro de sesiones

- Iniciar y detener sesiones de trabajo o estudio.
- Asignar un nombre a cada sesión.
- Registrar la duración y fecha de las sesiones.
- Reiniciar el temporizador al finalizar una sesión.

### Gestión de tareas

- Crear nuevas tareas.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- Conservar las tareas al cerrar y volver a abrir la aplicación.

### Historial

- Registrar las sesiones realizadas.
- Consultar su nombre, duración y fecha.
- Mantener el historial mediante almacenamiento local.

## Tecnologías utilizadas

| Tecnología | Utilización |
|---|---|
| Electron | Desarrollo de la aplicación de escritorio |
| React | Construcción de la interfaz mediante componentes |
| TypeScript | Tipado estático |
| Vite | Entorno de desarrollo y compilación |
| electron-store | Persistencia local de datos |
| CSS | Estilos de la interfaz |
| Git | Control de versiones |

## Arquitectura

FocusDesk utiliza una arquitectura que separa la interfaz gráfica, la lógica del temporizador y el almacenamiento local.

La interfaz está dividida en componentes reutilizables:

- `TimerCard`: interfaz del cronómetro.
- `TasksCard`: gestión visual de las tareas.
- `HistoryCard`: historial de sesiones.
- `Footer`: pie de la aplicación.

La lógica del temporizador se encuentra encapsulada en el hook personalizado `useTimer`, que gestiona el tiempo transcurrido y las operaciones de inicio, parada y reinicio.

El componente `App.tsx` coordina el estado general y la comunicación entre los distintos componentes.

### Persistencia de datos

La aplicación utiliza `electron-store` para almacenar las tareas y sesiones.

La comunicación entre React y el proceso principal de Electron se realiza mediante IPC (*Inter-Process Communication*).

El archivo `preload.ts` expone una interfaz denominada `focusDeskStorage`, que permite consultar y actualizar los datos almacenados.

De esta manera, se separa la interfaz de usuario de las operaciones de persistencia.

## Instalación y ejecución

Para ejecutar el proyecto en local es necesario tener instalados Node.js y npm.

**1. Clonar el repositorio**

```bash
git clone https://github.com/dcarpin03/focusdesk.git
```

**2. Acceder al directorio**

```bash
cd focusdesk
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Iniciar la aplicación en modo desarrollo**

```bash
npm run dev
```

Este comando inicia el entorno de desarrollo de Vite con la integración de Electron.

## Capturas de pantalla

*Pendiente de incorporar capturas de la aplicación.*

Se añadirán imágenes de la pantalla principal, la gestión de tareas y el historial de sesiones.

## Posibles mejoras

El proyecto puede ampliarse con nuevas funcionalidades:

- Estadísticas de productividad.
- Resúmenes de tiempo diario y semanal.
- Edición y categorización de tareas.
- Filtros para el historial.
- Intervalos de descanso.
- Exportación del historial.
- Empaquetado y distribución de la aplicación.

## Objetivo del proyecto

FocusDesk nació como un proyecto personal para profundizar en el desarrollo de aplicaciones de escritorio con tecnologías web modernas.

Su desarrollo me ha permitido trabajar con React, TypeScript, gestión de estado, hooks personalizados, comunicación IPC y persistencia local, además de mejorar progresivamente la organización y mantenibilidad del código.

El proyecto forma parte de mi portfolio como desarrollador de software.
