import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';

import { ConfigService } from './config.service';

@Injectable()
export class SlackService {
  constructor(private config: ConfigService) {}

  public async sendSlackMessage(message: string): Promise<boolean> {
    const url = this.config.get('slack.webhookUrl');
    const webhook = new IncomingWebhook(url);

    const result = await webhook.send({
      text: `🚨${message}🚨`,
      channel: 'webhook-test',
    });
    return result.text === 'ok' ? true : false;
  }
}
