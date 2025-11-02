import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsService, SiteSettingsData } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.get();
  }

  @Put()
  update(@Body() body: SiteSettingsData) {
    return this.settingsService.update(body);
  }
}


