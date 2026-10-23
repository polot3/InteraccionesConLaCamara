# 🖐️ Detección de Manos - Interacción con Cámara Web

Una aplicación interactiva moderna que detecta y visualiza manos en tiempo real usando **MediaPipe Hands** y WebRTC.

## 🎯 Características

✨ **Detección en Tiempo Real**
- Detecta ambas manos simultáneamente
- 21 puntos de referencia (landmarks) por mano
- Cálculo de confianza de detección

🎨 **Visualización Moderna**
- Canvas HTML5 para renderizado de alta performance
- Diferenciación visual: mano izquierda (azul) vs derecha (roja)
- Conexiones entre puntos para estructura de mano
- Panel de información detallado

📊 **Métricas en Vivo**
- Contador de FPS
- Estado de detección
- Coordenadas de puntos clave
- Confianza por mano
- Información detallada de landmarks

🎮 **Interfaz Intuitiva**
- Botones claros para iniciar/detener
- Diseño responsivo (desktop, tablet, móvil)
- Tema moderno con gradientes

## 🚀 Inicio Rápido

### 1. Requisitos Previos
```bash
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Cámara web funcional
- HTTPS (si se sirve remotamente)
```

### 2. Instalación
```bash
# Clonar o descargar el proyecto
cd InteraccionesConLaCamara

# El proyecto NO requiere instalación de dependencias
# (MediaPipe se carga desde CDN)
```

### 3. Ejecutar Localmente

**Opción A: Python 3**
```bash
python -m http.server 8000
# Luego: http://localhost:8000
```

**Opción B: Node.js (http-server)**
```bash
npx http-server
# Luego: http://localhost:8080
```

**Opción C: PHP**
```bash
php -S localhost:8000
# Luego: http://localhost:8000
```

**Opción D: Live Server (VS Code)**
- Instalar extensión "Live Server"
- Click derecho en `index.html` → "Open with Live Server"

### 4. Usar la Aplicación
1. Abre la app en tu navegador
2. Haz clic en **"Iniciar Cámara"**
3. Permite el acceso a tu cámara web
4. ¡Levanta las manos hacia la cámara!

## 📁 Estructura del Proyecto

```
InteraccionesConLaCamara/
├── index.html                 # Página principal
├── README.md                  # Este archivo
├── Spec.md                    # Especificaciones técnicas
├── css/
│   └── styles.css            # Estilos (responsive, animaciones)
├── js/
│   ├── app.js                # Lógica principal de la aplicación
│   ├── handDetector.js       # Módulo de detección de manos
│   ├── renderer.js           # Módulo de renderizado en canvas
│   └── utils.js              # Funciones utilitarias (si aplica)
└── assets/
    └── instructions.md       # Instrucciones de uso
```

## 🛠️ Arquitectura Técnica

### Módulos Principales

#### **HandDetector** (`js/handDetector.js`)
- Inicializa MediaPipe Hands
- Procesa frames del video
- Extrae información de landmarks
- Calcula puntos clave (muñeca, dedos)

#### **HandRenderer** (`js/renderer.js`)
- Dibuja landmarks en el canvas
- Dibuja conexiones entre puntos
- Aplica colores diferenciados por mano
- Maneja renderizado de información

#### **HandDetectionApp** (`js/app.js`)
- Orquesta el flujo de la aplicación
- Gestiona acceso a cámara
- Actualiza panel de información
- Controla ciclo de procesamiento

### Flujo de Datos
```
Cámara → getUserMedia() → Video Element → HandDetector → 
Procesar Frame → Landmarks → Renderer → Canvas → UI
```

## ⚙️ Configuración

### Ajustar Confianza de Detección
En `js/handDetector.js`:
```javascript
this.options = {
    maxNumHands: 2,              // Máximo 2 manos
    minDetectionConfidence: 0.5, // 0-1 (más alto = más estricto)
    minTrackingConfidence: 0.5,  // 0-1 (más alto = más estricto)
    modelComplexity: 1           // 0=lite, 1=full
};
```

### Cambiar Colores
En `js/renderer.js`:
```javascript
this.config = {
    leftHandColor: '#0099ff',    // Azul
    rightHandColor: '#ff3366',   // Rojo
    landmarkRadius: 5,           // Tamaño de puntos
    connectionWidth: 2           // Grosor de líneas
};
```

### Personalizar Landmarks Mostrados
En `js/renderer.js`, método `shouldLabelLandmark()`:
```javascript
const importantPoints = [0, 4, 8, 12, 16, 20]; // Solo puntas
return importantPoints.includes(index);
```

## 📊 Puntos de Referencia (Landmarks)

Cada mano tiene **21 puntos** ordenados así:

