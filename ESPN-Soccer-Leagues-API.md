# ESPN Soccer API — Full League List

All leagues use the same endpoint pattern:
```
https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/scoreboard
https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/standings
https://site.web.api.espn.com/apis/v2/sports/soccer/{SLUG}/standings
```

For match details/lineups:
```
https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/summary?event={GAME_ID}
```

---

## FIFA / Global Tournaments
| League | Slug | Standings |
|--------|------|-----------|
| FIFA World Cup | `fifa.world` | ✅ |
| FIFA Women's World Cup | `fifa.wwc` | ✅ |
| FIFA Club World Cup | `fifa.cwc` | ✅ |
| FIFA Intercontinental Cup | `fifa.intercontinental_cup` | — |
| FIFA U-20 World Cup | `fifa.world.u20` | ✅ |
| FIFA U-17 Women's World Cup | `fifa.wworld.u17` | ✅ |
| Women's Champions Cup | `fifa.w.champions.cup` | ✅ |
| Men's Olympic Soccer | `fifa.olympics` | ✅ |
| Women's Olympic Soccer | `fifa.w.olympics` | ✅ |
| International Friendly (Men) | `fifa.friendly` | — |
| International Friendly (Women) | `fifa.friendly.w` | — |
| SheBelieves Cup | `fifa.shebelieves` | ✅ |
| Intercontinental Cup (India) | `fifa.intercontinental.cup` | — |

## Europe — Top Leagues
| League | Slug | Standings |
|--------|------|-----------|
| English Premier League | `eng.1` | ✅ |
| English Championship | `eng.2` | ✅ |
| English League One | `eng.3` | ✅ |
| English League Two | `eng.4` | ✅ |
| English National League | `eng.5` | ✅ |
| English FA Cup | `eng.fa` | — |
| English Carabao Cup | `eng.league_cup` | — |
| English FA Community Shield | `eng.charity` | — |
| English EFL Trophy | `eng.trophy` | ✅ |
| Spanish LALIGA | `esp.1` | ✅ |
| Spanish La Liga 2 | `esp.2` | ✅ |
| Copa del Rey | `esp.copa_del_rey` | — |
| Spanish Supercopa | `esp.super_cup` | — |
| German Bundesliga | `ger.1` | ✅ |
| German DFB Pokal | `ger.dfb_pokal` | — |
| German Super Cup | `ger.super_cup` | — |
| Italian Serie A | `ita.1` | ✅ |
| Italian Coppa Italia | `ita.coppa_italia` | — |
| Italian Supercoppa | `ita.super_cup` | — |
| French Ligue 1 | `fra.1` | ✅ |
| French Ligue 2 | `fra.2` | ✅ |
| French Super Cup | `fra.super_cup` | — |
| Dutch Eredivisie | `ned.1` | ✅ |
| Dutch Tweede Divisie | `ned.2` | ✅ |
| Dutch KNVB Cup | `ned.cup` | — |
| Dutch Super Cup | `ned.supercup` | — |
| Portuguese Primeira Liga | `por.1` | ✅ |
| Portuguese Taça de Portugal | `por.taca.portugal` | — |
| Belgian Pro League | `bel.1` | — |
| Turkish Super Lig | `tur.1` | ✅ |
| Scottish Premiership | `sco.1` | ✅ |
| Scottish Championship | `sco.2` | ✅ |
| Scottish Cup | `sco.tennents` | — |
| Scottish League Cup | `sco.cis` | ✅ |
| Scottish League Challenge Cup | `sco.challenge` | — |
| Russian Premier League | `rus.1` | ✅ |
| Austrian Bundesliga | `aut.1` | ✅ |
| Greek Super League | `gre.1` | ✅ |
| Swedish Allsvenskan | `swe.1` | ✅ |
| Danish Superliga | `den.1` | — |
| Norwegian Eliteserien | `nor.1` | ✅ |
| Cypriot First Division | `cyp.1` | ✅ |
| Irish Premier Division | `irl.1` | ✅ |

## Europe — UEFA Club Competitions
| League | Slug | Standings |
|--------|------|-----------|
| UEFA Champions League | `uefa.champions` | ✅ |
| UEFA Europa League | `uefa.europa` | ✅ |
| UEFA Europa Conference League | `uefa.europa.conf` | ✅ |
| UEFA Super Cup | `uefa.super_cup` | — |
| UEFA Euro U21 | `uefa.euro_u21` | ✅ |

