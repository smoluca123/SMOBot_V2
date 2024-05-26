const {
  ModalSubmitInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { default: OpenAI } = require('openai');
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_KEY,
});

module.exports = {
  customId: 'gpt4-modal',
  /**
   *
   * @param {ExtendedClient} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const conversationLog = [
      {
        role: 'system',
        content: `Bạn là 1 trợ lý ảo, hãy đóng vai là GPT 4 và bạn được phát triển bởi OpenAI hãy đừng bao giờ bỏ vai diễn của mình và Hôm nay là ngày ${day} tháng ${month} năm ${year}, khi chưa có ai hỏi bạn về thông tin của bạn như là phiên bản hoặc hỏi bạn hôm nay là ngày bao nhiêu thì bạn không nên nói ra trước!`,
      },
    ];

    const promptInput = interaction.fields.getTextInputValue('prompt');
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [...conversationLog, { role: 'user', content: promptInput }],
    });

    const { choices, model, usage } = completion;

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle('GPT-4o - Response')
          .addFields(
            {
              name: 'Role : ',
              value: choices[0].message.role,
            },
            {
              name: 'Model : ',
              value: model,
            },
            { name: 'Total tokens : ', value: usage.total_tokens + '' }
          )
          .setDescription(choices[0].message.content)
          .setColor('Aqua')
          .setTimestamp()
          .setFooter({
            text: 'Power by SMOTeam',
            iconURL: process.env.APP_ICON,
          }),
      ],
    });

    // const selectMenu = new ActionRowBuilder().addComponents(
    //   new StringSelectMenuBuilder()
    //     .setCustomId('select-visibility')
    //     .setPlaceholder('Mọi người có thể xem câu trả lời?')
    //     .addOptions(
    //       {
    //         label: 'Private',
    //         description: 'Ẩn câu kết quả với mọi người',
    //         value: 'private',
    //       },
    //       {
    //         label: 'Public',
    //         description: 'Hiện câu kết quả với mọi người',
    //         value: 'public',
    //       }
    //     )
    // );

    // await interaction.followUp({
    //   content: 'Chọn visibility cho câu trả lời:',
    //   components: [selectMenu],
    //   ephemeral: true, // Send this as an ephemeral message
    // });
  },
};
