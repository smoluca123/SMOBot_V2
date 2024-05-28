const { SlashCommandBuilder } = require('discord.js');
const openai = require('../../../apis/openaiAPI');
const { getEmbedTemplate } = require('../../../global/embedTemplate');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('gpt4')
    .setDescription('Chat With GPT-4 (Free)')
    // .addStringOption((option) =>
    //   option
    //     .setName('model')
    //     .setDescription('Choose a model.')
    //     .setRequired(true)
    //     .setChoices(...modelChoices)
    // )
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('Put your prompt')
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('Upload an image.')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('answer-visibility')
        .setDescription('Public answer?')
        .setRequired(false)
        .setChoices(
          { name: 'Public', value: '1' },
          { name: 'Private', value: '0' }
        )
    ),

  options: {
    hidden: false,
  },
  run: async (client, interaction) => {
    try {
      const isPrivate = !+interaction.options.getString('answer-visibility');
      const image = interaction.options.getAttachment('image');

      await interaction.deferReply({
        ephemeral: isPrivate,
      });

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              image && image.url
                ? {
                    type: 'image_url',
                    image_url: {
                      detail: 'low',
                      url: image.url,
                    },
                  }
                : { type: 'text', text: '' },
              { type: 'text', text: interaction.options.getString('prompt') },
            ],
          },
        ],
      });

      if (completion.error) {
        throw completion.error;
      }

      const { choices, model: resModel, usage } = completion;

      interaction.followUp({
        embeds: [
          getEmbedTemplate()
            .setTitle(`GPT-4o - Response`)
            .addFields(
              {
                name: 'Role : ',
                value: choices[0].message.role,
              },
              {
                name: 'Model : ',
                value: resModel,
              },
              { name: 'Total tokens : ', value: usage.total_tokens + '' }
            )
            .setDescription(`**${choices[0].message.content}**`)
            .setImage(image?.url),
        ],
        ephemeral: isPrivate, // Send this as an ephemeral message
      });
    } catch (error) {
      interaction.followUp({
        content: 'Có lỗi xảy ra, vui lòng liên hệ BQT',
        ephemeral: true,
      });
    }
  },
};
