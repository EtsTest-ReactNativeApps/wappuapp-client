import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../style/theme';
import { IOS } from '../../services/device-info';

const colorfulSet = [theme.secondary, theme.secondaryLight, theme.secondaryTint];
const singleColorSet = [theme.secondary, theme.secondary, theme.secondary];

const defaultLocations = IOS ? [0, 0.5, 1] : [0, 0.6, 1];

const LG = ({ singleColor, ...props }) => (
  <LinearGradient
    start={{ x: 0.0, y: 0.9 }}
    end={{ x: 1, y: 1 }}
    locations={defaultLocations}
    colors={singleColor ? singleColorSet : colorfulSet}
    {...props}
  />
);

export default LG;
