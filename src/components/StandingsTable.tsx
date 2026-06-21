import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { ParsedStandingsEntry } from '../api';
import { colors } from '../constants';

interface StandingsTableProps {
    entries: ParsedStandingsEntry[];
    leagueName?: string;
    onTeamPress?: (teamId: string, teamName: string) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ entries, leagueName, onTeamPress }) => {
    return (
        <View style={styles.container}>
            {leagueName && <Text style={styles.title}>{leagueName}</Text>}

            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.posCell]}>#</Text>
                <Text style={[styles.headerCell, styles.teamCell]}>Team</Text>
                <Text style={[styles.headerCell, styles.statCell]}>GP</Text>
                <Text style={[styles.headerCell, styles.statCell]}>W</Text>
                <Text style={[styles.headerCell, styles.statCell]}>D</Text>
                <Text style={[styles.headerCell, styles.statCell]}>L</Text>
                <Text style={[styles.headerCell, styles.statCell]}>GD</Text>
                <Text style={[styles.headerCell, styles.ptsCell]}>Pts</Text>
            </View>

            {/* Rows */}
            {entries.map((entry) => (
                <TouchableOpacity
                    key={entry.team.id}
                    style={styles.row}
                    onPress={() => onTeamPress?.(entry.team.id, entry.team.name)}
                    activeOpacity={0.6}
                >
                    {/* Position with zone indicator */}
                    <View style={styles.posContainer}>
                        {entry.note ? (
                            <View style={[styles.zoneBar, { backgroundColor: entry.note.color }]} />
                        ) : (
                            <View style={styles.zoneBarSpacer} />
                        )}
                        <Text style={styles.posText}>{entry.position}</Text>
                    </View>

                    {/* Team */}
                    <View style={styles.teamContainer}>
                        {entry.team.logo ? (
                            <Image source={{ uri: entry.team.logo }} style={styles.teamLogo} />
                        ) : (
                            <View style={styles.teamLogoPlaceholder} />
                        )}
                        <Text style={styles.teamName} numberOfLines={1}>
                            {entry.team.abbreviation}
                        </Text>
                    </View>

                    {/* Stats */}
                    <Text style={[styles.statText, styles.statCell]}>{entry.gamesPlayed}</Text>
                    <Text style={[styles.statText, styles.statCell]}>{entry.wins}</Text>
                    <Text style={[styles.statText, styles.statCell]}>{entry.draws}</Text>
                    <Text style={[styles.statText, styles.statCell]}>{entry.losses}</Text>
                    <Text style={[styles.statText, styles.statCell, entry.goalDifference > 0 && styles.positive, entry.goalDifference < 0 && styles.negative]}>
                        {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                    </Text>
                    <Text style={[styles.statText, styles.ptsCell, styles.ptsText]}>{entry.points}</Text>
                </TouchableOpacity>
            ))}

            {/* Zone Legend */}
            {entries.some((e) => e.note) && (
                <View style={styles.legendContainer}>
                    {[...new Map(entries.filter((e) => e.note).map((e) => [e.note!.description, e.note!.color])).entries()].map(([desc, color]) => (
                        <View key={desc} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: color }]} />
                            <Text style={styles.legendText} numberOfLines={1}>{desc}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        padding: 16,
        paddingBottom: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    headerCell: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    posContainer: {
        width: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    posCell: {
        width: 32,
    },
    zoneBar: {
        width: 3,
        height: 24,
        borderRadius: 1.5,
        marginRight: 6,
    },
    zoneBarSpacer: {
        width: 3,
        marginRight: 6,
    },
    posText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    teamContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamCell: {
        flex: 1,
    },
    teamLogo: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    teamLogoPlaceholder: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.surfaceLight,
    },
    teamName: {
        fontSize: 13,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    statCell: {
        width: 30,
        textAlign: 'center',
    },
    statText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    ptsCell: {
        width: 32,
        textAlign: 'center',
    },
    ptsText: {
        fontWeight: '700',
        color: colors.textPrimary,
    },
    positive: {
        color: colors.win,
    },
    negative: {
        color: colors.loss,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 10,
        color: colors.textMuted,
    },
});
