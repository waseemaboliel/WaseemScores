import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import { colors } from '../constants';

interface MatchDetailScreenProps {
    route: {
        params: {
            eventId: string;
            slug: string;
            homeTeam: string;
            awayTeam: string;
        };
    };
}

interface KeyEvent {
    id: string;
    type: { text: string };
    text: string;
    clock: { displayValue: string };
    scoringPlay?: boolean;
}

interface PlayerEntry {
    starter: boolean;
    jersey: string;
    athlete: { displayName: string; shortName: string };
    position?: { abbreviation: string };
    subbedIn?: boolean;
    subbedOut?: boolean;
}

interface TeamRoster {
    homeAway: string;
    team: { displayName: string; logo: string; logos?: { href: string }[] };
    formation: string;
    roster: PlayerEntry[];
}

interface TeamStats {
    team: { displayName: string };
    statistics: { name: string; displayValue: string; label: string }[];
}

const STAT_DISPLAY: Record<string, string> = {
    possessionPct: 'Possession',
    totalShots: 'Total Shots',
    shotsOnTarget: 'Shots on Target',
    saves: 'Saves',
    cornerKicks: 'Corners',
    foulsCommitted: 'Fouls',
    offsides: 'Offsides',
    yellowCards: 'Yellow Cards',
    redCards: 'Red Cards',
    wonCorners: 'Corners',
};

export const MatchDetailScreen: React.FC<MatchDetailScreenProps> = ({ route }) => {
    const { eventId, slug, homeTeam, awayTeam } = route.params;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['matchDetail', slug, eventId],
        queryFn: () => espnApi.getMatchSummary(slug, eventId),
        staleTime: 30 * 1000,
    });

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Failed to load match details</Text>
            </View>
        );
    }

    const keyEvents: KeyEvent[] = (data as any).keyEvents ?? [];
    const rosters: TeamRoster[] = (data as any).rosters ?? [];
    const boxscoreTeams: TeamStats[] = (data as any).boxscore?.teams ?? [];

    const homeRoster = rosters.find((r) => r.homeAway === 'home');
    const awayRoster = rosters.find((r) => r.homeAway === 'away');
    const homeStats = boxscoreTeams[0]?.statistics ?? [];
    const awayStats = boxscoreTeams[1]?.statistics ?? [];

    // Filter meaningful key events (goals, cards, subs)
    const importantEvents = keyEvents.filter((e) => {
        const type = e.type?.text?.toLowerCase() ?? '';
        return type.includes('goal') || type.includes('card') || type.includes('substitution') || type.includes('penalty');
    });

    return (
        <ScrollView style={styles.container}>
            {/* Key Events / Timeline */}
            {importantEvents.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Match Events</Text>
                    {importantEvents.map((event, i) => (
                        <View key={event.id || i} style={styles.eventRow}>
                            <Text style={styles.eventTime}>{event.clock?.displayValue ?? ''}</Text>
                            <View style={styles.eventIconContainer}>
                                <Text style={styles.eventIcon}>
                                    {event.type?.text?.toLowerCase().includes('goal') ? '⚽' :
                                        event.type?.text?.toLowerCase().includes('yellow') ? '🟨' :
                                            event.type?.text?.toLowerCase().includes('red') ? '🟥' :
                                                event.type?.text?.toLowerCase().includes('substitution') ? '🔄' :
                                                    event.type?.text?.toLowerCase().includes('penalty') ? '⚽' : '•'}
                                </Text>
                            </View>
                            <Text style={styles.eventText} numberOfLines={2}>{event.text}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Stats Comparison */}
            {homeStats.length > 0 && awayStats.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Statistics</Text>
                    {homeStats.map((stat, i) => {
                        const label = STAT_DISPLAY[stat.name] ?? stat.label ?? stat.name;
                        const awayStat = awayStats[i];
                        if (!awayStat || !label) return null;
                        // Skip irrelevant stats
                        if (!STAT_DISPLAY[stat.name]) return null;
                        return (
                            <View key={stat.name} style={styles.statRow}>
                                <Text style={styles.statValue}>{stat.displayValue}</Text>
                                <Text style={styles.statLabel}>{label}</Text>
                                <Text style={styles.statValue}>{awayStat.displayValue}</Text>
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Lineups */}
            {homeRoster && awayRoster && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lineups</Text>

                    {/* Formations */}
                    <View style={styles.formationRow}>
                        <Text style={styles.formationText}>
                            {homeRoster.team.displayName} ({homeRoster.formation})
                        </Text>
                        <Text style={styles.formationText}>
                            {awayRoster.team.displayName} ({awayRoster.formation})
                        </Text>
                    </View>

                    {/* Starting XI */}
                    <View style={styles.lineupsContainer}>
                        <View style={styles.lineupColumn}>
                            {homeRoster.roster
                                .filter((p) => p.starter)
                                .map((p, i) => (
                                    <Text key={i} style={styles.playerText}>
                                        {p.jersey} {p.athlete?.shortName ?? p.athlete?.displayName}
                                    </Text>
                                ))}
                        </View>
                        <View style={styles.lineupColumn}>
                            {awayRoster.roster
                                .filter((p) => p.starter)
                                .map((p, i) => (
                                    <Text key={i} style={[styles.playerText, styles.playerTextRight]}>
                                        {p.athlete?.shortName ?? p.athlete?.displayName} {p.jersey}
                                    </Text>
                                ))}
                        </View>
                    </View>

                    {/* Substitutes Header */}
                    <Text style={styles.subsHeader}>Substitutes</Text>
                    <View style={styles.lineupsContainer}>
                        <View style={styles.lineupColumn}>
                            {homeRoster.roster
                                .filter((p) => !p.starter)
                                .map((p, i) => (
                                    <Text key={i} style={[styles.playerText, styles.subText]}>
                                        {p.jersey} {p.athlete?.shortName ?? p.athlete?.displayName}
                                    </Text>
                                ))}
                        </View>
                        <View style={styles.lineupColumn}>
                            {awayRoster.roster
                                .filter((p) => !p.starter)
                                .map((p, i) => (
                                    <Text key={i} style={[styles.playerText, styles.playerTextRight, styles.subText]}>
                                        {p.athlete?.shortName ?? p.athlete?.displayName} {p.jersey}
                                    </Text>
                                ))}
                        </View>
                    </View>
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
    errorText: {
        color: colors.live,
        fontSize: 16,
    },
    section: {
        backgroundColor: colors.surface,
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    // Events
    eventRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    eventTime: {
        width: 36,
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    eventIconContainer: {
        width: 24,
        alignItems: 'center',
    },
    eventIcon: {
        fontSize: 14,
    },
    eventText: {
        flex: 1,
        fontSize: 13,
        color: colors.textPrimary,
        marginLeft: 4,
    },
    // Stats
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    statValue: {
        width: 50,
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    statLabel: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    // Lineups
    formationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    formationText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    lineupsContainer: {
        flexDirection: 'row',
    },
    lineupColumn: {
        flex: 1,
    },
    playerText: {
        fontSize: 13,
        color: colors.textPrimary,
        paddingVertical: 3,
    },
    playerTextRight: {
        textAlign: 'right',
    },
    subText: {
        color: colors.textMuted,
    },
    subsHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
        marginTop: 12,
        marginBottom: 6,
    },
});
