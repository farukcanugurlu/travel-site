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
exports.ToursController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const tours_service_1 = require("./tours.service");
const update_tour_dto_1 = require("./dto/update-tour.dto");
const create_tour_package_dto_1 = require("./dto/create-tour-package.dto");
const update_tour_package_dto_1 = require("./dto/update-tour-package.dto");
let ToursController = class ToursController {
    constructor(toursService) {
        this.toursService = toursService;
    }
    create(createTourDto) {
        console.log('Received tour data:', createTourDto);
        return this.toursService.create(createTourDto);
    }
    findAll(filters) {
        return this.toursService.findAll(filters);
    }
    getFeatured(limit) {
        return this.toursService.getFeaturedTours(limit ? parseInt(limit) : 8);
    }
    getPopular(limit) {
        return this.toursService.getPopularTours(limit ? parseInt(limit) : 8);
    }
    getDestinations(limit) {
        return this.toursService.getPopularDestinations(limit ? parseInt(limit) : 8);
    }
    getDestinationsList() {
        return this.toursService.getDestinations();
    }
    findBySlug(slug) {
        return this.toursService.findBySlug(slug);
    }
    findOne(id) {
        return this.toursService.findOne(id);
    }
    update(id, updateTourDto) {
        return this.toursService.update(id, updateTourDto);
    }
    remove(id) {
        return this.toursService.remove(id);
    }
    createPackage(tourId, createPackageDto) {
        return this.toursService.createPackage(tourId, createPackageDto);
    }
    updatePackage(id, updatePackageDto) {
        return this.toursService.updatePackage(id, updatePackageDto);
    }
    removePackage(id, force) {
        const forceDelete = force === 'true' || force === '1';
        return this.toursService.removePackage(id, forceDelete);
    }
};
exports.ToursController = ToursController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tour' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tour created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tours with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tours retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured tours' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Featured tours retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "getFeatured", null);
__decorate([
    (0, common_1.Get)('popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular tours' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Popular tours retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)('destinations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular destinations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destinations retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "getDestinations", null);
__decorate([
    (0, common_1.Get)('destinations-list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all destinations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Destinations retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "getDestinationsList", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tour by slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tour retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tour not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tour by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tour retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tour not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update tour' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tour updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tour_dto_1.UpdateTourDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tour' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tour deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':tourId/packages'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create tour package' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Package created successfully' }),
    __param(0, (0, common_1.Param)('tourId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tour_package_dto_1.CreateTourPackageDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "createPackage", null);
__decorate([
    (0, common_1.Patch)('packages/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update tour package' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Package updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tour_package_dto_1.UpdateTourPackageDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "updatePackage", null);
__decorate([
    (0, common_1.Delete)('packages/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tour package' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Package deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "removePackage", null);
exports.ToursController = ToursController = __decorate([
    (0, swagger_1.ApiTags)('Tours'),
    (0, common_1.Controller)('tours'),
    __metadata("design:paramtypes", [tours_service_1.ToursService])
], ToursController);
//# sourceMappingURL=tours.controller.js.map