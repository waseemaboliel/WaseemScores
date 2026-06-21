import React from 'react';
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
import { colors } from '../constants';
import { useFavorites } from '../stores';
import type { ScoresStackParamList } from '../navigation';

interface TeamDetailParams {
    teamId: string;
    slug: string;
    teamName: string;
}

export const TeamDetailScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<ScoresStackParamList>>();
    const { teamId, slug, teamName } = route.params as TeamDetailParams;
    const { isTeamFavorite, toggleFavoriteTeam } = useFavorites();

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

    return (
        <ScrollView style={styles.container}>
            {/* Team Header */}
            <View style={styles.header}>
                {team?.logos?.[0]?.href && (
                    <Image source={{ uri: team.logos[0].href }} style={styles.logo} />
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
                    <Text style={styles.favText}>
                        {isTeamFavorite(teamId) ? '★' : '☆'}
                    </Text>
                </TouchableOpacity>
            </View>

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

            {/* Recent/Upcoming Fixtures */}
            {events.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fixtures</Text>
                    {events.slice(0, 10).map((event: any) => {
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
});
