"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@lexor.com';
    const adminPassword = 'admin123';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
                isActive: true,
            },
        });
        console.log('✅ Admin user created:', {
            id: admin.id,
            email: admin.email,
            role: admin.role,
        });
    }
    else {
        const updatedAdmin = await prisma.user.update({
            where: { id: existingAdmin.id },
            data: {
                role: 'ADMIN',
                isActive: true,
            },
        });
        console.log('✅ Admin user updated:', {
            id: updatedAdmin.id,
            email: updatedAdmin.email,
            role: updatedAdmin.role,
        });
    }
    const destinations = [
        { name: 'Antalya', slug: 'antalya', country: 'Turkey', latitude: 36.8841, longitude: 30.7056 },
        { name: 'Fethiye', slug: 'fethiye', country: 'Turkey', latitude: 36.6226, longitude: 29.1164 },
        { name: 'Bodrum', slug: 'bodrum', country: 'Turkey', latitude: 37.0344, longitude: 27.4305 },
        { name: 'Cappadocia', slug: 'cappadocia', country: 'Turkey', latitude: 38.6431, longitude: 34.8331 },
        { name: 'Istanbul', slug: 'istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
    ];
    const createdDestinations = [];
    for (const dest of destinations) {
        const existing = await prisma.destination.findUnique({
            where: { slug: dest.slug },
        });
        if (!existing) {
            const created = await prisma.destination.create({
                data: dest,
            });
            createdDestinations.push(created);
            console.log(`✅ Destination created: ${dest.name}`);
        }
        else {
            const updated = await prisma.destination.update({
                where: { id: existing.id },
                data: {
                    latitude: dest.latitude,
                    longitude: dest.longitude,
                },
            });
            createdDestinations.push(updated);
            console.log(`ℹ️ Destination updated: ${dest.name}`);
        }
    }
    const testUsers = [
        {
            email: 'test1@example.com',
            firstName: 'Esther',
            lastName: 'Howard',
            password: await bcrypt.hash('test123', 10),
        },
        {
            email: 'test2@example.com',
            firstName: 'Floyd',
            lastName: 'Miles',
            password: await bcrypt.hash('test123', 10),
        },
        {
            email: 'test3@example.com',
            firstName: 'Jacob',
            lastName: 'Jones',
            password: await bcrypt.hash('test123', 10),
        },
        {
            email: 'test4@example.com',
            firstName: 'Emily',
            lastName: 'Williams',
            password: await bcrypt.hash('test123', 10),
        },
        {
            email: 'test5@example.com',
            firstName: 'Michael',
            lastName: 'Johnson',
            password: await bcrypt.hash('test123', 10),
        },
    ];
    const createdUsers = [];
    for (const userData of testUsers) {
        const existing = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (!existing) {
            const user = await prisma.user.create({
                data: userData,
            });
            createdUsers.push(user);
            console.log(`✅ User created: ${userData.email}`);
        }
        else {
            createdUsers.push(existing);
            console.log(`ℹ️ User already exists: ${userData.email}`);
        }
    }
    const testTours = [
        {
            title: 'Epic Cappadocia Hot Air Balloon & Underground Cities Adventure',
            slug: 'epic-cappadocia-hot-air-balloon-adventure',
            description: `Experience the magical landscape of Cappadocia from above and below in this comprehensive adventure tour. Start your journey with an unforgettable hot air balloon ride at sunrise, floating over fairy chimneys and unique rock formations. Then explore the underground cities carved into the soft volcanic rock, where early Christians once hid from persecution.

Our expert guides will take you through the most spectacular valleys, ancient cave churches, and traditional pottery workshops. You'll visit the Goreme Open Air Museum, a UNESCO World Heritage Site, and learn about the rich history of this region.

The tour includes comfortable transportation, professional photography services, and delicious local cuisine. Capture breathtaking photos at sunset viewpoints and enjoy traditional Turkish hospitality throughout your journey.`,
            excerpt: 'Explore Cappadocia from the sky and underground in this magical adventure featuring hot air balloon rides and ancient cave cities.',
            featured: true,
            published: true,
            duration: '2 Days',
            thumbnail: '/assets/img/listing/listing-1.jpg',
            images: [
                '/assets/img/listing/listing-1.jpg',
                '/assets/img/listing/listing-2.jpg',
                '/assets/img/listing/listing-3.jpg',
                '/assets/img/listing/listing-4.jpg',
                '/assets/img/listing/listing-5.jpg',
                '/assets/img/listing/listing-6.jpg',
            ],
            included: [
                'Hot air balloon ride at sunrise',
                'Professional photography service',
                'All entrance fees included',
                'Traditional Turkish breakfast',
                'Expert local guide',
                'Comfortable transportation',
                'Cave hotel accommodation',
                'Lunch at local restaurant',
            ],
            excluded: [
                'International flights',
                'Travel insurance',
                'Personal expenses',
                'Gratuities (optional)',
                'Additional activities not mentioned',
            ],
            highlights: [
                'Hot air balloon experience with 360-degree views',
                'Explore ancient underground cities up to 8 stories deep',
                'Visit UNESCO World Heritage Goreme Open Air Museum',
                'Sunset photography at panoramic viewpoints',
                'Traditional pottery workshop experience',
                'Local cuisine tasting at authentic restaurants',
            ],
            itinerary: [
                {
                    day: 'Day 1',
                    title: 'Arrival & Hot Air Balloon Experience',
                    description: 'Morning pickup from your hotel. Experience a magical sunrise hot air balloon ride over Cappadocia\'s unique landscape. After landing celebration with champagne, enjoy a traditional Turkish breakfast. Visit Goreme Open Air Museum and explore ancient cave churches. Sunset photo session at Love Valley. Check into your cave hotel.',
                },
                {
                    day: 'Day 2',
                    title: 'Underground Cities & Valleys',
                    description: 'After breakfast, explore Kaymakli or Derinkuyu underground city, marveling at the engineering of ancient civilizations. Visit traditional pottery workshop in Avanos. Hike through Red Valley and see fairy chimneys. Enjoy lunch at a local restaurant. Visit Pigeon Valley and enjoy panoramic views. Transfer back to hotel.',
                },
            ],
            locationLatitude: 38.6431,
            locationLongitude: 34.8331,
            locationDescription: 'Cappadocia is located in central Turkey, famous for its unique fairy chimneys, underground cities, and ancient cave churches. The region offers a surreal landscape unlike any other in the world.',
            type: 'Adventure',
            groupSize: 'Small Group (Max 12 People)',
            languages: ['English', 'Turkish', 'Russian'],
            destinationSlug: 'cappadocia',
            packages: [
                {
                    name: 'Standard Package',
                    description: 'Perfect for budget-conscious travelers',
                    adultPrice: 250,
                    childPrice: 150,
                    infantPrice: 50,
                    language: 'English',
                    capacity: 12,
                },
                {
                    name: 'Premium Package',
                    description: 'Includes luxury cave hotel and VIP balloon basket',
                    adultPrice: 450,
                    childPrice: 300,
                    infantPrice: 100,
                    language: 'English',
                    capacity: 6,
                },
                {
                    name: 'Private Package',
                    description: 'Exclusive private tour with dedicated guide',
                    adultPrice: 850,
                    childPrice: 600,
                    infantPrice: 200,
                    language: 'English',
                    capacity: 4,
                },
            ],
        },
        {
            title: 'Antalya: Old Town, Waterfalls & Boat Cruise Experience',
            slug: 'antalya-old-town-waterfalls-cruise',
            description: `Discover the stunning Mediterranean city of Antalya in this comprehensive tour that combines history, nature, and relaxation. Start in the charming Old Town (Kaleici) with its narrow cobblestone streets, Ottoman-era houses, and ancient harbor. Visit the historic Hadrian's Gate and explore the Antalya Archaeological Museum.

Then escape to nature at Duden Waterfalls, where you can feel the mist of cascading water and enjoy lush green surroundings. The tour includes a scenic boat cruise along the turquoise coast, with opportunities for swimming in crystal-clear waters.

Indulge in delicious local cuisine at traditional restaurants and experience the perfect blend of culture and natural beauty that Antalya offers.`,
            excerpt: 'Experience Antalya\'s historic Old Town, stunning waterfalls, and beautiful Mediterranean coastline on this unforgettable day tour.',
            featured: true,
            published: true,
            duration: 'Full Day',
            thumbnail: '/assets/img/listing/listing-2.jpg',
            images: [
                '/assets/img/listing/listing-2.jpg',
                '/assets/img/listing/listing-3.jpg',
                '/assets/img/listing/listing-4.jpg',
                '/assets/img/listing/listing-5.jpg',
                '/assets/img/listing/listing-6.jpg',
                '/assets/img/listing/listing-7.jpg',
                '/assets/img/listing/listing-8.jpg',
            ],
            included: [
                'Professional English-speaking guide',
                'All entrance fees',
                'Boat cruise tickets',
                'Traditional Turkish lunch',
                'Hotel pickup and drop-off',
                'Air-conditioned transportation',
                'Bottled water',
            ],
            excluded: [
                'Alcoholic beverages',
                'Personal shopping',
                'Travel insurance',
                'Tips for guide and driver',
                'Additional activities',
            ],
            highlights: [
                'Explore historic Kaleici Old Town with Ottoman architecture',
                'Visit Hadrian\'s Gate, built in 130 AD',
                'Experience Duden Upper and Lower Waterfalls',
                'Scenic boat cruise along the Mediterranean coast',
                'Swimming stops in crystal-clear waters',
                'Antalya Archaeological Museum visit',
            ],
            itinerary: [
                {
                    day: 'Morning',
                    title: 'Old Town & Historical Sites',
                    description: 'Pickup from hotel. Guided tour of Kaleici Old Town, exploring narrow streets, historic houses, and the Roman harbor. Visit Hadrian\'s Gate, one of the best-preserved Roman monuments in Turkey. Explore the Antalya Archaeological Museum to see artifacts from ancient civilizations.',
                },
                {
                    day: 'Afternoon',
                    title: 'Waterfalls & Boat Cruise',
                    description: 'Drive to Duden Waterfalls, visit both upper and lower falls. Enjoy the natural beauty and take photos. Traditional Turkish lunch at local restaurant. Afternoon boat cruise along the Mediterranean coastline. Swimming stops at pristine beaches. Return to hotel.',
                },
            ],
            locationLatitude: 36.8841,
            locationLongitude: 30.7056,
            locationDescription: 'Antalya is Turkey\'s premier Mediterranean resort city, combining ancient history with stunning natural beauty. The city boasts beautiful beaches, waterfalls, and a well-preserved historic Old Town.',
            type: 'Cultural',
            groupSize: 'Medium Group (Max 25 People)',
            languages: ['English', 'Turkish', 'German'],
            destinationSlug: 'antalya',
            packages: [
                {
                    name: 'Standard Tour',
                    description: 'Group tour with experienced guide',
                    adultPrice: 120,
                    childPrice: 80,
                    infantPrice: 30,
                    language: 'English',
                    capacity: 25,
                },
                {
                    name: 'Premium Tour',
                    description: 'Smaller group with luxury boat',
                    adultPrice: 200,
                    childPrice: 140,
                    infantPrice: 60,
                    language: 'English',
                    capacity: 12,
                },
            ],
        },
        {
            title: 'Fethiye: Blue Lagoon, Butterfly Valley & 12 Islands Cruise',
            slug: 'fethiye-blue-lagoon-butterfly-valley-cruise',
            description: `Set sail on the turquoise waters of the Mediterranean in this unforgettable cruise experience. Visit the world-famous Blue Lagoon (Ölüdeniz) with its stunning turquoise waters, then explore the hidden gem of Butterfly Valley, accessible only by boat.

The tour takes you to 12 beautiful islands, each with its own unique charm. You'll have opportunities to swim, snorkel, and sunbathe at pristine beaches. Enjoy delicious onboard meals prepared fresh daily, including grilled fish and Mediterranean salads.

Visit ancient Lycian rock tombs carved into cliffs, and learn about the region's rich history from our knowledgeable crew. This is the perfect way to experience the natural beauty of Turkey's Mediterranean coast.`,
            excerpt: 'Cruise through 12 stunning islands, visit the famous Blue Lagoon and Butterfly Valley on this full-day sailing adventure.',
            featured: true,
            published: true,
            duration: 'Full Day',
            thumbnail: '/assets/img/listing/listing-3.jpg',
            images: [
                '/assets/img/listing/listing-3.jpg',
                '/assets/img/listing/listing-4.jpg',
                '/assets/img/listing/listing-5.jpg',
                '/assets/img/listing/listing-6.jpg',
                '/assets/img/listing/listing-7.jpg',
                '/assets/img/listing/listing-8.jpg',
                '/assets/img/listing/listing-9.jpg',
                '/assets/img/listing/listing-10.jpg',
            ],
            included: [
                'Full-day boat cruise',
                'All meals onboard (breakfast, lunch, snacks)',
                'Snorkeling equipment',
                'Professional crew',
                'Hotel pickup and drop-off',
                'Soft drinks and water',
                'Life jackets',
                'Music and entertainment',
            ],
            excluded: [
                'Alcoholic beverages (available for purchase)',
                'Additional water activities',
                'Personal expenses',
                'Travel insurance',
                'Gratuities',
            ],
            highlights: [
                'Swim in the famous Blue Lagoon (Ölüdeniz)',
                'Explore Butterfly Valley, accessible only by boat',
                'Visit 12 beautiful islands with unique characteristics',
                'Excellent snorkeling spots with crystal-clear waters',
                'See ancient Lycian rock tombs from the sea',
                'Enjoy delicious onboard meals and entertainment',
            ],
            itinerary: [
                {
                    day: 'Morning',
                    title: 'Blue Lagoon & Island Hopping',
                    description: 'Morning pickup from hotels. Board the boat and start sailing. First stop at the world-famous Blue Lagoon for swimming and photos. Visit multiple islands with stops for swimming and snorkeling. Enjoy breakfast onboard while sailing.',
                },
                {
                    day: 'Afternoon',
                    title: 'Butterfly Valley & More Islands',
                    description: 'Arrive at Butterfly Valley, a hidden paradise only accessible by boat. Time for swimming, hiking, or relaxing. Delicious grilled lunch onboard. Continue to more islands, each with unique beauty. Visit ancient rock tombs visible from the sea. Return to Fethiye harbor with sunset views.',
                },
            ],
            locationLatitude: 36.6226,
            locationLongitude: 29.1164,
            locationDescription: 'Fethiye is a beautiful coastal town on Turkey\'s Turquoise Coast, famous for its stunning blue lagoons, islands, and natural beauty. The region offers some of the best sailing and beach experiences in the Mediterranean.',
            type: 'Beach',
            groupSize: 'Large Group (Max 40 People)',
            languages: ['English', 'Turkish', 'Russian', 'German'],
            destinationSlug: 'fethiye',
            packages: [
                {
                    name: 'Standard Cruise',
                    description: 'Shared boat with full facilities',
                    adultPrice: 80,
                    childPrice: 60,
                    infantPrice: 20,
                    language: 'English',
                    capacity: 40,
                },
                {
                    name: 'Premium Cruise',
                    description: 'Luxury boat with fewer people',
                    adultPrice: 150,
                    childPrice: 110,
                    infantPrice: 40,
                    language: 'English',
                    capacity: 20,
                },
                {
                    name: 'Private Charter',
                    description: 'Private boat for your group',
                    adultPrice: 800,
                    childPrice: 600,
                    infantPrice: 200,
                    language: 'English',
                    capacity: 15,
                },
            ],
        },
    ];
    const createdTours = [];
    for (const tourData of testTours) {
        const existing = await prisma.tour.findUnique({
            where: { slug: tourData.slug },
        });
        const destination = createdDestinations.find(d => d.slug === tourData.destinationSlug);
        if (!destination) {
            console.log(`⚠️ Destination not found: ${tourData.destinationSlug}`);
            continue;
        }
        if (!existing) {
            const tour = await prisma.tour.create({
                data: {
                    title: tourData.title,
                    slug: tourData.slug,
                    description: tourData.description,
                    excerpt: tourData.excerpt,
                    featured: tourData.featured,
                    published: tourData.published,
                    duration: tourData.duration,
                    thumbnail: tourData.thumbnail,
                    images: tourData.images,
                    included: tourData.included,
                    excluded: tourData.excluded,
                    highlights: tourData.highlights,
                    itinerary: tourData.itinerary,
                    locationLatitude: tourData.locationLatitude,
                    locationLongitude: tourData.locationLongitude,
                    locationDescription: tourData.locationDescription,
                    type: tourData.type,
                    groupSize: tourData.groupSize,
                    languages: tourData.languages,
                    destinationId: destination.id,
                },
            });
            for (const pkgData of tourData.packages) {
                await prisma.tourPackage.create({
                    data: {
                        name: pkgData.name,
                        description: pkgData.description,
                        adultPrice: pkgData.adultPrice,
                        childPrice: pkgData.childPrice,
                        infantPrice: pkgData.infantPrice,
                        language: pkgData.language,
                        capacity: pkgData.capacity,
                        tourId: tour.id,
                    },
                });
            }
            createdTours.push(tour);
            console.log(`✅ Tour created: ${tourData.title}`);
        }
        else {
            const updated = await prisma.tour.update({
                where: { id: existing.id },
                data: {
                    description: tourData.description,
                    excerpt: tourData.excerpt,
                    featured: tourData.featured,
                    published: tourData.published,
                    duration: tourData.duration,
                    thumbnail: tourData.thumbnail,
                    images: tourData.images,
                    included: tourData.included,
                    excluded: tourData.excluded,
                    highlights: tourData.highlights,
                    itinerary: tourData.itinerary,
                    locationLatitude: tourData.locationLatitude,
                    locationLongitude: tourData.locationLongitude,
                    locationDescription: tourData.locationDescription,
                    type: tourData.type,
                    groupSize: tourData.groupSize,
                    languages: tourData.languages,
                },
            });
            createdTours.push(updated);
            console.log(`ℹ️ Tour updated: ${tourData.title}`);
        }
    }
    const tours = await prisma.tour.findMany({
        take: 5,
    });
    if (tours.length > 0 && createdUsers.length > 0) {
        const reviews = [
            {
                tour: 0,
                user: 0,
                rating: 5,
                title: 'Amazing Experience',
                content: 'This was one of the most incredible trips I have ever taken! The guides were knowledgeable, the locations were stunning, and everything was perfectly organized. Highly recommend!',
            },
            {
                tour: 0,
                user: 1,
                rating: 5,
                title: 'Exceeded Expectations',
                content: 'Our tour guide made the experience unforgettable. The attention to detail and the beautiful places we visited were beyond what I expected. Worth every penny!',
            },
            {
                tour: 0,
                user: 2,
                rating: 4,
                title: 'Great Tour',
                content: 'Very well organized tour with friendly staff and beautiful destinations. The only minor issue was the timing of some activities, but overall a fantastic experience!',
            },
            {
                tour: 1,
                user: 0,
                rating: 5,
                title: 'Perfect Holiday',
                content: 'From start to finish, this tour was amazing. The food, the accommodation, and the activities were all top-notch. I would definitely book again!',
            },
            {
                tour: 1,
                user: 3,
                rating: 5,
                title: 'Unforgettable Memories',
                content: 'This tour created memories that will last a lifetime. Everything was so well organized and the guides were incredibly helpful. I cannot recommend this enough!',
            },
            {
                tour: 2,
                user: 2,
                rating: 4,
                title: 'Wonderful Experience',
                content: 'A great tour with interesting destinations and knowledgeable guides. The only thing I would improve is adding more free time for exploring. Overall, very satisfied!',
            },
        ];
        for (const reviewData of reviews) {
            if (reviewData.tour < tours.length && reviewData.user < createdUsers.length) {
                const existingReview = await prisma.review.findFirst({
                    where: {
                        userId: createdUsers[reviewData.user].id,
                        tourId: tours[reviewData.tour].id,
                    },
                });
                if (!existingReview) {
                    await prisma.review.create({
                        data: {
                            rating: reviewData.rating,
                            title: reviewData.title,
                            content: reviewData.content,
                            approved: true,
                            userId: createdUsers[reviewData.user].id,
                            tourId: tours[reviewData.tour].id,
                        },
                    });
                    console.log(`✅ Review created for tour ${tours[reviewData.tour].title}`);
                }
                else {
                    console.log(`ℹ️ Review already exists`);
                }
            }
        }
    }
    console.log('🎉 Seeding completed!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map