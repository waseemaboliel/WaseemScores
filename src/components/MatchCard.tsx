import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { ParsedMatch } from '../api';
import { colors } from '../constants';

interface MatchCardProps {
    match: ParsedMatch;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const isLive = match.status.state === 'in';
    const isFinished = match.status.state === 'post';
    const isScheduled = match.status.state === 'pre';

    return (
        <View style={styles.container}>
            {/* Status */}
            <View style={styles.statusContainer}>
                {isLive && <View style={styles.liveDot} />}
                <Text style={[styles.statusText, isLive && styles.liveText]}>
                    {match.status.detail}
                </Text>
            </View>

            {/* Teams & Scores */}
            <View style={styles.matchRow}>
                {/* Home Team */}
                <View style={styles.teamContainer}>
                    {match.homeTeam.logo ? (
                        <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
                    ) : (
                        <View style={styles.teamLogoPlaceholder} />
                    )}
                    <Text style={styles.teamName} numberOfLines={1}>
                        {match.homeTeam.name}
                    </Text>
                </View>

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
                <View style={[styles.teamContainer, styles.teamContainerAway]}>
                    {match.awayTeam.logo ? (
                        <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
                    ) : (
                        <View style={styles.teamLogoPlaceholder} />
                    )}
                    <Text style={styles.teamName} numberOfLines={1}>
                        {match.awayTeam.name}
                    </Text>
                </View>
            </View>
        </View>
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
