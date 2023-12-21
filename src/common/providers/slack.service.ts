import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';

import { ConfigService } from './config.service';

@Injectable()
export class SlackService {
  constructor(private config: ConfigService) {}

  public async sendSlackMessage(
    message: string,
    channel?: string,
    username?: string,
  ): Promise<boolean> {
    const url = this.config.get('slack.webhookUrl');
    const webhook = new IncomingWebhook(url);
    const result = await webhook.send({
      text: `${message}`,
      channel: channel || 'webhook-test',
      username: username || 'slack-bot',
      icon_emoji: ':bell:',
    });
    return result.text === 'ok' ? true : false;
  }
}
