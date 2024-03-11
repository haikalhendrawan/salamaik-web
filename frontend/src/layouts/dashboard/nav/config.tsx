// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />


const navConfig = [
  {
    title: 'Data TIK',
    path: '/iasset',
    icon: icon('solar-database-bold'),
  },
  {
    title: 'Worksheet',
    path: '/worksheet',
    icon: icon('solar-document'),
  },

];

const navConfig2 = [
  {
    title: 'Log Book TIK',
    path: '/logbook',
    icon: icon('solar-notebook'),
  },
  {
    title: 'Monitoring',
    path: '/monitoring',
    icon: icon('solar-telescope'), 
  },
  // {
  //   title: 'Topology',
  //   path: '/topology',
  //   icon: icon('solar-usb'),
  // },
];

const navConfig5 = [
  {
    title: 'Reference',
    path: '/admin',
    icon: icon('solar-user-check'),
    menu:[
      {
        title: 'User Management',
        path: '/admin/user',
        icon: icon('dot-mark'),
      },
      {
        title: 'Worksheet Data',
        path: '/admin/worksheet',
        icon: icon('dot-mark'),
      },
    ]
  },
];

const navConfig4 = [
  {
    title: 'Panduan',
    path: 'https://drive.google.com/file/d/1Z_ozqch3MV2IKWNFPDfCeafP0MPexJtO/view?usp=sharing',
    icon: icon('help-outline'),
    info: 'blank'
  },
];

const navConfig3 = [
  {
    title: 'Home',
    path: '/app',
    icon: icon('home-bold-duotone'),
  },
];

export default navConfig;
export {navConfig2, navConfig3, navConfig4, navConfig5};
