import React, { createContext, useContext, useState, useCallback } from 'react';
import { mmkvStorage } from './storage';

const STORAGE_KEY = '@favorites';

interface FavoritesContextType {
    favoriteLeagues: string[];
    favoriteTeams: string[];
    toggleFavoriteLeague: (slug: string) => void;
    toggleFavoriteTeam: (teamId: string) => void;
    isLeagueFavorite: (slug: string) => boolean;
    isTeamFavorite: (teamId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favoriteLeagues: [],
    favoriteTeams: [],
    toggleFavoriteLeague: () => { },
    toggleFavoriteTeam: () => { },
    isLeagueFavorite: () => false,
    isTeamFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

interface FavoritesState {
    leagues: string[];
    teams: string[];
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<FavoritesState>(() => {
        return mmkvStorage.getObject<FavoritesState>(STORAGE_KEY) ?? { leagues: [], teams: [] };
    });

    const toggleFavoriteLeague = useCallback((slug: string) => {
        setState((prev) => {
            const leagues = prev.leagues.includes(slug)
                ? prev.leagues.filter((s) => s !== slug)
                : [...prev.leagues, slug];
            const newState = { ...prev, leagues };
            mmkvStorage.setObject(STORAGE_KEY, newState);
            return newState;
        });
    }, []);

    const toggleFavoriteTeam = useCallback((teamId: string) => {
        setState((prev) => {
            const teams = prev.teams.includes(teamId)
                ? prev.teams.filter((t) => t !== teamId)
                : [...prev.teams, teamId];
            const newState = { ...prev, teams };
            mmkvStorage.setObject(STORAGE_KEY, newState);
            return newState;
        });
    }, []);

    const isLeagueFavorite = useCallback((slug: string) => state.leagues.includes(slug), [state.leagues]);
    const isTeamFavorite = useCallback((teamId: string) => state.teams.includes(teamId), [state.teams]);

    return (
        <FavoritesContext.Provider
            value={{
                favoriteLeagues: state.leagues,
                favoriteTeams: state.teams,
                toggleFavoriteLeague,
                toggleFavoriteTeam,
                isLeagueFavorite,
                isTeamFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};
