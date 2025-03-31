/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { rateLimit } from 'express-rate-limit';

const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, 
	limit: 10000, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

export default rateLimiter