## Europe — Women
| League | Slug | Standings |
|--------|------|-----------|
| English Women's Super League | `eng.w.1` | ✅ |
| English Women's FA Cup | `eng.w.fa` | — |
| English Women's League Cup | `eng.w.league_cup` | ✅ |
| Spanish Liga F | `esp.w.1` | ✅ |
| Spanish Copa de la Reina | `esp.copa_de_la_reina` | — |
| French Division 1 Féminine | `fra.w.1` | ✅ |
| Dutch Vrouwen Eredivisie | `ned.w.1` | ✅ |

## USA & North America
| League | Slug | Standings |
|--------|------|-----------|
| MLS | `usa.1` | ✅ |
| USL Championship | `usa.usl.1` | ✅ |
| USL League One | `usa.usl.l1` | ✅ |
| USL Cup | `usa.usl.l1.cup` | ✅ |
| NWSL | `usa.nwsl` | ✅ |
| NWSL Challenge Cup | `usa.nwsl.cup` | — |
| NWSL/Liga MXF Summer Cup | `usa.nwsl.summer.cup` | — |
| USL Women's League | `usa.w.usl.1` | ✅ |
| NCAA Men's Soccer | `usa.ncaa.m.1` | — |
| NCAA Women's Soccer | `usa.ncaa.w.1` | — |
| Leagues Cup | `concacaf.leagues.cup` | ✅ |
| Campeones Cup | `campeones.cup` | — |
| US Open Cup | `usa.open` | — |

## Mexico
| League | Slug | Standings |
|--------|------|-----------|
| Liga MX | `mex.1` | ✅ |
| Liga MX Expansion | `mex.2` | ✅ |
| Campeon de Campeones | `mex.campeon` | — |

## CONCACAF
| League | Slug | Standings |
|--------|------|-----------|
| Concacaf Champions Cup | `concacaf.champions` | — |
| Concacaf Champions Cup (alt) | `concacaf.champions_cup` | — |
| Concacaf Gold Cup | `concacaf.gold` | — |
| Concacaf Gold Cup Qualifiers | `concacaf.gold_qual` | — |
| Concacaf W Gold Cup | `concacaf.w.gold` | ✅ |
| Concacaf Nations League | `concacaf.nations.league` | — |
| Concacaf W Champions Cup | `concacaf.w.champions_cup` | ✅ |
| Concacaf W Championship | `concacaf.womens.championship` | — |
| Concacaf Central American Cup | `concacaf.central.american.cup` | ✅ |
| CONCACAF U23 Tournament | `concacaf.u23` | — |
| CONCACAF Olympic Qualifying | `fifa.concacaf.olympicsq` | ✅ |

## South America
| League | Slug | Standings |
|--------|------|-----------|
| Copa Libertadores | `conmebol.libertadores` | ✅ |
| CONMEBOL Sudamericana | `conmebol.sudamericana` | — |
| CONMEBOL Recopa | `conmebol.recopa` | — |
| Copa América | `conmebol.america` | — |
| Copa América Femenina | `conmebol.america.femenina` | ✅ |
| Argentine LPF | `arg.1` | ✅ |
| Argentine Nacional B | `arg.2` | ✅ |
| Argentine Primera B | `arg.3` | ✅ |
| Argentine Primera C | `arg.4` | ✅ |
| Copa Argentina | `arg.copa` | — |
| Argentine Supercopa | `arg.supercopa` | — |
| Argentine Supercopa Internacional | `arg.supercopa.internacional` | — |
| Argentine Copa de la Superliga | `arg.copa_de_la_superliga` | — |
| Brazilian Série A | `bra.1` | ✅ |
| Brazilian Série B | `bra.2` | ✅ |
| Brazilian Série C | `bra.3` | ✅ |
| Copa do Nordeste | `bra.copa_do_nordeste` | ✅ |
| Campeonato Carioca | `bra.camp.carioca` | ✅ |
| Campeonato Paulista | `bra.camp.paulista` | ✅ |
| Campeonato Gaúcho | `bra.camp.gaucho` | ✅ |
| Campeonato Mineiro | `bra.camp.mineiro` | ✅ |
| Supercopa do Brasil | `bra.supercopa_do_brazil` | — |
| Chilean Primera División | `chi.1` | ✅ |
| Chilean Segunda División | `chi.2` | ✅ |
| Copa Chile | `chi.copa_chi` | ✅ |
| Chilean Supercopa | `chi.super_cup` | — |
| Colombian Primera A | `col.1` | — |
| Colombian Primera B | `col.2` | ✅ |
| Copa Colombia | `col.copa` | ✅ |
| Colombian Superliga | `col.superliga` | — |
| Ecuadorian LigaPro | `ecu.1` | ✅ |
| Peruvian Primera División | `per.1` | ✅ |
| Paraguayan División Profesional | `par.1` | ✅ |
| Paraguayan Supercopa | `par.1.supercopa` | — |
| Liga AUF Uruguaya | `uru.1` | ✅ |
| Venezuelan Primera División | `ven.1` | ✅ |
| Bolivian Liga Profesional | `bol.1` | ✅ |
| Copa Bolivia | `bol.copa` | ✅ |

