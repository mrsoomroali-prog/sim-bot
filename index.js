const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const http = require('http');

// --- 1. 24/7 UPTIME SERVER ---
http.createServer((req, res) => {
    res.write("SIM DATABASE BOT IS RUNNING 24/7 BY SIM DETAILS OFFICIAL");
    res.end();
}).listen(8080);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Mr khan bhai, QR Code scan karein!');
});

client.on('ready', () => {
    console.log('🚀 SIM DETAILS OFFICIAL (2026) Online!');
});

client.on('message', async (msg) => {
    const message = msg.body.trim().replace(/-/g, "");
    const sender = msg.from;

    // --- 2. ADMIN REPLY SYSTEM (Aapka Number: 447455680379) ---
    if (sender.includes("447455680379") && message.startsWith("reply ")) {
        const parts = message.split(" ");
        const target = parts[1].includes("@c.us") ? parts[1] : `${parts[1]}@c.us`;
        const replyText = parts.slice(2).join(" ");
        client.sendMessage(target, `🛡️ *SIM DETAILS OFFICIAL:* \n\n${replyText}`);
        msg.reply("✅ User ko reply bhej diya gaya!");
        return;
    }

    // --- 3. MENU SYSTEM ---
    if (message === "1" || message.toLowerCase() === "menu" || message.toLowerCase() === "hi") {
        let menu = "✨ *SIM DETAILS OFFICIAL (2026)* ✨\n\n";
        menu += "📍 *1️⃣ SIM Tracker* (11 Digits)\n";
        menu += "🆔 *2️⃣ CNIC Details* (13 Digits)\n";
        menu += "🌳 *3️⃣ Family Tree* (VIP)\n";
        menu += "📸 *4️⃣ CNIC Photo* (Original)\n";
        menu += "🚗 *5️⃣ Vehicle Tracking*\n";
        menu += "💬 *6️⃣ Live Chat* (Admin)\n\n";
        menu += "━━━━━━━━━━━━━━━━━━━\n";
        menu += "💡 *Note:* Number ya CNIC bhej kar search karein.";
        msg.reply(menu);
        return;
    } 

    // --- 4. DATA SEARCH ---
    else if (!isNaN(message) && (message.length === 11 || message.length === 13)) {
        const apiConfig = { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } };
        msg.reply("🔍 *Searching Database...*");
        
        try {
            const endpoint = message.length === 11 ? `num=${message}` : `cnic=${message}`;
            const response = await axios.get(`https://api.cnic.pro/?${endpoint}`, apiConfig);
            const user = response.data;

            if (user && user.name) {
                let result = "✅ *RECORD FOUND*\n\n";
                result += `👤 *Name:* ${user.name}\n`;
                result += `🆔 *CNIC:* ${user.cnic}\n`;
                result += `🏠 *Address:* ${user.address}\n\n`;
                result += "⭐ *Powered by SIM DETAILS OFFICIAL*";
                msg.reply(result);
            } else {
                msg.reply(`❌ *Record Not Found!*\n\nVIP Data ke liye Admin se rabta karein:\n👉 https://wa.me/447455680379`);
            }
        } catch (e) { 
            msg.reply("⚠️ Server busy hai! Rabta: wa.me/447455680379"); 
        }
        return;
    }

    // --- 5. FORWARDING TO ADMIN (Direct Number Fixed) ---
    else if (!sender.includes("447455680379")) {
        // User ko Auto-Reply
        msg.reply("👋 *SIM DETAILS OFFICIAL* mein khush-amdeed!\n\nAapka message Admin ko forward kar diya gaya hai. Intezar karein ya '1' likh kar Menu check karein.");

        // Aapko (Admin) Message Forwarding
        const forwardMsg = `📩 *NEW USER MESSAGE*\n\n*User:* ${sender.replace('@c.us', '')}\n*Text:* ${message}\n\n━━━━━━━━━━━━━━━━━━━\n*Reply likhein:* reply ${sender.replace('@c.us', '')} [Aapka Jawab]`;
        
        // Yahan maine direct aapka number dal diya hai:
        client.sendMessage("447455680379@c.us", forwardMsg);
    }
});

client.initialize();
