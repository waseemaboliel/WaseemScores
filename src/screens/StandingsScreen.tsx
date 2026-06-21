import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useStandings, useSeasons, useTournamentCalendar, useBracket } from '../hooks';
import { StandingsTable, BracketView } from '../components';
import { colors, LEAGUES } from '../constants';
import type { League } from '../constants';

const ALL_LEAGUES = LEAGUES;

type Tab = 'groups' | 'bracket';

export const StandingsScreen: React.FC = () => {
    const [selectedLeague, setSelectedLeague] = useState<League>(ALL_LEAGUES[0]);
    const [activeTab, setActiveTab] = useState<Tab>('groups');
    const [selectedSeason, setSelectedSeason] = useState<number | undefined>(undefined);

    const { data: seasons } = useSeasons(selectedLeague.slug);

    const { data, isLoading, isError, refetch, isRefetching } = useStandings(
        selectedLeague.slug,
        selectedSeason
    );

    const { data: calendarRounds } = useTournamentCalendar(selectedLeague.slug, selectedLeague.hasStandings);
    const hasKnockouts = (calendarRounds?.length ?? 0) > 0;

    const { data: bracketData, isLoading: bracketLoading } = useBracket(
        selectedLeague.slug,
        activeTab === 'bracket' && calendarRounds ? calendarRounds : []
    );

    return (
        <View style={styles.container}>
            {/* League Selector */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.leaguePicker}
                contentContainerStyle={styles.leaguePickerContent}
            >
                {ALL_LEAGUES.map((league) => (
                    <TouchableOpacity
                        key={league.slug}
                        style={[
                            styles.leagueChip,
                            selectedLeague.slug === league.slug && styles.leagueChipActive,
                        ]}
                        onPress={() => {
                            setSelectedLeague(league);
                            setActiveTab(league.hasStandings ? 'groups' : 'bracket');
                            setSelectedSeason(undefined);
                        }}
                    >
                        <Text
                            style={[
                                styles.leagueChipText,
                                selectedLeague.slug === league.slug && styles.leagueChipTextActive,
                            ]}
                        >
                            {league.shortName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Season Picker */}
            {selectedLeague.hasStandings && seasons && seasons.length > 1 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.seasonPicker}
                    contentContainerStyle={styles.seasonPickerContent}
                >
                    {seasons.map((season: any) => (
                        <TouchableOpacity
                            key={season.year}
                            style={[
                                styles.seasonChip,
                                (selectedSeason === season.year || (!selectedSeason && seasons[0].year === season.year)) && styles.seasonChipActive,
                            ]}
                            onPress={() => setSelectedSeason(season.year === seasons[0].year ? undefined : season.year)}
                        >
                            <Text style={[
                                styles.seasonText,
                                (selectedSeason === season.year || (!selectedSeason && seasons[0].year === season.year)) && styles.seasonTextActive,
                            ]}>
                                {season.displayName || season.year}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Groups / Bracket Toggle */}
            {(hasKnockouts || !selectedLeague.hasStandings) && (
                <View style={styles.tabBar}>
                    {selectedLeague.hasStandings && (
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'groups' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('groups')}
                        >
                            <Text style={[styles.tabText, activeTab === 'groups' && styles.tabTextActive]}>
                                Groups
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'bracket' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('bracket')}
                    >
                        <Text style={[styles.tabText, activeTab === 'bracket' && styles.tabTextActive]}>
                            Bracket
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Content */}
            {activeTab === 'groups' ? (
                isLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading standings...</Text>
                    </View>
                ) : isError ? (
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load standings</Text>
                        <Text style={styles.retryText} onPress={() => refetch()}>
                            Tap to retry
                        </Text>
                    </View>
                ) : data && data.length > 0 ? (
                    <ScrollView
                        style={styles.tableScroll}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetching}
                                onRefresh={refetch}
                                tintColor={colors.primary}
                            />
                        }
                    >
                        {data[0]?.seasonDisplay && (
                            <Text style={styles.seasonLabel}>{data[0].seasonDisplay}</Text>
                        )}
                        {data.map((group, index) => (
                            <StandingsTable
                                key={index}
                                entries={group.entries}
                                leagueName={data.length > 1 ? group.name : selectedLeague.name}
                            />
                        ))}
                        <View style={styles.bottomPadding} />
                    </ScrollView>
                ) : (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No standings available</Text>
                    </View>
                )
            ) : (
                /* Bracket Tab */
                bracketLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading bracket...</Text>
                    </View>
                ) : bracketData && bracketData.length > 0 ? (
                    <ScrollView style={styles.tableScroll}>
                        <BracketView rounds={bracketData} />
                        <View style={styles.bottomPadding} />
                    </ScrollView>
                ) : (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>Bracket not available yet</Text>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    leaguePicker: {
        maxHeight: 52,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    leaguePickerContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    leagueChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.surfaceLight,
    },
    leagueChipActive: {
        backgroundColor: colors.primary,
    },
    leagueChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    leagueChipTextActive: {
        color: colors.textPrimary,
    },
    seasonPicker: {
        maxHeight: 40,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    seasonPickerContent: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    seasonChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 14,
        backgroundColor: colors.surfaceLight,
    },
    seasonChipActive: {
        backgroundColor: colors.accent,
    },
    seasonText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textMuted,
    },
    seasonTextActive: {
        color: colors.textPrimary,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    tabBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.surfaceLight,
    },
    tabBtnActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.textPrimary,
    },
    tableScroll: {
        flex: 1,
    },
    seasonLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        paddingVertical: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
        fontSize: 14,
    },
    errorText: {
        color: colors.live,
        fontSize: 16,
        fontWeight: '600',
    },
    retryText: {
        marginTop: 8,
        color: colors.accent,
        fontSize: 14,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    bottomPadding: {
        height: 40,
    },
});
