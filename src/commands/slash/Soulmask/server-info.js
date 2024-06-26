const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { getEmbedTemplate } = require('../../../global/embedTemplate.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('soulmask-pve-info')
    .setDescription('Lấy thông tin server'),
  run: async (client, interaction) => {
    await interaction.deferReply();
    const {
      data: { response },
    } = await axios({
      method: 'get',
      url: `https://api.gamemonitoring.net/servers/4605898`,
    });

    const { app_name, name, numplayers, maxplayers, connect, status } =
      response;

    await interaction.followUp({
      embeds: [
        getEmbedTemplate()
          .setTitle(`${app_name} - Infomation`)
          .setDescription('Thông tin máy chủ')
          .addFields({
            name: 'Name : ',
            value: name,
          })
          .addFields({
            name: 'Player : ',
            value: `\`\`\`${numplayers}/${maxplayers}\`\`\``,
          })
          .addFields({
            name: 'Connect : ',
            value: `\`\`\`${connect}\`\`\``,
          })
          .addFields({
            name: 'Online : ',
            value: `\`\`\`${status}\`\`\``,
          })
          .setImage(
            'https://widgets.gamemonitoring.net/servers/4605898/350x20.png'
          ),
      ],
    });
  },
};
