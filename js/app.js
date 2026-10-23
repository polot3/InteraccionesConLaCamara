/**
 * Main Application Logic
 * Gestiona el flujo principal de la aplicación
 */

class HandDetectionApp {
    constructor() {
        // Elementos del DOM
        this.elements = {
            video: document.getElementById('video'),
            canvas: document.getElementById('canvas'),
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            fps: document.getElementById('fps'),
            status: document.getElementById('status'),
            generalStatus: document.getElementById('generalStatus'),
            handCount: document.getElementById('handCount'),
            confidence: document.getElementById('confidence'),
            leftHandStatus: document.getElementById('leftHandStatus'),
            leftConfidence: document.getElementById('leftConfidence'),
            leftLandmarks: document.getElementById('leftLandmarks'),
            rightHandStatus: document.getElementById('rightHandStatus'),
            rightConfidence: document.getElementById('rightConfidence'),
            rightLandmarks: document.getElementById('rightLandmarks')
        };

        // Módulos
        this.detector = new HandDetector();
        this.renderer = new HandRenderer();

        // Estado
        this.state = {
            isRunning: false,
            cameraActive: false,
            lastFrameTime: 0,
            frameCount: 0,
            fps: 0,
            camera: null
        };

        // Configuración
        this.config = {
            targetFps: 30,
            frameInterval: 1000 / 30
        };

        // Bindear métodos
        this.startCamera = this.startCamera.bind(this);
        this.stopCamera = this.stopCamera.bind(this);
        this.processFrame = this.processFrame.bind(this);
    }

    /**
     * Inicializar la aplicación
     */
    async initialize() {
        console.log('🚀 Inicializando aplicación...');

        try {
            // Inicializar detector
            const detectorReady = await this.detector.initialize();
            if (!detectorReady) {
                this.updateStatus('Error: No se pudo inicializar el detector', true);
                return false;
            }

            // Inicializar renderer
            const rendererReady = this.renderer.initialize(this.elements.canvas);
            if (!rendererReady) {
                this.updateStatus('Error: No se pudo inicializar el renderer', true);
                return false;
            }

            // Configurar event listeners
            this.setupEventListeners();

            // Ajustar canvas
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());

            this.updateStatus('✅ Listo para iniciar', false);
            console.log('✅ Aplicación inicializada correctamente');
            return true;

        } catch (error) {
            console.error('❌ Error durante la inicialización:', error);
            this.updateStatus('Error: ' + error.message, true);
            return false;
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', this.startCamera);
        this.elements.stopBtn.addEventListener('click', this.stopCamera);

        // Detectar cuando el video está listo
        this.elements.video.addEventListener('loadedmetadata', () => {
            console.log('📹 Metadatos del video cargados');
            this.resizeCanvas();
        });
    }

    /**
     * Iniciar la cámara
     */
    async startCamera() {
        console.log('📹 Iniciando cámara...');

        try {
            // Solicitar acceso a la cámara
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });

            this.elements.video.srcObject = stream;
            this.state.cameraActive = true;
            this.state.isRunning = true;

            // Actualizar botones
            this.elements.startBtn.disabled = true;
            this.elements.stopBtn.disabled = false;

            this.updateStatus('🟢 Cámara activa', false);

