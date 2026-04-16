import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Facility from './models/Facility.js';
import MenuItem from './models/MenuItem.js';
import MessMenu from './models/MessMenu.js';
import Feedback from './models/Feedback.js';

import { facilities, messMenus, canteenItems, emojiStats } from '../src/data/dummyData.js';
import bcrypt from 'bcryptjs';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Facility.deleteMany();
        await MenuItem.deleteMany();
        await MessMenu.deleteMany();
        await Feedback.deleteMany();
        await User.deleteMany();
        
        console.log('Previous Data Destroyed!');

        // 1. Facilities
        const createdFacilities = await Facility.insertMany(facilities.map(f => ({
            _id: new mongoose.Types.ObjectId(), // generate new ID or use mapping
            name: f.name,
            type: f.type,
            location: f.location,
            crowdLevel: f.crowdLevel
        })));
        
        console.log('Facilities Imported!');

        // Create ID mapping map for facility old ID -> new MongoDB _id
        const facilityIdMap = {};
        facilities.forEach((f, index) => {
            facilityIdMap[f.id] = createdFacilities[index]._id;
        });

        // 2. Default users
        const salt = await bcrypt.genSalt(10);
        const vendorPassword = await bcrypt.hash('admin', salt);
        const studentPassword = await bcrypt.hash('123456', salt);
        
        await User.create([
            { name: 'BH 1 Mess Vendor', email: 'vendor_bh1@test.com', password: vendorPassword, role: 'vendor', facilityId: facilityIdMap['bh1'] },
            { name: 'BH 2 Mess Vendor', email: 'vendor_bh2@test.com', password: vendorPassword, role: 'vendor', facilityId: facilityIdMap['bh2'] },
            { name: 'BH 3 Mess Vendor', email: 'vendor_bh3@test.com', password: vendorPassword, role: 'vendor', facilityId: facilityIdMap['bh3'] },
            { name: 'GH Mess Vendor', email: 'vendor_gh@test.com', password: vendorPassword, role: 'vendor', facilityId: facilityIdMap['gh'] },
            { name: 'Main Canteen Vendor', email: 'vendor_canteen@test.com', password: vendorPassword, role: 'vendor', facilityId: facilityIdMap['c1'] },
            { name: 'Student 1', email: 'student@test.com', password: studentPassword, role: 'student' }
        ]);

        console.log('Users Imported!');

        // 3. Menu Items logic map for old ID -> new ID
        const itemIdMap = {};
        
        // 3a. Canteen Items
        const mappedCanteenItems = canteenItems.map(item => {
            const newItemId = new mongoose.Types.ObjectId();
            itemIdMap[item.id] = newItemId;
            return {
                _id: newItemId,
                facilityId: facilityIdMap[item.facilityId],
                name: item.name,
                price: item.price,
                category: item.category,
                imageUrl: item.imageUrl,
                dietaryTags: item.dietaryTags,
                availability: item.availability,
                popular: item.popular
            };
        });
        
        await MenuItem.insertMany(mappedCanteenItems);
        
        // 3b. Mess Items
        for (const [facilityKey, menu] of Object.entries(messMenus)) {
            const newFacilityId = facilityIdMap[facilityKey];
            
            const createSectionItems = async (section) => {
                const sectionObjectIds = [];
                for (const item of section.items) {
                    const newItem = await MenuItem.create({
                        facilityId: newFacilityId,
                        name: item.name,
                        description: item.description,
                        dietaryTags: item.dietaryTags
                    });
                    itemIdMap[item.id] = newItem._id;
                    sectionObjectIds.push(newItem._id);
                }
                return sectionObjectIds;
            };

            const breakfastIds = await createSectionItems(menu.breakfast);
            const lunchIds = await createSectionItems(menu.lunch);
            const dinnerIds = await createSectionItems(menu.dinner);

            await MessMenu.create({
                facilityId: newFacilityId,
                date: new Date(menu.date),
                breakfast: { time: menu.breakfast.time, items: breakfastIds },
                lunch: { time: menu.lunch.time, items: lunchIds },
                dinner: { time: menu.dinner.time, items: dinnerIds }
            });
        }
        
        console.log('Menu Items Imported!');

        // 4. Feedback
        const feedbackList = [];
        for (const [oldItemId, stats] of Object.entries(emojiStats)) {
            const mongoItemId = itemIdMap[oldItemId];
            if (mongoItemId) {
                for (const [reaction, count] of Object.entries(stats)) {
                    for (let i = 0; i < count; i++) {
                        feedbackList.push({ itemId: mongoItemId, reaction });
                    }
                }
            }
        }
        
        // Insert in batches if large
        await Feedback.insertMany(feedbackList);
        console.log('Feedback Imported!');

        console.log('Data Import Completed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
