import { sample } from 'lodash';

// ----------------------------------------------------------------------

export const users = [...Array(24)].map((_, index) => ({
  id: index,
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
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
