// Quick script to add a test instructor
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';

dotenv.config();

const addTestInstructor = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create or update instructor
        const instructor = await User.findOneAndUpdate(
            { email: 'bhantureddy65@gmail.com' },
            {
                email: 'bhantureddy65@gmail.com',
                name: 'Test Instructor',
                role: 'instructor',
                department: 'Computer Science'
            },
            { upsert: true, new: true }
        );
        console.log('Instructor created:', instructor.email);

        // Assign instructor to a course (first available course)
        const course = await Course.findOneAndUpdate(
            {},
            { instructorId: instructor._id },
            { new: true }
        );

        if (course) {
            console.log('Assigned to course:', course.name);
        }

        console.log('\n✅ Done! You can now:');
        console.log('1. Login as student and request enrollment');
        console.log('2. The instructor email bhantureddy65@gmail.com will receive notification');
        console.log('3. Login as instructor with bhantureddy65@gmail.com to approve');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

addTestInstructor();
