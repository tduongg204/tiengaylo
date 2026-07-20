const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const app = express();

const webhookClient = new WebhookClient({ 
    url: 'https://discord.com/api/webhooks/1528789899178672338/rgoVyZp-mKzoSvY-QoBPsCH8e0hTS5sSbJAfk5FcIBHtcWbVwcH3kvo8ScPlIOUeGrJi' 
});

// Biến lưu ID của tin nhắn vừa gửi gần nhất
let lastMessageId = null;

async function sendAndCycleWebhook() {
    try {
        // 1. Nếu đã có tin nhắn từ lần gửi trước, tiến hành xóa
        if (lastMessageId) {
            try {
                await webhookClient.deleteMessage(lastMessageId);
                console.log(`🗑️ Đã xóa tin nhắn cũ (ID: ${lastMessageId})`);
            } catch (err) {
                console.error('⚠️ Không thể xóa tin nhắn cũ (có thể đã bị xóa thủ công):', err.message);
            }
        }

        // 2. Cấu trúc bảng & Embed
        const tableString = `\`\`\`\n┌──────────────────────┬──────────────────────┐\n│ Sản Phẩm             │ 📥 Link Download     │\n├──────────────────────┼──────────────────────┤\n│ Migul VN             │ Bấm Vào Đây          │\n├──────────────────────┼──────────────────────┤\n│ Migul Global         │ Bấm Vào Đây          │\n└──────────────────────┴──────────────────────┘\n\`\`\``;

        const embed = new EmbedBuilder()
            .setTitle('📥 Download Migul iOS')
            .setColor('#4A90E2')
            .setDescription(`Chọn đúng phiên bản bạn cần tải.\n\n${tableString}`)
            .setFooter({ text: 'Migul iOS • Latest Version' })
            .setTimestamp();

        const btnVN = new ButtonBuilder()
            .setLabel('🇻🇳 Migul VN')
            .setStyle(ButtonStyle.Link)
            .setURL('https://l.messenger.com/l.php?u=https%3A%2F%2Fcdn.authtool.app%2Fuser_39QQInVf1DKz83SmVKQApc9ewdV%2Fipa%2F1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa&h=AUAyM5eN-tLE6sLsZ2hv7HVCAnsWNV2WxLWRz1GjDyl1h_89b3939f-yjLQfchJfSPy0k3P9bZr79Mx0ifHVINx3UU-4pUIKfCrJSzcyFmAXh9XEBJCKstiA8xhGkzXC6-euyA');

        const btnGlobal = new ButtonBuilder()
            .setLabel('🌍 Migul Global')
            .setStyle(ButtonStyle.Link)
            .setURL('https://l.messenger.com/l.php?u=https%3A%2F%2Fcdn.authtool.app%2Fuser_39QQInVf1DKz83SmVKQApc9ewdV%2Fipa%2F1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa&h=AUAyM5eN-tLE6sLsZ2hv7HVCAnsWNV2WxLWRz1GjDyl1h_89b3939f-yjLQfchJfSPy0k3P9bZr79Mx0ifHVINx3UU-4pUIKfCrJSzcyFmAXh9XEBJCKstiA8xhGkzXC6-euyA');

        const actionRow = new ActionRowBuilder().addComponents(btnVN, btnGlobal);

        // 3. Gửi tin nhắn mới (bắt buộc có wait: true để trả về object tin nhắn)
        const sentMessage = await webhookClient.send({ 
            embeds: [embed], 
            components: [actionRow],
            wait: true
        });

        // Lưu lại ID để xóa ở chu kỳ tiếp theo
        lastMessageId = sentMessage.id;
        console.log(`✅ Đã gửi tin nhắn mới (ID: ${lastMessageId})`);

    } catch (error) {
        console.error('❌ Lỗi tiến trình Webhook:', error);
    }
}

// Server giữ kết nối port trên Render
app.get('/', (req, res) => res.send('Webhook Auto-Cycle Service Online'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Server đang chạy trên port ${PORT}...`);

    // Gửi ngay lần đầu tiên khi dịch vụ khởi động
    sendAndCycleWebhook();

    // Lặp lại sau mỗi 24 giờ (24 * 60 * 60 * 1000 ms)
    const INTERVAL_24H = 24 * 60 * 60 * 1000;
    setInterval(sendAndCycleWebhook, INTERVAL_24H);
});
