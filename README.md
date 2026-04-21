# Todo App

Aplicación de lista de tareas para usuarios:

• Agrega nuevas tareas.
• Marca tareas como completadas.
• Elimina tareas.

La aplicación está construida con Ionic y Angular, y utiliza almacenamiento local para guardar el estado de las tareas.

## Requisitos de instalación

- **Node.js 18**
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Gradle**: `brew install gradle`
- **Java JDK 11 o 17**: `JAVA_HOME`
- **Android SDK**: `ANDROID_HOME`
- **Xcode**

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Compilación y Ejecución

### Navegador
```bash
ionic serve
```

### Android

1. **Agregar la plataforma**:
   ```bash
   ionic cordova platform add android
   ```
2. **Ejecutar en emulador**:
   ```bash
   ionic cordova run android --emulator
   ```
3. **Generar APK de depuración**:
   ```bash
   ionic cordova build android
   ```

### iOS

1. **Agregar la plataforma**:
   ```bash
   ionic cordova platform add ios
   ```
2. **Compilar para dispositivo**:
   ```bash
   ionic cordova build ios --device
   ```
