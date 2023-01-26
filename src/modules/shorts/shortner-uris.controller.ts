import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShortnerUrisService } from './shortner-uris.service';
import * as express from 'express';
import { CreateShortnerUrisDto } from './dto/CreateShortnerUrisDto';
import { ShortnerUrisDto } from './dto/ShortnerUrisDto';

@Controller()
@ApiTags('Encurtar URL')
export class ShortnerUrisController {
  constructor(private readonly shortnerUrisService: ShortnerUrisService) {}

  @Post('/api/v1/shortner-uris')
  @ApiOperation({ summary: 'Cria e retorna uma url encurtada' })
  async createShortUri(
    @Body() createShortnerUrisDto: CreateShortnerUrisDto,
  ): Promise<ShortnerUrisDto> {
    return await this.shortnerUrisService.createShortUri(createShortnerUrisDto);
  }

  @Get('/:shortUri')
  @ApiOperation({
    summary: 'Redireciona para a url original a partir da url encurtada',
  })
  async redirectToOriginalUri(
    @Param('shortUri') shortUri: string,
    @Response() response: express.Response,
  ) {
    const shortnerUrisDto = await this.shortnerUrisService.getOriginalUri(
      shortUri,
    );
    return response.redirect(302, shortnerUrisDto.url);
  }
}
