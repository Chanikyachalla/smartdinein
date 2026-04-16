// src/data/dummyData.js

export const facilities = [
  { id: 'bh1', name: 'BH 1 Mess', type: 'mess', location: 'Boys Hostel 1', crowdLevel: 'medium' },
  { id: 'bh2', name: 'BH 2 Mess', type: 'mess', location: 'Boys Hostel 2', crowdLevel: 'low' },
  { id: 'bh3', name: 'BH 3 Mess', type: 'mess', location: 'Boys Hostel 3', crowdLevel: 'high' },
  { id: 'gh', name: 'GH Mess', type: 'mess', location: 'Girls Hostel', crowdLevel: 'medium' },
  { id: 'c1', name: 'Main Canteen', type: 'canteen', location: 'Student Center', crowdLevel: 'low' },
];

export const messMenus = {
  'bh1': {
    date: new Date().toISOString().split('T')[0],
    breakfast: {
      time: '7:30 AM - 9:30 AM',
      items: [
        { id: 'm1', name: 'Masala Dosa', description: 'Served with sambar and coconut chutney', dietaryTags: ['veg'] },
        { id: 'm2', name: 'Bread Omelette', description: 'Two egg omelette with toasted bread', dietaryTags: ['non-veg'] },
        { id: 'm3', name: 'Tea & Coffee', description: 'Hot beverages', dietaryTags: ['veg'] }
      ]
    },
    lunch: {
      time: '12:30 PM - 2:30 PM',
      items: [
        { id: 'm4', name: 'Dal Tadka', description: 'Yellow lentils with spices', dietaryTags: ['veg', 'jain'] },
        { id: 'm5', name: 'Jeera Rice', description: 'Basmati rice tempered with cumin', dietaryTags: ['veg'] },
        { id: 'm6', name: 'Chicken Curry', description: 'Spicy chicken in rich gravy', dietaryTags: ['non-veg'] }
      ]
    },
    dinner: {
      time: '7:30 PM - 9:30 PM',
      items: [
        { id: 'm7', name: 'Chapati', description: 'Whole wheat flatbread', dietaryTags: ['veg'] },
        { id: 'm8', name: 'Aloo Gobi', description: 'Potato and cauliflower curry', dietaryTags: ['veg'] },
        { id: 'm9', name: 'Cut Fruits', description: 'Seasonal mixed fruits', dietaryTags: ['veg'] }
      ]
    }
  },
  'bh2': {
    date: new Date().toISOString().split('T')[0],
    breakfast: {
      time: '7:30 AM - 9:30 AM',
      items: [
        { id: 'm10', name: 'Idli Vada', description: 'Served with sambar and coconut chutney', dietaryTags: ['veg'] },
        { id: 'm11', name: 'Boiled Egg', description: 'Two boiled eggs', dietaryTags: ['non-veg'] },
      ]
    },
    lunch: {
      time: '12:30 PM - 2:30 PM',
      items: [
        { id: 'm12', name: 'Rajma Chawal', description: 'Kidney beans curry with rice', dietaryTags: ['veg'] },
        { id: 'm13', name: 'Egg Curry', description: 'Spicy egg curry', dietaryTags: ['non-veg'] }
      ]
    },
    dinner: {
      time: '7:30 PM - 9:30 PM',
      items: [
        { id: 'm14', name: 'Puri Sabzi', description: 'Puri with potato curry', dietaryTags: ['veg'] },
        { id: 'm15', name: 'Gulab Jamun', description: 'Sweet dessert', dietaryTags: ['veg'] }
      ]
    }
  },
  'bh3': {
    date: new Date().toISOString().split('T')[0],
    breakfast: {
      time: '7:30 AM - 9:30 AM',
      items: [
        { id: 'm16', name: 'Poha', description: 'Flattened rice cooked with peanuts', dietaryTags: ['veg'] }
      ]
    },
    lunch: {
      time: '12:30 PM - 2:30 PM',
      items: [
        { id: 'm17', name: 'Chole Bhature', description: 'Spicy chickpeas with fried bread', dietaryTags: ['veg'] }
      ]
    },
    dinner: {
      time: '7:30 PM - 9:30 PM',
      items: [
        { id: 'm18', name: 'Fried Rice', description: 'Veg fried rice', dietaryTags: ['veg'] }
      ]
    }
  },
  'gh': {
    date: new Date().toISOString().split('T')[0],
    breakfast: {
      time: '7:30 AM - 9:30 AM',
      items: [
        { id: 'm19', name: 'Upma', description: 'Semolina dish', dietaryTags: ['veg'] }
      ]
    },
    lunch: {
      time: '12:30 PM - 2:30 PM',
      items: [
        { id: 'm20', name: 'Paneer Butter Masala', description: 'Rich paneer gravy with naan', dietaryTags: ['veg'] }
      ]
    },
    dinner: {
      time: '7:30 PM - 9:30 PM',
      items: [
        { id: 'm21', name: 'Veg Noodles', description: 'Hakka noodles', dietaryTags: ['veg'] }
      ]
    }
  }
};

export const canteenItems = [
  {
    id: 'c1_1',
    facilityId: 'c1',
    name: 'Masala Dosa',
    price: 40,
    category: 'meals',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=500&q=80',
    dietaryTags: ['veg'],
    availability: 'available',
    popular: true
  },
  {
    id: 'c1_2',
    facilityId: 'c1',
    name: 'Cold Coffee',
    price: 35,
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
    dietaryTags: ['veg'],
    availability: 'limited',
    popular: true
  },
  {
    id: 'c1_3',
    facilityId: 'c1',
    name: 'Chicken Roll',
    price: 60,
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
    dietaryTags: ['non-veg'],
    availability: 'soldOut',
    popular: false
  },
  {
    id: 'c1_4',
    facilityId: 'c1',
    name: 'Samosa',
    price: 15,
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    dietaryTags: ['veg'],
    availability: 'available',
    popular: false
  },
  {
    id: 'c1_5',
    facilityId: 'c1',
    name: 'Veg Burger',
    price: 50,
    category: 'meals',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80',
    dietaryTags: ['veg'],
    availability: 'available',
    popular: true
  }
];

export const emojiStats = {
  'm1': { '😍': 120, '😊': 45, '😐': 10, '😞': 2 },
  'm6': { '😍': 200, '😊': 50, '😐': 5, '😞': 1 },
  'c1_1': { '😍': 80, '😊': 20, '😐': 2, '😞': 0 },
  'c1_2': { '😍': 150, '😊': 30, '😐': 5, '😞': 1 }
};
