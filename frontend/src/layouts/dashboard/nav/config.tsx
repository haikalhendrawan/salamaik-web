/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/icon/${name}.svg`} sx={{ width: 1, height: 1 }} />


const navSupervisi = [
  {
    title: 'Kertas Kerja',
    path: '/worksheet',
    icon: icon('solar--clipboard-list-bold-duotone'),
  },
  {
    title: 'Matriks',
    path: '/matrix',
    icon: icon('solar--presentation-graph-bold-duotone'),
  },
  {
    title: 'Tindak Lanjut',
    path: '/followUp',
    icon: icon('solar--rocket-2-bold-duotone'),
  },
];

const navMonitoring = [
  {
    title: 'Standardisasi KPPN',
    path: '/standard',
    icon: icon('solar--palette-round-bold-duotone'),
  },
  {
    title: "Riwayat Pembinaan",
    path: '/history',
    icon: icon('solar--database-bold-duotone'),
  }
];

const navAdmin = [
  {
    title: 'Reference',
    path: '/reference',
    icon: icon('solar-user-check'),
    menu:[
      {
        title: 'User',
        path: '/reference/user',
        icon: icon('dot-mark'),
      },
      {
        title: 'Kertas Kerja',
        path: '/reference/worksheet',
        icon: icon('dot-mark'),
      },
    ]
  },
  {
    title: 'Interface',
    path: '/interface',
    icon: icon('solar--diploma-verified-bold-duotone'),
    menu:[
      {
        title: 'Notification',
        path: '/interface/notification',
        icon: icon('dot-mark'),
      },
      {
        title: 'Gallery',
        path: '/interface/gallery',
        icon: icon('dot-mark'),
      },
      {
        title: 'Activity Log',
        path: '/interface/activity-log',
        icon: icon('dot-mark'),
      },
    ]
  },
];



const navHome = [
  {
    title: 'Home',
    path: '/home',
    icon: icon('home-bold-duotone'),
  },
];

export {navSupervisi, navHome, navMonitoring, navAdmin};
