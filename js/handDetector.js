/**
 * Hand Detection Module
 * Encapsula la lógica de detección de manos usando MediaPipe Hands
 */

class HandDetector {
    constructor() {
        this.hands = null;
        this.results = null;
        this.isInitialized = false;
        this.isRunning = false;

        // Configuración
        this.config = {
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        };

        // Opciones del modelo
        this.options = {
            maxNumHands: 2,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            modelComplexity: 1
        };

        // Nombres de los landmarks para referencia
        this.landmarkNames = [
            // Palma (0-4)
            'Muñeca', 'Conexión Palma-Pulgar',
            // Pulgar (2-4)
            'Pulgar MCP', 'Pulgar PIP', 'Pulgar DIP', 'Pulgar Punta',
            // Índice (5-8)
            'Índice CMC', 'Índice MCP', 'Índice PIP', 'Índice DIP', 'Índice Punta',
            // Medio (9-12)
            'Medio CMC', 'Medio MCP', 'Medio PIP', 'Medio DIP', 'Medio Punta',
            // Anular (13-16)
            'Anular CMC', 'Anular MCP', 'Anular PIP', 'Anular DIP', 'Anular Punta',
            // Meñique (17-20)
            'Meñique CMC', 'Meñique MCP', 'Meñique PIP', 'Meñique DIP', 'Meñique Punta'
        ];
    }

    /**
     * Inicializar el detector de manos
     */
    async initialize() {
        try {
            if (this.isInitialized) return true;

            // Esperar a que MediaPipe esté disponible
            await this.waitForMediaPipe();

            // Crear instancia de Hands
            this.hands = new window.Hands(this.config);

            // Configurar opciones
            this.hands.setOptions(this.options);

            // Configurar callback para resultados
            this.hands.onResults((results) => {
                this.results = results;
            });

            this.isInitialized = true;
            console.log('✅ Hand Detector inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Hand Detector:', error);
            return false;
        }
    }

    /**
     * Esperar a que las librerías de MediaPipe se carguen
     */
    async waitForMediaPipe(maxAttempts = 50) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                if (window.Hands && window.drawingUtils && window.Camera) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (attempts++ > maxAttempts) {
                    clearInterval(checkInterval);
                    reject(new Error('MediaPipe no se cargó correctamente'));
                }
            }, 100);
        });
    }

    /**
     * Procesar un frame de video
     */
    async processFrame(videoElement) {
        if (!this.isInitialized || !this.hands) return null;

        try {
            await this.hands.send({ image: videoElement });
            return this.results;
        } catch (error) {
            console.error('Error procesando frame:', error);
            return null;
        }
    }

    /**
     * Obtener los resultados actuales de detección
     */
    getResults() {
        return this.results;
    }

    /**
     * Obtener información formateada de las manos detectadas
     */
    getHandsInfo() {
        if (!this.results || !this.results.multiHandLandmarks) {
            return { count: 0, hands: [] };
        }

        const handsInfo = [];

        this.results.multiHandLandmarks.forEach((landmarks, index) => {
            const handedness = this.results.multiHandedness[index].label; // "Left" o "Right"
            const confidence = this.results.multiHandedness[index].score;

            // Calcular puntos clave
            const keyPoints = this.getKeyPoints(landmarks);

            handsInfo.push({
                id: index,
                handedness,
                confidence: confidence.toFixed(2),
                landmarks: landmarks,
                keyPoints: keyPoints
            });
        });

        return {
            count: handsInfo.length,
            hands: handsInfo
        };
    }

    /**
     * Extraer puntos clave de una mano (muñeca, dedos, etc.)
     */
    getKeyPoints(landmarks) {
        const keyPoints = {};

        // Muñeca
        keyPoints.wrist = {
            name: 'Muñeca',
            x: (landmarks[0].x * 100).toFixed(1),
            y: (landmarks[0].y * 100).toFixed(1),
            z: (landmarks[0].z * 100).toFixed(1)
        };

        // Punta de cada dedo
        const fingerTips = [4, 8, 12, 16, 20];
        const fingerNames = ['Pulgar', 'Índice', 'Medio', 'Anular', 'Meñique'];

        fingerNames.forEach((name, idx) => {
            const landmarkIdx = fingerTips[idx];
            keyPoints[name.toLowerCase()] = {
                name: `${name} (Punta)`,
                x: (landmarks[landmarkIdx].x * 100).toFixed(1),
                y: (landmarks[landmarkIdx].y * 100).toFixed(1),
                z: (landmarks[landmarkIdx].z * 100).toFixed(1)
            };
        });

        return keyPoints;
    }

    /**
     * Obtener nombre del landmark por índice
     */
    getLandmarkName(index) {
        return this.landmarkNames[index] || `Landmark ${index}`;
    }

    /**
     * Cambiar configuración del detector
     */
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        if (this.hands) {
            this.hands.setOptions(this.options);
        }
    }

    /**
     * Obtener configuración actual
     */
    getOptions() {
        return this.options;
    }

    /**
     * Limpiar recursos
     */
    dispose() {
        if (this.hands) {
            this.hands.close();
            this.hands = null;
        }
        this.isInitialized = false;
        this.isRunning = false;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HandDetector;
}
