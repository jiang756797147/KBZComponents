import 'react-native-popup-menu/src/polyfills';
import { deprecatedComponent } from 'react-native-popup-menu/src/helpers'

import Menu from 'react-native-popup-menu/src/Menu';
import MenuProvider from 'react-native-popup-menu/src/MenuProvider';
import MenuOption from 'react-native-popup-menu/src/MenuOption';
import MenuOptions from 'react-native-popup-menu/src/MenuOptions';
import MenuTrigger from 'react-native-popup-menu/src/MenuTrigger';

import ContextMenu from 'react-native-popup-menu/src/renderers/ContextMenu';
import NotAnimatedContextMenu from 'react-native-popup-menu/src/renderers/NotAnimatedContextMenu';
import SlideInMenu from 'react-native-popup-menu/src/renderers/SlideInMenu';
import Popover from 'react-native-popup-menu/src/renderers/Popover';
import ContextMenu1 from './ContextMenu1';
import PopoverNew from './PopoverNew';
const renderers = { ContextMenu, ContextMenu1, SlideInMenu, NotAnimatedContextMenu, Popover, PopoverNew };

const MenuContext = deprecatedComponent(
    'MenuContext is deprecated and it might be removed in future releases, use MenuProvider instead.',
    ['openMenu', 'toggleMenu', 'closeMenu', 'isMenuOpen'],
)(MenuProvider);

export {
    Menu as default,
    Menu,
    MenuProvider,
    MenuContext,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
};