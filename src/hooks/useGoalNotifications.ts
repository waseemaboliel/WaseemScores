import { useEffect, useRef } from 'react';
import { useFavorites } from '../stores';
import { sendLocalGoalNotification } from '../services/notifications';
import type { ParsedMatch } from '../api';

interface ScoreSnapshot {
    [matchId: string]: { homeScore: string; awayScore: string };
}

export const useGoalNotifications = (matches: ParsedMatch[]) => {
    const { isTeamFavorite } = useFavorites();
    const prevScores = useRef<ScoreSnapshot>({});

    useEffect(() => {
        const liveMatches = matches.filter((m) => m.status.state === 'in');

        for (const match of liveMatches) {
            const isFavHome = isTeamFavorite(match.homeTeam.id);
            const isFavAway = isTeamFavorite(match.awayTeam.id);

            if (!isFavHome && !isFavAway) continue;

            const prev = prevScores.current[match.id];
            const currentHome = match.homeTeam.score;
            const currentAway = match.awayTeam.score;

            if (prev) {
                const homeScored = parseInt(currentHome) > parseInt(prev.homeScore);
                const awayScored = parseInt(currentAway) > parseInt(prev.awayScore);

                if (homeScored && isFavHome) {
                    sendLocalGoalNotification(
                        match.homeTeam.name,
                        'Goal',
                        `${match.homeTeam.abbreviation} vs ${match.awayTeam.abbreviation}`,
                        `${currentHome} - ${currentAway}`,
                    );
                }

                if (awayScored && isFavAway) {
                    sendLocalGoalNotification(
                        match.awayTeam.name,
                        'Goal',
                        `${match.homeTeam.abbreviation} vs ${match.awayTeam.abbreviation}`,
                        `${currentHome} - ${currentAway}`,
                    );
                }
            }

            prevScores.current[match.id] = {
                homeScore: currentHome,
                awayScore: currentAway,
            };
        }
    }, [matches, isTeamFavorite]);
};
