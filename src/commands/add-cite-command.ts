import {
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandOption,
  APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionResponseType,
} from 'discord-api-types/v10';
import { ApiCommand } from './models/api-command';
import { InteractionResponseFlags } from 'discord-interactions';
import { Response } from 'express';
import { ChannelUtils } from '../channel-utils';
import { ServerConfig } from '../models';

class AddCiteCommand extends ApiCommand {
  options: APIApplicationCommandOption[] = [];

  private readonly messageOptionKey = 'message';
  private readonly personOptionKey = 'person';

  constructor() {
    super('cite', 'Create a citation', ApplicationCommandType.ChatInput);

    this.options.push(
      {
        name: this.messageOptionKey,
        description: 'Message',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: this.personOptionKey,
        description: 'Person',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    );
  }

  protected async executeInternal(
    interaction: APIChatInputApplicationCommandInteraction,
    res: Response,
    config: ServerConfig,
  ): Promise<void> {
    const values = interaction.data.options;
    const msgOption = values.find(
      (elem) => elem.name === this.messageOptionKey,
    ) as APIApplicationCommandInteractionDataStringOption;
    const msg = msgOption.value;

    const personOption = values.find(
      (elem) => elem.name === this.personOptionKey,
    ) as APIApplicationCommandInteractionDataStringOption;
    const person = personOption.value;

    const returnMsg = `"${msg}"\r\n- ${person}, ${new Date().getFullYear()}`;

    await ChannelUtils.createMessage(config.citeChannelId, returnMsg);

    res.send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Cite created',
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    });
  }
}

export default new AddCiteCommand();
