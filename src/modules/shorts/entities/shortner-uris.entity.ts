import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShortnerUris {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  shortUri: any;

  @Column({ nullable: false })
  expiration: Date;

}
