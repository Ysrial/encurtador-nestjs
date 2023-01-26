import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { ShortnerUrisRepository } from './shortner-uris.repository';
import { CreateShortnerUrisDto } from './dto/CreateShortnerUrisDto';
import { ShortnerUrisDto } from './dto/ShortnerUrisDto';
import { customAlphabet } from 'nanoid';
import { ShortnerUris } from './entities/shortner-uris.entity';

@Injectable()
export class ShortnerUrisService {
  private MINIMAL_SHORT_URI_SIZE = 5;
  private COUNT_DAYS = 1;
  private URI_BUILDER;
  private PROTOCOL = 'https';

  constructor(
    // Repository pattern foi depreciando na nova versão do TypeORM
    // @InjectRepository(ShortnerUrisRepository)
    @InjectRepository(ShortnerUris)
    private readonly repo: Repository<ShortnerUris>,
  ) {
    this.URI_BUILDER = customAlphabet(
      '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      10,
    );
  }

  async createShortUri(
    createShortnerUris: CreateShortnerUrisDto,
  ): Promise<any> {
    // create an empty entity
    const shortnerUri = this.repo.create();

    shortnerUri.url = createShortnerUris.url;
    shortnerUri.shortUri = await this.URI_BUILDER();
    shortnerUri.expiration = new Date(Date.now() + this.COUNT_DAYS);

    if (shortnerUri.shortUri.length < this.MINIMAL_SHORT_URI_SIZE) {
      throw new InternalServerErrorException(
        'Não foi possível gerar a url curta',
      );
    }

    return await this.repo.save(shortnerUri);
  }

  async findOne(options: Partial<{ id: number, shortUri: string }>): Promise<ShortnerUris> {
    return await this.repo.findOneBy({
      // id: options.id,
      shortUri: options.shortUri,
    });
  }

  async getOriginalUri(shortUri: string): Promise<string> {
    const shortnerUri = await this.repo.findOneBy({ shortUri: shortUri });

    if (!shortnerUri) {
      throw new NotFoundException('Não foi possível encontrar a url informada');
    }

    const currentDate = new Date();
    if (currentDate > shortnerUri.expiration) {
      throw new BadRequestException('A url solicitada expirou');
    }

    const url = shortnerUri.url;
    if (!url.startsWith('http') || !url.startsWith('https')) {
      return `${this.PROTOCOL}://${url}`;
    }

    return url;
  }
}
