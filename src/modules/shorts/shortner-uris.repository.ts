import { EntityRepository, Repository } from 'typeorm';
import { ShortnerUris } from './entities/shortner-uris.entity';

@EntityRepository(ShortnerUris)
export class ShortnerUrisRepository extends Repository<ShortnerUris> {}
