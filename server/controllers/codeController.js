const asyncHandler = require('express-async-handler');

const Code = require('../models/codeModel');
const User = require('../models/userModel')

// @desc    Get code
// @route   GET /api/code
// @access  Private
const getCode = asyncHandler(async (req, res) => {
    const code = await Code.find({ user: req.user.id });
    console.log(code);

    res.status(200).json(code);
});

// @desc    Set code
// @route   POST /api/code
// @access  Private
const setCode = asyncHandler(async (req, res) => {
    // const { html, css, js } = req.body;

    const code = await Code.create({
        html: req.body.html,
        css: req.body.css,
        js: req.body.js,
        user: req.body.id,
    });

    res.status(201).json(code); //herehere
});

// @desc    Update code
// @route   PUT /api/code/:id
// @access  Private
const updateCode = asyncHandler(async (req, res) => {
    // Check if the code exists
    const code = await Code.findById(req.params.id);
    if (!code) {
        // If not, send a 404 error
        res.status(404);
        throw new Error('Code not found');
    }

    // Make sure the logged-in user matches the code user
    if (code.user.toString() !== req.user._id.toString()) {
        // If not, send a 401 error
        res.status(401);
        throw new Error('User not authorized');
    }

    // Update the code with the request body
    const updatedCode = await Code.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    // Send the updated code as a response
    res.status(200).json(updatedCode);
});


// @desc    Delete code
// @route   DELETE /api/code/:id
// @access  Private
const deleteCode = asyncHandler(async (req, res) => {
    const code = await Code.findById(req.params.id);

    if (!code) {
        res.status(400);
        throw new Error('Code not found');
    }

    // Make sure the logged-in user matches the code user
    if (code.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await code.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCode,
    setCode,
    updateCode,
    deleteCode,
};



