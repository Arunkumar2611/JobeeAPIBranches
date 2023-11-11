const express = require('express')
const router = express.Router()

// Importing jobs controller methods
const { getJobs, newJob, getJobsInRadius, updateJob, deleteJob} = require('../controllers/jobsController')

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

router.route('/jobs').get(getJobs)
// router.post('/job/new', newJob)
router.route('/job/new').post(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), newJob)
router.get('/jobs/:zipcode/:distance',getJobsInRadius)
// router.put('/job/:id', updateJob)
router.delete('/job/:id', deleteJob)
//Protected routes only authenticated user can make changes via this routes
router.route('/jobs/:id').put(isAuthenticatedUser,updateJob).delete(isAuthenticatedUser,deleteJob)

module.exports = router
