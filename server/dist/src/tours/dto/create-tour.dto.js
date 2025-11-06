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
exports.CreateTourDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTourDto {
}
exports.CreateTourDto = CreateTourDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Antalya City Highlights' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'antalya-city-highlights' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Explore the beautiful city of Antalya...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Discover Antalya...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "popular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "published", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1 Day' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/assets/img/listing/listing-1.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['/assets/img/listing/listing-1.jpg', '/assets/img/listing/listing-2.jpg'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'dest-1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "destinationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Pick and Drop Service', '1 Meal Per Day'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "included", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Gratuities', 'Travel insurance'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "excluded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Hot air balloon experience', 'Explore ancient cities'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "highlights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [{ day: 'Day 1', title: 'Arrival', description: '...' }] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "itinerary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 36.8841 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "locationLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30.7056 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "locationLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Antalya is a beautiful coastal city...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "locationDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hotel Pickup or Main Square' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "meetingPointAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://www.google.com/maps/embed?pb=...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "meetingPointMapUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Adventure' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Small Group (Max 12 People)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "groupSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['English', 'Turkish'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['09:00', '14:00', '18:00'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], CreateTourDto.prototype, "availableTimes", void 0);
//# sourceMappingURL=create-tour.dto.js.map