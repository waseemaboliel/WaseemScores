import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { espnApi } from '../api';
import { colors } from '../constants';

interface PlayerProfileParams {
    playerId: string;
    playerName: string;
    slug: string;
}

const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

export const PlayerProfileScreen: React.FC = () => {
    const route = useRoute();
    const { playerId, playerName, slug } = route.params as PlayerProfileParams;

    const { data: infoData, isLoading: infoLoading } = useQuery({
        queryKey: ['athleteInfo', slug, playerId],
        queryFn: () => espnApi.getAthleteInfo(slug, playerId),
        staleTime: 60 * 60 * 1000,
    });

    const { data: overviewData, isLoading: overviewLoading } = useQuery({
        queryKey: ['athleteOverview', slug, playerId],
        queryFn: () => espnApi.getAthleteOverview(slug, playerId),
        staleTime: 60 * 60 * 1000,
    });

    if (infoLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const athlete = infoData?.athlete ?? {};
    const stats = overviewData?.statistics;
    const gameLog = overviewData?.gameLog;

    const displayName = athlete.displayName ?? playerName;

    // Build stat rows from splits
    const statLabels = stats?.labels ?? [];
    const statNames = stats?.names ?? [];
    const splits = stats?.splits ?? [];

    // Key stat indices for display
    const keyStatNames = ['totalGoals', 'goalAssists', 'starts', 'yellowCards', 'redCards', 'totalShots', 'shotsOnTarget'];
    const keyStatLabels = ['G', 'A', 'STRT', 'YC', 'RC', 'SHOT', 'SOG'];

    return (
        <ScrollView style={styles.container}>
            {/* Player Header */}
            <View style={styles.header}>
                <View style={styles.headshot}>
                    <Text style={styles.headshotInitials}>{getInitials(displayName)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.playerName}>{displayName}</Text>
                    {athlete.position && (
                        <Text style={styles.position}>{athlete.position.displayName}</Text>
                    )}
                    <View style={styles.metaRow}>
                        {athlete.jersey != null && (
                            <Text style={styles.metaItem}>#{athlete.jersey}</Text>
                        )}
                        {athlete.team?.displayName && (
                            <Text style={styles.metaItem}>{athlete.team.displayName}</Text>
                        )}
                    </View>
                    {athlete.statsSummary && (
                        <Text style={styles.statsSummary}>
                            {typeof athlete.statsSummary === 'string'
                                ? athlete.statsSummary
                                : athlete.statsSummary.displayName ?? ''}
                        </Text>
                    )}
                </View>
            </View>

            {/* Bio */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Info</Text>
                <View style={styles.bioCard}>
                    {athlete.dateOfBirth && (
                        <View style={styles.bioRow}>
                            <Text style={styles.bioLabel}>Age</Text>
                            <Text style={styles.bioValue}>{athlete.age ?? '—'}</Text>
                        </View>
                    )}
                    {athlete.displayHeight && (
                        <View style={styles.bioRow}>
                            <Text style={styles.bioLabel}>Height</Text>
                            <Text style={styles.bioValue}>{athlete.displayHeight}</Text>
                        </View>
                    )}
                    {athlete.displayWeight && (
                        <View style={styles.bioRow}>
                            <Text style={styles.bioLabel}>Weight</Text>
                            <Text style={styles.bioValue}>{athlete.displayWeight}</Text>
                        </View>
                    )}
                    {athlete.citizenship && (
                        <View style={styles.bioRow}>
                            <Text style={styles.bioLabel}>Nationality</Text>
                            <Text style={styles.bioValue}>{athlete.citizenship}</Text>
                        </View>
                    )}
                    {athlete.birthPlace?.city && (
                        <View style={styles.bioRow}>
                            <Text style={styles.bioLabel}>Birthplace</Text>
                            <Text style={styles.bioValue}>
                                {[athlete.birthPlace.city, athlete.birthPlace.country].filter(Boolean).join(', ')}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Season Stats Table */}
            {splits.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Season Stats</Text>
                    <View style={styles.statsTable}>
                        {/* Header */}
                        <View style={styles.statsHeaderRow}>
                            <Text style={[styles.statsCell, styles.statsCellWide, styles.statsHeaderText]}>Season</Text>
                            {statLabels.map((label: string) => (
                                <Text key={label} style={[styles.statsCell, styles.statsHeaderText]}>{label}</Text>
                            ))}
                        </View>
                        {/* Rows */}
                        {splits.map((split: any, i: number) => (
                            <View key={i} style={[styles.statsRow, i % 2 === 0 && styles.statsRowEven]}>
                                <Text style={[styles.statsCell, styles.statsCellWide]} numberOfLines={1}>
                                    {split.displayName ?? '—'}
                                </Text>
                                {(split.stats ?? []).map((val: string, j: number) => (
                                    <Text key={j} style={styles.statsCell}>{val}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Recent Game Log */}
            {gameLog?.events?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Games</Text>
                    {gameLog.events.slice(0, 10).map((event: any, i: number) => {
                        const statsArr = gameLog.statistics?.[0]?.events?.[i]?.stats;
                        const goals = statsArr?.[statNames.indexOf('totalGoals')] ?? '—';
                        const assists = statsArr?.[statNames.indexOf('goalAssists')] ?? '—';
                        return (
                            <View key={event.id ?? i} style={styles.gameLogRow}>
                                <View style={styles.gameLogInfo}>
                                    <Text style={styles.gameLogName} numberOfLines={1}>
                                        {event.shortName ?? event.name ?? '—'}
                                    </Text>
                                    <Text style={styles.gameLogDate}>
                                        {event.gameDate ? new Date(event.gameDate).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric',
                                        }) : '—'}
                                    </Text>
                                </View>
                                <View style={styles.gameLogStats}>
                                    <Text style={styles.gameLogStat}>{goals}G</Text>
                                    <Text style={styles.gameLogStat}>{assists}A</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    headshot: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headshotInitials: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textMuted,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    playerName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    position: {
        fontSize: 14,
        color: colors.primary,
        marginTop: 2,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    metaItem: {
        fontSize: 12,
        color: colors.textMuted,
    },
    statsSummary: {
        fontSize: 12,
        color: colors.accent,
        marginTop: 4,
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    bioCard: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 14,
    },
    bioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    bioLabel: {
        fontSize: 14,
        color: colors.textMuted,
    },
    bioValue: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    statsTable: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        overflow: 'hidden',
    },
    statsHeaderRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
        backgroundColor: colors.surfaceLight,
    },
    statsRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    statsRowEven: {
        backgroundColor: colors.surfaceLight + '40',
    },
    statsCell: {
        flex: 1,
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: 'center',
        minWidth: 30,
    },
    statsCellWide: {
        flex: 2.5,
        textAlign: 'left',
    },
    statsHeaderText: {
        fontWeight: '700',
        color: colors.textMuted,
        fontSize: 11,
    },
    gameLogRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    gameLogInfo: {
        flex: 1,
    },
    gameLogName: {
        fontSize: 13,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    gameLogDate: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: 2,
    },
    gameLogStats: {
        flexDirection: 'row',
        gap: 12,
    },
    gameLogStat: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});
