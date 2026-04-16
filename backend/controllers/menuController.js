import MenuItem from '../models/MenuItem.js';
import MessMenu from '../models/MessMenu.js';
import Facility from '../models/Facility.js';

// @desc    Fetch menu for a facility
// @route   GET /api/facilities/:id/menu
// @access  Public
const getFacilityMenu = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found' });
        }

        if (facility.type === 'canteen') {
            const items = await MenuItem.find({ facilityId: facility._id });
            res.json(items);
        } else {
            // For mess, get the menu for today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const messMenu = await MessMenu.findOne({
                facilityId: facility._id,
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            }).populate('breakfast.items lunch.items dinner.items');

            if (messMenu) {
                res.json(messMenu);
            } else {
                res.status(404).json({ message: 'No menu found for today' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a menu item
// @route   POST /api/items
// @access  Private/Vendor
const createMenuItem = async (req, res) => {
    try {
        const { facilityId, name, description, price, category, imageUrl, dietaryTags } = req.body;
        
        const item = new MenuItem({
            facilityId,
            name,
            description,
            price,
            category,
            imageUrl,
            dietaryTags
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update menu item availability
// @route   PUT /api/items/:id/availability
// @access  Private/Vendor
const updateItemAvailability = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (item) {
            item.availability = req.body.availability || item.availability;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add an item to today's mess menu
// @route   POST /api/facilities/:id/menu/today
// @access  Private/Vendor
const addItemToMessMenu = async (req, res) => {
    try {
        const facilityId = req.params.id;
        const { name, mealSlot, type } = req.body; 

        const item = new MenuItem({
            facilityId,
            name,
            description: '',
            dietaryTags: [type ? type.toLowerCase() : 'veg']
        });
        const createdItem = await item.save();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let messMenu = await MessMenu.findOne({
            facilityId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (!messMenu) {
            messMenu = new MessMenu({
                facilityId,
                date: new Date(),
                breakfast: { time: '7:30 AM - 9:30 AM', items: [] },
                lunch: { time: '12:30 PM - 2:30 PM', items: [] },
                dinner: { time: '7:30 PM - 9:30 PM', items: [] }
            });
        }

        const slot = mealSlot ? mealSlot.toLowerCase() : 'breakfast';
        if (slot === 'breakfast') messMenu.breakfast.items.push(createdItem._id);
        else if (slot === 'lunch') messMenu.lunch.items.push(createdItem._id);
        else if (slot === 'dinner') messMenu.dinner.items.push(createdItem._id);

        await messMenu.save();
        
        const updatedMenu = await MessMenu.findById(messMenu._id).populate('breakfast.items lunch.items dinner.items');
        res.status(201).json(updatedMenu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Clear today's mess menu
// @route   DELETE /api/facilities/:id/menu/today
// @access  Private/Vendor
const clearMessMenu = async (req, res) => {
    try {
        const facilityId = req.params.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let messMenu = await MessMenu.findOne({
            facilityId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (messMenu) {
            messMenu.breakfast.items = [];
            messMenu.lunch.items = [];
            messMenu.dinner.items = [];
            await messMenu.save();
            const updatedMenu = await MessMenu.findById(messMenu._id).populate('breakfast.items lunch.items dinner.items');
            res.json(updatedMenu);
        } else {
            res.status(404).json({ message: 'No menu found for today' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove an item from today's mess menu
// @route   DELETE /api/facilities/:id/menu/today/items/:itemId
// @access  Private/Vendor
const removeMessMenuItem = async (req, res) => {
    try {
        const facilityId = req.params.id;
        const itemId = req.params.itemId;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let messMenu = await MessMenu.findOne({
            facilityId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (messMenu) {
            messMenu.breakfast.items = messMenu.breakfast.items.filter(id => id.toString() !== itemId);
            messMenu.lunch.items = messMenu.lunch.items.filter(id => id.toString() !== itemId);
            messMenu.dinner.items = messMenu.dinner.items.filter(id => id.toString() !== itemId);
            await messMenu.save();
            await MenuItem.findByIdAndDelete(itemId);
            
            const updatedMenu = await MessMenu.findById(messMenu._id).populate('breakfast.items lunch.items dinner.items');
            res.json(updatedMenu);
        } else {
            res.status(404).json({ message: 'No menu found for today' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getFacilityMenu, createMenuItem, updateItemAvailability, addItemToMessMenu, clearMessMenu, removeMessMenuItem, deleteCanteenItem };

// @desc    Delete a canteen menu item permanently
// @route   DELETE /api/items/:id
// @access  Private/Vendor
async function deleteCanteenItem(req, res) {
    try {
        const deleted = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
