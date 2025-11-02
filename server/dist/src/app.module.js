"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const tours_module_1 = require("./tours/tours.module");
const blog_module_1 = require("./blog/blog.module");
const reviews_module_1 = require("./reviews/reviews.module");
const bookings_module_1 = require("./bookings/bookings.module");
const favorites_module_1 = require("./favorites/favorites.module");
const upload_module_1 = require("./upload/upload.module");
const admin_module_1 = require("./admin/admin.module");
const users_module_1 = require("./users/users.module");
const destinations_module_1 = require("./destinations/destinations.module");
const settings_module_1 = require("./settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            tours_module_1.ToursModule,
            blog_module_1.BlogModule,
            reviews_module_1.ReviewsModule,
            bookings_module_1.BookingsModule,
            favorites_module_1.FavoritesModule,
            upload_module_1.UploadModule,
            admin_module_1.AdminModule,
            users_module_1.UsersModule,
            destinations_module_1.DestinationsModule,
            settings_module_1.SettingsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map