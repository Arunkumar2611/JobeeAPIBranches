const Job = require('../models/jobs')
const geoCoder = require('../utils/geocoder')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

// Get all Jobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors( async (req, res, next) => {
  // console.log("inside get job")
  const jobs = await Job.find()

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs

  })
})

// Create a new Job = > /api/v1/job/new

exports.newJob = async (req, res, next) => {
  // console.log("insie new job")
  // const { body} = req;
  // console.log(body)

  //Adding user to body
  req.body.user = req.user.id
  const job = await Job.create(req.body)
  // console.log(job)

  res.status(200).json({
    success: true,
    message: 'Job Created',
    data: job
  })
}

// Update a Job => /api/v1/job/:id

exports.updateJob = catchAsyncErrors( async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    console.log("in error handler update method")
     return next(new ErrorHandler('Job not found', 404))
  
  }
  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    success: true,
    message: 'Job is updated',
    data: job
  })
})


//Delete a Job => /api/v1/job/:id

exports.deleteJob = catchAsyncErrors( async (req, res, next) => {
  let job = await Job.findById(req.params.id)

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    })

  }
  job = await Job.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: 'Job is deleted',
    data: job
  })
})

// Search jobs within radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Getting latitude & longitude from geocoder with zipcode
  const loc = await geoCoder.geocode(zipcode)
  const latitude = loc[0].latitude
  const longitude = loc[0].longitude

  const radius = disatnce / 3963
  const jobs = await Job.find({
    location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
  })
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs

  })
}