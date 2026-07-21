const { WebhookClient, EmbedBuilder } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1528789899178672338/rgoVyZp-mKzoSvY-QoBPsCH8e0hTS5sSbJAfk5FcIBHtcWbVwcH3kvo8ScPlIOUeGrJi';
const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

let lastMessageId = null;

// ==========================================
// 1. DANH SÁCH LINK TẢI FREE FIRE
// ==========================================
const FF_DOWNLOADS = [
    {
        name: '⚔️ FF Darksword IPA (Menu Rời)',
        desc: 'Hỗ trợ iOS 17.1 - 18.7.1 & iOS 26.0 - 26.0.1 | Aimbot, ESP, Ẩn Hack (Antiban Cao)',
        url: 'https://www.mediafire.com/file/sr7n8xn7uu9ro11/FFDarksword.ipa/file'
    },
    {
        name: '🔥 TIPA IOSViet (Lửa Chùa 1.126.1)',
        desc: 'Bản TIPA IOSViet mượt mà ổn định',
        url: 'https://www.mediafire.com/file/zbx65s1b0pl166g/Lu%CC%9B%CC%89a+chu%CC%80a-1.126.1.tipa/file'
    },
    {
        name: '🛡️ TIPA SUDO FF THƯỜNG (Menu Rời)',
        desc: 'Bản TIPA Sudo menu rời chuyên dụng',
        url: 'https://www.mediafire.com/file/6ng4cy3s6n2h0yr/FF_Exsudo.tipa/file'
    },
    {
        name: '🇻🇳 MIGUL Việt Nam IPA',
        desc: 'Free Fire IPA Server VN',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa'
    },
    {
        name: '🌍 MIGUL Global IPA',
        desc: 'Free Fire IPA Server Global',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa'
    },
    {
        name: '💧 Drip Client Android',
        desc: 'File APK dành riêng cho máy Android',
        url: 'https://www.mediafire.com/file/7666056zfyw1gwa/DPFF-APKM0D-v2.3x-BETA.apks/file'
    }
];

// ==========================================
// 2. LIÊN QUÂN MOBILE & LOG CẬP NHẬT
// ==========================================
const LQ_DOWNLOAD = {
    name: '🎮 Liên Quân Mobile (Chấp Tố)',
    desc: 'Bản IPA Liên Quân Chấp Tố mới nhất',
    url: 'https://www.mediafire.com/file/o050st9p8g6g71f/Lie%CC%82n+Qua%CC%82n+Mobile_1.63.11692297_1783524379.ipa/file'
};

const LQ_UPDATE_NOTES = [
    'Sửa lỗi mất ESP con chim ở lane Rồng / Tà Thần đầu game',
    'Sửa Auto Trừng Trị trong chế độ Hỗน Chiến Phù Hiệu',
    'Chỉ Auto Trừng Trị khi có tướng địch cách đó 15m (giảm tốc độ trừng trị)',
    'Bỏ qua Aimbot khi không có tầm nhìn'
];

// ==========================================
// 3. HƯỚNG DẪN & LƯU Ý
// ==========================================
const VIDEO_GUIDE_URL = 'https://www.mediafire.com/file/lps79itynoq6au0/Messenger_creation_889407713754254.mp4/file';
const NOTE_STABILITY = 'IPA và Link Trực Tiếp tính năng như nhau, nhưng link trực tiếp dễ văng app hơn. Cài file IPA qua ESign sẽ bền bỉ và ổn định hơn nhiều.';

async function sendAndCleanup() {
    try {
        // Xóa tin nhắn cũ trước khi gửi
        if (lastMessageId) {
            try {
                await webhookClient.deleteMessage(lastMessageId);
                console.log(`🗑️ Đã xóa tin nhắn cũ (ID: ${lastMessageId})`);
            } catch (err) {
                console.log('⚠️ Không thể xóa tin nhắn cũ (có thể đã bị xóa thủ công).');
            }
        }

        // --- EMBED 1: DÀNH CHO FREE FIRE ---
        let ffContent = 'Chọn đúng bản Free Fire bạn cần tải bên dưới:\n\n';
        FF_DOWNLOADS.forEach(item => {
            ffContent += `• **${item.name}**\n  📌 *${item.desc}*\n  🔗 [Bấm vào đây để tải](${item.url})\n\n`;
        });

        const embedFF = new EmbedBuilder()
            .setTitle('🔥 TỔNG HỢP LINK TẢI FREE FIRE (IPA & TIPA)')
            .setColor('#FF5500')
            .setDescription(ffContent)
            .setTimestamp();

        // --- EMBED 2: DÀNH CHO LIÊN QUÂN MOBILE ---
        const embedLQ = new EmbedBuilder()
            .setTitle('⚔️ LINK TẢI & CẬP NHẬT LIÊN QUÂN MOBILE')
            .setColor('#5865F2')
            .setTimestamp();

        embedLQ.addFields({
            name: '📥 LINK TẢI LIÊN QUÂN',
            value: `• **${LQ_DOWNLOAD.name}**\n  📌 *${LQ_DOWNLOAD.desc}*\n  🔗 [Bấm vào đây để tải](${LQ_DOWNLOAD.url})`,
            inline: false
        });

        let lqNotesText = '';
        LQ_UPDATE_NOTES.forEach(note => {
            lqNotesText += `🔹 ${note}\n`;
        });
        embedLQ.addFields({
            name: '⚠️ CHI TIẾT CẬP NHẬT TIPA + IPA LIÊN QUÂN (KHÔNG PHẢI FF)',
            value: lqNotesText,
            inline: false
        });

        // --- EMBED 3: HƯỚNG DẪN & LƯU Ý ---
        const embedGuide = new EmbedBuilder()
            .setTitle('🎬 HƯỚNG DẪN CÀI ĐẶT & LƯU Ý')
            .setColor('#2ECC71')
            .addFields({
                name: '📌 Hướng dẫn & Ghi chú',
                value: `▶️ **Video HD cài IPA bằng ESign:** [Xem / Tải Video](${VIDEO_GUIDE_URL})\n\n💡 **Lưu ý quan trọng:** ${NOTE_STABILITY}`,
                inline: false
            })
            .setFooter({ text: 'Download Center • Tự động cập nhật mỗi 24h' })
            .setTimestamp();

        // Gửi cả 3 Embed cùng lúc
        const response = await webhookClient.send({
            embeds: [embedFF, embedLQ, embedGuide],
            wait: true
        });

        if (response && response.id) {
            lastMessageId = response.id;
            console.log(`✅ Đã gửi 3 Embed mới thành công (ID: ${lastMessageId})`);
        }

    } catch (error) {
        console.error('❌ Lỗi tiến trình Webhook:', error.message);
    }
}

// Web Server giữ Render luôn "Live"
app.get('/', (req, res) => res.send('Download Center Service Online!'));

app.listen(PORT, () => {
    console.log(`🌐 Server đang lắng nghe tại port ${PORT}...`);

    // Gửi ngay lần đầu khi start
    sendAndCleanup();

    // Lặp lại tự động mỗi 24 giờ
    const INTERVAL_24H = 24 * 60 * 60 * 1000;
    setInterval(sendAndCleanup, INTERVAL_24H);
});
