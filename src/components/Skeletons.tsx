import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants';

const ShimmerBar: React.FC<{ width: number | string; height: number; style?: any }> = ({ width, height, style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                { width: width as any, height, backgroundColor: colors.surface, borderRadius: 6, opacity },
                style,
            ]}
        />
    );
};

const SkeletonMatch: React.FC = () => (
    <View style={styles.matchRow}>
        <ShimmerBar width={28} height={28} style={styles.teamLogo} />
        <ShimmerBar width={100} height={14} />
        <View style={styles.scorePlaceholder}>
            <ShimmerBar width={20} height={16} />
        </View>
    </View>
);

const SkeletonSection: React.FC = () => (
    <View style={styles.section}>
        <ShimmerBar width={120} height={14} style={{ marginBottom: 12 }} />
        <SkeletonMatch />
        <SkeletonMatch />
        <SkeletonMatch />
    </View>
);

export const ScoresSkeleton: React.FC = () => (
    <View style={styles.container}>
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
    </View>
);

export const StandingsSkeleton: React.FC = () => (
    <View style={styles.container}>
        <ShimmerBar width="60%" height={16} style={{ marginBottom: 16, alignSelf: 'center' }} />
        {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={styles.standingsRow}>
                <ShimmerBar width={20} height={14} />
                <ShimmerBar width={28} height={28} style={{ marginLeft: 8 }} />
                <ShimmerBar width={120} height={14} style={{ marginLeft: 8 }} />
                <ShimmerBar width={30} height={14} style={{ marginLeft: 'auto' }} />
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 10,
    },
    teamLogo: {
        borderRadius: 14,
    },
    scorePlaceholder: {
        marginLeft: 'auto',
    },
    standingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
});
