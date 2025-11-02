"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    console.log('📁 Static files directory:', uploadsPath);
    console.log('📂 Process CWD:', process.cwd());
    console.log('📂 __dirname:', __dirname);
    const fs = require('fs');
    if (fs.existsSync(uploadsPath)) {
        console.log('✅ Uploads directory exists');
    }
    else {
        console.log('❌ Uploads directory NOT found');
    }
    app.useStaticAssets(uploadsPath, {
        prefix: '/uploads/',
        dotfiles: 'ignore',
        etag: true,
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
        fallthrough: true,
        index: false,
        lastModified: true,
        maxAge: 0,
        redirect: false,
        setHeaders: (res, path) => {
            res.set('x-timestamp', Date.now().toString());
            if (path.endsWith('.pdf')) {
                res.set('Content-Type', 'application/pdf');
            }
        }
    });
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
        exposedHeaders: ['Content-Length', 'Content-Type'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map(error => {
                const constraints = error.constraints;
                if (constraints) {
                    return Object.values(constraints).join(', ');
                }
                return `${error.property} has invalid value`;
            });
            return new common_1.BadRequestException({
                message: messages,
                error: 'Validation failed',
                statusCode: 400,
            });
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('LEXOR Travel API')
        .setDescription('API for LEXOR Travel booking system')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map