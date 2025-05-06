import { seedDatabase } from '../app/crud/seedDatabase';
import { clearDatabase } from '../app/crud/clearDatabase';

const runSeed = async () => {
    console.log('Starting database seeding process...');
    try {
        // First, clear the database
        console.log('Clearing existing data...');
        const cleared = await clearDatabase();
        if (!cleared) {
            console.error('Failed to clear database');
            process.exit(1);
        }

        // Then, seed new data
        console.log('Seeding new data...');
        const success = await seedDatabase();
        if (success) {
            console.log('Database seeded successfully!');
            process.exit(0);
        } else {
            console.error('Failed to seed database');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error in seeding process:', error);
        process.exit(1);
    }
};

runSeed(); 