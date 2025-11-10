import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ToursModule } from './tours/tours.module';
import { BlogModule } from './blog/blog.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BookingsModule } from './bookings/bookings.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { DestinationsModule } from './destinations/destinations.module';
import { SettingsModule } from './settings/settings.module';
import { SitemapModule } from './sitemap/sitemap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ToursModule,
    BlogModule,
    ReviewsModule,
    BookingsModule,
    FavoritesModule,
    UploadModule,
    AdminModule,
    UsersModule,
    DestinationsModule,
    SettingsModule,
    SitemapModule,
  ],
})
export class AppModule {}
