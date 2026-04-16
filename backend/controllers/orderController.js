import Order from '../models/Order.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Public
const placeOrder = async (req, res) => {
    try {
        const { facilityId, customerName, hostel, phone, items } = req.body;
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({ facilityId, customerName, hostel, phone, items, totalAmount });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get pending orders for a facility
// @route   GET /api/facilities/:id/orders
// @access  Private/Vendor
const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({ facilityId: req.params.id, status: 'pending' })
            .sort({ createdAt: 1 }); // oldest first (FIFO)
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark an order as completed
// @route   PUT /api/orders/:id/complete
// @access  Private/Vendor
const completeOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = 'completed';
        await order.save();
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get completed order history for a facility
// @route   GET /api/facilities/:id/orders/history
// @access  Private/Vendor
const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ facilityId: req.params.id, status: 'completed' })
            .sort({ updatedAt: -1 })
            .limit(100);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { placeOrder, getPendingOrders, completeOrder, getOrderHistory };
