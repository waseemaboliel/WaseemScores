import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants';

interface Player {
    jersey: string;
    name: string;
}

interface FormationViewProps {
    formation: string; // e.g. "4-3-3"
    players: Player[]; // starters in order (GK first, then back to front)
    teamColor?: string;
    isAway?: boolean;
}

const parseFormation = (formation: string): number[] => {
    const parts = formation.split('-').map(Number).filter((n) => !isNaN(n) && n > 0);
    return parts;
};

export const FormationView: React.FC<FormationViewProps> = ({
    formation,
    players,
    teamColor,
    isAway = false,
}) => {
    const lines = parseFormation(formation);
    if (lines.length === 0) return null;

    // Build rows: GK (1) + formation lines
    const rows: Player[][] = [];
    let idx = 0;

    // GK row
    if (idx < players.length) {
        rows.push([players[idx]]);
        idx++;
    }

    // Formation rows (defense → attack)
    for (const count of lines) {
        const row: Player[] = [];
        for (let i = 0; i < count && idx < players.length; i++) {
            row.push(players[idx]);
            idx++;
        }
        rows.push(row);
    }

    // For away team, reverse the order (attack at top, GK at bottom)
    const displayRows = isAway ? [...rows].reverse() : rows;

    const dotColor = teamColor ? `#${teamColor}` : colors.primary;

    return (
        <View style={styles.pitch}>
            {/* Pitch markings */}
            <View style={styles.centerLine} />
            <View style={styles.centerCircle} />

            {displayRows.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.row}>
                    {row.map((player, pIdx) => (
                        <View key={pIdx} style={styles.playerSpot}>
                            <View style={[styles.dot, { backgroundColor: dotColor }]}>
                                <Text style={styles.jersey}>{player.jersey}</Text>
                            </View>
                            <Text style={styles.name} numberOfLines={1}>
                                {player.name}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    pitch: {
        backgroundColor: '#1a3a1a',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 8,
        minHeight: 200,
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    centerLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    centerCircle: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        marginLeft: -25,
        marginTop: -25,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 4,
    },
    playerSpot: {
        alignItems: 'center',
        width: 52,
    },
    dot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jersey: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    name: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
        textAlign: 'center',
    },
});
