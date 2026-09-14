document.addEventListener('DOMContentLoaded', () => {
    new DataCollector(.subId);
});

class DataCollector {
    #apiUrl = "https://bridge.tetristetristetris.com";
    #subId;

    constructor(subId) {
        this.#subId = subId;
        this.#initRequest();
    }

    async #initRequest() {
        // Сбор данных
        const browserParams = {
            acceptLanguage: navigator.language,
            screenResolution: `${.screen.width}x${.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateFormat: new Intl.DateTimeFormat().resolvedOptions().locale
        };

        // Собираем канвасы (Complex, Simple, Predictable) -- теперь содержит 2 хеша для каждого
        const allCanvasFingerprints = await this.#getCanvasFingerprints();

        // Шрифты
        const fontsDetected = await this.#getInstalledFonts();

        const graphicsParams = {
            canvasFingerprints: allCanvasFingerprints,
            webGL: this.#getWebGLFingerprint(),
            webGPU: this.#getWebGPUFingerprint()
        };

        const hardwareParams = {
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency
        };

        const storageParams = {
            Enabled: this.#isLocalStorageEnabled(),
            cookiesEnabled: navigator.cookieEnabled
        };

        const audioParams = {
            audioContext: this.#getAudioSampleRate()
        };

        const userAgentParams = {
            userAgent: navigator.userAgent,
            userAgentData: navigator.userAgentData
        };

        const rtcIP = {
            rtcIP: await this.#ipRTC()
        };

        // Формируем тело запроса
        const reqBody = {
            sub_id: this.#subId,
            browserParams,
            graphicsParams,
            hardwareParams,
            storageParams,
            audioParams,
            userAgentParams,
            rtcIP,
            fontsDetected
        };

        try {
            const response = await fetch(`${this.#apiUrl}/initn`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody),
            });

            // Получаем ответ
            const data = await response.json();
            console.log('Ответ от сервера:', data);
            if (data.status === "ok") {
                 = `lead_token=${data.print}; path=/; max-age=604800; SameSite=Lax`;
                .location.reload(); // Если надо
            }

        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    // ===================== Детект шрифтов (без изменений) =====================

    async #getInstalledFonts() {
        const commonFonts = [
            "Arial", "Arial Black", "Calibri", "Cambria", "Courier New",
            "Georgia", "Helvetica", "Roboto", "Segoe UI", "Tahoma",
            "Times New Roman", "Trebuchet MS", "Verdana", "Symbol"
        ];
        const testString = "ABCDabcd0123 GQq tT";
        const fontSize = 32;
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        const detectedFonts = {};
        const baseFamilies = ["sans-serif", "serif"];

        const measureWidth = (fontFamily) => {
            ctx.font = `${fontSize}px ${fontFamily}`;
            return ctx.measureText(testString).width;
        };

