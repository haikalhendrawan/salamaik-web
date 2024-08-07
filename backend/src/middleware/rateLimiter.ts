import { rateLimit } from 'express-rate-limit'

const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, 
	limit: 300, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

export default rateLimiter