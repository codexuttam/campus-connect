import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { theme } from '../../theme';

export interface CollaborationMarkProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * CollaborationMark
 *
 * Minimalist, tactile graphic representing student collaboration,
 * shared intellectual inquiry, and collegiate community.
 * Uses strict flat geometry and the CampusConnect palette.
 */
export const CollaborationMark: React.FC<CollaborationMarkProps> = ({
  size = 180,
  style,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
        {/* Outer subtle orbital boundary ring */}
        <Circle
          cx="80"
          cy="80"
          r="74"
          stroke={theme.colors.border}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Central warm medallion */}
        <Circle
          cx="80"
          cy="80"
          r="48"
          fill={theme.colors.card}
          stroke={theme.colors.border}
          strokeWidth="1"
        />

        {/* Interconnected triangular nexus of collaborative scholars */}
        {/* Node 1: Top (Primary Maroon) */}
        <G>
          <Path
            d="M80 50 L56 94 L104 94 Z"
            stroke={theme.colors.border}
            strokeWidth="1.5"
            fill="none"
          />
          {/* Internal interconnect lines */}
          <Path
            d="M80 50 L80 80 M56 94 L80 80 M104 94 L80 80"
            stroke={theme.colors.borderSubtle}
            strokeWidth="1"
          />
        </G>

        {/* Node A (Top - Academic Leadership) */}
        <Circle cx="80" cy="48" r="10" fill={theme.colors.maroon} />
        <Circle cx="80" cy="48" r="4" fill={theme.colors.textInverse} />

        {/* Node B (Bottom Left - Peer Discussion) */}
        <Circle cx="54" cy="96" r="10" fill={theme.colors.olive} />
        <Circle cx="54" cy="96" r="4" fill={theme.colors.textInverse} />

        {/* Node C (Bottom Right - Research & Projects) */}
        <Circle cx="106" cy="96" r="10" fill={theme.colors.textPrimary} />
        <Circle cx="106" cy="96" r="4" fill={theme.colors.textInverse} />

        {/* Center Nexus Point */}
        <Circle
          cx="80"
          cy="80"
          r="5"
          fill={theme.colors.surface}
          stroke={theme.colors.maroon}
          strokeWidth="1.5"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

