const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('gpt4')
    .setDescription('Ask With GPT.'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  options: {
    hidden: false,
  },
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setTitle('Chat Prompt')
      .setCustomId('gpt4-modal')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel('Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?')
            .setCustomId('prompt')
            .setPlaceholder('Nhập câu hỏi của bạn ở đây!')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
        // new ActionRowBuilder().addComponents(

        // .setPlaceholder('Mọi người có thể xem câu trả lời?')
        // .setCustomId('answer-visibility')
        // .addOptions(
        //   {
        //     label: 'Private',
        //     description: 'Ẩn câu kết quả với mọi người',
        //     value: '0',
        //   },
        //   {
        //     label: 'Public',
        //     description: 'hiện câu kết quả với mọi người',
        //     value: '1',
        //   }
        // )
        // )
      );

    await interaction.showModal(modal);
  },
};
