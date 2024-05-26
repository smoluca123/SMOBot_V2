const { Message } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const prisma = require('../../../handlers/prisma');

module.exports = {
  structure: {
    name: 'prefix',
    description: 'Get/Set/Default prefix',
    aliases: [],
    permissions: 'Administrator',
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (!prisma) {
      await message.reply({
        content: 'Database is not ready, this command cannot be executed.',
      });

      return;
    }

    const type = args[0];

    switch (type) {
      case 'set': {
        let data = await prisma.guilds.findFirst({
          where: {
            guild: message.guildId,
          },
        });

        if (!data) {
          data = await prisma.guilds.create({
            data: {
              guild: message.guildId,
            },
          });
        }

        const oldPrefix = data.prefix || config.handler.prefix;

        if (!args[1]) {
          await message.reply({
            content: 'You need to provide the prefix as a second parameter.',
          });

          return;
        }

        await prisma.guilds.update({
          where: {
            id: data.id,
            guild: data.guild,
          },
          data: {
            prefix: args[1],
          },
        });

        await message.reply({
          content: `The old prefix \`${oldPrefix}\` has been changed to \`${args[1]}\`.`,
        });

        break;
      }

      case 'reset': {
        let data = await prisma.guilds.findFirst({
          where: {
            guild: message.guildId,
          },
        });

        if (data) {
          await prisma.guilds.delete({
            where: {
              id: data.id,
              guild: data.guild,
            },
          });
        }

        await message.reply({
          content: `The new prefix on this server is: \`${config.handler.prefix}\` (default).`,
        });

        break;
      }

      default: {
        await message.reply({
          content: 'Allowed methods: `set`, `reset`',
        });

        break;
      }
    }
  },
};
