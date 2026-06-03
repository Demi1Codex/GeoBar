# Registro de Errores - GeoBar

## Error: ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING en Render
**¿Qué pasó?**
Render ejecutaba `expo start` (script `start` en package.json) en lugar de `node server.js`. Expo cargaba sus módulos `.ts` y Node.js 22+ fallaba porque su sistema de type stripping no funciona dentro de `node_modules`.

**¿Cómo se solucionó?**
Se cambió el script `"start"` de `package.json` a `"node server.js"` y se movió `expo start` al script `"expo"`. Se agregó un `Procfile` con `web: node server.js` para que Render use el comando correcto.

## Solución: Panel de control Python para servidor remoto
No hay terminal interactiva en Render. Se creó `server_cli.py` que se ejecuta localmente y se conecta al servidor (local o Render) vía HTTP. Comandos: `reset`, `status`, `bars`, `connect`.

## Error: IP 0.0.0.0 en Render no funciona para conexión desde la app
**¿Qué pasó?**
Render muestra `http://0.0.0.0:10000` como bind address local. Esa dirección solo sirve para el servidor internamente, no es una URL pública accesible desde la app.

**¿Cómo se solucionó?**
Se modificó el sistema de conexión en `App.js` para aceptar URLs completas (ej: `https://geobar.onrender.com`) además de IPs locales. Ahora el input detecta automáticamente si es una IP (usa `http://IP:3000`) o una URL completa (la usa directamente). Se migró la clave de AsyncStorage de `@server_ip` a `@server_url` con soporte de migración automática.

## Error: BUILD FAILED (Error en la instalación de APK)
**¿Qué pasó?**
Falla en el autolinking y rutas del SDK durante el proceso automático de Expo.

**¿Cómo se solucionó?**
Se configuró `local.properties` y se procedió con una compilación manual de Gradle + instalación vía ADB.

## Error: Conexión Fallida / Pantalla Blanca en Dispositivos Externos
**¿Qué pasó?**
Falla de conexión sin feedback visual.

**¿Cómo se solucionó?**
Se implementó el sistema de verificación de Host con botón "Test".

## Error Crítico: Proyecto Android Malformado (EBUSY / Reinitialize)
**¿Qué pasó?**
Recursión `android/android/` por tener un `package.json` en la carpeta `android/`.

**¿Cómo se solucionó?**
Se eliminó la carpeta `android/`, se quitó el `package.json` erróneo y se hizo un prebuild limpio.

## Error: Conexión Local Bloqueada en App Release
**¿Qué pasó?**
Al intentar conectar la versión de "Release" (producción) a la IP local, Android bloqueaba la solicitud. Esto ocurre porque por defecto Android prohíbe el tráfico HTTP (sin S) en aplicaciones de producción por seguridad.

**¿Cómo se solucionó?**
1.  **Modificación del Manifiesto**: Se editó `android/app/src/main/AndroidManifest.xml` (Línea 16).
2.  **Parámetro habilitado**: Se añadió `android:usesCleartextTraffic="true"` a la etiqueta `<application>`.
3.  **Resultado**: La aplicación ahora permite conectarse al servidor Metro (HTTP) incluso en modo Release.

## Error: Build FAILED due to "Unable to delete directory"
**¿Qué pasó?**
Al compilar la aplicación en Android, Gradle falló intentando eliminar directorios (`cacheable`, `pluginDescriptors` bajo `node_modules/@react-native` y `expo-modules-autolinking`) porque estos archivos estaban bloqueados por un Daemon de Gradle pendiente o en uso.

**¿Cómo se solucionó?**
1. Se detuvieron todos los procesos de Gradle activos usando `.\gradlew.bat --stop` desde el directorio `android/`.
2. Opcionalmente se ejecuta `.\gradlew.bat clean` para asegurar un prebuild limpio antes de recompilar o reinstalar.

## Error: SDK location not found
**¿Qué pasó?**
Gradle falló al configurar el proyecto `:app` porque no encontraba la ruta del SDK de Android. El archivo `local.properties` no existía en la carpeta `android/`.

**¿Cómo se solucionó?**
1. Se identificó la ruta del SDK en el sistema (`C:\Users\demia\AppData\Local\Android\Sdk`).
2. Se creó manualmente el archivo `C:\Users\demia\GeoBar\android\local.properties` con la propiedad `sdk.dir` correctamente configurada.
3. Se verificó la configuración permitiendo que Gradle avanzara en el proceso de compilación.

## Error: Unable to delete directory (mergeReleaseJniLibFolders)
**¿Qué pasó?**
Al intentar generar la versión de `Release` (`assembleRelease`), el proceso falló con errores en múltiples módulos (`async-storage`, `svg`, `webview`, `expo-constants`). Gradle no pudo borrar los directorios de salida dentro de `node_modules` debido a bloqueos de archivos por procesos activos.

**¿Cómo se solucionó?**
1. Se detuvieron todos los daemons de Gradle usando `gradlew --stop`.
2. Se forzó el cierre de procesos `java` y `node` residuales en el sistema que podrían estar bloqueando archivos.
3. Se intentó borrar manualmente las carpetas `build` de los módulos afectados para limpiar el pool de archivos abiertos por el sistema de ficheros de Windows.
4. Se procedió con un reintento de la tarea de compilación. [REINCIDENCIA]
5. **Estado**: Se ha activado la supervisión de terminal ante fallos continuos para aplicar una limpieza radical de procesos Java/Node bloqueantes.

## Error: Process 'command 'cmd'' finished with non-zero exit value 1 (Settings file line 29)
**¿Qué pasó?**
El archivo `android/settings.gradle` fallaba en la línea 29 porque el comando de autolinking de Expo no podía ejecutarse. El motivo era que la versión de `@expo/cli` instalada estaba corrupta (sin la carpeta `build/`). Esto ocurrió debido a conflictos de versiones en `npm` que impidieron una instalación completa de las dependencias.

**¿Cómo se solucionó?**
1. Se identificó el conflicto de dependencias (`ERESOLVE`) mediante los logs de npm.
2. Se realizó una limpieza de `node_modules` y se reinstaló todo usando `npm install --legacy-peer-deps` para forzar la resolución de conflictos.
3. Se agregaron los repositorios `google()` y `mavenCentral()` al bloque `pluginManagement` de `settings.gradle` para permitir que Gradle descargara los plugins necesarios.

## Error: Minimum supported Gradle version is 8.13. Current version is 8.10.2.
**¿Qué pasó?**
Al intentar compilar utilizando el SDK 36 (Preview) de Android y las últimas herramientas de Expo, el sistema detectó que la versión de Gradle configurada en el proyecto (8.10.2) era demasiado antigua para las nuevas versiones de los plugins de Android.

**¿Cómo se solucionó?**
Se actualizó el archivo `android/gradle/wrapper/gradle-wrapper.properties` cambiando la propiedad `distributionUrl` de la versión `8.10.2-all.zip` a la versión `8.13-all.zip`. Esto permitió que Gradle descargara la versión compatible y continuara con la compilación.

## Error: Unable to resolve module react-native-svg (createBundleReleaseJsAndAssets FAILED)
**¿Qué pasó?**
Durante el bundling de Metro para el build de Release (`:app:createBundleReleaseJsAndAssets`), el proceso fallaba porque `lucide-react-native` requiere `react-native-svg` como peer dependency, pero este paquete no estaba instalado en el proyecto.

**¿Cómo se solucionó?**
Se instaló `react-native-svg` con `npm install react-native-svg --legacy-peer-deps`. Tras esto, el build de Release completó exitosamente (`assembleRelease` con código de salida 0).

