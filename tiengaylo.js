const { WebhookClient, EmbedBuilder } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Khởi tạo Webhook Client
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1528458052884234393/XKgLKDRQ4SRzkKO0TNVgljpdEWxTVPQLWRsxe71kqAga126QPIxXSuNAX9s6SEHe28-u';
const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

// Biến toàn cục lưu ID tin nhắn gần nhất
let lastMessageId = null;

// Danh sách sản phẩm & link tải
const PRODUCTS = [
    {
        title: '🇻🇳 Migui Việt Nam',
        description: 'Dành cho người chơi tại Việt Nam',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa',
        active: true
    },
    {
        title: '🌍 Migui Global',
        description: 'Dành cho người chơi quốc tế',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa',
        active: true
    },
    {
        title: '💧 Drip Client Android',
        description: 'APK dành cho Android',
        url: 'https://www.mediafire.com/file/kcywrq5i1sxvx2t/DPFF-APKM0D-V2.2x-BETA.apks/file',
        active: true
    },
    {
        title: '🚧 Đang cập nhật...',
        description: 'Sản phẩm mới sẽ sớm ra mắt',
        url: null,
        active: false
    },
    {
        title: '🚧 Đang cập nhật...',
        description: 'Sản phẩm mới sẽ sớm ra mắt',
        url: null,
        active: false
    },
    {
        title: '🚧 Đang cập nhật...',
        description: 'Sản phẩm mới sẽ sớm ra mắt',
        url: null,
        active: false
    }
];

async function sendAndCleanup() {
    try {
        // 1. Nếu đã có lastMessageId, tiến hành xóa tin nhắn cũ
        if (lastMessageId) {
            try {
                await webhookClient.deleteMessage(lastMessageId);
                console.log(`🗑️ Đã xóa tin nhắn cũ (ID: ${lastMessageId})`);
            } catch (err) {
                console.log('⚠️ Không thể xóa tin nhắn cũ (có thể đã bị xóa trước đó).');
            }
        }

        // 2. Tạo giao diện Embed với đường link xanh bấm trực tiếp
        const embed = new EmbedBuilder()
            .setTitle('📥 DOWNLOAD MIGUI IOS')
            .setColor('#5865F2')
            .setDescription(
                'Chọn đúng phiên bản bạn cần tải bên dưới.\n\n' +
                '✅ **Luôn cập nhật bản mới nhất**\n' +
                '⚡ **Tốc độ tải nhanh**'
            )
            .setFooter({ text: 'Migui Download Center' })
            .setTimestamp();

        PRODUCTS.forEach(product => {
            if (product.active) {
                embed.addFields({
                    name: product.title,
                    value: `> ${product.description}\n🔗 **Link tải:** [Bấm vào đây để tải](${product.url})`,
                    inline: false
                });
            } else {
                embed.addFields({
                    name: product.title,
                    value: `> ${product.description}`,
                    inline: false
                });
            }
        });

        // 3. Gửi tin nhắn mới (truyền wait: true để lấy thông tin response)
        const response = await webhookClient.send({
            embeds: [embed],
            wait: true
        });

        // 4. Lưu lại ID của tin nhắn vừa gửi
        if (response && response.id) {
            lastMessageId = response.id;
            console.log(`✅ Đã gửi tin nhắn mới thành công (ID: ${lastMessageId})`);
        }

    } catch (error) {
        console.error('❌ Lỗi tiến trình Webhook:', error.message);
    }
}

// Web Server giữ kết nối cho Render
app.get('/', (req, res) => res.send('Migui Download Center Service is Online!'));

app.listen(PORT, () => {
    console.log(`🌐 Server đang lắng nghe tại port ${PORT}...`);

    // Chạy lần đầu ngay khi khởi động
    sendAndCleanup();

    // Lặp lại quá trình xóa & gửi mới sau mỗi 60 giây
    const INTERVAL_60S = 60 * 1000;
    setInterval(sendAndCleanup, INTERVAL_60S);
});
