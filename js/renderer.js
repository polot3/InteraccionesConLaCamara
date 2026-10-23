/**
 * Renderer Module
 * Encapsula la lógica de dibujo y visualización de landmarks
 */

class HandRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.canvasWidth = 0;
        this.canvasHeight = 0;

        // Configuración visual
        this.config = {
            landmarkRadius: 5,
            connectionWidth: 2,
            leftHandColor: '#0099ff',  // Azul
            rightHandColor: '#ff3366', // Rojo
            landmarkColor: '#ffffff',  // Blanco
            confidenceThreshold: 0.5
        };

        // Definición de conexiones entre landmarks
        // Cada tupla representa una línea entre dos puntos
        this.connections = [
            // Palma
            [0, 1], [0, 5], [0, 9], [0, 13], [0, 17],
            // Dedos
            [1, 2], [2, 3], [3, 4],     // Pulgar
            [5, 6], [6, 7], [7, 8],     // Índice
            [9, 10], [10, 11], [11, 12], // Medio
            [13, 14], [14, 15], [15, 16], // Anular
            [17, 18], [18, 19], [19, 20]  // Meñique
        ];
    }

    /**
     * Inicializar el renderer con el canvas
     */
    initialize(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');

        if (!this.ctx) {
            console.error('No se pudo obtener el contexto 2D del canvas');
            return false;
        }

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        console.log(`✅ Canvas inicializado: ${this.canvasWidth}x${this.canvasHeight}`);
        return true;
    }

    /**
     * Limpiar el canvas
     */
    clear() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    /**
     * Dibujar las manos detectadas
     */
    drawHands(handsInfo) {
        if (!this.ctx) return;

        this.clear();

        handsInfo.hands.forEach((hand) => {
            const color = hand.handedness === 'Right' 
                ? this.config.rightHandColor 
                : this.config.leftHandColor;

            // Dibujar conexiones primero (líneas de fondo)
            this.drawConnections(hand.landmarks, color);

            // Dibujar landmarks después (círculos en frente)
            this.drawLandmarks(hand.landmarks, color);
        });
    }

    /**
     * Dibujar las líneas que conectan los landmarks
     */
    drawConnections(landmarks, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.config.connectionWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.connections.forEach(([start, end]) => {
            const startLandmark = landmarks[start];
            const endLandmark = landmarks[end];

            const x1 = startLandmark.x * this.canvasWidth;
            const y1 = startLandmark.y * this.canvasHeight;
            const x2 = endLandmark.x * this.canvasWidth;
            const y2 = endLandmark.y * this.canvasHeight;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        });
    }

    /**
     * Dibujar los puntos de referencia (landmarks)
     */
    drawLandmarks(landmarks, color) {
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * this.canvasWidth;
            const y = landmark.y * this.canvasHeight;
            const z = landmark.z;

            // Dibujar círculo de fondo
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.config.landmarkRadius + 2, 0, 2 * Math.PI);
            this.ctx.fill();

            // Dibujar círculo principal
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.config.landmarkRadius, 0, 2 * Math.PI);
            this.ctx.fill();

            // Dibujar borde blanco
            this.ctx.strokeStyle = this.config.landmarkColor;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Dibujar pequeño número de índice (opcional, solo para puntos importantes)
            if (this.shouldLabelLandmark(index)) {
                this.drawLandmarkLabel(index, x, y, color);
            }
        });
    }

    /**
     * Dibujar etiqueta de landmark
     */
    drawLandmarkLabel(index, x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const label = index.toString();
        this.ctx.fillText(label, x, y - 15);
    }

    /**
     * Determinar si un landmark debe ser etiquetado
     * Solo etiquetamos puntos importantes
     */
    shouldLabelLandmark(index) {
        // Etiquetamos: muñeca (0), puntas de dedos (4, 8, 12, 16, 20)
        const importantPoints = [0, 4, 8, 12, 16, 20];
        return importantPoints.includes(index);
    }

    /**
     * Dibujar información de depuración
     */
    drawDebugInfo(fpsValue, handsCount) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 80);

        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = 'bold 14px Courier New';
        this.ctx.textAlign = 'left';

        this.ctx.fillText(`FPS: ${fpsValue}`, 20, 35);
        this.ctx.fillText(`Manos: ${handsCount}`, 20, 55);
        this.ctx.fillText(`Timestamp: ${Date.now()}`, 20, 75);
    }

    /**
     * Cambiar configuración visual
     */
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Obtener configuración actual
     */
    getConfig() {
        return this.config;
    }

    /**
     * Redimensionar el canvas
     */
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HandRenderer;
}
