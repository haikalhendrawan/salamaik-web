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
    icon: icon('solar--folder-open-bold-duotone'),
  },

];


const navAdmin = [
  {
    title: 'Reference',
    path: '/admin',
    icon: icon('solar-user-check'),
    menu:[
      {
        title: 'User',
        path: '/admin/user',
        icon: icon('dot-mark'),
      },
      {
        title: 'Kertas Kerja',
        path: '/admin/worksheet',
        icon: icon('dot-mark'),
      },
    ]
  },
];

const navMonitoring = [
  {
    title: 'Dashboard Salamaik',
    path: 'https://drive.google.com/file/d/1Z_ozqch3MV2IKWNFPDfCeafP0MPexJtO/view?usp=sharing',
    icon: icon('solar--chart-bold-duotone'),
    info: 'solar--folder-open-bold-duotone'
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
