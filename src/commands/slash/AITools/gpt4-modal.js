const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  AttachmentBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('gpt4-modal')
    .setDescription('Ask With GPT-4o (Free)'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  options: {
    hidden: true,
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
      );

    await interaction.showModal(modal);
  },
};
