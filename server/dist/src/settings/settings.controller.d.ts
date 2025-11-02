import { SettingsService, SiteSettingsData } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<any>;
    update(body: SiteSettingsData): Promise<any>;
}