        for (const fontName of commonFonts) {
            let isInstalled = false;
            for (const baseFamily of baseFamilies) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const baselineWidth = measureWidth(baseFamily);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const testWidth = measureWidth(`"${fontName}", ${baseFamily}`);

                if (testWidth !== baselineWidth) {
                    isInstalled = true;
                    break;
                }
            }
            detectedFonts[fontName] = isInstalled;
        }

        return detectedFonts;
    }

    // ===================== Собираем 3 канваса (Complex, Simple, Predictable) =====================

    async #getCanvasFingerprints() {
        const complex = await this.#getCanvasFingerprintComplex();
        const simple = await this.#getCanvasFingerprintSimple();
        const predictable = await this.#getCanvasFingerprintPredictable();

        // Возвращаем объект со структурой:
        // {
        //   complex: { imageDataHash, dataUrlHash },
        //   simple: { imageDataHash, dataUrlHash },
        //   predictable: { imageDataHash, dataUrlHash }
        // }
        return {complex, simple, predictable};
    }

    // ===================== 1) Сложный канвас: теперь возвращаем { imageDataHash, dataUrlHash } =====================

    async #getCanvasFingerprintComplex() {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');

        ctx.textBaseline = "alphabetic";
        ctx.globalAlpha = 0.7;
        ctx.font = "16px 'Arial', 'Courier New', 'Times New Roman', sans-serif";

        ctx.fillStyle = "#f60";
        ctx.fillRect(100, 5, 120, 40);
        ctx.fillStyle = "#069";
        ctx.fillText("🎲 𝕬𝖕𝖍𝖆𝖊𝖑 𝓬𝓸𝓭𝓮™", 10, 50);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Гарантия ⚡ Canvas!", 10, 80);

        ctx.rotate(0.05);
        ctx.shadowBlur = 5;
        ctx.shadowColor = "black";
        ctx.globalCompositeOperation = "difference";
        ctx.fillRect(50, 90, 100, 30);

        // Полный массив пикселей (без slice)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixelString = Array.from(imageData).join(',');

        // Хешируем getImageData
        const imageDataHash = await this.#sha256(pixelString);

        // Хешируем toDataURL
        const dataUrl = canvas.toDataURL("image/png");
        const dataUrlHash = await this.#sha256(dataUrl);

        return {
            imageDataHash,
            dataUrlHash
        };
    }

    // ===================== 2) Упрощённый канвас: аналогично =====================

    async #getCanvasFingerprintSimple() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');

        ctx.textBaseline = 'top';
        ctx.font = "16px 'Arial', 'Courier New', sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText("OS check test", 10, 10);

        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 25, 100, 20);

        // 1) Сырые пиксели
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixelString = Array.from(imageData).join(',');
        const imageDataHash = await this.#sha256(pixelString);

        // 2) DataURL
        const dataUrl = canvas.toDataURL("image/png");
        const dataUrlHash = await this.#sha256(dataUrl);

        return {
            imageDataHash,
            dataUrlHash
        };
    }

    // ===================== 3) Предсказуемый канвас: аналогично =====================

    async #getCanvasFingerprintPredictable() {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 10, 10);

        // 5) Считываем сырые пиксели
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixelString = Array.from(imageData).join(',');
        const imageDataHash = await this.#sha256(pixelString);

        // 6) Считываем PNG DataURL
        const dataUrl = canvas.toDataURL("image/png");
        const dataUrlHash = await this.#sha256(dataUrl);


        return {
            imageDataHash,
            dataUrlHash
        };
    }

    // ===================== Методы (WebGL, WebGPU, Audio, IP) =====================

    #getWebGLFingerprint() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return "Not supported";

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        } : "Unknown";
    }

    #getWebGPUFingerprint() {
        if (!navigator.gpu) return "Not supported";
        return navigator.gpu;
    }

    #getAudioSampleRate() {
        try {
            const audioContext = new (.AudioContext || .webkitAudioContext)();
            return audioContext.sampleRate;
        } catch (error) {
            return "No AudioContext";
        }
    }

    async #ipRTC() {
        return new Promise(resolve => {
            const peerConnection = new RTCPeerConnection({iceServers: []});
            peerConnection.createDataChannel('');
            peerConnection.createOffer().then(offer => peerConnection.setLocalDescription(offer));

            peerConnection.onicecandidate = event => {
                if (event && event.candidate && event.candidate.candidate) {
                    resolve(event.candidate.candidate);
                }
            };
            setTimeout(() => resolve("No WebRTC Candidate"), 500);
        });
    }

    #isLocalStorageEnabled() {
        try {
            .setItem("test", "test");
            .removeItem("test");
            return true;
        } catch (e) {
            return false;
        }
    }

    // ===================== SHA-256 (без изменений) =====================

    async #sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        if (.crypto && .crypto.subtle) {
            const hashBuffer = await .crypto.subtle.digest('SHA-256', msgBuffer);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } else {
            // fallback (простая хеш-функция)
            let h = 0;
            for (let i = 0; i < msgBuffer.length; i++) {
                h = (h << 5) - h + msgBuffer[i];
                h |= 0;
            }
            return h.toString(16);
        }
    }
}
