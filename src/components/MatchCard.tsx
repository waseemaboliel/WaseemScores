import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParsedMatch } from '../api';
import type { ScoresStackParamList } from '../navigation';
import { colors } from '../constants';
import { useSettings } from '../stores';

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

const getCountdown = (dateStr: string): string | null => {
    const now = new Date();
    const match = new Date(dateStr);
    const diff = match.getTime() - now.getTime();
    if (diff <= 0 || diff > 24 * 60 * 60 * 1000) return null; // only show within 24h
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `in ${hours}h ${mins}m`;
    return `in ${mins}m`;
};

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const navigation = useNavigation<NativeStackNavigationProp<ScoresStackParamList>>();
    const { settings } = useSettings();
    const isLive = match.status.state === 'in';
    const isFinished = match.status.state === 'post';
    const isScheduled = match.status.state === 'pre';
    const [spoilerRevealed, setSpoilerRevealed] = useState(false);
    const showScores = !settings.spoilerMode || spoilerRevealed || isScheduled;

    // Score flash animation
    const flashOpacity = useRef(new Animated.Value(0)).current;
    const prevScoreRef = useRef(`${match.homeTeam.score}-${match.awayTeam.score}`);

    useEffect(() => {
        const currentScore = `${match.homeTeam.score}-${match.awayTeam.score}`;
        if (isLive && prevScoreRef.current !== currentScore && prevScoreRef.current !== '-') {
            // Score changed — flash!
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ]).start();
        }
        prevScoreRef.current = currentScore;
    }, [match.homeTeam.score, match.awayTeam.score, isLive, flashOpacity]);

    // Countdown for scheduled matches
    const countdown = isScheduled ? getCountdown(match.date) : null;

    const handlePress = () => {
        if (settings.spoilerMode && !spoilerRevealed && !isScheduled) {
            setSpoilerRevealed(true);
            return;
        }
        navigation.navigate('MatchDetail', {
            eventId: match.id,
            slug: match.league.slug,
            homeTeam: match.homeTeam.abbreviation || match.homeTeam.name,
            awayTeam: match.awayTeam.abbreviation || match.awayTeam.name,
        });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
            {/* Score flash overlay */}
            <Animated.View
                style={[styles.flashOverlay, { opacity: flashOpacity }]}
                pointerEvents="none"
            />

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

                {/* Score / Countdown */}
                <View style={styles.scoreContainer}>
                    {isScheduled ? (
                        <View style={styles.scheduleContainer}>
                            <Text style={styles.scheduleTime}>{match.status.detail}</Text>
                            {countdown && (
                                <Text style={styles.countdown}>{countdown}</Text>
                            )}
                        </View>
                    ) : showScores ? (
                        <Text style={[styles.score, isLive && styles.liveScore]}>
                            {match.homeTeam.score} - {match.awayTeam.score}
                        </Text>
                    ) : (
                        <Text style={styles.spoilerHidden}>? - ?</Text>
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
        position: 'relative',
        overflow: 'hidden',
    },
    flashOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary + '25',
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
    scheduleContainer: {
        alignItems: 'center',
    },
    countdown: {
        fontSize: 10,
        color: colors.primary,
        marginTop: 2,
        fontWeight: '600',
    },
    spoilerHidden: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textMuted,
    },
});
