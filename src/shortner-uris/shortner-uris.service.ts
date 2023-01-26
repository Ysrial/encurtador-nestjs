import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortnerUrisRepository } from './shortner-uris.repository';
import { CreateShortnerUrisDto } from './dto/Create-Shortner-Uris.Dto';
import { ShortnerUrisDto } from './dto/Shortner-Uris.Dto';

@Injectable()
export class ShortnerUrisService {
  private MINIMAL_SHORT_URI_SIZE = 5;

  constructor(
    @InjectRepository(ShortnerUrisRepository)
    private readonly shortnerUrisRepository: ShortnerUrisRepository,
  ) {}

  async createShortUri(
    createShortnerUris: CreateShortnerUrisDto,
  ): Promise<ShortnerUrisDto> {
    const shortnerUris = createShortnerUris.toEntity();
    await shortnerUris.initialize();

    if (shortnerUris.shortUri.length < this.MINIMAL_SHORT_URI_SIZE) {
      throw new InternalServerErrorException(
        'Não foi possível gerar a url curta',
      );
    }

    await this.shortnerUrisRepository.save(shortnerUris);

    return shortnerUris.toDtoWithNewUrl();
  }

  async getOriginalUri(shortUri: any): Promise<ShortnerUrisDto> {
    const shortnerUris = await this.shortnerUrisRepository.findOneBy(shortUri);

    if (!shortnerUris) {
      throw new NotFoundException('Não foi possível encontrar a url informada');
    }

    const currentDate = new Date();
    if (currentDate > shortnerUris.expiration) {
      throw new BadRequestException('A url solicitada expirou');
    }

    return shortnerUris.toDtoWithUrl();
  }
}
