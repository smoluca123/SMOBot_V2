const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('get-movies')
    .setDescription('Lấy thông tin phim và player xem phim không quảng cáo!'),
  // .addStringOption((option) =>
  //   option.setName('movie-name').setDescription('Tên phim')
  // ),
  options: {
    hidden: true,
  },
  run: async (client, interaction) => {
    try {
      const modal = new ModalBuilder()
        .setTitle('Tìm kiếm phim')
        .setCustomId('get-movies-modal')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setStyle(TextInputStyle.Short)
              .setCustomId('movie-name')
              .setLabel('Tên phim')
              .setPlaceholder('Nhập câu hỏi của bạn ở đây!')
          )
        );
      await interaction.showModal(modal);
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: 'Có lỗi xảy ra, vui lòng liên hệ BQT',
        ephemeral: true,
      });
    }
  },
};
