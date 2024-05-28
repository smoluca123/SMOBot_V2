const { default: axios } = require('axios');

const baseApi = axios.create({
  baseURL: 'https://phimapi.com',
});

module.exports = {
  customId: 'get-movies-modal',
  /**
   *
   * @param {ExtendedClient} client
   * @param {ModalSubmitInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });
    try {
      const movieNameInput = interaction.fields.getTextInputValue('movie-name');

      const { data } = await baseApi({
        method: 'GET',
        url: `/v1/api/tim-kiem?keyword=${movieNameInput}&limit=3`,
      });
      console.log(data.data.items[0]);
      console.log(data.data.items[1]);
      console.log(data.data.items[2]);
      await interaction.followUp({
        content: 'ABC',
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content: 'Có lỗi xảy ra, vui lòng liên hệ BQT',
        ephemeral: true,
      });
    }
  },
};
