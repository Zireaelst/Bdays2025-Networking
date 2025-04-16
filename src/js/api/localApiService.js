/**
 * LocalApiService - Simulates a backend service using localStorage
 * This will be replaced with AWS Lambda calls in the future
 */
class LocalApiService {
    // Private storage keys
    static #KEYS = {
        USERS: 'bd25_users',
        QR_CODES: 'bd25_qr_codes'
    };

    /**
     * Initialize the service
     */
    static initialize() {
        // Create initial storage if not exists
        if (!localStorage.getItem(this.#KEYS.USERS)) {
            localStorage.setItem(this.#KEYS.USERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.#KEYS.QR_CODES)) {
            localStorage.setItem(this.#KEYS.QR_CODES, JSON.stringify({}));
        }
        console.log('LocalApiService initialized');
    }

    /**
     * Register a new user
     * @param {Object} userData - User data to register
     * @returns {Promise<Object>} - Registered user data with generated QR
     */
    static async registerUser(userData) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Get existing users
                    const users = JSON.parse(localStorage.getItem(this.#KEYS.USERS) || '[]');

                    // Check if the user is new or updating
                    const existingUserIndex = users.findIndex(user => user.email === userData.email);

                    if (existingUserIndex === -1) {
                        // New user registration
                        // Check if email already exists
                        if (users.some(user => user.email === userData.email)) {
                            throw new Error('Bu e-posta adresi zaten kayıtlı');
                        }

                        // Add userId
                        const newUser = {
                            ...userData,
                            userId: this.#generateUserId(userData.email),
                            registeredAt: new Date().toISOString(),
                            connections: [],
                            points: 0
                        };

                        // Generate QR code
                        const qrCode = this.#generateQRCode(newUser);

                        // Save user
                        users.push(newUser);
                        localStorage.setItem(this.#KEYS.USERS, JSON.stringify(users));

                        // Return response with QR code
                        resolve({
                            success: true,
                            user: newUser,
                            qrCode
                        });
                    } else {
                        // Update existing user
                        const existingUser = users[existingUserIndex];

                        // Update only the fields that are provided
                        users[existingUserIndex] = {
                            ...existingUser,
                            ...userData // Merge existing user data with new data
                        };

                        // Save updated user
                        localStorage.setItem(this.#KEYS.USERS, JSON.stringify(users));

                        // Return response with updated user
                        resolve({
                            success: true,
                            user: users[existingUserIndex],
                            qrCode: this.#generateQRCode(users[existingUserIndex]) // Generate new QR code if needed
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, 300); // 300ms delay to simulate network
        });
    }

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - User data
     */
    static async getUserById(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem(this.#KEYS.USERS) || '[]');
                    const user = users.find(u => u.userId === userId);
                    
                    if (!user) {
                        throw new Error('Kullanıcı bulunamadı');
                    }
                    
                    resolve({
                        success: true,
                        user
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, 100);
        });
    }

    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise<Object>} - User data
     */
    static async getUserByEmail(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem(this.#KEYS.USERS) || '[]');
                    const user = users.find(u => u.email === email);
                    
                    if (!user) {
                        throw new Error('Kullanıcı bulunamadı');
                    }
                    
                    resolve({
                        success: true,
                        user
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, 100);
        });
    }

    /**
     * Get user QR code
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - QR code data
     */
    static async getUserQR(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const qrCodes = JSON.parse(localStorage.getItem(this.#KEYS.QR_CODES) || '{}');
                    const qrCode = qrCodes[userId];
                    
                    if (!qrCode) {
                        throw new Error('QR kodu bulunamadı');
                    }
                    
                    resolve({
                        success: true,
                        qrCode
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, 100);
        });
    }

    /**
     * Add connection between users
     * @param {string} userId - User ID
     * @param {string} connectionId - Connection ID to add
     * @returns {Promise<Object>} - Updated user data
     */
    static async addConnection(userId, connectionId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem(this.#KEYS.USERS) || '[]');
                    
                    // Find user and connection
                    const userIndex = users.findIndex(u => u.userId === userId);
                    const connectionIndex = users.findIndex(u => u.userId === connectionId);
                    
                    if (userIndex === -1 || connectionIndex === -1) {
                        throw new Error('Kullanıcı veya bağlantı bulunamadı');
                    }
                    
                    // Check if already connected
                    if (users[userIndex].connections.includes(connectionId)) {
                        throw new Error('Bu kişiyle zaten bağlantı kurdunuz');
                    }
                    
                    // Add connection and update points
                    users[userIndex].connections.push(connectionId);
                    users[userIndex].points += POINTS.NEW_CONNECTION;
                    
                    // Check for bonus points
                    if (users[userIndex].connections.length === 5) {
                        users[userIndex].points += POINTS.BONUS_FIRST_FIVE;
                    } else if (users[userIndex].connections.length === 10) {
                        users[userIndex].points += POINTS.BONUS_FIRST_TEN;
                    }
                    
                    // Save updated users
                    localStorage.setItem(this.#KEYS.USERS, JSON.stringify(users));
                    
                    resolve({
                        success: true,
                        user: users[userIndex],
                        connection: users[connectionIndex]
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, 300);
        });
    }

    /**
     * Get leaderboard
     * @returns {Promise<Object>} - Leaderboard data
     */
    static async getLeaderboard() {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem(this.#KEYS.USERS) || '[]');
                    
                    // Create leaderboard with minimal data
                    const leaderboard = users
                        .map(user => ({
                            userId: user.userId,
                            name: user.name,
                            points: user.points,
                            connections: user.connections.length,
                            linkedin: user.linkedin
                        }))
                        .sort((a, b) => b.points - a.points); // Sort by points descending
                    
                    resolve({
                        success: true,
                        leaderboard
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, 200);
        });
    }

    /**
     * Generate unique user ID from email
     * @param {string} email - User email
     * @returns {string} - Unique ID
     * @private
     */
    static #generateUserId(email) {
        // Use a combination of btoa and timestamp for uniqueness
        const timestamp = new Date().getTime().toString(36);
        return btoa(email) + '-' + timestamp;
    }

    /**
     * Generate QR code for user
     * @param {Object} user - User data
     * @returns {string} - QR code data URL or API URL
     * @private
     */
    static #generateQRCode(user) {
        // Create QR data
        const qrData = {
            userId: user.userId,
            name: user.name,
            linkedin: user.linkedin || ''
        };
        
        // Generate QR code URL
        const qrUrl = `${API.QR_GENERATOR}?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
        
        // Store QR code
        const qrCodes = JSON.parse(localStorage.getItem(this.#KEYS.QR_CODES) || '{}');
        qrCodes[user.userId] = qrUrl;
        localStorage.setItem(this.#KEYS.QR_CODES, JSON.stringify(qrCodes));
        
        return qrUrl;
    }
}

// Initialize the service when script is loaded
LocalApiService.initialize(); 