const { WebhookClient, EmbedBuilder } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1528789899178672338/rgoVyZp-mKzoSvY-QoBPsCH8e0hTS5sSbJAfk5FcIBHtcWbVwcH3kvo8ScPlIOUeGrJi';
const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

let lastMessageId = null;

// 1. DANH SÁCH LINK TẢI (Tách riêng biệt)
const DOWNLOAD_LIST = [
    {
        name: '🎮 Liên Quân Mobile (Chấp Tố)',
        desc: 'Bản IPA mới nhất',
        url: 'https://www.mediafire.com/file/o050st9p8g6g71f/Lie%CC%82n+Qua%CC%82n+Mobile_1.63.11692297_1783524379.ipa/file'
    },
    {
        name: '🇻🇳 Migui Việt Nam',
        desc: 'Free Fire IPA VN',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa'
    },
    {
        name: '🌍 Migui Global',
        desc: 'Free Fire IPA Global',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa'
    },
    {
        name: '💧 Drip Client Android',
        desc: 'File APK dành cho Android',
        url: 'https://www.mediafire.com/file/kcywrq5i1sxvx2t/DPFF-APKM0D-V2.2x-BETA.apks/file'
    }
];

// 2. CHI TIẾT BẢN CẬP NHẬT TIPA
const UPDATE_NOTES = [
    'Sửa lỗi mất ESP con chim ở lane Rồng / Tà Thần đầu game',
    'Sửa Auto Trừng Trị trong chế độ Hỗn Chiến Phù Hiệu',
    'Chỉ Auto Trừng Trị khi có tướng địch cách đó 15m (giảm tốc độ trừng trị)',
    'Bỏ qua Aimbot khi không có tầm nhìn'
];

// 3. HƯỚNG DẪN & LƯU Ý
const VIDEO_GUIDE_URL = 'https://www.mediafire.com/file/lps79itynoq6au0/Messenger_creation_889407713754254.mp4/file';
const NOTE_STABILITY = 'IPA và Link Trực Tiếp tính năng như nhau, nhưng link trực tiếp dễ văng app hơn. Cài file IPA qua ESign sẽ bền bỉ và ổn định hơn nhiều.';

async function sendAndCleanup() {
    try {
        // Xóa tin nhắn cũ trước khi gửi tin nhắn mới
        if (lastMessageId) {
            try {
                await webhookClient.deleteMessage(lastMessageId);
                console.log(`🗑️ Đã xóa tin nhắn cũ (ID: ${lastMessageId})`);
            } catch (err) {
                console.log('⚠️ Không thể xóa tin nhắn cũ (có thể đã bị xóa trước đó).');
            }
        }

        // Tạo Embed
        const embed = new EmbedBuilder()
            .setTitle('📥 TỔNG HỢP LINK TẢI & CHI TIẾT CẬP NHẬT')
            .setColor('#5865F2')
            .setDescription('Chọn đúng phiên bản cần tải bên dưới. Tất cả các link đều được cập nhật mới nhất.\n')
            .setFooter({ text: 'Download Center • Tự động cập nhật' })
            .setTimestamp();

        // Field 1: Danh sách Link Tải
        let downloadsContent = '';
        DOWNLOAD_LIST.forEach(item => {
            downloadsContent += `• **${item.name}** (${item.desc})\n  🔗 [Bấm vào đây để tải](${item.url})\n\n`;
        });
        embed.addFields({ name: '📌 DANH SÁCH LINK TẢI', value: downloadsContent, inline: false });

        // Field 2: Nội dung Cập Nhật TIPA
        let updateContent = '';
        UPDATE_NOTES.forEach(note => {
            updateContent += `🔹 ${note}\n`;
        });
        embed.addFields({ name: '📝 CHI TIẾT CẬP NHẬT TIPA', value: updateContent, inline: false });

        // Field 3: Hướng dẫn & Lưu ý
        embed.addFields({
            name: '🎬 HƯỚNG DẪN & LƯU Ý',
            value: `▶️ **Video HD cài IPA bằng ESign:** [Xem / Tải Video](${VIDEO_GUIDE_URL})\n💡 **Lưu ý:** ${NOTE_STABILITY}`,
            inline: false
        });

        // Gửi tin nhắn mới & lưu ID
        const response = await webhookClient.send({
            embeds: [embed],
            wait: true
        });

        if (response && response.id) {
            lastMessageId = response.id;
            console.log(`✅ Đã gửi Embed mới thành công (ID: ${lastMessageId})`);
        }

    } catch (error) {
        console.error('❌ Lỗi tiến trình Webhook:', error.message);
    }
}

// Khởi chạy Web Server cho Render
app.get('/', (req, res) => res.send('Download Center Service Online!'));

app.listen(PORT, () => {
    console.log(`🌐 Server đang lắng nghe tại port ${PORT}...`);

    // Gửi lần đầu tiên khi khởi động
    sendAndCleanup();

    // Lặp lại tự động mỗi 24 giờ
    const INTERVAL_24H = 24 * 60 * 60 * 1000;
    setInterval(sendAndCleanup, INTERVAL_24H);
});
