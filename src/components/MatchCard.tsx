import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParsedMatch } from '../api';
import type { ScoresStackParamList } from '../navigation';
import { colors } from '../constants';

interface MatchCardProps {
    match: ParsedMatch;
}

const LiveDot: React.FC = () => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [opacity]);

    return <Animated.View style={[styles.liveDot, { opacity }]} />;
};

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const navigation = useNavigation<NativeStackNavigationProp<ScoresStackParamList>>();
    const isLive = match.status.state === 'in';
    const isFinished = match.status.state === 'post';
    const isScheduled = match.status.state === 'pre';

    const handlePress = () => {
        navigation.navigate('MatchDetail', {
            eventId: match.id,
            slug: match.league.slug,
            homeTeam: match.homeTeam.abbreviation || match.homeTeam.name,
            awayTeam: match.awayTeam.abbreviation || match.awayTeam.name,
        });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
            {/* Status */}
            <View style={styles.statusContainer}>
                {isLive && <LiveDot />}
                <Text style={[styles.statusText, isLive && styles.liveText]}>
                    {match.status.detail}
                </Text>
            </View>

            {/* Teams & Scores */}
            <View style={styles.matchRow}>
                {/* Home Team */}
                <TouchableOpacity
                    style={styles.teamContainer}
                    onPress={() => {
                        navigation.navigate('TeamDetail', {
                            teamId: match.homeTeam.id,
                            slug: match.league.slug,
                            teamName: match.homeTeam.name,
                        });
                    }}
                    activeOpacity={0.6}
                >
                    {match.homeTeam.logo ? (
                        <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
                    ) : (
                        <View style={styles.teamLogoPlaceholder} />
                    )}
                    <Text style={styles.teamName} numberOfLines={1}>
                        {match.homeTeam.name}
                    </Text>
                </TouchableOpacity>

                {/* Score */}
                <View style={styles.scoreContainer}>
                    {isScheduled ? (
                        <Text style={styles.scheduleTime}>{match.status.detail}</Text>
                    ) : (
                        <Text style={[styles.score, isLive && styles.liveScore]}>
                            {match.homeTeam.score} - {match.awayTeam.score}
                        </Text>
                    )}
                </View>

                {/* Away Team */}
                <TouchableOpacity
                    style={[styles.teamContainer, styles.teamContainerAway]}
                    onPress={() => {
                        navigation.navigate('TeamDetail', {
                            teamId: match.awayTeam.id,
                            slug: match.league.slug,
                            teamName: match.awayTeam.name,
                        });
                    }}
                    activeOpacity={0.6}
                >
                    {match.awayTeam.logo ? (
                        <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
                    ) : (
                        <View style={styles.teamLogoPlaceholder} />
                    )}
                    <Text style={styles.teamName} numberOfLines={1}>
                        {match.awayTeam.name}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.live,
        marginRight: 6,
    },
    statusText: {
        fontSize: 11,
        color: colors.textMuted,
        textTransform: 'uppercase',
    },
    liveText: {
        color: colors.live,
        fontWeight: '600',
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    teamContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamContainerAway: {
        flexDirection: 'row-reverse',
    },
    teamLogo: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    teamLogoPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.surfaceLight,
    },
    teamName: {
        fontSize: 14,
        color: colors.textPrimary,
        flex: 1,
    },
    scoreContainer: {
        paddingHorizontal: 12,
        minWidth: 60,
        alignItems: 'center',
    },
    score: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    liveScore: {
        color: colors.live,
    },
    scheduleTime: {
        fontSize: 13,
        color: colors.textSecondary,
    },
});
