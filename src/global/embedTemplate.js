const { EmbedBuilder } = require('discord.js');

const getEmbedTemplate = () => {
  return new EmbedBuilder()
    .setTitle('SMOBot - V2')

    .setDescription('Default Desc')
    .setColor('Aqua')
    .setTimestamp()
    .setFooter({
      text: 'Power by SMOTeam',
      iconURL: process.env.APP_ICON,
    });
};

module.exports = {
  getEmbedTemplate,
};
