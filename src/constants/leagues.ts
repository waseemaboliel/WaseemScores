export type Region =
    | 'fifa'
    | 'europe'
    | 'europe-women'
    | 'usa-canada'
    | 'mexico'
    | 'concacaf'
    | 'south-america'
    | 'asia'
    | 'oceania'
    | 'africa'
    | 'wcq'
    | 'other';

export interface League {
    slug: string;
    name: string;
    shortName: string;
    region: Region;
    country?: string;
    hasStandings: boolean;
    tier: 1 | 2 | 3;
}

export const LEAGUES: League[] = [
    // === FIFA / Global Tournaments ===
    { slug: 'fifa.world', name: 'FIFA World Cup', shortName: 'World Cup', region: 'fifa', hasStandings: true, tier: 1 },
    { slug: 'fifa.wwc', name: "FIFA Women's World Cup", shortName: "Women's WC", region: 'fifa', hasStandings: true, tier: 2 },
    { slug: 'fifa.cwc', name: 'FIFA Club World Cup', shortName: 'Club WC', region: 'fifa', hasStandings: true, tier: 2 },
    { slug: 'fifa.intercontinental_cup', name: 'FIFA Intercontinental Cup', shortName: 'Intercontinental', region: 'fifa', hasStandings: false, tier: 3 },
    { slug: 'fifa.world.u20', name: 'FIFA U-20 World Cup', shortName: 'U-20 WC', region: 'fifa', hasStandings: true, tier: 3 },
    { slug: 'fifa.wworld.u17', name: "FIFA U-17 Women's World Cup", shortName: "U-17 Women's WC", region: 'fifa', hasStandings: true, tier: 3 },
    { slug: 'fifa.w.champions.cup', name: "Women's Champions Cup", shortName: "W Champions Cup", region: 'fifa', hasStandings: true, tier: 3 },
    { slug: 'fifa.olympics', name: "Men's Olympic Soccer", shortName: 'Olympics M', region: 'fifa', hasStandings: true, tier: 2 },
    { slug: 'fifa.w.olympics', name: "Women's Olympic Soccer", shortName: 'Olympics W', region: 'fifa', hasStandings: true, tier: 3 },
    { slug: 'fifa.friendly', name: 'International Friendly (Men)', shortName: 'Friendly M', region: 'fifa', hasStandings: false, tier: 3 },
    { slug: 'fifa.friendly.w', name: 'International Friendly (Women)', shortName: 'Friendly W', region: 'fifa', hasStandings: false, tier: 3 },
    { slug: 'fifa.shebelieves', name: 'SheBelieves Cup', shortName: 'SheBelieves', region: 'fifa', hasStandings: true, tier: 3 },

    // === Europe — Top Leagues ===
    { slug: 'eng.1', name: 'English Premier League', shortName: 'Premier League', region: 'europe', country: 'England', hasStandings: true, tier: 1 },
    { slug: 'eng.2', name: 'English Championship', shortName: 'Championship', region: 'europe', country: 'England', hasStandings: true, tier: 2 },
    { slug: 'eng.3', name: 'English League One', shortName: 'League One', region: 'europe', country: 'England', hasStandings: true, tier: 3 },
    { slug: 'eng.4', name: 'English League Two', shortName: 'League Two', region: 'europe', country: 'England', hasStandings: true, tier: 3 },
    { slug: 'eng.5', name: 'English National League', shortName: 'National League', region: 'europe', country: 'England', hasStandings: true, tier: 3 },
    { slug: 'eng.fa', name: 'English FA Cup', shortName: 'FA Cup', region: 'europe', country: 'England', hasStandings: false, tier: 2 },
    { slug: 'eng.league_cup', name: 'English Carabao Cup', shortName: 'Carabao Cup', region: 'europe', country: 'England', hasStandings: false, tier: 2 },
    { slug: 'eng.charity', name: 'English FA Community Shield', shortName: 'Community Shield', region: 'europe', country: 'England', hasStandings: false, tier: 3 },
    { slug: 'eng.trophy', name: 'English EFL Trophy', shortName: 'EFL Trophy', region: 'europe', country: 'England', hasStandings: true, tier: 3 },
    { slug: 'esp.1', name: 'Spanish LALIGA', shortName: 'La Liga', region: 'europe', country: 'Spain', hasStandings: true, tier: 1 },
    { slug: 'esp.2', name: 'Spanish La Liga 2', shortName: 'La Liga 2', region: 'europe', country: 'Spain', hasStandings: true, tier: 2 },
    { slug: 'esp.copa_del_rey', name: 'Copa del Rey', shortName: 'Copa del Rey', region: 'europe', country: 'Spain', hasStandings: false, tier: 2 },
    { slug: 'esp.super_cup', name: 'Spanish Supercopa', shortName: 'Supercopa', region: 'europe', country: 'Spain', hasStandings: false, tier: 3 },
    { slug: 'ger.1', name: 'German Bundesliga', shortName: 'Bundesliga', region: 'europe', country: 'Germany', hasStandings: true, tier: 1 },
    { slug: 'ger.dfb_pokal', name: 'German DFB Pokal', shortName: 'DFB Pokal', region: 'europe', country: 'Germany', hasStandings: false, tier: 2 },
    { slug: 'ger.super_cup', name: 'German Super Cup', shortName: 'DFL Super Cup', region: 'europe', country: 'Germany', hasStandings: false, tier: 3 },
    { slug: 'ita.1', name: 'Italian Serie A', shortName: 'Serie A', region: 'europe', country: 'Italy', hasStandings: true, tier: 1 },
    { slug: 'ita.coppa_italia', name: 'Italian Coppa Italia', shortName: 'Coppa Italia', region: 'europe', country: 'Italy', hasStandings: false, tier: 2 },
    { slug: 'ita.super_cup', name: 'Italian Supercoppa', shortName: 'Supercoppa', region: 'europe', country: 'Italy', hasStandings: false, tier: 3 },
    { slug: 'fra.1', name: 'French Ligue 1', shortName: 'Ligue 1', region: 'europe', country: 'France', hasStandings: true, tier: 1 },
    { slug: 'fra.2', name: 'French Ligue 2', shortName: 'Ligue 2', region: 'europe', country: 'France', hasStandings: true, tier: 2 },
    { slug: 'fra.super_cup', name: 'French Super Cup', shortName: 'Trophée des Champions', region: 'europe', country: 'France', hasStandings: false, tier: 3 },
    { slug: 'ned.1', name: 'Dutch Eredivisie', shortName: 'Eredivisie', region: 'europe', country: 'Netherlands', hasStandings: true, tier: 2 },
    { slug: 'ned.2', name: 'Dutch Tweede Divisie', shortName: 'Tweede Divisie', region: 'europe', country: 'Netherlands', hasStandings: true, tier: 3 },
    { slug: 'ned.cup', name: 'Dutch KNVB Cup', shortName: 'KNVB Cup', region: 'europe', country: 'Netherlands', hasStandings: false, tier: 3 },
    { slug: 'ned.supercup', name: 'Dutch Super Cup', shortName: 'Johan Cruyff Shield', region: 'europe', country: 'Netherlands', hasStandings: false, tier: 3 },
    { slug: 'por.1', name: 'Portuguese Primeira Liga', shortName: 'Liga Portugal', region: 'europe', country: 'Portugal', hasStandings: true, tier: 2 },
    { slug: 'por.taca.portugal', name: 'Portuguese Taça de Portugal', shortName: 'Taça de Portugal', region: 'europe', country: 'Portugal', hasStandings: false, tier: 3 },
    { slug: 'tur.1', name: 'Turkish Super Lig', shortName: 'Süper Lig', region: 'europe', country: 'Turkey', hasStandings: true, tier: 2 },
    { slug: 'sco.1', name: 'Scottish Premiership', shortName: 'Premiership', region: 'europe', country: 'Scotland', hasStandings: true, tier: 2 },
    { slug: 'sco.2', name: 'Scottish Championship', shortName: 'Scot Championship', region: 'europe', country: 'Scotland', hasStandings: true, tier: 3 },
    { slug: 'sco.tennents', name: 'Scottish Cup', shortName: 'Scottish Cup', region: 'europe', country: 'Scotland', hasStandings: false, tier: 3 },
    { slug: 'sco.cis', name: 'Scottish League Cup', shortName: 'Scot League Cup', region: 'europe', country: 'Scotland', hasStandings: true, tier: 3 },
    { slug: 'rus.1', name: 'Russian Premier League', shortName: 'RPL', region: 'europe', country: 'Russia', hasStandings: true, tier: 3 },
    { slug: 'aut.1', name: 'Austrian Bundesliga', shortName: 'Austrian BL', region: 'europe', country: 'Austria', hasStandings: true, tier: 3 },
    { slug: 'gre.1', name: 'Greek Super League', shortName: 'Super League', region: 'europe', country: 'Greece', hasStandings: true, tier: 3 },
    { slug: 'swe.1', name: 'Swedish Allsvenskan', shortName: 'Allsvenskan', region: 'europe', country: 'Sweden', hasStandings: true, tier: 3 },
    { slug: 'den.1', name: 'Danish Superliga', shortName: 'Superliga', region: 'europe', country: 'Denmark', hasStandings: false, tier: 3 },
    { slug: 'nor.1', name: 'Norwegian Eliteserien', shortName: 'Eliteserien', region: 'europe', country: 'Norway', hasStandings: true, tier: 3 },
    { slug: 'cyp.1', name: 'Cypriot First Division', shortName: 'Cyprus 1st', region: 'europe', country: 'Cyprus', hasStandings: true, tier: 3 },
    { slug: 'irl.1', name: 'Irish Premier Division', shortName: 'LOI Premier', region: 'europe', country: 'Ireland', hasStandings: true, tier: 3 },
    { slug: 'bel.1', name: 'Belgian Pro League', shortName: 'Pro League', region: 'europe', country: 'Belgium', hasStandings: false, tier: 2 },

    // === Europe — UEFA Club Competitions ===
    { slug: 'uefa.champions', name: 'UEFA Champions League', shortName: 'UCL', region: 'europe', hasStandings: true, tier: 1 },
    { slug: 'uefa.europa', name: 'UEFA Europa League', shortName: 'UEL', region: 'europe', hasStandings: true, tier: 1 },
    { slug: 'uefa.europa.conf', name: 'UEFA Europa Conference League', shortName: 'UECL', region: 'europe', hasStandings: true, tier: 2 },
    { slug: 'uefa.super_cup', name: 'UEFA Super Cup', shortName: 'UEFA Super Cup', region: 'europe', hasStandings: false, tier: 3 },
    { slug: 'uefa.euro_u21', name: 'UEFA Euro U21', shortName: 'Euro U21', region: 'europe', hasStandings: true, tier: 3 },

    // === Europe — Women ===
    { slug: 'eng.w.1', name: "English Women's Super League", shortName: 'WSL', region: 'europe-women', country: 'England', hasStandings: true, tier: 2 },
    { slug: 'eng.w.fa', name: "English Women's FA Cup", shortName: "Women's FA Cup", region: 'europe-women', country: 'England', hasStandings: false, tier: 3 },
    { slug: 'eng.w.league_cup', name: "English Women's League Cup", shortName: "W League Cup", region: 'europe-women', country: 'England', hasStandings: true, tier: 3 },
    { slug: 'esp.w.1', name: 'Spanish Liga F', shortName: 'Liga F', region: 'europe-women', country: 'Spain', hasStandings: true, tier: 3 },
    { slug: 'esp.copa_de_la_reina', name: 'Copa de la Reina', shortName: 'Copa Reina', region: 'europe-women', country: 'Spain', hasStandings: false, tier: 3 },
    { slug: 'fra.w.1', name: 'French Division 1 Féminine', shortName: 'D1 Féminine', region: 'europe-women', country: 'France', hasStandings: true, tier: 3 },
    { slug: 'ned.w.1', name: 'Dutch Vrouwen Eredivisie', shortName: 'Vrouwen Eredivisie', region: 'europe-women', country: 'Netherlands', hasStandings: true, tier: 3 },

    // === USA & North America ===
    { slug: 'usa.1', name: 'MLS', shortName: 'MLS', region: 'usa-canada', country: 'USA', hasStandings: true, tier: 1 },
    { slug: 'usa.usl.1', name: 'USL Championship', shortName: 'USL Championship', region: 'usa-canada', country: 'USA', hasStandings: true, tier: 3 },
    { slug: 'usa.usl.l1', name: 'USL League One', shortName: 'USL League One', region: 'usa-canada', country: 'USA', hasStandings: true, tier: 3 },
    { slug: 'usa.nwsl', name: 'NWSL', shortName: 'NWSL', region: 'usa-canada', country: 'USA', hasStandings: true, tier: 2 },
    { slug: 'usa.nwsl.cup', name: 'NWSL Challenge Cup', shortName: 'NWSL Cup', region: 'usa-canada', country: 'USA', hasStandings: false, tier: 3 },
    { slug: 'usa.open', name: 'US Open Cup', shortName: 'US Open Cup', region: 'usa-canada', country: 'USA', hasStandings: false, tier: 3 },
    { slug: 'concacaf.leagues.cup', name: 'Leagues Cup', shortName: 'Leagues Cup', region: 'usa-canada', hasStandings: true, tier: 2 },

    // === Mexico ===
    { slug: 'mex.1', name: 'Liga MX', shortName: 'Liga MX', region: 'mexico', country: 'Mexico', hasStandings: true, tier: 1 },
    { slug: 'mex.2', name: 'Liga MX Expansion', shortName: 'Liga Expansión', region: 'mexico', country: 'Mexico', hasStandings: true, tier: 3 },

    // === CONCACAF ===
    { slug: 'concacaf.champions', name: 'Concacaf Champions Cup', shortName: 'CONCACAF CL', region: 'concacaf', hasStandings: false, tier: 2 },
    { slug: 'concacaf.gold', name: 'Concacaf Gold Cup', shortName: 'Gold Cup', region: 'concacaf', hasStandings: false, tier: 2 },
    { slug: 'concacaf.gold_qual', name: 'Concacaf Gold Cup Qualifiers', shortName: 'Gold Cup Q', region: 'concacaf', hasStandings: false, tier: 3 },
    { slug: 'concacaf.w.gold', name: 'Concacaf W Gold Cup', shortName: 'W Gold Cup', region: 'concacaf', hasStandings: true, tier: 3 },
    { slug: 'concacaf.nations.league', name: 'Concacaf Nations League', shortName: 'CNL', region: 'concacaf', hasStandings: false, tier: 2 },
    { slug: 'concacaf.w.champions_cup', name: 'Concacaf W Champions Cup', shortName: 'W Champ Cup', region: 'concacaf', hasStandings: true, tier: 3 },

    // === South America ===
    { slug: 'conmebol.libertadores', name: 'Copa Libertadores', shortName: 'Libertadores', region: 'south-america', hasStandings: true, tier: 1 },
    { slug: 'conmebol.sudamericana', name: 'CONMEBOL Sudamericana', shortName: 'Sudamericana', region: 'south-america', hasStandings: false, tier: 2 },
    { slug: 'conmebol.america', name: 'Copa América', shortName: 'Copa América', region: 'south-america', hasStandings: false, tier: 1 },
    { slug: 'conmebol.america.femenina', name: 'Copa América Femenina', shortName: 'Copa América F', region: 'south-america', hasStandings: true, tier: 3 },
    { slug: 'arg.1', name: 'Argentine LPF', shortName: 'Liga Argentina', region: 'south-america', country: 'Argentina', hasStandings: true, tier: 1 },
    { slug: 'arg.2', name: 'Argentine Nacional B', shortName: 'Nacional B', region: 'south-america', country: 'Argentina', hasStandings: true, tier: 3 },
    { slug: 'arg.3', name: 'Argentine Primera B', shortName: 'Primera B', region: 'south-america', country: 'Argentina', hasStandings: true, tier: 3 },
    { slug: 'arg.copa', name: 'Copa Argentina', shortName: 'Copa Argentina', region: 'south-america', country: 'Argentina', hasStandings: false, tier: 3 },
    { slug: 'bra.1', name: 'Brazilian Série A', shortName: 'Brasileirão', region: 'south-america', country: 'Brazil', hasStandings: true, tier: 1 },
    { slug: 'bra.2', name: 'Brazilian Série B', shortName: 'Série B', region: 'south-america', country: 'Brazil', hasStandings: true, tier: 2 },
    { slug: 'bra.3', name: 'Brazilian Série C', shortName: 'Série C', region: 'south-america', country: 'Brazil', hasStandings: true, tier: 3 },
    { slug: 'bra.copa_do_nordeste', name: 'Copa do Nordeste', shortName: 'Copa Nordeste', region: 'south-america', country: 'Brazil', hasStandings: true, tier: 3 },
    { slug: 'bra.camp.carioca', name: 'Campeonato Carioca', shortName: 'Carioca', region: 'south-america', country: 'Brazil', hasStandings: true, tier: 3 },
    { slug: 'bra.camp.paulista', name: 'Campeonato Paulista', shortName: 'Paulistão', region: 'south-america', country: 'Brazil', hasStandings: true, tier: 3 },
    { slug: 'chi.1', name: 'Chilean Primera División', shortName: 'Primera Chile', region: 'south-america', country: 'Chile', hasStandings: true, tier: 3 },
    { slug: 'col.1', name: 'Colombian Primera A', shortName: 'Liga BetPlay', region: 'south-america', country: 'Colombia', hasStandings: false, tier: 2 },
    { slug: 'ecu.1', name: 'Ecuadorian LigaPro', shortName: 'LigaPro', region: 'south-america', country: 'Ecuador', hasStandings: true, tier: 3 },
    { slug: 'per.1', name: 'Peruvian Primera División', shortName: 'Liga 1', region: 'south-america', country: 'Peru', hasStandings: true, tier: 3 },
    { slug: 'par.1', name: 'Paraguayan División Profesional', shortName: 'Primera Paraguay', region: 'south-america', country: 'Paraguay', hasStandings: true, tier: 3 },
    { slug: 'uru.1', name: 'Liga AUF Uruguaya', shortName: 'Primera Uruguay', region: 'south-america', country: 'Uruguay', hasStandings: true, tier: 3 },
    { slug: 'ven.1', name: 'Venezuelan Primera División', shortName: 'Primera Venezuela', region: 'south-america', country: 'Venezuela', hasStandings: true, tier: 3 },
    { slug: 'bol.1', name: 'Bolivian Liga Profesional', shortName: 'División Pro', region: 'south-america', country: 'Bolivia', hasStandings: true, tier: 3 },

    // === CONCACAF — Central America ===
    { slug: 'crc.1', name: 'Costa Rican Primera División', shortName: 'Primera Costa Rica', region: 'concacaf', country: 'Costa Rica', hasStandings: true, tier: 3 },
    { slug: 'hon.1', name: 'Honduran Liga Nacional', shortName: 'Liga Honduras', region: 'concacaf', country: 'Honduras', hasStandings: true, tier: 3 },
    { slug: 'gua.1', name: 'Guatemalan Liga Nacional', shortName: 'Liga Guatemala', region: 'concacaf', country: 'Guatemala', hasStandings: false, tier: 3 },
    { slug: 'slv.1', name: 'Salvadoran Primera División', shortName: 'Primera El Salvador', region: 'concacaf', country: 'El Salvador', hasStandings: true, tier: 3 },

    // === Asia ===
    { slug: 'afc.champions', name: 'AFC Champions League Elite', shortName: 'ACL', region: 'asia', hasStandings: false, tier: 2 },
    { slug: 'afc.asian.cup', name: 'AFC Asian Cup', shortName: 'Asian Cup', region: 'asia', hasStandings: true, tier: 2 },
    { slug: 'afc.w.asian.cup', name: "AFC Women's Asian Cup", shortName: "W Asian Cup", region: 'asia', hasStandings: true, tier: 3 },
    { slug: 'afc.cupq', name: 'AFC Asian Cup Qualifiers', shortName: 'Asian Cup Q', region: 'asia', hasStandings: true, tier: 3 },
    { slug: 'aff.championship', name: 'ASEAN Championship', shortName: 'ASEAN', region: 'asia', hasStandings: true, tier: 3 },
    { slug: 'ksa.1', name: 'Saudi Pro League', shortName: 'SPL', region: 'asia', country: 'Saudi Arabia', hasStandings: true, tier: 1 },
    { slug: 'jpn.1', name: 'Japanese J1 League', shortName: 'J1 League', region: 'asia', country: 'Japan', hasStandings: true, tier: 2 },
    { slug: 'chn.1', name: 'Chinese Super League', shortName: 'CSL', region: 'asia', country: 'China', hasStandings: true, tier: 3 },
    { slug: 'ind.1', name: 'Indian Super League', shortName: 'ISL', region: 'asia', country: 'India', hasStandings: false, tier: 3 },
    { slug: 'idn.1', name: 'Indonesian Liga 1', shortName: 'Liga 1', region: 'asia', country: 'Indonesia', hasStandings: true, tier: 3 },
    { slug: 'mys.1', name: 'Malaysian Super League', shortName: 'MSL', region: 'asia', country: 'Malaysia', hasStandings: true, tier: 3 },
    { slug: 'sgp.1', name: 'Singaporean Premier League', shortName: 'SPL', region: 'asia', country: 'Singapore', hasStandings: true, tier: 3 },
    { slug: 'tha.1', name: 'Thai League 1', shortName: 'Thai League', region: 'asia', country: 'Thailand', hasStandings: true, tier: 3 },

    // === Oceania ===
    { slug: 'aus.1', name: 'Australian A-League Men', shortName: 'A-League', region: 'oceania', country: 'Australia', hasStandings: true, tier: 2 },
    { slug: 'aus.w.1', name: 'Australian A-League Women', shortName: 'A-League W', region: 'oceania', country: 'Australia', hasStandings: true, tier: 3 },

    // === Africa ===
    { slug: 'caf.nations', name: 'Africa Cup of Nations', shortName: 'AFCON', region: 'africa', hasStandings: true, tier: 1 },
    { slug: 'caf.nations_qual', name: 'Africa Cup of Nations Qualifiers', shortName: 'AFCON Q', region: 'africa', hasStandings: true, tier: 3 },
    { slug: 'caf.w.nations', name: "Women's Africa Cup of Nations", shortName: 'W AFCON', region: 'africa', hasStandings: true, tier: 3 },
    { slug: 'caf.championship', name: 'African Nations Championship', shortName: 'CHAN', region: 'africa', hasStandings: true, tier: 3 },
    { slug: 'caf.champions', name: 'CAF Champions League', shortName: 'CAF CL', region: 'africa', hasStandings: false, tier: 2 },
    { slug: 'caf.cosafa', name: 'COSAFA Cup', shortName: 'COSAFA', region: 'africa', hasStandings: true, tier: 3 },
    { slug: 'rsa.1', name: 'South African Premier Soccer League', shortName: 'PSL', region: 'africa', country: 'South Africa', hasStandings: true, tier: 3 },
    { slug: 'rsa.2', name: 'South African First Division', shortName: 'SA First Div', region: 'africa', country: 'South Africa', hasStandings: true, tier: 3 },
    { slug: 'nga.1', name: 'Nigerian Professional League', shortName: 'NPFL', region: 'africa', country: 'Nigeria', hasStandings: true, tier: 3 },
    { slug: 'ken.1', name: 'Kenyan Premier League', shortName: 'KPL', region: 'africa', country: 'Kenya', hasStandings: true, tier: 3 },

    // === FIFA World Cup Qualifying ===
    { slug: 'fifa.worldq.concacaf', name: 'WCQ — CONCACAF', shortName: 'WCQ CONCACAF', region: 'wcq', hasStandings: true, tier: 2 },
    { slug: 'fifa.worldq.conmebol', name: 'WCQ — CONMEBOL', shortName: 'WCQ CONMEBOL', region: 'wcq', hasStandings: true, tier: 2 },
    { slug: 'fifa.worldq.afc', name: 'WCQ — AFC', shortName: 'WCQ AFC', region: 'wcq', hasStandings: true, tier: 2 },
    { slug: 'fifa.worldq.uefa', name: 'WCQ — UEFA', shortName: 'WCQ UEFA', region: 'wcq', hasStandings: true, tier: 2 },
    { slug: 'fifa.worldq.caf', name: 'WCQ — CAF', shortName: 'WCQ CAF', region: 'wcq', hasStandings: true, tier: 2 },
    { slug: 'fifa.worldq.ofc', name: 'WCQ — OFC', shortName: 'WCQ OFC', region: 'wcq', hasStandings: true, tier: 3 },

    // === Other / Global ===
    { slug: 'global.champs_cup', name: 'International Champions Cup', shortName: 'ICC', region: 'other', hasStandings: true, tier: 3 },
    { slug: 'global.finalissima', name: 'CONMEBOL-UEFA Finalissima', shortName: 'Finalissima', region: 'other', hasStandings: false, tier: 3 },
    { slug: 'club.friendly', name: 'Club Friendly', shortName: 'Friendly', region: 'other', hasStandings: false, tier: 3 },
];

// Helper functions
export const getLeagueBySlug = (slug: string): League | undefined =>
    LEAGUES.find((l) => l.slug === slug);

export const getLeaguesByRegion = (region: Region): League[] =>
    LEAGUES.filter((l) => l.region === region);

export const getLeaguesByTier = (tier: 1 | 2 | 3): League[] =>
    LEAGUES.filter((l) => l.tier === tier);

export const getTopLeagues = (): League[] =>
    LEAGUES.filter((l) => l.tier === 1);

export const getLeaguesWithStandings = (): League[] =>
    LEAGUES.filter((l) => l.hasStandings);

// Default leagues shown on the scoreboard
export const DEFAULT_SCOREBOARD_LEAGUES: string[] = [
    'eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1',
    'uefa.champions', 'uefa.europa',
    'usa.1', 'mex.1',
    'arg.1', 'bra.1',
    'ksa.1',
    'conmebol.libertadores',
];
