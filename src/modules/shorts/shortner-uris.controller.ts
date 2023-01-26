import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShortnerUrisService } from './shortner-uris.service';
import * as express from 'express';
import { CreateShortnerUrisDto } from './dto/CreateShortnerUrisDto';
import { ShortnerUrisDto } from './dto/ShortnerUrisDto';

@Controller('/api/v1/shortner')
@ApiTags('Shortner')
export class ShortnerUrisController {
  constructor(private readonly service: ShortnerUrisService) {}

  @Post('short-url')
  @ApiOperation({ summary: 'Cria e retorna uma url encurtada' })
  async createShortUri(
    @Body() createShortnerUrisDto: CreateShortnerUrisDto,
  ): Promise<ShortnerUrisDto> {
    return await this.service.createShortUri(createShortnerUrisDto);
  }

  @Get('/:shortUri')
  @ApiOperation({
    summary: 'Redireciona para a url original a partir da url encurtada',
  })
  async redirectToOriginalUri(
    @Param('shortUri') shortUri: string,
    @Response() response: express.Response,
  ) {
    const uri = await this.service.getOriginalUri(shortUri);
    return response.redirect(302, uri);
  }
}
