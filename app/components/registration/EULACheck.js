'use strict';

import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import theme from '../../style/theme';

const EULACheck = ({ approved, onChange, onTermsShow }) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.linkText}>
        <Text style={styles.text}>I accept </Text>
        <TouchableOpacity onPress={onTermsShow}>
          <Text style={styles.link}>Terms of Service (EULA)</Text>
        </TouchableOpacity>
      </View>

      <Switch value={approved} onValueChange={onChange} onTintColor={theme.primary} />
    </View>
  );
};

EULACheck.propTypes = {
  approved: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onTermsShow: PropTypes.func.isRequired,
};

EULACheck.defaultProps = {
  approved: false,
};

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 0,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  linkText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: theme.dark,
  },
  link: {
    fontSize: 12,
    color: theme.primary,
  },
});

export default EULACheck;