            // Iniciar procesamiento
            this.processFrame();

        } catch (error) {
            console.error('❌ Error accediendo a la cámara:', error);
            let errorMsg = '❌ Error: ';

            if (error.name === 'NotAllowedError') {
                errorMsg += 'Permiso de cámara denegado';
            } else if (error.name === 'NotFoundError') {
                errorMsg += 'No se encontró cámara';
            } else {
                errorMsg += error.message;
            }

            this.updateStatus(errorMsg, true);
        }
    }

    /**
     * Detener la cámara
     */
    stopCamera() {
        console.log('⏹️ Deteniendo cámara...');

        if (this.state.cameraActive) {
            const stream = this.elements.video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }

        this.state.isRunning = false;
        this.state.cameraActive = false;

        // Actualizar botones
        this.elements.startBtn.disabled = false;
        this.elements.stopBtn.disabled = true;

        this.updateStatus('⏸️ Cámara detenida', false);
        this.renderer.clear();
        this.clearInfoPanel();

        console.log('✅ Cámara detenida');
    }

    /**
     * Procesar frames del video
     */
    async processFrame() {
        if (!this.state.isRunning) return;

        try {
            // Procesar con el detector
            const results = await this.detector.processFrame(this.elements.video);

            // Obtener información de las manos
            const handsInfo = this.detector.getHandsInfo();

            // Renderizar
            this.renderer.drawHands(handsInfo);

            // Actualizar información en pantalla
            this.updateInfoPanel(handsInfo);

            // Actualizar FPS
            this.updateFPS();

        } catch (error) {
            console.error('Error procesando frame:', error);
        }

        // Continuar con el siguiente frame
        requestAnimationFrame(() => this.processFrame());
    }

    /**
     * Actualizar panel de información
     */
    updateInfoPanel(handsInfo) {
        // Estado general
        this.elements.generalStatus.textContent = 
            handsInfo.count > 0 ? '🟢 Detectando' : '⚫ Esperando...';
        this.elements.handCount.textContent = handsInfo.count;

        // Calcular confianza promedio
        if (handsInfo.count > 0) {
            const avgConfidence = handsInfo.hands.reduce((sum, hand) => 
                sum + parseFloat(hand.confidence), 0) / handsInfo.count;
            this.elements.confidence.textContent = (avgConfidence * 100).toFixed(1) + '%';
        } else {
            this.elements.confidence.textContent = '---%';
        }

        // Información por mano
        handsInfo.hands.forEach((hand) => {
            if (hand.handedness === 'Right') {
                this.updateHandInfo(hand, 'right');
            } else {
                this.updateHandInfo(hand, 'left');
            }
        });

        // Limpiar mano no detectada
        if (!handsInfo.hands.find(h => h.handedness === 'Right')) {
            this.clearHandInfo('right');
        }
        if (!handsInfo.hands.find(h => h.handedness === 'Left')) {
            this.clearHandInfo('left');
        }
    }

    /**
     * Actualizar información de una mano
     */
    updateHandInfo(hand, side) {
        const prefix = side === 'right' ? 'right' : 'left';
        const statusEl = this.elements[`${prefix}HandStatus`];
        const confidenceEl = this.elements[`${prefix}Confidence`];
        const landmarksEl = this.elements[`${prefix}Landmarks`];

        // Estado
        statusEl.textContent = `🟢 Detectada`;

        // Confianza
        confidenceEl.textContent = (parseFloat(hand.confidence) * 100).toFixed(1) + '%';

        // Landmarks
        let landmarkHTML = '<div class="landmark-list">';
        
        // Mostrar puntos clave
        Object.entries(hand.keyPoints).forEach(([key, point]) => {
            landmarkHTML += `
                <div class="landmark-item">
                    <strong>${point.name}:</strong> 
                    X: ${point.x}% Y: ${point.y}% Z: ${point.z}
                </div>
            `;
        });

        landmarkHTML += '</div>';
        landmarksEl.innerHTML = landmarkHTML;
    }

    /**
     * Limpiar información de una mano
     */
    clearHandInfo(side) {
        const prefix = side === 'right' ? 'right' : 'left';
        this.elements[`${prefix}HandStatus`].textContent = '⚫ No detectada';
        this.elements[`${prefix}Confidence`].textContent = '---%';
        this.elements[`${prefix}Landmarks`].innerHTML = 
            `<p class="text-muted">Levanta tu mano ${side === 'right' ? 'derecha' : 'izquierda'}</p>`;
    }

    /**
     * Limpiar panel de información
     */
    clearInfoPanel() {
        this.elements.generalStatus.textContent = 'Esperando...';
        this.elements.handCount.textContent = '0';
        this.elements.confidence.textContent = '---%';
        this.clearHandInfo('left');
        this.clearHandInfo('right');
    }

    /**
     * Actualizar contador de FPS
     */
    updateFPS() {
        const now = performance.now();
        const deltaTime = now - this.state.lastFrameTime;

        if (deltaTime > 0) {
            this.state.frameCount++;

            // Actualizar cada 500ms
            if (this.state.frameCount >= 30) {
                this.state.fps = Math.round(1000 / (deltaTime / this.state.frameCount));
                this.elements.fps.textContent = `FPS: ${this.state.fps}`;
                this.state.frameCount = 0;
                this.state.lastFrameTime = now;
            }
        }
    }

    /**
     * Actualizar mensaje de estado
     */
    updateStatus(message, isError = false) {
        this.elements.status.textContent = message;
        this.elements.status.style.borderLeftColor = isError ? '#ff3366' : '#00ff88';
        this.elements.generalStatus.textContent = message;
    }

    /**
     * Redimensionar canvas al tamaño de la ventana
     */
    resizeCanvas() {
        const wrapper = this.elements.canvas.parentElement;
        if (wrapper) {
            const width = wrapper.offsetWidth;
            const height = wrapper.offsetHeight;
            this.renderer.resize(width, height);
        }
    }

    /**
     * Limpiar recursos
     */
    dispose() {
        this.stopCamera();
        this.detector.dispose();
        console.log('🧹 Recursos limpios');
    }
}

/**
 * Iniciar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎬 Iniciando aplicación...');
    window.app = new HandDetectionApp();
    const success = await window.app.initialize();

    if (!success) {
        console.error('❌ Falló la inicialización de la aplicación');
    }
});

/**
 * Limpiar recursos al cerrar la página
 */
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.dispose();
    }
});
