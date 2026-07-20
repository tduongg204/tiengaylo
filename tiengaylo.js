const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// 1. Khởi tạo WebhookClient với URL bạn cung cấp
const webhookClient = new WebhookClient({ 
    url: 'https://discord.com/api/webhooks/1528789899178672338/rgoVyZp-mKzoSvY-QoBPsCH8e0hTS5sSbJAfk5FcIBHtcWbVwcH3kvo8ScPlIOUeGrJi' 
});

async function sendWebhook() {
    try {
        console.log('⏳ Đang tạo và gửi Webhook...');

        // 2. Cấu trúc Unicode Box Drawing cho bảng
        // Sử dụng code block (```) để căn chỉnh chuẩn xác font monospace trên Discord
        const tableString = 
            `\`\`\`\n` +
            `┌──────────────────────┬──────────────────────┐\n` +
            `│ Sản Phẩm             │ 📥 Link Download     │\n` +
            `├──────────────────────┼──────────────────────┤\n` +
            `│ Migul VN             │ Bấm Vào Đây          │\n` +
            `├──────────────────────┼──────────────────────┤\n` +
            `│ Migul Global         │ Bấm Vào Đây          │\n` +
            `└──────────────────────┴──────────────────────┘\n` +
            `\`\`\``;

        // 3. Khởi tạo Embed đẹp mắt
        const embed = new EmbedBuilder()
            .setTitle('📥 Download Migul iOS')
            .setColor('#4A90E2') // Màu xanh dương chuẩn theo yêu cầu
            .setDescription(`Chọn đúng phiên bản bạn cần tải.\n\n${tableString}`)
            .setFooter({ text: 'Migul iOS • Latest Version' })
            .setTimestamp(); // Tự động lấy giờ hiện tại (Timestamp = true)

        // 4. Tạo các Nút Tải Xuống (Discord Button Link)
        const btnVN = new ButtonBuilder()
            .setLabel('🇻🇳 Migul VN')
            .setStyle(ButtonStyle.Link)
            .setURL('[https://l.messenger.com/l.php?u=https%3A%2F%2Fcdn.authtool.app%2Fuser_39QQInVf1DKz83SmVKQApc9ewdV%2Fipa%2F1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa&h=AUAyM5eN-tLE6sLsZ2hv7HVCAnsWNV2WxLWRz1GjDyl1h_89b3939f-yjLQfchJfSPy0k3P9bZr79Mx0ifHVINx3UU-4pUIKfCrJSzcyFmAXh9XEBJCKstiA8xhGkzXC6-euyA](https://l.messenger.com/l.php?u=https%3A%2F%2Fcdn.authtool.app%2Fuser_39QQInVf1DKz83SmVKQApc9ewdV%2Fipa%2F1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa&h=AUAyM5eN-tLE6sLsZ2hv7HVCAnsWNV2WxLWRz1GjDyl1h_89b3939f-yjLQfchJfSPy0k3P9bZr79Mx0ifHVINx3UU-4pUIKfCrJSzcyFmAXh9XEBJCKstiA8xhGkzXC6-euyA)');

        const btnGlobal = new ButtonBuilder()
            .setLabel('🌍 Migul Global')
            .setStyle(ButtonStyle.Link)
            .setURL('[https://l.messenger.com/l.php?u=https%3A%2F%2Fcdn.authtool.app%2Fuser_39QQInVf1DKz83SmVKQApc9ewdV%2Fipa%2F1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa&h=AUAyM5eN-tLE6sLsZ2hv7HVCAnsWNV2WxLWRz1GjDyl1h_89b3939f-yjLQfchJfSPy0k3P9bZr79Mx0ifHVINx3UU-4pUIKfCrJSzcyFmAXh9XEBJCKstiA8xhGkzXC6-euyA](https://l.messenger.com/l.php?u=https%3A%2F%2Fcdn.authtool.app%2Fuser_39QQInVf1DKz83SmVKQApc9ewdV%2Fipa%2F1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa&h=AUAyM5eN-tLE6sLsZ2hv7HVCAnsWNV2WxLWRz1GjDyl1h_89b3939f-yjLQfchJfSPy0k3P9bZr79Mx0ifHVINx3UU-4pUIKfCrJSzcyFmAXh9XEBJCKstiA8xhGkzXC6-euyA)');

        // 5. Thêm nút vào Action Row
        const actionRow = new ActionRowBuilder().addComponents(btnVN, btnGlobal);

        // 6. Gửi dữ liệu tới Webhook
        await webhookClient.send({
            embeds: [embed],
            components: [actionRow]
        });

        console.log('✅ Đã gửi Webhook thành công!');

    } catch (error) {
        console.error('❌ Đã xảy ra lỗi khi gửi Webhook:', error);
    } finally {
        // 7. Giải phóng bộ nhớ và đóng tiến trình sau khi thực thi xong
        webhookClient.destroy();
    }
}

// Thực thi function
sendWebhook();