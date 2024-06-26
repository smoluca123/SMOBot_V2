const { default: axios } = require('axios');
const { getEmbedTemplate } = require('../../global/embedTemplate');
const { EmbedBuilder } = require('discord.js');
const { splitArray } = require('../../global/functions');

const baseApi = axios.create({
  baseURL: 'https://phimapi.com',
});

const baseApiUrlShorter = axios.create({
  baseURL: 'https://api.short.io',
  headers: {
    Authorization: process.env.SHORT_IO_KEY,
  },
});

const CDN_IMAGE_URL = 'https://img.phimapi.com/';

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

      let arrEpisodesList = [];

      const handleFieldsEmbed = async ({
        name,
        quality,
        lang,
        year,
        time,
        poster_url,
        category,
        slug,
      }) => {
        const {
          data: {
            movie: { episode_total },
            episodes,
          },
        } = await baseApi({
          method: 'GET',
          url: `/phim/${slug}`,
        });

        const categoryList =
          category.length > 3
            ? Array.from({ length: 3 }, (_, i) => category[i].name) + '...'
            : category.map((c) => c.name).join(', ');

        const episodesList = await Promise.all(
          episodes[0].server_data.map(async (episode) => {
            const { name, link_embed } = episode;
            const { data } = await baseApiUrlShorter({
              method: 'POST',
              url: '/links',
              data: {
                domain: 'url.smoteam.com',
                originalURL: link_embed,
              },
            });
            return `[${name}](${data.secureShortURL})`;
          })
        );

        if (episodesList.length > 10) {
          const [episodeList1, episodeList2] = splitArray(episodesList);
          arrEpisodesList.push(episodeList1, episodeList2);
        }

        return {
          name,
          value: `Thời lượng : ${time} phút - Số tập : ${episode_total}\n
          Năm phát hành : ${year}\n
          Chất lượng : ${quality}\n
          Ngôn ngữ : ${lang}\n
          Poster : [Ảnh Poster](${CDN_IMAGE_URL + poster_url})\n
          Click vào các tập phim bên dưới để xem phim - Không quảng cáo!\n
          Thể loại : ${categoryList}\n
          ${episodesList.length < 10 ? `Danh sách tập phim : ${episodesList.join('\n')}` : ''}`,
        };
      };

      const embedFields = await Promise.all(
        data.data.items.map(handleFieldsEmbed)
      );

      const embed = [
        getEmbedTemplate()
          .setURL('https://www.facebook.com/LucaNN.Info/')
          .setTitle('Thông tin phim')
          .setDescription('Các player xem phim bên dưới 100% không quảng cáo!')
          .addFields(...embedFields),
      ];
      embed.push(
        ...data.data.items.map((movie) =>
          new EmbedBuilder()
            .setURL('https://www.facebook.com/LucaNN.Info/')
            .setImage(CDN_IMAGE_URL + movie.poster_url)
        )
      );

      if (arrEpisodesList.length > 0) {
        arrEpisodesList.map((episodeList, index) =>
          embed[0].addFields({
            name: `Danh sách tập phim trang ${index + 1}`,
            value: episodeList.join(', '),
          })
        );
      }

      await interaction.followUp({
        embeds: embed,
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
