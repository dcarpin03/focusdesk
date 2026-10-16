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

### Diseños visuales

`src/layouts/types.ts` define los seis identificadores de diseño y el contrato `LayoutProps`. `src/layouts/layoutConfig.ts` centraliza sus nombres y resuelve el componente correspondiente. El diseño interno predeterminado es `editorial`, implementado en `EditorialLayout`. Glass Nocturno está implementado en `GlassLayout`. Ajustes → Apariencia → Diseño de interfaz permite elegir entre ambos con miniaturas CSS de su distribución. Los otros cuatro diseños siguen pendientes, no se ofrecen en Ajustes y utilizan `CurrentLayout` como respaldo interno.

Los layouts organizan la presentación y reciben el mismo modelo; no deben crear otra instancia de `useFocusDesk`, leer directamente el almacenamiento ni duplicar acciones de negocio. Los estados locales de presentación, como los grupos abiertos del historial o la apertura de ajustes, pueden seguir en sus componentes. Al cambiar de diseño se desmontan esos componentes y dichos estados locales se reinician; los datos de estudio y el cronómetro permanecerán en `App` a través del hook compartido.

Para incorporar nuevas variantes:

1. Crear un componente que reciba `LayoutProps` y registrar su `component` en la entrada correspondiente de `LAYOUTS`.
2. Reorganizar los componentes existentes utilizando los datos y acciones de `model`. `TimerCard` acepta un `sessionForm` opcional y las presentaciones anterior, Editorial y Glass; todas comparten los mismos controles y acciones.
3. Consumir `elapsedSeconds`, `isRunning`, `canStartSession`, `handleStartTimer` y `handleStopTimer` del mismo modelo para presentar el cronómetro sin duplicar su lógica.

Los temas y diseños son independientes: `data-theme` y `src/themes.css` siguen controlando la paleta. Los estilos de Editorial se limitan a `.editorial-layout` en `EditorialLayout.css`, reutilizan las variables semánticas y no sobrescriben las preferencias. Los estilos de `App.css` continúan disponibles para la presentación anterior.

Editorial incorpora una cabecera con identidad y ajustes, cronómetro circular y tarjeta de sesión sobre un fondo ambiental, resumen diario y columna de secciones, tareas e historial. El círculo muestra el tiempo ascendente real en `HH:MM:SS`; su aro completo es decorativo y no representa progreso ni un objetivo. Las tareas muestran el número real de completadas y el historial suma la duración de cada sección, sin nuevos datos almacenados.

El fondo es un WebP local original generado para el proyecto (aproximadamente 110 KB), con degradado CSS de respaldo. Su procedencia y el prompt están documentados en [src/assets/editorial/README.md](src/assets/editorial/README.md). La interfaz funciona sin conexión y conserva la barra nativa de Electron. En ventanas estrechas se apila verticalmente; las listas mantienen scroll independiente. Los paneles conservan su comportamiento desplegable y su estado inicial cerrado.

Los temas se definen mediante variables semánticas en `src/themes.css` y el atributo `data-theme` del documento. Las mismas clases CSS se reutilizan en los cuatro temas.

Glass distribuye secciones a la izquierda, cronómetro y resumen diario en el centro, y tareas e historial a la derecha. En ventanas medianas la organización pasa a dos columnas y en estrechas se apila con scroll vertical. Sus estilos están limitados a `.glass-layout` en `GlassLayout.css`; los tokens semánticos locales mantienen una paleta nocturna violeta y azul con cualquier tema guardado. Cambiar de diseño no modifica `theme`: al volver a Editorial se recupera visualmente su paleta. Las miniaturas de temas conservan sus propios colores.

El fondo provisional de Glass se construye exclusivamente con degradados y siluetas CSS locales originales, sin imágenes ni recursos externos que licenciar. Queda pendiente incorporar, si se desea, una fotografía o ilustración ambiental nocturna con licencia verificable para redistribución. No se utiliza el mockup como fondo.

El cambio es inmediato y conserva el tiempo transcurrido, el nombre y la sección activos en la única instancia de `useFocusDesk` / `useTimer`. Puede finalizarse la sesión desde cualquiera de los dos diseños. Ajustes se cierra al cambiar y `App` devuelve el foco al botón de ajustes del nuevo layout. Las tareas y los paneles abiertos pertenecen al estado compartido; los grupos expandidos, los borradores de nueva sección y los errores locales se reinician al desmontar sus componentes.

### Persistencia de datos

La aplicación utiliza `electron-store` para almacenar las tareas, sesiones y secciones.

Cada sesión nueva conserva el identificador de la sección seleccionada al iniciarla. Las sesiones anteriores, sin ese identificador, siguen disponibles en «Sin sección» sin necesidad de migrarlas. Electron comprueba que una sección no contiene sesiones antes de permitir su eliminación; esta operación nunca elimina sesiones.

Las secciones creadas antes de incorporar los colores reciben el azul predeterminado al cargarse. Esta actualización conserva sus identificadores, nombres y sesiones asociadas.

La preferencia de apariencia se guarda en la clave `theme` de `electron-store` mediante operaciones IPC limitadas a leer y guardar un tema válido. Se carga antes de montar React, sin sobrescribirla durante la inicialización. Si no existe o contiene un valor desconocido, se utiliza Clásico.

La preferencia independiente `layout` usa la misma instancia de electron-store, con los canales limitados `settings:get-layout` y `settings:set-layout`. Solo se pueden guardar `editorial` y `glass`; un valor ausente, desconocido o todavía no implementado se interpreta como Editorial. Se carga antes de montar React y solo se escribe al cambiar de diseño, sin efectos de guardado durante la carga inicial ni cambios en los registros de estudio.

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
