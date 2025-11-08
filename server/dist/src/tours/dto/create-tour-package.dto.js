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
exports.CreateTourPackageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTourPackageDto {
}
exports.CreateTourPackageDto = CreateTourPackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Standard Package' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Standard tour package...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.00 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "adultPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75.00 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "childPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.00 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "infantPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'English' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Maximum age for child (e.g., 5 or 6)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "childMaxAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Maximum age for infant (e.g., 2 or 3)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "infantMaxAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { "1": { "adultPrice": 150, "childPrice": 75, "infantPrice": 0 }, "2": { "adultPrice": 160, "childPrice": 80, "infantPrice": 0 } },
        description: 'Monthly prices override base prices. Keys are month numbers (1-12)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "monthlyPrices", void 0);
//# sourceMappingURL=create-tour-package.dto.js.map