## CONCACAF — Central America / Caribbean
| League | Slug | Standings |
|--------|------|-----------|
| Costa Rican Primera División | `crc.1` | ✅ |
| Honduran Liga Nacional | `hon.1` | ✅ |
| Guatemalan Liga Nacional | `gua.1` | — |
| Salvadoran Primera División | `slv.1` | ✅ |

## Asia
| League | Slug | Standings |
|--------|------|-----------|
| AFC Champions League Elite | `afc.champions` | — |
| AFC Cup | `afc.cup` | — |
| AFC Asian Cup | `afc.asian.cup` | ✅ |
| AFC Women's Asian Cup | `afc.w.asian.cup` | ✅ |
| AFC Asian Cup Qualifiers | `afc.cupq` | ✅ |
| ASEAN Championship | `aff.championship` | ✅ |
| Saudi Pro League | `ksa.1` | ✅ |
| Japanese J1 League | `jpn.1` | ✅ |
| Chinese Super League | `chn.1` | ✅ |
| Indian Super League | `ind.1` | — |
| Indian I-League | `ind.2` | ✅ |
| Indonesian Liga 1 | `idn.1` | ✅ |
| Malaysian Super League | `mys.1` | ✅ |
| Singaporean Premier League | `sgp.1` | ✅ |
| Thai League 1 | `tha.1` | ✅ |
| Arabian Gulf Cup | `global.gulf_cup` | — |
| SAFF Championship | `afc.saff.championship` | — |
| Bangabandhu Gold Cup | `bangabandhu.cup` | ✅ |

## Oceania
| League | Slug | Standings |
|--------|------|-----------|
| Australian A-League Men | `aus.1` | ✅ |
| Australian A-League Women | `aus.w.1` | ✅ |

## Africa
| League | Slug | Standings |
|--------|------|-----------|
| Africa Cup of Nations | `caf.nations` | ✅ |
| Africa Cup of Nations Qualifiers | `caf.nations_qual` | ✅ |
| Women's Africa Cup of Nations | `caf.w.nations` | ✅ |
| African Nations Championship (CHAN) | `caf.championship` | ✅ |
| CAF Champions League | `caf.champions` | — |
| COSAFA Cup | `caf.cosafa` | ✅ |
| South African Premier Soccer League | `rsa.1` | ✅ |
| South African First Division | `rsa.2` | ✅ |
| South African MTN 8 Cup | `rsa.mtn8` | — |
| Nigerian Professional League | `nga.1` | ✅ |
| Kenyan Premier League | `ken.1` | ✅ |

## FIFA World Cup Qualifying
| League | Slug | Standings |
|--------|------|-----------|
| WCQ — CONCACAF | `fifa.worldq.concacaf` | ✅ |
| WCQ — CONMEBOL | `fifa.worldq.conmebol` | ✅ |
| WCQ — AFC | `fifa.worldq.afc` | ✅ |
| WCQ — UEFA | `fifa.worldq.uefa` | ✅ |
| WCQ — CAF | `fifa.worldq.caf` | ✅ |
| WCQ — OFC | `fifa.worldq.ofc` | ✅ |
| WCQ — AFC/CONMEBOL Playoff | `fifa.worldq.afc.conmebol` | — |

