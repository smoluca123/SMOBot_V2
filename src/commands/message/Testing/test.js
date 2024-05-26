const {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new ContextMenuCommandBuilder()
    .setName('Test Message command')
    .setType(3),

  options: {
    hidden: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {MessageContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: 'Hello message context command!',
    });
  },
};
