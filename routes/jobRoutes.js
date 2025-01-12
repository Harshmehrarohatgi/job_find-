const express = require('express');
const Job = require('../models/Job.');
const User = require('../models/User.');
const router = express.Router();

// Create Job
router.post('/', async (req, res) => {
    const { title, company, location, postedDate, description, skills, salary } = req.body;
    try {
        const job = new Job({ title, company, location, postedDate, description, skills, salary });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Apply for Job
router.post('/:jobId/apply', async (req, res) => {
    const { userId } = req.body;
    try {
        const job = await Job.findById(req.params.jobId);
        const user = await User.findById(userId);

        if (!job || !user) return res.status(404).json({ message: 'Job or User not found' });

        job.applicants.push(user._id);
        user.appliedJobs.push(job._id);

        await job.save();
        await user.save();

        res.status(200).json({ message: 'Applied successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;