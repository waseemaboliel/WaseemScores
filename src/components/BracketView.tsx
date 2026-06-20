import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import type { BracketRound } from '../api';
import type { ParsedMatch } from '../api';
import { colors } from '../constants';

interface BracketViewProps {
    rounds: BracketRound[];
}

const MATCH_HEIGHT = 64;
const MATCH_WIDTH = 140;
const CONNECTOR_WIDTH = 20;
const ROUND_GAP = 4;

interface MatchCardProps {
    match: ParsedMatch;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const isLive = match.status.state === 'in';
    return (
        <View style={[cardStyles.card, isLive && cardStyles.cardLive]}>
            {/* Home */}
            <View style={cardStyles.teamRow}>
                {match.homeTeam.logo ? (
                    <Image source={{ uri: match.homeTeam.logo }} style={cardStyles.logo} />
                ) : (
                    <View style={cardStyles.logoPlaceholder} />
                )}
                <Text style={cardStyles.teamName} numberOfLines={1}>
                    {match.homeTeam.abbreviation || match.homeTeam.name}
                </Text>
                <Text style={[cardStyles.score, isLive && cardStyles.liveText]}>
                    {match.homeTeam.score || '-'}
                </Text>
            </View>
            {/* Away */}
            <View style={cardStyles.teamRow}>
                {match.awayTeam.logo ? (
                    <Image source={{ uri: match.awayTeam.logo }} style={cardStyles.logo} />
                ) : (
                    <View style={cardStyles.logoPlaceholder} />
                )}
                <Text style={cardStyles.teamName} numberOfLines={1}>
                    {match.awayTeam.abbreviation || match.awayTeam.name}
                </Text>
                <Text style={[cardStyles.score, isLive && cardStyles.liveText]}>
                    {match.awayTeam.score || '-'}
                </Text>
            </View>
        </View>
    );
};

/** Draws connector lines between two matches feeding into one */
const Connector: React.FC<{ matchCount: number; roundIndex: number }> = ({ matchCount, roundIndex }) => {
    // Space multiplier doubles each round
    const spacing = MATCH_HEIGHT * Math.pow(2, roundIndex);
    const connectors: React.ReactElement[] = [];

    for (let i = 0; i < Math.floor(matchCount / 2); i++) {
        const pairHeight = spacing * 2;
        connectors.push(
            <View key={i} style={{ height: pairHeight, justifyContent: 'center' }}>
                <View style={connectorStyles.bracket}>
                    {/* Top horizontal line */}
                    <View style={[connectorStyles.hLine, connectorStyles.topLine]} />
                    {/* Vertical line */}
                    <View style={connectorStyles.vLine} />
                    {/* Bottom horizontal line */}
                    <View style={[connectorStyles.hLine, connectorStyles.bottomLine]} />
                    {/* Output horizontal line */}
                    <View style={[connectorStyles.hLineOut]} />
                </View>
            </View>
        );
    }

    return <View style={connectorStyles.container}>{connectors}</View>;
};

export const BracketView: React.FC<BracketViewProps> = ({ rounds }) => {
    // Sort rounds by value (ascending = early rounds first)
    const sortedRounds = [...rounds].sort((a, b) => Number(a.value) - Number(b.value));

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
            <View style={styles.bracketContainer}>
                {sortedRounds.map((round, roundIndex) => (
                    <React.Fragment key={round.value}>
                        {/* Round Column */}
                        <View style={styles.roundColumn}>
                            <Text style={styles.roundTitle}>{round.label}</Text>
                            <View style={[
                                styles.matchesColumn,
                                { justifyContent: roundIndex === 0 ? 'flex-start' : 'space-around' },
                            ]}>
                                {round.matches.map((match) => (
                                    <View
                                        key={match.id}
                                        style={[
                                            styles.matchWrapper,
                                            {
                                                marginVertical: roundIndex === 0
                                                    ? ROUND_GAP
                                                    : (MATCH_HEIGHT * Math.pow(2, roundIndex) - MATCH_HEIGHT) / 2,
                                            },
                                        ]}
                                    >
                                        <MatchCard match={match} />
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Connector between this round and next */}
                        {roundIndex < sortedRounds.length - 1 && (
                            <View style={styles.connectorColumn}>
                                <View style={styles.connectorSpacer} />
                                <Connector matchCount={round.matches.length} roundIndex={roundIndex} />
                            </View>
                        )}
                    </React.Fragment>
                ))}
            </View>
        </ScrollView>
    );
};

const cardStyles = StyleSheet.create({
    card: {
        width: MATCH_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 6,
        borderWidth: 1,
        borderColor: colors.separator,
    },
    cardLive: {
        borderColor: colors.live,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
    },
    logo: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
    },
    logoPlaceholder: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.surfaceLight,
        marginRight: 4,
    },
    teamName: {
        flex: 1,
        fontSize: 11,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    score: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
        minWidth: 18,
        textAlign: 'center',
    },
    liveText: {
        color: colors.live,
    },
});

const connectorStyles = StyleSheet.create({
    container: {
        width: CONNECTOR_WIDTH,
        justifyContent: 'flex-start',
    },
    bracket: {
        width: CONNECTOR_WIDTH,
        flex: 1,
        position: 'relative',
    },
    hLine: {
        position: 'absolute',
        left: 0,
        width: CONNECTOR_WIDTH / 2,
        height: 1,
        backgroundColor: colors.textMuted,
    },
    topLine: {
        top: '25%',
    },
    bottomLine: {
        bottom: '25%',
    },
    vLine: {
        position: 'absolute',
        left: CONNECTOR_WIDTH / 2 - 0.5,
        top: '25%',
        bottom: '25%',
        width: 1,
        backgroundColor: colors.textMuted,
    },
    hLineOut: {
        position: 'absolute',
        left: CONNECTOR_WIDTH / 2,
        top: '50%',
        width: CONNECTOR_WIDTH / 2,
        height: 1,
        backgroundColor: colors.textMuted,
    },
});

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    bracketContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    roundColumn: {
        alignItems: 'center',
    },
    roundTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 8,
        textAlign: 'center',
    },
    matchesColumn: {
        alignItems: 'center',
    },
    matchWrapper: {},
    connectorColumn: {
        justifyContent: 'flex-start',
    },
    connectorSpacer: {
        height: 24, // Matches the round title + marginBottom
    },
});
