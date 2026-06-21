import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { espnApi } from '../api';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants';
import { useFavorites } from '../stores';
import type { ScoresStackParamList } from '../navigation';

interface TeamDetailParams {
    teamId: string;
    slug: string;
    teamName: string;
}

type TabKey = 'overview' | 'squad' | 'fixtures';

const HEADSHOT_BASE = 'https://a.espncdn.com/i/headshots/soccer/players/full/';

export const TeamDetailScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<ScoresStackParamList>>();
    const { teamId, slug, teamName } = route.params as TeamDetailParams;
    const { isTeamFavorite, toggleFavoriteTeam } = useFavorites();
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    const { data: teamData, isLoading } = useQuery({
        queryKey: ['team', slug, teamId],
        queryFn: () => espnApi.getTeamInfo(slug, teamId),
        staleTime: 60 * 60 * 1000,
    });

    const { data: scheduleData } = useQuery({
        queryKey: ['teamSchedule', slug, teamId],
        queryFn: () => espnApi.getTeamSchedule(slug, teamId),
        staleTime: 60 * 60 * 1000,
    });

    const { data: rosterData } = useQuery({
        queryKey: ['teamRoster', slug, teamId],
        queryFn: async () => {
            // Try current season first, fall back to previous year if empty
            const current = await espnApi.getTeamRoster(slug, teamId);
            if (current?.athletes?.length > 0) return current;
            return espnApi.getTeamRoster(slug, teamId, 2024);
        },
        staleTime: 60 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const team = teamData?.team;
    const nextEvent = team?.nextEvent?.[0];
    const record = team?.record?.items?.[0];
    const standing = team?.standingSummary;
    const events = scheduleData?.events ?? [];
    const athletes = rosterData?.athletes ?? [];
    const coach = rosterData?.coach;

    // Group athletes by position
    const positionGroups = athletes.reduce((acc: Record<string, any[]>, player: any) => {
        const pos = player.position?.displayName ?? 'Unknown';
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(player);
        return acc;
    }, {} as Record<string, any[]>);

    const positionOrder = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
    const sortedPositions = Object.keys(positionGroups).sort(
        (a, b) => (positionOrder.indexOf(a) === -1 ? 99 : positionOrder.indexOf(a)) -
            (positionOrder.indexOf(b) === -1 ? 99 : positionOrder.indexOf(b))
    );

    // Team stats from record
    const stats = record?.stats ?? [];
    const getStat = (name: string) => stats.find((s: any) => s.name === name)?.value;

    const renderOverview = () => (
        <>
            {/* Team Stats */}
            {record && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Season Stats</Text>
                    <View style={styles.statsGrid}>
                        {[
                            { label: 'Played', value: getStat('gamesPlayed') },
                            { label: 'Wins', value: getStat('wins') },
                            { label: 'Draws', value: getStat('ties') },
                            { label: 'Losses', value: getStat('losses') },
                            { label: 'GF', value: getStat('pointsFor') },
                            { label: 'GA', value: getStat('pointsAgainst') },
                        ].filter(s => s.value != null).map((s) => (
                            <View key={s.label} style={styles.statItem}>
                                <Text style={styles.statValue}>{Math.round(s.value!)}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Next Match */}
            {nextEvent && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Next Match</Text>
                    <TouchableOpacity
                        style={styles.matchCard}
                        onPress={() => {
                            const comp = nextEvent.competitions?.[0];
                            const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
                            const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
                            navigation.navigate('MatchDetail', {
                                eventId: nextEvent.id,
                                slug,
                                homeTeam: home?.team?.abbreviation ?? 'HOME',
                                awayTeam: away?.team?.abbreviation ?? 'AWAY',
                            });
                        }}
                    >
                        <Text style={styles.matchName}>{nextEvent.shortName}</Text>
                        <Text style={styles.matchDate}>
                            {new Date(nextEvent.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Coach */}
            {coach && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Manager</Text>
                    <View style={styles.coachRow}>
                        <Text style={styles.coachName}>{coach.displayName ?? coach.firstName + ' ' + coach.lastName}</Text>
                        {coach.nationality && <Text style={styles.coachNat}>{coach.nationality}</Text>}
                    </View>
                </View>
            )}
        </>
    );

    const renderSquad = () => (
        <>
            {sortedPositions.map((pos) => (
                <View key={pos} style={styles.section}>
                    <Text style={styles.sectionTitle}>{pos}s</Text>
                    {positionGroups[pos].map((player: any) => (
                        <TouchableOpacity
                            key={player.id}
                            style={styles.playerRow}
                            onPress={() => {
                                navigation.navigate('PlayerProfile', {
                                    playerId: player.id,
                                    playerName: player.displayName,
                                    slug,
                                });
                            }}
                        >
                            <Image
                                source={{ uri: `${HEADSHOT_BASE}${player.id}.png` }}
                                style={styles.playerPhoto}
                                defaultSource={require('../../assets/icon.png')}
                            />
                            <View style={styles.playerInfo}>
                                <Text style={styles.playerName}>{player.displayName}</Text>
                                <View style={styles.playerMeta}>
                                    {player.jersey != null && (
                                        <Text style={styles.playerJersey}>#{player.jersey}</Text>
                                    )}
                                    {player.flag?.alt && (
                                        <Text style={styles.playerNat}>{player.flag.alt}</Text>
                                    )}
                                    {player.age && (
                                        <Text style={styles.playerAge}>{player.age} yrs</Text>
                                    )}
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            {athletes.length === 0 && (
                <View style={styles.emptySection}>
                    <Text style={styles.emptyText}>No roster data available</Text>
                </View>
            )}
        </>
    );

    const renderFixtures = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fixtures</Text>
            {events.length === 0 && (
                <Text style={styles.emptyText}>No fixtures available</Text>
            )}
            {events.slice(0, 20).map((event: any) => {
                const comp = event.competitions?.[0];
                const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
                const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
                const isFinished = comp?.status?.type?.completed;
                const homeScore = home?.score?.displayValue;
                const awayScore = away?.score?.displayValue;

                return (
                    <TouchableOpacity
                        key={event.id}
                        style={styles.fixtureRow}
                        onPress={() => {
                            navigation.navigate('MatchDetail', {
                                eventId: event.id,
                                slug,
                                homeTeam: home?.team?.abbreviation ?? 'HOME',
                                awayTeam: away?.team?.abbreviation ?? 'AWAY',
                            });
                        }}
                    >
                        <View style={styles.fixtureTeams}>
                            <Text style={styles.fixtureTeamName} numberOfLines={1}>
                                {home?.team?.shortDisplayName ?? home?.team?.displayName ?? '—'}
                            </Text>
                            <Text style={styles.fixtureTeamName} numberOfLines={1}>
                                {away?.team?.shortDisplayName ?? away?.team?.displayName ?? '—'}
                            </Text>
                        </View>
                        <View style={styles.fixtureScore}>
                            {isFinished ? (
                                <>
                                    <Text style={styles.scoreText}>{homeScore ?? '-'}</Text>
                                    <Text style={styles.scoreText}>{awayScore ?? '-'}</Text>
                                </>
                            ) : (
                                <Text style={styles.fixtureDate}>
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Team Header */}
            <View style={styles.header}>
                {(team?.logos?.[0]?.href || team?.logo) && (
                    <Image source={{ uri: team?.logos?.[0]?.href ?? team?.logo }} style={styles.logo} />
                )}
                <View style={styles.headerInfo}>
                    <Text style={styles.teamName}>{team?.displayName ?? teamName}</Text>
                    {standing && <Text style={styles.standing}>{standing}</Text>}
                    {record && <Text style={styles.record}>Record: {record.summary}</Text>}
                </View>
                <TouchableOpacity
                    onPress={() => toggleFavoriteTeam(teamId)}
                    style={styles.favBtn}
                >
                    <Ionicons
                        name={isTeamFavorite(teamId) ? 'star' : 'star-outline'}
                        size={24}
                        color={isTeamFavorite(teamId) ? colors.primary : colors.textMuted}
                    />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {([
                    { key: 'overview' as const, label: 'Overview' },
                    { key: 'squad' as const, label: 'Squad' },
                    { key: 'fixtures' as const, label: 'Fixtures' },
                ]).map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'squad' && renderSquad()}
            {activeTab === 'fixtures' && renderFixtures()}

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
    logo: {
        width: 64,
        height: 64,
        borderRadius: 8,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    teamName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    standing: {
        fontSize: 13,
        color: colors.primary,
        marginTop: 4,
    },
    record: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    favBtn: {
        padding: 8,
    },
    favText: {
        fontSize: 24,
        color: colors.primary,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
    },
    tabTextActive: {
        color: colors.primary,
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 12,
        gap: 4,
    },
    statItem: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: 2,
    },
    matchCard: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 14,
    },
    matchName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    matchDate: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 4,
    },
    coachRow: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 14,
    },
    coachName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    coachNat: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    playerPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceLight,
    },
    playerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    playerMeta: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 2,
    },
    playerJersey: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    playerNat: {
        fontSize: 12,
        color: colors.textMuted,
    },
    playerAge: {
        fontSize: 12,
        color: colors.textMuted,
    },
    chevron: {
        fontSize: 18,
        color: colors.textMuted,
        marginLeft: 8,
    },
    fixtureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    fixtureTeams: {
        flex: 1,
        gap: 2,
    },
    fixtureTeamName: {
        fontSize: 13,
        color: colors.textPrimary,
    },
    fixtureScore: {
        alignItems: 'flex-end',
        minWidth: 40,
    },
    scoreText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    fixtureDate: {
        fontSize: 11,
        color: colors.textMuted,
    },
    emptySection: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: colors.textMuted,
    },
});
