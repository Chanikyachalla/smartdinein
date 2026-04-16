import Facility from '../models/Facility.js';

// @desc    Fetch all facilities
// @route   GET /api/facilities
// @access  Public
const getFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find({});
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single facility
// @route   GET /api/facilities/:id
// @access  Public
const getFacilityById = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (facility) {
            res.json(facility);
        } else {
            res.status(404).json({ message: 'Facility not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update crowd level
// @route   PUT /api/facilities/:id/crowd
// @access  Private/Vendor
const updateCrowdLevel = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);

        if (facility) {
            facility.crowdLevel = req.body.crowdLevel || facility.crowdLevel;
            const updatedFacility = await facility.save();
            res.json(updatedFacility);
        } else {
            res.status(404).json({ message: 'Facility not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getFacilities, getFacilityById, updateCrowdLevel };
