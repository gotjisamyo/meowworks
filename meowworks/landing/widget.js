// MeowChat Web Widget
(function() {
  // Configuration
  const config = {
    shopId: null,
    apiUrl: 'http://localhost:3001',
    position: 'bottom-right',
    primaryColor: '#EC4899'
  };

  // Load configuration from data attributes
  const widgetDiv = document.getElementById('meowchat-widget');
  if (widgetDiv) {
    config.shopId = widgetDiv.getAttribute('data-shop-id') || localStorage.getItem('shopId');
    config.position = widgetDiv.getAttribute('data-position') || 'bottom-right';
    config.primaryColor = widgetDiv.getAttribute('data-color') || '#EC4899';
  }

  // Create widget HTML
  function createWidget() {
    // Check if widget already exists
    if (document.getElementById('meowchat-widget-container')) {
      return;
    }

    const widget = document.createElement('div');
    widget.id = 'meowchat-widget-container';
    widget.innerHTML = `
      <style>
        #meowchat-widget-container {
          position: fixed;
          ${config.position.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
          ${config.position.includes('right') ? 'right: 20px' : 'left: 20px'};
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #meowchat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${config.primaryColor}, #4ECDC4);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          transition: transform 0.3s;
        }
        #meowchat-toggle:hover {
          transform: scale(1.1);
        }
        #meowchat-chat {
          display: none;
          position: absolute;
          ${config.position.includes('bottom') ? 'bottom: 80px' : 'top: 80px'};
          ${config.position.includes('right') ? 'right: 0' : 'left: 0'};
          width: 350px;
          height: 450px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.2);
          overflow: hidden;
          flex-direction: column;
        }
        #meowchat-chat.open {
          display: flex;
        }
        #meowchat-header {
          background: linear-gradient(135deg, ${config.primaryColor}, #4ECDC4);
          color: white;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        #meowchat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background: #f5f5f5;
        }
        .meowchat-message {
          margin-bottom: 10px;
          max-width: 80%;
        }
        .meowchat-message.bot {
          margin-right: auto;
        }
        .meowchat-message.user {
          margin-left: auto;
          text-align: right;
        }
        .meowchat-bubble {
          display: inline-block;
          padding: 10px 15px;
          border-radius: 15px;
          font-size: 14px;
        }
        .meowchat-message.bot .meowchat-bubble {
          background: white;
          border-bottom-left-radius: 2px;
        }
        .meowchat-message.user .meowchat-bubble {
          background: ${config.primaryColor};
          color: white;
          border-bottom-right-radius: 2px;
        }
        #meowchat-input {
          padding: 15px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
        }
        #meowchat-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
        }
        #meowchat-input input:focus {
          border-color: ${config.primaryColor};
        }
        #meowchat-input button {
          background: ${config.primaryColor};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
        }
        #meowchat-login {
          padding: 30px;
          text-align: center;
        }
        #meowchat-login input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        #meowchat-login button {
          width: 100%;
          background: ${config.primaryColor};
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        @media (max-width: 480px) {
          #meowchat-chat {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
          }
        }
      </style>
      
      <button id="meowchat-toggle">🐱</button>
      
      <div id="meowchat-chat">
        <div id="meowchat-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">🐱</span>
            <div>
              <div style="font-weight: bold;">MeowChat</div>
              <div style="font-size: 12px; opacity: 0.8;">Online</div>
            </div>
          </div>
          <button id="meowchat-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        
        <div id="meowchat-messages">
          <div class="meowchat-message bot">
            <div class="meowchat-bubble">
              สวัสดีค่ะ! 🐱<br>
              ยินดีต้อนรับสู่ MeowChat<br>
              มีอะไรให้ช่วยไหมคะ?
            </div>
          </div>
        </div>
        
        <div id="meowchat-login" style="display: none;">
          <h3>เข้าสู่ระบบ</h3>
          <input type="text" id="meowchat-phone" placeholder="เบอร์โทร">
          <input type="password" id="meowchat-password" placeholder="รหัสผ่าน">
          <button id="meowchat-login-btn">เข้าสู่ระบบ</button>
        </div>
        
        <div id="meowchat-input">
          <input type="text" id="meowchat-message-input" placeholder="พิมพ์ข้อความ...">
          <button id="meowchat-send">ส่ง</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    // Add event listeners
    document.getElementById('meowchat-toggle').addEventListener('click', toggleChat);
    document.getElementById('meowchat-close').addEventListener('click', toggleChat);
    document.getElementById('meowchat-send').addEventListener('click', sendMessage);
    document.getElementById('meowchat-message-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
    document.getElementById('meowchat-login-btn').addEventListener('click', login);
  }

  function toggleChat() {
    const chat = document.getElementById('meowchat-chat');
    chat.classList.toggle('open');
  }

  function login() {
    const phone = document.getElementById('meowchat-phone').value;
    const password = document.getElementById('meowchat-password').value;
    
    // Simple login (in production, use proper API)
    if (phone && password) {
      localStorage.setItem('meowchat_user', phone);
      document.getElementById('meowchat-login').style.display = 'none';
      document.getElementById('meowchat-messages').style.display = 'block';
      addMessage('bot', '✅ เข้าสู่ระบบสำเร็จค่ะ! ยินดีต้อนรับ 💕');
    }
  }

  function sendMessage() {
    const input = document.getElementById('meowchat-message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage('user', message);
    input.value = '';
    
    // Send to API
    if (config.shopId) {
      fetch(`${config.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          shopId: config.shopId,
          userId: localStorage.getItem('meowchat_user') || 'anonymous'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.reply) {
          addMessage('bot', data.reply);
        } else {
          addMessage('bot', 'ขอโทษค่ะ มีปัญหา ลองอีกครั้งนะคะ 💕');
        }
      })
      .catch(err => {
        addMessage('bot', 'ขอโทษค่ะ มีปัญหาในการเชื่อมต่อ 💕');
      });
    } else {
      // Demo mode - random responses
      setTimeout(() => {
        const responses = [
          'ขอบคุณที่ติดต่อมาค่ะ! 💕',
          'เราจะช่วยหาข้อมูลให้นะคะ...',
          'มีอะไรให้ช่วยอีกไหมคะ?',
          'สนใจสินค้าไหนเป็นพิเศษคะ?'
        ];
        const random = responses[Math.floor(Math.random() * responses.length)];
        addMessage('bot', random);
      }, 1000);
    }
  }

  function addMessage(type, text) {
    const messages = document.getElementById('meowchat-messages');
    const div = document.createElement('div');
    div.className = `meowchat-message ${type}`;
    div.innerHTML = `<div class="meowchat-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
