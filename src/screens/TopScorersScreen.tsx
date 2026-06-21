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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { espnApi } from '../api';
import { colors } from '../constants';
import { LEAGUES, DEFAULT_SCOREBOARD_LEAGUES } from '../constants/leagues';
import type { StatsStackParamList } from '../navigation';

type Tab = 'goals' | 'assists';

export const TopScorersScreen: React.FC = () => {
    const [selectedLeague, setSelectedLeague] = useState(DEFAULT_SCOREBOARD_LEAGUES[0]);
    const [tab, setTab] = useState<Tab>('goals');
    const navigation = useNavigation<NativeStackNavigationProp<StatsStackParamList>>();

    const league = LEAGUES.find((l) => l.slug === selectedLeague) ?? LEAGUES[0];

    const { data, isLoading } = useQuery({
        queryKey: ['statistics', league.slug],
        queryFn: () => espnApi.getLeagueStatistics(league.slug),
        staleTime: 60 * 60 * 1000,
    });

    const stats = data?.stats;
    const goalsLeaders = stats?.[0]?.leaders ?? [];
    const assistsLeaders = stats?.[1]?.leaders ?? [];
    const leaders = tab === 'goals' ? goalsLeaders : assistsLeaders;

    return (
        <View style={styles.container}>
            {/* League Picker */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.leaguePicker}
                contentContainerStyle={styles.leaguePickerContent}
            >
                {LEAGUES.map((l) => (
                    <TouchableOpacity
                        key={l.slug}
                        onPress={() => setSelectedLeague(l.slug)}
                        style={[
                            styles.leagueChip,
                            l.slug === selectedLeague && styles.leagueChipActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.leagueChipText,
                                l.slug === selectedLeague && styles.leagueChipTextActive,
                            ]}
                            numberOfLines={1}
                        >
                            {l.shortName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Goals / Assists Toggle */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    onPress={() => setTab('goals')}
                    style={[styles.tabBtn, tab === 'goals' && styles.tabBtnActive]}
                >
                    <Text style={[styles.tabText, tab === 'goals' && styles.tabTextActive]}>
                        Goals
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('assists')}
                    style={[styles.tabBtn, tab === 'assists' && styles.tabBtnActive]}
                >
                    <Text style={[styles.tabText, tab === 'assists' && styles.tabTextActive]}>
                        Assists
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.list}>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.rankHeader, styles.headerText]}>#</Text>
                        <Text style={[styles.playerHeader, styles.headerText]}>Player</Text>
                        <Text style={[styles.statHeader, styles.headerText]}>APP</Text>
                        <Text style={[styles.statHeader, styles.headerText]}>G</Text>
                        <Text style={[styles.statHeader, styles.headerText]}>A</Text>
                    </View>

                    {leaders.map((leader: any, index: number) => {
                        const athlete = leader.athlete;
                        // Parse from shortDisplayValue: "M: 38, G: 29: A: 18"
                        const short = (leader.shortDisplayValue ?? '') as string;
                        const matchM = short.match(/M:\s*(\d+)/);
                        const matchG = short.match(/G:\s*(\d+)/);
                        const matchA = short.match(/A:\s*(\d+)/);
                        const appearances = matchM?.[1] ?? '-';
                        const goals = matchG?.[1] ?? '-';
                        const assists = matchA?.[1] ?? '-';

                        return (
                            <TouchableOpacity
                                key={athlete?.id ?? index}
                                style={styles.row}
                                onPress={() => athlete?.id && navigation.navigate('PlayerProfile', {
                                    playerId: athlete.id,
                                    playerName: athlete.displayName ?? '',
                                    slug: league.slug,
                                })}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.rank}>{index + 1}</Text>
                                <View style={styles.playerInfo}>
                                    {(athlete?.team?.logos?.[0]?.href || athlete?.team?.logo) && (
                                        <Image
                                            source={{ uri: athlete?.team?.logos?.[0]?.href ?? athlete?.team?.logo }}
                                            style={styles.teamBadge}
                                        />
                                    )}
                                    <View>
                                        <Text style={styles.playerName} numberOfLines={1}>
                                            {athlete?.displayName ?? '—'}
                                        </Text>
                                        <Text style={styles.teamName} numberOfLines={1}>
                                            {athlete?.team?.displayName ?? ''}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.stat}>{appearances}</Text>
                                <Text style={[styles.stat, tab === 'goals' && styles.statHighlight]}>
                                    {goals}
                                </Text>
                                <Text style={[styles.stat, tab === 'assists' && styles.statHighlight]}>
                                    {assists}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    {leaders.length === 0 && (
                        <Text style={styles.empty}>No statistics available for this league.</Text>
                    )}
                </ScrollView>
            )}
        </View>
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
    },
    leaguePicker: {
        maxHeight: 44,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    leaguePickerContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    leagueChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.surface,
        marginRight: 6,
    },
    leagueChipActive: {
        backgroundColor: colors.primary,
    },
    leagueChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
    },
    leagueChipTextActive: {
        color: '#000',
    },
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
    },
    tabBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: colors.surface,
    },
    tabBtnActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textMuted,
    },
    tabTextActive: {
        color: '#000',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    headerText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textMuted,
    },
    rankHeader: {
        width: 28,
    },
    playerHeader: {
        flex: 1,
    },
    statHeader: {
        width: 36,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    rank: {
        width: 28,
        fontSize: 13,
        fontWeight: '700',
        color: colors.textMuted,
    },
    playerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamBadge: {
        width: 22,
        height: 22,
    },
    playerName: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    teamName: {
        fontSize: 11,
        color: colors.textMuted,
    },
    stat: {
        width: 36,
        textAlign: 'center',
        fontSize: 13,
        color: colors.textSecondary,
    },
    statHighlight: {
        fontWeight: '700',
        color: colors.primary,
    },
    empty: {
        textAlign: 'center',
        color: colors.textMuted,
        marginTop: 40,
        fontSize: 14,
    },
});
