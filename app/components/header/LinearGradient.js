import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../style/theme';
import { IOS } from '../../services/device-info';

const colorfulSet = [theme.secondary, theme.secondaryLight, theme.secondaryTint];
const singleColorSet = [theme.secondary, theme.secondary, theme.secondary];

const defaultLocations = IOS ? [0, 0.4, 1] : [0, 0.5, 1];
const start = IOS ? { x: 0, y: 0.25 } : { x: 0.3, y: 0.25 };
const end = IOS ? { x: 1, y: 1 } : { x: 0.7, y: 1 };

const LG = ({ singleColor, ...props }) => (
  <LinearGradient
    start={start}
    end={end}
    locations={defaultLocations}
    colors={singleColor ? singleColorSet : colorfulSet}
    {...props}
  />
);

export default LG;
