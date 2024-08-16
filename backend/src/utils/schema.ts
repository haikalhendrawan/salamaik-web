import { z } from 'zod';

// ----------------------------------------------------------------------------------------------------

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,}$/; // Minimum 8 characters, at least one letter and one number

export  const passwordSchema =  z
                                .string()
                                .regex(
                                  passwordRegex,
                                  'Minimum 8 characters, at least one letter and one number'
                                );

export const emailSchema = z.string().email('Invalid email');
