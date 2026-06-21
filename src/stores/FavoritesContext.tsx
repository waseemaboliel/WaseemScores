import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [state, setState] = useState<FavoritesState>({ leagues: [], teams: [] });

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
            if (raw) {
                try {
                    setState(JSON.parse(raw));
                } catch { }
            }
        });
    }, []);

    const persist = useCallback((newState: FavoritesState) => {
        setState(newState);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }, []);

    const toggleFavoriteLeague = useCallback((slug: string) => {
        setState((prev) => {
            const leagues = prev.leagues.includes(slug)
                ? prev.leagues.filter((s) => s !== slug)
                : [...prev.leagues, slug];
            const newState = { ...prev, leagues };
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    }, []);

    const toggleFavoriteTeam = useCallback((teamId: string) => {
        setState((prev) => {
            const teams = prev.teams.includes(teamId)
                ? prev.teams.filter((t) => t !== teamId)
                : [...prev.teams, teamId];
            const newState = { ...prev, teams };
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
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
