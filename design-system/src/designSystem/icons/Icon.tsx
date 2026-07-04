import type { ComponentType } from 'react';

import type { GlyphProps } from './glyphs';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogoutIcon,
  PanelLeftCloseIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from './glyphs';

import styles from './icon.module.css';

export type IconName =
  | 'search'
  | 'user'
  | 'logout'
  | 'chevronLeft'
  | 'chevronRight'
  | 'panelLeftClose'
  | 'layoutDashboard'
  | 'calendar'
  | 'users'
  | 'heart';

const MAP: Record<IconName, ComponentType<GlyphProps>> = {
  search: SearchIcon,
  user: UserIcon,
  logout: LogoutIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  panelLeftClose: PanelLeftCloseIcon,
  layoutDashboard: LayoutDashboardIcon,
  calendar: CalendarIcon,
  users: UsersIcon,
  heart: HeartIcon,
};

export type IconSize = 'sm' | 'md' | 'lg';

export type IconProps = Omit<GlyphProps, 'children'> & {
  name: IconName;
  size?: IconSize;
};

export function Icon({ name, size = 'md', className, title, ...rest }: IconProps) {
  const Cmp = MAP[name];
  return (
    <span
      className={[styles.wrap, styles[size], className ?? ''].join(' ')}
      data-icon={name}
    >
      <Cmp title={title} {...rest} />
    </span>
  );
}
