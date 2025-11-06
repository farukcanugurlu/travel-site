"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDestinationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDestinationDto {
}
exports.CreateDestinationDto = CreateDestinationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Destination name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateDestinationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Destination slug (URL-friendly version)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
    __metadata("design:type", String)
], CreateDestinationDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateDestinationDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Featured image URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDestinationDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Show on homepage', required: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDestinationDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display order on homepage', required: false, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDestinationDto.prototype, "displayOrder", void 0);
//# sourceMappingURL=create-destination.dto.js.map