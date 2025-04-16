class QRManager {
    static scanner = null;

    static initialize() {
        this.setupScanner();
        if (StorageManager.isRegistered()) {
            this.generateUserQR();
        }
    }

    static setupScanner() {
        this.scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: QR_CONFIG.fps,
                qrbox: QR_CONFIG.qrbox,
                aspectRatio: QR_CONFIG.aspectRatio,
                rememberLastUsedCamera: true,
            }
        );

        this.scanner.render(this.handleScan.bind(this), this.handleError.bind(this));
    }

    static async handleScan(decodedText) {
        try {
            const scannedData = JSON.parse(decodedText);
            
            // Validate scanned data
            if (!scannedData.userId || !scannedData.name) {
                throw new Error('Geçersiz QR kod');
            }

            const userData = StorageManager.getUserData();
            if (!userData) {
                NotificationManager.error('Önce kayıt olmalısınız!');
                return;
            }

            // Check if scanning own QR code
            if (scannedData.userId === userData.userId) {
                NotificationManager.error('Kendi QR kodunuzu tarayamazsınız!');
                return;
            }

            // Use the LocalApiService to add connection
            const response = await LocalApiService.addConnection(userData.userId, scannedData.userId);
            
            if (!response.success) {
                throw new Error(response.error);
            }
            
            // Update local user data
            StorageManager.saveUserData(response.user);
            
            // Update UI
            ProfileManager.updatePoints(response.user.points);
            LeaderboardManager.updateLeaderboard();
            
            // Show success notification with point information
            const connectionName = response.connection.name;
            NotificationManager.success(`${connectionName} ile bağlantı kuruldu! +${POINTS.NEW_CONNECTION} puan kazandınız!`);
            
            // Show bonus notifications if applicable
            if (response.user.connections.length === 5) {
                NotificationManager.success('Tebrikler! İlk 5 bağlantı bonusu kazandınız! +20 puan');
            } else if (response.user.connections.length === 10) {
                NotificationManager.success('Tebrikler! İlk 10 bağlantı bonusu kazandınız! +50 puan');
            }

        } catch (error) {
            NotificationManager.error('Geçersiz QR kod: ' + error.message);
        }
    }

    static handleError(error) {
        console.error(error);
    }

    static generateUserQR() {
        const userData = StorageManager.getUserData();
        if (!userData) return;

        const qrData = {
            userId: btoa(userData.email),
            name: userData.name,
            linkedin: userData.linkedin
        };

        const qrUrl = `${API.QR_GENERATOR}?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
        
        const qrContainer = document.getElementById('user-qr');
        const qrImage = document.createElement('img');
        qrImage.src = qrUrl;
        qrImage.alt = 'Your QR Code';
        qrImage.className = 'scale-in';
        
        qrContainer.innerHTML = '';
        qrContainer.appendChild(qrImage);
    }

    static stopScanner() {
        if (this.scanner) {
            this.scanner.clear();
        }
    }

    static restartScanner() {
        this.stopScanner();
        this.setupScanner();
    }
}

// Initialize QR manager
QRManager.initialize(); 