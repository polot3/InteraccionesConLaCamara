# Especificación: Detección de Manos con Cámara Web

## Objetivo
Crear una aplicación interactiva que capture video en tiempo real desde la cámara web y detecte las manos del usuario, mostrando puntos de referencia (landmarks) en cada mano detectada.

## Características Principales

### 1. Captura de Video
- Acceso a la cámara web del dispositivo
- Stream en tiempo real en resolución nativa
- Manejo de permisos del navegador

### 2. Detección de Manos
- Detectar mano izquierda y derecha simultáneamente
- Identificar 21 puntos de referencia (landmarks) por mano:
  - Palma (5 puntos: muñeca, base de dedo)
  - Dedos (4 puntos por dedo: articulaciones)
- Calcular confianza de detección

### 3. Visualización
- Dibujar landmarks en tiempo real sobre el video
- Conectar puntos con líneas para formar la estructura de la mano
- Mostrar círculos en cada punto de referencia
- Diferenciar mano izquierda (azul) de mano derecha (roja)

### 4. Información en Pantalla
- Contador de frames por segundo (FPS)
- Estado de detección ("Mano detectada" / "Sin detección")
- Confianza de detección (porcentaje)
- Posición de puntos clave (coordenadas X, Y)

## Stack Tecnológico
- **Frontend**: HTML5, Canvas API, JavaScript vanilla
- **Detección**: MediaPipe Hands (modelo pre-entrenado)
- **Captura**: getUserMedia API (WebRTC)

## Estructura de Carpetas
```
InteraccionesConLaCamara/
├── Spec.md
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── handDetector.js
│   └── renderer.js
└── assets/
    └── instructions.md
```

## Requisitos Técnicos
- Navegador moderno con soporte WebRTC
- Cámara web funcional
- HTTPS (si se sirve remotamente, no local)
- Conexión a Internet (para cargar MediaPipe)

## Instrucciones de Instalación

### Paso 1: Clonar/Descargar el Proyecto
```bash
cd InteraccionesConLaCamara
```

### Paso 2: Iniciar Servidor Local
```bash
# Opción 1: Python 3
python -m http.server 8000

# Opción 2: Node.js (http-server)
npx http-server

# Opción 3: PHP
php -S localhost:8000
```

### Paso 3: Abrir en Navegador
```
http://localhost:8000
```

### Paso 4: Permitir Acceso a Cámara
Cuando el navegador solicite permiso, haz clic en "Permitir" para acceder a la cámara web.

## Instrucciones de Uso

1. **Abre la aplicación** en tu navegador
2. **Permite el acceso** a tu cámara cuando se solicite
3. **Colócate frente a la cámara** a una distancia de 30-60 cm
4. **Levanta una o ambas manos** hacia la cámara
5. **Observa los puntos de referencia** aparecer sobre tus manos
6. **Experimenta con gestos**: mueve las manos, abre/cierra puños, señala con dedos

## Puntos de Referencia (Landmarks)

Cada mano tiene 21 puntos ordenados así:

### Palma (0-4)
- 0: Muñeca (wrist)
- 1: Conexión palma-pulgar
- 5: Base del dedo índice
- 9: Base del dedo medio
- 13: Base del dedo anular
- 17: Base del dedo meñique

### Dedos (5-20)
Cada dedo tiene 4 puntos de articulación (MCP, PIP, DIP, TIP):
- Pulgar: 2-4
- Índice: 6-8
- Medio: 10-12
- Anular: 14-16
- Meñique: 18-20

## Configuración Avanzada

### Ajustar Confianza Mínima
En `js/handDetector.js`, modifica:
```javascript
minDetectionConfidence: 0.5, // 0.0 a 1.0
minTrackingConfidence: 0.5,  // 0.0 a 1.0
```

### Cambiar Colores
En `js/renderer.js`, modifica:
```javascript
const COLORS = {
  leftHand: '#0099ff',  // Azul
  rightHand: '#ff3366', // Rojo
};
```

### Ajustar FPS de Dibujo
En `js/app.js`:
```javascript
maxFrameRate: 30 // Máximo de frames por segundo
```

## Solución de Problemas

### "No se detecta cámara"
- Verifica que la cámara esté conectada
- Permite el acceso en la configuración del navegador
- Prueba con otro navegador

### "Baja precisión en detección"
- Mejora la iluminación del ambiente
- Acércate un poco más a la cámara
- Aumenta `minDetectionConfidence` en handDetector.js

### "Movimientos entrecortados"
- Reduce `maxFrameRate` para una mejor precisión
- Cierra otras aplicaciones que usen cámara

## Referencias
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- [WebRTC getUserMedia API](https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)

## Licencia
MIT - Libre para uso personal y educativo
