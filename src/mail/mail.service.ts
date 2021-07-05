import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendMail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    const form = new FormData();

    form.append(
      'from',
      `Owner from huber-eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', 'wjdghdwns0@gmail.com');
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((emailVar) =>
      form.append(`v:${emailVar.key}`, emailVar.value),
    );
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    const emailVars = [
      {
        key: 'code',
        value: code,
      },
      {
        key: 'username',
        value: email,
      },
    ];
    const subject = 'Verify Your Email';
    const template = 'verify-email';
    this.sendMail(subject, template, emailVars);
  }
}