```
      0 = Muñeca (Wrist)

Dedos (4 articulaciones cada uno):
  Pulgar:   2, 3, 4
  Índice:   6, 7, 8
  Medio:   10,11,12
  Anular:  14,15,16
  Meñique: 18,19,20

Coordenadas: X, Y (pantalla), Z (profundidad)
Rango: 0.0 - 1.0 (relativo al canvas)
```

## 🐛 Solución de Problemas

### "No se detecta cámara"
```
✓ Verifica que la cámara esté conectada
✓ Permite acceso en configuración del navegador
✓ Prueba con otro navegador (Chrome recomendado)
✓ Reinicia el navegador
```

### "Baja precisión"
```
✓ Mejora la iluminación del ambiente
✓ Acércate más a la cámara (30-60 cm ideal)
✓ Aumenta minDetectionConfidence (menos falsos positivos)
✓ Usa fondo limpio detrás
```

### "Movimientos entrecortados"
```
✓ Cierra otras apps que usen cámara
✓ Reduce otras tabs del navegador
✓ Baja la resolución de video (en getUserMedia)
✓ Reduce maxFrameRate en app.js
```

### "Webcam bloqueada"
```
✓ Verifica permisos del navegador
✓ Chrome: Settings → Privacy → Camera
✓ Firefox: Preferences → Privacy → Permissions
✓ Recarga la página después de permitir
```

## 📚 Ejemplos de Uso

### Detectar Gesto Específico
```javascript
// En app.js, dentro de updateInfoPanel()
const keyPoints = hand.keyPoints;

// Puño cerrado: distancia pequeña entre dedos
const fingerDistance = Math.hypot(
    keyPoints.pulgar.x - keyPoints.indice.x,
    keyPoints.pulgar.y - keyPoints.indice.y
);

if (fingerDistance < 10) {
    console.log('✊ Puño cerrado detectado');
}
```

### Rastrear Movimiento
```javascript
// Calcular velocidad del dedo índice
const currentIndex = hand.keyPoints.indice;
if (this.previousIndex) {
    const vx = currentIndex.x - this.previousIndex.x;
    const vy = currentIndex.y - this.previousIndex.y;
    const speed = Math.hypot(vx, vy);
}
this.previousIndex = currentIndex;
```

### Dibujar Rastro de Mano
```javascript
// En renderer.js, antes de limpiar
this.ctx.globalAlpha = 0.3; // Transparencia
// Dibujar frame anterior
this.ctx.globalAlpha = 1.0; // Restaurar opacidad
```

## 🌐 Compatibilidad

| Navegador | Versión | Soporte |
|-----------|---------|--------|
| Chrome    | 77+     | ✅ Completo |
| Firefox   | 78+     | ✅ Completo |
| Safari    | 14.1+   | ✅ Completo |
| Edge      | 79+     | ✅ Completo |
| Opera     | 64+     | ✅ Completo |

## 🔒 Privacidad

- ✅ **No se graban datos**: Todo ocurre localmente
- ✅ **Sin servidor**: La app corre 100% en el navegador
- ✅ **Sin almacenamiento**: Nada se guarda
- ✅ **Control total**: Deniega permisos cuando quieras

## 📖 Referencias

- [MediaPipe Hands Docs](https://google.github.io/mediapipe/solutions/hands.html)
- [WebRTC getUserMedia](https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)
- [RequestAnimationFrame](https://developer.mozilla.org/es/docs/Web/API/window/requestAnimationFrame)

## 🎓 Aprende Más

### JavaScript Conceptos Utilizados
- Web APIs: `getUserMedia`, `Canvas`
- ES6+: async/await, clases, arrow functions
- Performance: RequestAnimationFrame, frame timing

### MediaPipe Concepts
- Pose estimation con redes neuronales
- BlazePalm para detección inicial
- BlazeLandmark para predicción de puntos
- Tracking para suavizado de datos

## 💡 Ideas de Extensión

- 🎮 **Control de juegos**: Usar gestos como input
- 🖼️ **Filtros AR**: Accesorios virtuales en manos
- 📊 **Análisis de gestos**: Reconocimiento de ASL
- 🎥 **Grabación**: Exportar video con landmarks
- 🤝 **Multijugador**: Sincronizar múltiples usuarios
- 📱 **ML Training**: Dataset de gestos personalizados

## 📄 Licencia

MIT © 2024 - Libre para uso personal, educativo y comercial

## 🤝 Contribuir

¿Tienes ideas? ¡Pull requests bienvenidos!

## 📧 Soporte

Para reportar bugs o sugerencias:
1. Abre un issue en el repositorio
2. Incluye: navegador, SO, cámara, mensaje de error
3. Adjunta screenshot o video si es posible

---

**Hecho con ❤️ usando JavaScript vanilla y MediaPipe**

¡Que disfrutes detectando manos! 🖐️✨
