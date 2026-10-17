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
- Crear secciones personalizadas y seleccionarlas antes de iniciar una sesión.
- Elegir uno de seis colores para identificar cada sección en el historial.
- Expandir y contraer las secciones para consultar sus sesiones.
- Eliminar únicamente secciones vacías y sin una sesión en curso.
- Conservar las sesiones antiguas en el grupo «Sin sección».
- Mantener el historial mediante almacenamiento local.

### Apariencia

- Abrir ajustes desde el engranaje de la parte superior derecha.
- Elegir entre Clásico, Oscuro, Azul y Verde con una vista previa de sus colores.
- Aplicar el tema al instante y conservarlo al reiniciar.
- Mantener los colores personalizados de las secciones en todos los temas.

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
- `SessionForm`: nombre obligatorio y selección de sección, reutilizable dentro o fuera de la tarjeta del cronómetro.
- `SectionForm`: creación de secciones con nombre y color.
- `SectionPicker`: selección de la sección de una sesión.
- `TasksCard`: gestión visual de las tareas.
- `HistoryCard`: historial de sesiones.
- `Footer`: pie de la aplicación.
- `SettingsPanel`: ajustes de apariencia accesibles con ratón y teclado.

La lógica del temporizador se encuentra encapsulada en el hook personalizado `useTimer`, que gestiona el tiempo transcurrido y las operaciones de inicio, parada y reinicio.

`useFocusDesk` mantiene una única instancia del estado de sesiones, secciones, tareas y tema, junto con sus acciones, persistencia y cálculo del tiempo diario. Reutiliza `useTimer` sin modificar su funcionamiento. `App.tsx` crea ese modelo una sola vez y se lo pasa al layout seleccionado mediante props.

### Interfaz

FocusDesk utiliza exclusivamente Editorial Premium con los temas Clásico, Oscuro, Azul y Verde. App mantiene una sola instancia de useFocusDesk; EditorialLayout organiza los componentes y recibe ese modelo. Las preferencias antiguas de layout se ignoran sin borrarlas ni cambiar los datos de estudio.

El fondo predeterminado es un WebP local original. Su procedencia se documenta en [src/assets/editorial/README.md](src/assets/editorial/README.md). La aplicación funciona sin conexión.

### Persistencia de datos

La aplicación utiliza `electron-store` para almacenar las tareas, sesiones y secciones.

Cada sesión nueva conserva el identificador de la sección seleccionada al iniciarla. Las sesiones anteriores, sin ese identificador, siguen disponibles en «Sin sección» sin necesidad de migrarlas. Electron comprueba que una sección no contiene sesiones antes de permitir su eliminación; esta operación nunca elimina sesiones.

Las secciones creadas antes de incorporar los colores reciben el azul predeterminado al cargarse. Esta actualización conserva sus identificadores, nombres y sesiones asociadas.

La preferencia de apariencia se guarda en la clave `theme` de `electron-store` mediante operaciones IPC limitadas a leer y guardar un tema válido. Se carga antes de montar React, sin sobrescribirla durante la inicialización. Si no existe o contiene un valor desconocido, se utiliza Clásico.

En Ajustes → Fondo ambiental se puede importar JPG, PNG o WebP (máximo 10 MB y 30 megapíxeles) o restablecer el fondo original. Electron abre el selector nativo, valida la firma y decodifica la imagen antes de guardar una copia con nombre UUID dentro de `app.getPath('userData')/backgrounds`. La clave `backgroundImage` contiene únicamente ese nombre relativo; no se guardan imágenes en base64 ni rutas de origen.

El protocolo `focusdesk-background://image/current` sirve solo la copia activa validada, sin acceso genérico a archivos. WebP se valida con Chromium en una ventana oculta, aislada y sin Node/preload porque nativeImage de Electron 30 no lo decodifica. Los archivos ausentes o dañados utilizan el fondo predeterminado y muestran un aviso dentro de Ajustes. El restablecimiento limpia la referencia y la copia; no modifica los datos de estudio.

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
