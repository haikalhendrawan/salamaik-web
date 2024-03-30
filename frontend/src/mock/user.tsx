import { sample } from 'lodash';

// ----------------------------------------------------------------------

export const users = [...Array(24)].map((_, index) => ({
  id: index,
  avatarUrl: sample(['/avatar/default-female.png','/avatar/default-male.png']),
  name: `name${index}`,
  company: sample(['Kanwil DJPb Sumbar', 'KPPN Padang', 'KPPN Bukittinggi', 'KPPN Sijunjung']),
  isVerified: true,
  status: sample(['active', 'banned']),
  role: sample([
    'Admin Kanwil',
    'User Kanwil',
    'Admin KPPN',
    'User KPPN',
    'Public'
  ]),
}));
