const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// 1. Cấu hình Webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1528458052884234393/XKgLKDRQ4SRzkKO0TNVgljpdEWxTVPQLWRsxe71kqAga126QPIxXSuNAX9s6SEHe28-u';

// 2. Danh sách sản phẩm (Dễ dàng thêm/sửa link tại đây)
const PRODUCTS = [
    {
        title: '🇻🇳 Migui Việt Nam',
        description: 'Dành cho người chơi tại Việt Nam',
        buttonLabel: '📥 Tải Migui VN',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784307460807-d7zeq5lqqj9-Free_Fire_1.126.1_1784306058.ipa',
        active: true
    },
    {
        title: '🌍 Migui Global',
        description: 'Dành cho người chơi quốc tế',
        buttonLabel: '📥 Tải Migui Global',
        url: 'https://cdn.authtool.app/user_39QQInVf1DKz83SmVKQApc9ewdV/ipa/1784308355701-1q56fhng73z-Free_Fire_1.126.1_1784307627.ipa',
        active: true
    },
    {
        title: '💧 Drip Client Android',
        description: 'APK dành cho Android',
        buttonLabel: '📥 Tải Drip Client',
        url: 'https://www.mediafire.com/file/kcywrq5i1sxvx2t/DPFF-APKM0D-V2.2x-BETA.apks/file',
        active: true
    },
    // Các ô chờ cập nhật sau
    {
        title: '🚧 Đang cập nhật...',
        description: 'Sản phẩm mới sẽ sớm ra mắt',
        buttonLabel: 'Coming Soon 1',
        url: null,
        active: false
    },
    {
        title: '🚧 Đang cập nhật...',
        description: 'Sản phẩm mới sẽ sớm ra mắt',
        buttonLabel: 'Coming Soon 2',
        url: null,
        active: false
    },
    {
        title: '🚧 Đang cập nhật...',
        description: 'Sản phẩm mới sẽ sớm ra mắt',
        buttonLabel: 'Coming Soon 3',
        url: null,
        active: false
    }
];

async function executeWebhook() {
    const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

    try {
        console.log('🚀 Đang khởi tạo Embed Download Center...');

        // Tạo Embed chính
        const embed = new EmbedBuilder()
            .setTitle('📥 DOWNLOAD MIGUI IOS')
            .setColor('#5865F2') // Màu Blurple chuẩn Discord Dark Mode
            .setDescription(
                'Chọn đúng phiên bản bạn cần tải bên dưới.\n\n' +
                '✅ **Luôn cập nhật bản mới nhất**\n' +
                '⚡ **Tốc độ tải nhanh**'
            )
            .setFooter({ text: 'Migui Download Center' })
            .setTimestamp();

        // Thêm danh sách sản phẩm vào Embed Fields
        PRODUCTS.forEach(product => {
            embed.addFields({
                name: product.title,
                value: `> ${product.description}`,
                inline: false
            });
        });

        // Tạo các ActionRow cho Nút bấm
        const rows = [];

        // 3 Sản phẩm chính (mỗi nút 1 dòng riêng)
        PRODUCTS.filter(p => p.active).forEach(product => {
            const btn = new ButtonBuilder()
                .setLabel(product.buttonLabel)
                .setStyle(ButtonStyle.Link)
                .setURL(product.url);

            rows.push(new ActionRowBuilder().addComponents(btn));
        });

        // Gom các nút "Coming Soon" vào 1 Hàng Nút (để không vượt quá giới hạn 5 ActionRow của Discord)
        const comingSoonRow = new ActionRowBuilder();
        PRODUCTS.filter(p => !p.active).forEach((product, index) => {
            const disabledBtn = new ButtonBuilder()
                .setCustomId(`coming_soon_${index + 1}`)
                .setLabel(product.buttonLabel)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            comingSoonRow.addComponents(disabledBtn);
        });

        rows.push(comingSoonRow);

        // Gửi Embed lên Discord
        await webhookClient.send({
            embeds: [embed],
            components: rows
        });

        console.log('✅ Đã gửi giao diện Download Center thành công!');

    } catch (error) {
        console.error('❌ Lỗi gửi Webhook:', error);
    } finally {
        webhookClient.destroy();
    }
}

executeWebhook();