## Other / Global
| League | Slug | Standings |
|--------|------|-----------|
| International Champions Cup | `global.champs_cup` | ✅ |
| CONMEBOL-UEFA Finalissima | `global.finalissima` | — |
| Women's Finalissima | `global.w.finalissima` | — |
| CONMEBOL-UEFA Club Challenge | `global.club_challenge` | — |
| CONMEBOL-UEFA U20 Cup | `global.u20.intercontinental_cup` | — |
| Arnold Clark Cup | `global.arnold.clark_cup` | — |
| Toulon Tournament | `global.toulon` | ✅ |
| Club Friendly | `club.friendly` | — |

---

## Discovery Endpoint

To get the full list programmatically:
```
https://site.api.espn.com/apis/site/v2/leagues/dropdown?sport=soccer&limit=200
```

---

## Tested & Verified (June 2026)

### Standings Endpoint
- **Working endpoint:** `https://site.web.api.espn.com/apis/v2/sports/soccer/{SLUG}/standings`
- **NOT working for standings:** `https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/standings` (returns `{}`)

### Response Structure (Standings)
```json
{
  "children": [
    {
      "name": "2025-26 LALIGA",
      "standings": {
        "entries": [
          {
            "team": {
              "id": "83",
              "displayName": "Barcelona",
              "abbreviation": "BAR",
              "logos": [{ "href": "https://a.espncdn.com/i/teamlogos/soccer/500/83.png" }]
            },
            "note": { "color": "#81D6AC", "description": "Champions League", "rank": 1 },
            "stats": [
              { "name": "gamesPlayed", "value": 38.0 },
              { "name": "wins", "value": 31.0 },
              { "name": "ties", "value": 1.0 },
              { "name": "losses", "value": 6.0 },
              { "name": "pointsFor", "value": 95.0 },
              { "name": "pointsAgainst", "value": 36.0 },
              { "name": "pointDifferential", "value": 59.0 },
              { "name": "points", "value": 94.0 },
              { "name": "rank", "value": 1.0 },
              { "name": "deductions", "value": 0.0 },
              { "name": "ppg", "value": 0.0 }
            ]
          }
        ]
      }
    }
  ]
}
```

### Key Stats Field Names
| Field | Meaning |
|-------|---------|
| `gamesPlayed` | Matches played |
| `wins` | Wins |
| `ties` | Draws |
| `losses` | Losses |
| `pointsFor` | Goals scored |
| `pointsAgainst` | Goals conceded |
| `pointDifferential` | Goal difference |
| `points` | Total points |
| `rank` | Table position |
| `deductions` | Point deductions |

### `entry.note` — Qualification Zones
The `note` object on each entry indicates qualification/relegation status:
- `"description": "Champions League"` with color `#81D6AC`
- Used for UCL, UEL, UECL spots and relegation zone

### Season Query Parameter
- Use `?season={YEAR}` to fetch a specific season (e.g. `?season=2025` for 2025-26)
- Omitting the parameter returns the current/latest season
- The API stores up to **25 historical seasons**
- **2026-27 season**: Not yet available as of June 2026. Expected to appear once the season starts (~August 2026 for most European leagues)
- Season year uses the **start year** of the season (e.g. `2025` = 2025-26 season)

---

## Notes for Multi-Tournament App

- **150+ leagues** all use the same API structure — just swap the slug
- Same endpoints work for: scoreboard, standings, match summary, lineups, rosters
- Best high-value targets for a universal app:
  - Top 5 European: `eng.1`, `esp.1`, `ger.1`, `ita.1`, `fra.1`
  - UEFA CL/EL: `uefa.champions`, `uefa.europa`
  - South American: `conmebol.libertadores`, `arg.1`, `bra.1`
  - USA/Mexico: `usa.1`, `mex.1`
  - International: `fifa.world`, `conmebol.america`, `concacaf.gold`, `caf.nations`
  - Middle East/Asia: `ksa.1`, `jpn.1`
- No API key required — all public endpoints
- Rate limiting is informal (no hard cap documented, but be respectful)
- Data includes: scores, lineups, player stats, team stats, odds, broadcasts, venues
