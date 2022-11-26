import express, { Router } from 'express';

import { router as toolsRouter } from './tools'

const router: Router = express.Router()

router.use('/tools', toolsRouter)

// module.exports = router;
export { router };