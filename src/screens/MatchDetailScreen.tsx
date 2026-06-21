import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { espnApi } from '../api';
import { colors } from '../constants';
import { FormationView, ErrorState } from '../components';
import type { ScoresStackParamList } from '../navigation';

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
    type: { text: string; type: string };
    text: string;
    shortText?: string;
    clock: { displayValue: string };
    scoringPlay?: boolean;
    team?: { id: string; displayName: string };
    participants?: { athlete: { id: string; displayName: string } }[];
}

interface PlayerEntry {
    starter: boolean;
    jersey: string;
    athlete: { id: string; displayName: string; shortName: string };
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
    const navigation = useNavigation<NativeStackNavigationProp<ScoresStackParamList>>();

    const { data, isLoading, isError, refetch } = useQuery({
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
        return <ErrorState message="Failed to load match details" onRetry={refetch} />;
    }

    const keyEvents: KeyEvent[] = (data as any).keyEvents ?? [];
    const rosters: TeamRoster[] = (data as any).rosters ?? [];
    const boxscoreTeams: TeamStats[] = (data as any).boxscore?.teams ?? [];
    const headToHead: any[] = (data as any).headToHeadGames ?? (data as any).headToHead ?? [];

    const homeRoster = rosters.find((r) => r.homeAway === 'home');
    const awayRoster = rosters.find((r) => r.homeAway === 'away');
    const homeStats = boxscoreTeams[0]?.statistics ?? [];
    const awayStats = boxscoreTeams[1]?.statistics ?? [];

    // Filter meaningful key events (goals, cards, subs)
    const importantEvents = keyEvents.filter((e) => {
        const type = e.type?.type ?? e.type?.text?.toLowerCase() ?? '';
        return type.includes('goal') || type.includes('card') || type.includes('substitution') || type.includes('penalty');
    });

    const getEventIcon = (event: KeyEvent): { name: string; color: string } => {
        const type = event.type?.type ?? '';
        if (type === 'own-goal') return { name: 'football', color: '#e74c3c' };
        if (type.includes('goal') || event.scoringPlay) return { name: 'football', color: colors.textPrimary };
        if (type.includes('red')) return { name: 'square', color: '#e74c3c' };
        if (type.includes('yellow')) return { name: 'square', color: '#f1c40f' };
        if (type.includes('substitution')) return { name: 'swap-horizontal', color: colors.primary };
        return { name: 'ellipse', color: colors.textMuted };
    };

    const getEventDisplay = (event: KeyEvent): { main: string; sub?: string } => {
        const type = event.type?.type ?? '';
        const players = event.participants ?? [];
        const team = event.team?.displayName ?? '';

        if ((type.includes('goal') || event.scoringPlay) && players.length > 0) {
            const scorer = players[0]?.athlete?.displayName ?? '';
            const isOwnGoal = type === 'own-goal';
            const assister = players[1]?.athlete?.displayName;
            return {
                main: isOwnGoal ? `${scorer} (OG)` : scorer,
                sub: isOwnGoal ? team : (assister ? `Assist: ${assister}` : team),
            };
        }

        if (type.includes('card') && players.length > 0) {
            return {
                main: players[0]?.athlete?.displayName ?? '',
                sub: team,
            };
        }

        if (type.includes('substitution') && players.length >= 2) {
            return {
                main: `${players[0]?.athlete?.displayName}`,
                sub: `for ${players[1]?.athlete?.displayName}`,
            };
        }

        // Fallback to shortText or parsed text
        if (event.shortText) return { main: event.shortText };
        return { main: event.text?.split('.')[0] ?? '' };
    };

    return (
        <ScrollView style={styles.container}>
            {/* Key Events / Timeline */}
            {importantEvents.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Match Events</Text>
                    {importantEvents.map((event, i) => {
                        const icon = getEventIcon(event);
                        const display = getEventDisplay(event);
                        const isGoal = event.type?.type?.includes('goal') || event.scoringPlay;
                        const isOwnGoal = event.type?.type === 'own-goal';
                        const mainPlayer = event.participants?.[0]?.athlete;
                        return (
                            <TouchableOpacity
                                key={event.id || i}
                                style={[styles.eventRow, isGoal && !isOwnGoal && styles.eventRowGoal, isOwnGoal && styles.eventRowOwnGoal]}
                                onPress={() => mainPlayer && navigation.navigate('PlayerProfile', {
                                    playerId: mainPlayer.id,
                                    playerName: mainPlayer.displayName,
                                    slug,
                                })}
                                activeOpacity={mainPlayer ? 0.6 : 1}
                                disabled={!mainPlayer}
                            >
                                <Text style={[styles.eventTime, isGoal && !isOwnGoal && styles.eventTimeGoal, isOwnGoal && styles.eventTimeOwnGoal]}>
                                    {event.clock?.displayValue ?? ''}
                                </Text>
                                <View style={[styles.eventIconContainer, isGoal && styles.eventIconGoal]}>
                                    <Ionicons name={icon.name as any} size={isGoal ? 16 : 14} color={icon.color} />
                                </View>
                                <View style={styles.eventContent}>
                                    <Text style={[styles.eventMain, isGoal && styles.eventMainGoal]} numberOfLines={1}>
                                        {display.main}
                                    </Text>
                                    {display.sub && (
                                        <Text style={styles.eventSub} numberOfLines={1}>{display.sub}</Text>
                                    )}
                                </View>
                                {mainPlayer && (
                                    <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
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

            {/* Head-to-Head */}
            {headToHead.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Head to Head</Text>
                    {headToHead.slice(0, 5).map((game: any, i: number) => {
                        const comp = game.competitions?.[0];
                        const teams = comp?.competitors ?? [];
                        const homeH2H = teams.find((t: any) => t.homeAway === 'home');
                        const awayH2H = teams.find((t: any) => t.homeAway === 'away');
                        const date = game.date
                            ? new Date(game.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })
                            : '';
                        return (
                            <View key={game.id ?? i} style={styles.h2hRow}>
                                <Text style={styles.h2hDate}>{date}</Text>
                                <View style={styles.h2hMatch}>
                                    <Text style={styles.h2hTeam} numberOfLines={1}>
                                        {homeH2H?.team?.abbreviation ?? homeH2H?.team?.displayName ?? '—'}
                                    </Text>
                                    <Text style={styles.h2hScore}>
                                        {homeH2H?.score?.displayValue ?? '-'} - {awayH2H?.score?.displayValue ?? '-'}
                                    </Text>
                                    <Text style={styles.h2hTeam} numberOfLines={1}>
                                        {awayH2H?.team?.abbreviation ?? awayH2H?.team?.displayName ?? '—'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Lineups */}
            {homeRoster && awayRoster && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lineups</Text>

                    {/* Formation Pitch Views */}
                    {homeRoster.formation && (
                        <View style={styles.formationPitchContainer}>
                            <Text style={styles.formationTeamLabel}>
                                {homeRoster.team.displayName} ({homeRoster.formation})
                            </Text>
                            <FormationView
                                formation={homeRoster.formation}
                                players={homeRoster.roster
                                    .filter((p) => p.starter)
                                    .map((p) => ({
                                        jersey: p.jersey,
                                        name: p.athlete?.shortName ?? p.athlete?.displayName ?? '',
                                    }))}
                            />
                        </View>
                    )}
                    {awayRoster.formation && (
                        <View style={styles.formationPitchContainer}>
                            <Text style={styles.formationTeamLabel}>
                                {awayRoster.team.displayName} ({awayRoster.formation})
                            </Text>
                            <FormationView
                                formation={awayRoster.formation}
                                players={awayRoster.roster
                                    .filter((p) => p.starter)
                                    .map((p) => ({
                                        jersey: p.jersey,
                                        name: p.athlete?.shortName ?? p.athlete?.displayName ?? '',
                                    }))}
                                isAway
                            />
                        </View>
                    )}

                    {/* Fallback: text list if no formation */}
                    {!homeRoster.formation && !awayRoster.formation && (
                        <>
                            <View style={styles.lineupsContainer}>
                                <View style={styles.lineupColumn}>
                                    {homeRoster.roster
                                        .filter((p) => p.starter)
                                        .map((p, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => navigation.navigate('PlayerProfile', {
                                                    playerId: p.athlete?.id,
                                                    playerName: p.athlete?.displayName,
                                                    slug,
                                                })}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={styles.playerText}>
                                                    {p.jersey} {p.athlete?.shortName ?? p.athlete?.displayName}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                                <View style={styles.lineupColumn}>
                                    {awayRoster.roster
                                        .filter((p) => p.starter)
                                        .map((p, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => navigation.navigate('PlayerProfile', {
                                                    playerId: p.athlete?.id,
                                                    playerName: p.athlete?.displayName,
                                                    slug,
                                                })}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={[styles.playerText, styles.playerTextRight]}>
                                                    {p.athlete?.shortName ?? p.athlete?.displayName} {p.jersey}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>
                        </>
                    )}

                    {/* Substitutes */}
                    <Text style={styles.subsHeader}>Substitutes</Text>
                    <View style={styles.lineupsContainer}>
                        <View style={styles.lineupColumn}>
                            {homeRoster.roster
                                .filter((p) => !p.starter)
                                .map((p, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => navigation.navigate('PlayerProfile', {
                                            playerId: p.athlete?.id,
                                            playerName: p.athlete?.displayName,
                                            slug,
                                        })}
                                        activeOpacity={0.6}
                                    >
                                        <Text style={[styles.playerText, styles.subText]}>
                                            {p.jersey} {p.athlete?.shortName ?? p.athlete?.displayName}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                        <View style={styles.lineupColumn}>
                            {awayRoster.roster
                                .filter((p) => !p.starter)
                                .map((p, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => navigation.navigate('PlayerProfile', {
                                            playerId: p.athlete?.id,
                                            playerName: p.athlete?.displayName,
                                            slug,
                                        })}
                                        activeOpacity={0.6}
                                    >
                                        <Text style={[styles.playerText, styles.playerTextRight, styles.subText]}>
                                            {p.athlete?.shortName ?? p.athlete?.displayName} {p.jersey}
                                        </Text>
                                    </TouchableOpacity>
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
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    eventRowGoal: {
        backgroundColor: colors.primary + '10',
        marginHorizontal: -16,
        paddingHorizontal: 16,
        borderBottomColor: colors.primary + '20',
    },
    eventRowOwnGoal: {
        backgroundColor: '#e74c3c10',
        marginHorizontal: -16,
        paddingHorizontal: 16,
        borderBottomColor: '#e74c3c20',
    },
    eventTime: {
        width: 42,
        fontSize: 13,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    eventTimeGoal: {
        color: colors.primary,
    },
    eventTimeOwnGoal: {
        color: '#e74c3c',
    },
    eventIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    eventIconGoal: {
        backgroundColor: colors.primary + '20',
    },
    eventContent: {
        flex: 1,
    },
    eventMain: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    eventMainGoal: {
        color: colors.primary,
        fontWeight: '700',
    },
    eventSub: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 1,
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
    formationPitchContainer: {
        marginBottom: 16,
    },
    formationTeamLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
    },
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
    // H2H
    h2hRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    h2hDate: {
        width: 80,
        fontSize: 11,
        color: colors.textMuted,
    },
    h2hMatch: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    h2hTeam: {
        flex: 1,
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    h2hScore: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
    },
});
