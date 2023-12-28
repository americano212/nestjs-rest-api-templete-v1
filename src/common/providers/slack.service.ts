import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';

import { ConfigService } from './config.service';

interface SlackMessage {
  text: string;
  channel: string;
  username: string;
  icon_emoji: string;
}

@Injectable()
export class SlackService {
  constructor(private config: ConfigService) {}

  public async sendSlackMessage(
    text: string,
    channel: string = 'webhook-test',
    username: string = 'slack-bot',
  ): Promise<boolean> {
    const url = this.config.get('slack.webhookUrl');
    const webhook = new IncomingWebhook(url);
    const slackMessage: SlackMessage = { text, channel, username, icon_emoji: ':bell:' };

    const result = await webhook.send(slackMessage);
    return result.text === 'ok' ? true : false;
  }
}
