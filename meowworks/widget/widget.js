// AI Chat Widget for MeowChat
// Version 1.0.0

(function() {
    'use strict';

    // Default configuration
    const defaultConfig = {
        shopName: 'ร้านค้า',
        shopId: '',
        apiUrl: null,
        position: 'bottom-right',
        primaryColor: '#4F46E5',
        greeting: 'สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?'
    };

    // Demo responses for testing
    const demoResponses = [
        'มีค่ะ! สนใจสินค้าไหนเป็นพิเศษไหมคะ? 😊',
        'ขอบคุณที่สอบถามนะคะ ประเภทสินค้ามีหลายแบบเลยค่ะ',
        'ราคาเริ่มต้นที่ 350 บาทค่ะ สินค้าคุณภาพดีมากเลยค่ะ!',
        'จัดส่งภายใน 2-3 วันทำการค่ะ ส่งฟรีเกิน 500 บาทค่ะ!',
        'มีในสี ดำ น้ำเงิน เทา ขาว ค่ะ เลือกได้เลยค่ะ!',
        'ไซส์มี S M L XL ค่ะ วัดรอบอกได้เลยค่ะ!',
        'สนใจสั่งซื้อได้เลยค่ะ กดปุ่ม "สั่งซื้อ" ได้เลยค่ะ! 😊'
    ];

    class AIChatWidget {
        constructor(config) {
            this.config = { ...defaultConfig, ...config };
            this.isOpen = false;
            this.messages = [];
            this.init();
        }

        init() {
            this.createWidget();
            this.bindEvents();
            if (this.config.apiUrl) {
                this.loadChatHistory();
            }
        }

        createWidget() {
            const widget = document.getElementById('ai-chat-widget');
            if (widget) {
                widget.remove();
            }

            const widgetHTML = `
                <div id="ai-chat-widget" class="chat-widget" style="--primary-color: ${this.config.primaryColor}">
                    <button id="chat-toggle" class="chat-toggle">
                        <span class="chat-icon">💬</span>
                        <span class="chat-text">แชทกับเรา</span>
                    </button>
                    
                    <div id="chat-window" class="chat-window hidden">
                        <div class="chat-header">
                            <div class="chat-header-info">
                                <span class="chat-avatar">🤖</span>
                                <div>
                                    <div class="chat-title">${this.config.shopName}</div>
                                    <div class="chat-status">● ออนไลน์</div>
                                </div>
                            </div>
                            <button id="chat-close" class="chat-close">✕</button>
                        </div>
                        
                        <div id="chat-messages" class="chat-messages">
                            <div class="message bot-message">
                                <span class="message-avatar">🤖</span>
                                <div class="message-content">
                                    ${this.config.greeting}
                                </div>
                            </div>
                        </div>
                        
                        <div id="typing-indicator" class="typing-indicator hidden">
                            <span>🤖 กำลังพิมพ์...</span>
                        </div>
                        
                        <div class="chat-input">
                            <input type="text" id="message-input" placeholder="พิมข้อความ..." />
                            <button id="send-button">➤</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', widgetHTML);

            // Position
            const chatWidget = document.getElementById('ai-chat-widget');
            if (this.config.position === 'bottom-left') {
                chatWidget.style.left = '20px';
                chatWidget.style.right = 'auto';
            }
        }

        bindEvents() {
            const toggleBtn = document.getElementById('chat-toggle');
            const closeBtn = document.getElementById('chat-close');
            const sendBtn = document.getElementById('send-button');
            const input = document.getElementById('message-input');

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleChat());
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeChat());
            }

            if (sendBtn) {
                sendBtn.addEventListener('click', () => this.sendMessage());
            }

            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            }
        }

        toggleChat() {
            const window = document.getElementById('chat-window');
            const toggle = document.getElementById('chat-toggle');
            
            if (this.isOpen) {
                window.classList.add('hidden');
                toggle.classList.remove('hidden');
            } else {
                window.classList.remove('hidden');
                toggle.classList.add('hidden');
            }
            
            this.isOpen = !this.isOpen;
        }

        closeChat() {
            this.toggleChat();
        }

        sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if (!message) return;

            // Add user message
            this.addMessage(message, 'user');
            input.value = '';

            // Show typing indicator
            this.showTyping();

            // Get response
            setTimeout(() => {
                this.hideTyping();
                const response = this.getResponse(message);
                this.addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000);
        }

        addMessage(text, sender) {
            const messagesContainer = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            const avatar = sender === 'user' ? '👤' : '🤖';
            
            messageDiv.innerHTML = `
                <span class="message-avatar">${avatar}</span>
                <div class="message-content">${text}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Save to messages array
            this.messages.push({ sender, text, timestamp: Date.now() });
        }

        showTyping() {
            const indicator = document.getElementById('typing-indicator');
            indicator.classList.remove('hidden');
            
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        hideTyping() {
            const indicator = document.getElementById('typing-indicator');
            indicator.classList.add('hidden');
        }

        getResponse(userMessage) {
            // Demo mode - return random response
            if (!this.config.apiUrl) {
                const randomIndex = Math.floor(Math.random() * demoResponses.length);
                return demoResponses[randomIndex];
            }

            // Real API call
            return this.callAPI(userMessage);
        }

        async callAPI(message) {
            try {
                const response = await fetch(`${this.config.apiUrl}/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        shopId: this.config.shopId,
                        message: message,
                        history: this.messages
                    })
                });

                const data = await response.json();
                return data.response || 'ขอโทษค่ะ ขอตอบใหม่นะคะ';
            } catch (error) {
                console.error('Chat API Error:', error);
                return 'ขอโทษค่ะ มีปัญหาการเชื่อมต่อ ลองอีกครั้งนะคะ';
            }
        }

        async loadChatHistory() {
            if (!this.config.apiUrl) return;
            
            try {
                const response = await fetch(`${this.config.apiUrl}/api/chat/history?shopId=${this.config.shopId}`);
                const data = await response.json();
                
                if (data.messages) {
                    data.messages.forEach(msg => {
                        this.addMessage(msg.text, msg.sender);
                    });
                }
            } catch (error) {
                console.error('Load history error:', error);
            }
        }
    }

    // Export to window
    window.AIChatWidget = {
        init: function(config) {
            return new AIChatWidget(config);
        }
    };

    // Auto-init if data attributes present
    document.addEventListener('DOMContentLoaded', function() {
        const widget = document.querySelector('[data-ai-chat]');
        if (widget) {
            window.AIChatWidget.init({
                shopName: widget.dataset.shopName || 'ร้านค้า',
                shopId: widget.dataset.shopId || '',
                apiUrl: widget.dataset.apiUrl || null
            });
        }
    });
})();
