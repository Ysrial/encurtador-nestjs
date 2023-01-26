import { customAlphabet } from 'nanoid/async';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as config from 'config';
import { ShortnerUrisDto } from './dto/Shortner-Uris.Dto';
import { ShortnerUrisDtoBuilder } from './dto/Shortner-Uris-Dto.Builder';

const serverConfig = config.get('server');
const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  10,
);
const countDays = 1;

@Entity()
export class ShortnerUris {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  url: string;

  @Column()
  shortUri: any;

  @Column()
  expiration: Date;

  async initialize(): Promise<void> {
    this.shortUri = await nanoid();
    this.expiration = new Date();
    this.expiration.setDate(this.expiration.getDate() + countDays);
    return Promise.resolve();
  }

  async toDtoWithUrl(): Promise<ShortnerUrisDto> {
    const url = this.setSchema(this.url);

    return new ShortnerUrisDtoBuilder().withUrl(url).build();
  }

  async toDtoWithNewUrl(): Promise<ShortnerUrisDto> {
    return new ShortnerUrisDtoBuilder()
      .withNewUrl(
        `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.port}/${this.shortUri}`,
      )
      .build();
  }

  private setSchema(url: string): string {
    if (!this.url.startsWith('http') || !this.url.startsWith('https')) {
      return `${serverConfig.protocol}://${url}`;
    }

    return url;
  }
}
