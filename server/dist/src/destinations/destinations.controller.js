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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const destinations_service_1 = require("./destinations.service");
const create_destination_dto_1 = require("./dto/create-destination.dto");
const update_destination_dto_1 = require("./dto/update-destination.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
let DestinationsController = class DestinationsController {
    constructor(destinationsService) {
        this.destinationsService = destinationsService;
    }
    findAll(search, country, page, limit) {
        const filters = {
            search,
            country,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.destinationsService.findAll(filters);
    }
    getStats() {
        return this.destinationsService.getStats();
    }
    findOne(id) {
        return this.destinationsService.findOne(id);
    }
    create(createDestinationDto) {
        return this.destinationsService.create(createDestinationDto);
    }
    update(id, updateDestinationDto) {
        return this.destinationsService.update(id, updateDestinationDto);
    }
    remove(id) {
        return this.destinationsService.remove(id);
    }
};
exports.DestinationsController = DestinationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all destinations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destinations retrieved successfully' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('country')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get destination statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destination statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get destination by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destination retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Destination not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new destination' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Destination created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_destination_dto_1.CreateDestinationDto]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update destination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destination updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Destination not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_destination_dto_1.UpdateDestinationDto]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete destination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destination deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Destination not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "remove", null);
exports.DestinationsController = DestinationsController = __decorate([
    (0, swagger_1.ApiTags)('Destinations'),
    (0, common_1.Controller)('destinations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [destinations_service_1.DestinationsService])
], DestinationsController);
//# sourceMappingURL=destinations.controller.js.map