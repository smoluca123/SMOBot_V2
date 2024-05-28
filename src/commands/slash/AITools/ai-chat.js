const { SlashCommandBuilder } = require('discord.js');
const openai = require('../../../apis/openaiAPI');
const { getEmbedTemplate } = require('../../../global/embedTemplate');

const modelChoices = [
  {
    name: 'Meta: Llama 3 70B Instruct',
    value: 'meta-llama/llama-3-70b-instruct',
  },
  { name: 'MythoMax 13B', value: 'gryphe/mythomax-l2-13b' },
  {
    name: 'OpenAI: GPT-4o (Can Upload Image)',
    value: 'openai/gpt-4o',
    promptImg: true,
  },
  {
    name: 'Google: Gemini Pro 1.5 (preview) (Can Upload Image)',
    value: 'google/gemini-pro-1.5',
    promptImg: true,
  },
  { name: 'Anthropic: Claude 3 Haiku', value: 'anthropic/claude-3-haiku' },
];

const modelCanUploadImg = modelChoices.filter((m) => !!m.promptImg);

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('ai-chat')
    .setDescription('Chat With multi AI')
    .addStringOption((option) =>
      option
        .setName('model')
        .setDescription('Choose a model.')
        .setRequired(true)
        .setChoices(...modelChoices)
    )
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
      const model = interaction.options.getString('model');
      const image = interaction.options.getAttachment('image');
      const prompt = interaction.options.getString('prompt');

      const modelInfo = modelChoices.find((m) => m.value === model);

      await interaction.deferReply({
        ephemeral: isPrivate,
      });
      const isModelCanHandleImg = !!modelCanUploadImg.find(
        (m) => m.value === model
      );

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: isModelCanHandleImg
              ? [
                  image && image.url
                    ? {
                        type: 'image_url',
                        image_url: {
                          detail: 'low',
                          url: image.url,
                        },
                      }
                    : { type: 'text', text: '' },
                  {
                    type: 'text',
                    text: prompt,
                  },
                ]
              : prompt,
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
            .setTitle(
              `${modelInfo.name.replace('(Can Upload Image)', '')} - Response`
            )
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
      console.log(error);
      interaction.followUp({
        content: 'Có lỗi xảy ra, vui lòng liên hệ BQT',
        ephemeral: true,
      });
    }
  },
};
