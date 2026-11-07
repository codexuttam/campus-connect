import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { CheckCircle2, ShieldCheck, MapPin } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppCard } from '../../../components/ui/AppCard';
import { MarketplaceSeller } from '../types';
import { theme } from '../../../theme';

export interface SellerInfoCardProps {
  seller: MarketplaceSeller;
  onPressProfile?: () => void;
}

export const SellerInfoCard: React.FC<SellerInfoCardProps> = ({
  seller,
  onPressProfile,
}) => {
  return (
    <AppCard variant="default" padding="md" style={styles.card}>
      <Pressable
        onPress={onPressProfile}
        disabled={!onPressProfile}
        style={styles.sellerHeader}
      >
        <AppAvatar
          name={seller.fullName}
          source={seller.avatarUrl ? { uri: seller.avatarUrl } : undefined}
          size="lg"
        />
        <View style={styles.sellerDetails}>
          <View style={styles.nameRow}>
            <AppText variant="bodyMedium" style={styles.sellerName} numberOfLines={1}>
              {seller.fullName}
            </AppText>
            {seller.isCollegeVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={13} color={theme.colors.olive} strokeWidth={2.4} />
                <AppText variant="caption" style={styles.verifiedText}>
                  Verified Student
                </AppText>
              </View>
            )}
          </View>

          {/* Academic / College Details */}
          <AppText variant="caption" color="secondary" numberOfLines={1}>
            {seller.collegeName}
            {seller.courseOrBranch ? ` • ${seller.courseOrBranch}` : ''}
            {seller.graduationYear ? ` '${seller.graduationYear.slice(-2)}` : ''}
          </AppText>

          {/* Activity / Trust stat */}
          <View style={styles.statsRow}>
            {seller.memberSince && (
              <AppText variant="caption" color="muted">
                Active member since {seller.memberSince}
              </AppText>
            )}
            {typeof seller.soldCount === 'number' && seller.soldCount > 0 && (
              <AppText variant="caption" color="muted">
                {' • '}{seller.soldCount} {seller.soldCount === 1 ? 'item' : 'items'} sold
              </AppText>
            )}
          </View>
        </View>
      </Pressable>

      {/* Safety & Meetup Recommendation Banner */}
      <View style={styles.safetyNotice}>
        <ShieldCheck size={16} color={theme.colors.olive} strokeWidth={1.8} />
        <AppText variant="caption" color="secondary" style={styles.safetyText}>
          Campus safety reminder: Meet in daylight at verified campus spots (Student Union, main library, or academic cafes).
        </AppText>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.sm,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  sellerName: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.oliveLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.radius.xs,
  },
  verifiedText: {
    color: theme.colors.olive,
    fontSize: 10,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderSubtle,
  },
  safetyText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
});
