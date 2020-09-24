import {Stellung} from './Stellung';
import {Util} from './Util';

import {IStellung} from './IStellung';

export class ZugGenerator
{

    private anzSymmetrieStellungen = 0;

    ZOBRIST_ZUFALLSWERTE: number[][] = [[], []];
    ZOBRIST_ZUFALLSWERTE_FUER_AUSSEN: number[][] = [[], []]; 
    private readonly PHASE_I = 1;
    private readonly PHASE_II  = 2;
    private readonly PHASE_III = 3;

//     gewichte: Gewichte;

    /**
     * Jedes Feld gehoert zu genau 2 Muehlen
     * (Stein 1 gehoert z.B. zur Muehle 1 und zur Muehle 9)
     * [25][2]
     */
    private readonly feldZuMuehle: number[][] = [
            [0, 0 ],
            [1, 9 ],
            [1, 12 ],
            [1, 16 ],
            [2, 10 ],
            [2, 12 ],
            [2, 15 ],
            [3, 11 ],
            [3, 12 ],
            [3, 14 ],
            [4, 9 ],
            [4, 10 ],
            [4, 11 ],
            [5, 14 ],
            [5, 15 ],
            [5, 16 ],
            [6, 11 ],
            [6, 13 ],
            [6, 14 ],
            [7, 10 ],
            [7, 13 ],
            [7, 15 ],
            [8, 9 ],
            [8, 13 ],
            [8, 16 ] ];

    /**
     * Jeder Stein kann bis zu 4 Nachbarn haben. Die Anzahl der Nachbarn von
     * Stein i steht in nachbar[i][0]. Die restlichen 4 Werte beinhalten die
     * Positionen der moeglichen Nachbarn.  [25][5]
     */
    private readonly nachbar: number[][] = [
            [0, 0, 0, 0, 0 ],
            [2, 2, 10, 0, 0 ], // 1
            [3, 1, 3, 5, 0 ], // 2
            [2, 2, 15, 0, 0 ], // 3
            [2, 5, 11, 0, 0 ], // 4
            [4, 2, 4, 6, 8 ], // 5
            [2, 5, 14, 0, 0 ], // 6
            [2, 8, 12, 0, 0 ], // 7
            [3, 5, 7, 9, 0 ], // 8
            [2, 8, 13, 0, 0 ], // 9
            [3, 1, 11, 22, 0 ], // 10
            [4, 4, 10, 12, 19 ], // 11
            [3, 7, 11, 16, 0 ], // 12
            [3, 9, 14, 18, 0 ], // 13
            [4, 6, 13, 15, 21 ], // 14
            [3, 3, 14, 24, 0 ], // 15
            [2, 12, 17, 0, 0 ], // 16
            [3, 16, 18, 20, 0 ], // 17
            [2, 13, 17, 0, 0 ], // 18
            [2, 11, 20, 0, 0 ], // 19
            [4, 17, 19, 21, 23 ], // 20
            [2, 14, 20, 0, 0 ], // 21
            [2, 10, 23, 0, 0 ], // 22
            [3, 20, 22, 24, 0 ], // 23
            [2, 15, 23, 0, 0 ]]; // 24

    /*
     * 1-----------------2-----------------3
     * |                 |                 |
     * |                 |                 |
     * |     4-----------5-----------6     |
     * |     |           |           |     |
     * |     |           |           |     |
     * |     |     7-----8-----9     |     |
     * |     |     |           |     |     |
     * |     |     |           |     |     |
     * 10----11----12          13----14----15
     * |     |     |           |     |     |
     * |     |     |           |     |     |
     * |     |     16----17----18    |     |
     * |     |           |           |     |
     * |     |           |           |     |
     * |     19----------20----------21    |
     * |                 |                 |
     * |                 |                 |
     * 22----------------23----------------24
     *
     * offene Muehlen:
     *
     * Horizontal     | freies Feld        ||   Vertikal        | freies Feld
     *------------------------------------------------------------------------
     *  1 | 10, 2, 3  | 1                  ||   33 |  2,10,22   | 1
     *  2 |  1, 5, 3  | 2                  ||   34 |  1,11,22   | 10
     *  3 |  1, 2,15  | 3                  ||   35 |  1,10,23   | 22
     *  4 | 11, 5, 6  | 4                  ||   36 |  5,11,19   | 4
     *  5 |  4, 2, 6  | 5                  ||   37 |  4,10,19   | 11
     *  6 |  4, 8, 6  | 5                  ||   38 |  4,12,19   | 11
     *  7 |  4, 5,14  | 6                  ||   39 |  4,11,20   | 19
     *  8 | 12, 8, 9  | 7                  ||   40 |  8,12,16   | 7
     *  9 |  7, 5, 9  | 8                  ||   41 |  7,11,16   | 12
     * 10 |  7, 8,13  | 9                  ||   42 |  7,12,17   | 16
     * 11 |  1,11,12  | 10                 ||   43 |  1, 5, 8   | 2
     * 12 | 22,11,12  | 10                 ||   44 |  3, 5, 8   | 2
     * 13 | 10, 4,12  | 11                 ||   45 |  2, 4, 8   | 5
     * 14 | 10,19,12  | 11                 ||   46 |  2, 6, 8   | 5
     * 15 | 10,11, 7  | 12                 ||   47 |  2, 5, 7   | 8
     * 16 | 10,11,16  | 12                 ||   48 |  2, 5, 9   | 8
     * 17 |  9,14,15  | 13                 ||   49 | 16,20,23   | 17
     * 18 | 18,14,15  | 13                 ||   50 | 18,20,23   | 17
     * 19 | 13, 6,15  | 14                 ||   51 | 17,19,23   | 20
     * 20 | 13,21,15  | 14                 ||   52 | 17,21,23   | 20
     * 21 | 13,14, 3  | 15                 ||   53 | 17,20,22   | 23
     * 22 | 13,14,24  | 15                 ||   54 | 17,20,24   | 23
     * 23 | 12,17,18  | 16                 ||   55 |  8,13,18   | 9
     * 24 | 16,20,18  | 17                 ||   56 |  9,14,18   | 13
     * 25 | 16,17,13  | 18                 ||   57 |  9,13,17   | 18
     * 26 | 11,20,21  | 19                 ||   58 |  5,14,21   | 6
     * 27 | 19,17,21  | 20                 ||   59 |  6,13,21   | 14
     * 28 | 19,23,21  | 20                 ||   60 |  6,15,21   | 14
     * 29 | 19,20,14  | 21                 ||   61 |  6,14,20   | 21
     * 30 | 10,23,24  | 22                 ||   62 |  2,15,24   | 3
     * 31 | 22,20,24  | 23                 ||   63 |  3,14,24   | 15
     * 32 | 22,23,15  | 24                 ||   64 |  3,15,23   | 24
     * -------------------------------------------------
     */
    private readonly feldZuOffenerMuehle: number[][] = [
                [ 0, 0],
                [ 2, 3, 11, 34, 35, 43],             //  1
                [ 1, 3, 5, 33, 45, 46, 47, 48, 62],    //  2
                [ 1, 2, 21, 44, 63, 64],             //  3
                [ 5, 6, 7, 13, 37, 38, 39, 45],       //  4
                [ 2, 4, 7, 9, 36, 43, 44, 47, 48, 58], //  5
                [ 4, 5, 6, 19, 46, 59, 60, 61],       //  6
                [ 9, 10, 15, 41, 42, 47],             //  7
                [ 6, 8, 10, 40, 43, 44, 45, 46, 55],    //  8
                [ 8, 9, 17, 48, 56, 57],             //  9
                [ 1, 33, 35, 37, 13, 14, 15, 16 , 30],    // 10
                [ 4, 34, 36, 39, 41, 11, 12, 15, 16, 26], // 11
                [ 8, 11, 12, 13, 14, 23, 38, 40, 42],    // 12
                [10, 19, 20, 21, 22, 25, 55, 57, 59],    // 13
                [ 7, 17, 18, 21, 22, 29, 56, 58, 61, 63], // 14
                [ 3, 17, 18, 19, 20, 32, 60, 62, 64],    // 15
                [16, 24, 25, 40, 41, 49],             // 16
                [23, 25, 27, 42, 51, 52, 53, 54, 57],    // 17
                [18, 23, 24, 50, 55, 56],             // 18
                [14, 27, 28, 29, 36, 37, 38, 51],       // 19
                [24, 26, 29, 31, 39, 49, 50, 53, 54, 61], // 20
                [20, 26, 27, 28, 52, 58, 59, 60],       // 21
                [12, 31, 32, 33, 34, 53],             // 22
                [28, 30, 32, 35, 49, 50, 51, 52, 64],    // 23
                [22, 30, 31, 54, 62, 63]              // 24
    ];
    // tslint:disable-next-line: member-ordering
    static readonly freiFeldEinerOffenenMuehle: number[] = [0,
        1 , 2,  3, 4,  5,  5,  6, 7,  8,  9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 17, 18, 19, 20, 20, 21, 22, 23, 24,
        1, 10, 22, 4, 11, 11, 19, 7, 12, 16,  2,  2,  5,  5,  8,  8, 17, 17, 20, 20, 23, 23,  9, 13, 18,  6, 14, 14, 21,  3, 15, 24];


//    public ZugGenerator(Gewichte p_gewichte)
//    {
//    	gewichte = p_gewichte;
//        this.generiereZufallszahlen();
//    }
    constructor()
    {
        this.generiereZufallszahlen();
    }



    /**
     *
     * Ermittelt alle moeglichen Zuege einer Stellung, fuehrt die Zuege jeweils aus und liefert
     * alle neuen Stellungen zurueck.
     * Die moeglichen Zuege sind abhaengig von der Phase, in der man sich gerade befindet:
     * Phase I: Setzphase
     * Phase II: Ziehphase
     * Phase III: Springphase
     * @return List
     */
    ermittleAlleZuege(stellung: Stellung, laengeStellungsfolge: number,
                      pruefeSymmetrisch: boolean): Array<Stellung>
    {

        const alleStellungen: Array<Stellung> = new Array<Stellung>();

        let posVon: number;
        let posBis: number;
        let eigene: number;
        let fremde: number;

        if (stellung.getAmZug() === Util.WEISS)
        {
            eigene = 0;
            fremde = 1;
        }
        else
        {
            eigene = 1;
            fremde = 0;
        }
        /*------------------------------------------------------------------------*/
        /* Phase I (es gibt noch Steine ausserhalb, Setzphase) : */
        /*------------------------------------------------------------------------*/
        if (stellung.getAnzahlSteineAussen()[eigene] > 0)
        {
            for (posBis = 1; posBis < 25; posBis++)
            {
                /* Ist posBis frei ? */
                // tslint:disable-next-line: no-bitwise
                if (((stellung.getSpielpositionen()[0] | stellung.getSpielpositionen()[1]) & Util.bit[posBis]) === 0)
                {
                    this.erweitereStellungsListeUmNeueStellungen(alleStellungen, 0, posBis, eigene,
                            fremde, stellung, this.PHASE_I, laengeStellungsfolge,
                            pruefeSymmetrisch);
                }
            }
        } /* end of Phase I */
        else
        {
            if (stellung.getAnzahlSteine()[eigene] > 3)
            {
                /*----------------------------------------------------------------------*/
                /* Phase II (keine Aussensteine, mehr als 3 Steine, Schiebphase) : */
                /* Nur in dieser Phase kann es passieren, dass kein Zug */
                /* moeglich ist. */
                /*----------------------------------------------------------------------*/
                for (posVon = 1; posVon < 25; posVon++)
                {
                    // tslint:disable-next-line: no-bitwise
                    if ((stellung.getSpielpositionen()[eigene] & Util.bit[posVon]) !== 0)
                    {
                        for (let zaehl = 1; zaehl <= this.nachbar[posVon][0]; zaehl++)
                        {
                            posBis = this.nachbar[posVon][zaehl];

                            /* Ist posBis frei ? */
                            // tslint:disable-next-line: no-bitwise
                            if (((stellung.getSpielpositionen()[0] | stellung.getSpielpositionen()[1]) & Util.bit[posBis]) === 0)
                            {
                                this.erweitereStellungsListeUmNeueStellungen(alleStellungen,
                                        posVon, posBis, eigene, fremde, stellung, this.PHASE_II,
                                        laengeStellungsfolge, pruefeSymmetrisch);
                            }
                        }
                    }
                }
            } /* end of Phase II */
            else
            /*----------------------------------------------------------------------*/
            /* Phase III (genau 3 Steine, Sprungphase) */
            /*----------------------------------------------------------------------*/
            {
                for (posVon = 1; posVon < 25; posVon++)
                {
                    // tslint:disable-next-line: no-bitwise
                    if ((stellung.getSpielpositionen()[eigene] & Util.bit[posVon]) !== 0)
                    {
                        for (posBis = 1; posBis < 25; posBis++)
                        {
                            /* Ist posBis frei ? */
                            // tslint:disable-next-line: no-bitwise
                            if (((stellung.getSpielpositionen()[0] | stellung.getSpielpositionen()[1]) & Util.bit[posBis]) === 0)
                            {
                                this.erweitereStellungsListeUmNeueStellungen(alleStellungen,
                                        posVon, posBis, eigene, fremde, stellung, this.PHASE_III,
                                        laengeStellungsfolge, pruefeSymmetrisch);
                            }
                        }
                    }
                }
            } // end of Phase III
        } // end of   nicht Phase I
        return alleStellungen;
    }



    private erweitereStellungsListeUmNeueStellungen(alleStellungen: Array<Stellung>,
                                                    posVon: number, posBis: number, eigene: number,
                                                    fremde: number, stellung: Stellung,
                                                    phase: number,
                                                    laengeStellungsfolge: number, pruefeSymmetrisch: boolean): void
    {

        /*---------------------------------------------------------------------------------
         * Erzeuge neue Stellung
         *-------------------------------------------------------------------------------*/
        const neueStellung: Stellung = stellung.kopiereStellung();


        /*---------------------------------------------------------------------------------
         * setze neuen Stein
         *-------------------------------------------------------------------------------*/

        // tslint:disable-next-line: no-bitwise
        neueStellung.getSpielpositionen()[eigene] |= Util.bit[posBis];
        // Fuer Stellungsbewertung
        this.steinBewegungAendertMuehlen(neueStellung,  posBis, eigene, 1);

        /*---------------------------------------------------------------------------------
         * Wenn Phase II oder Phase III, dann muss der Stein von posVon geloescht werden
         *-------------------------------------------------------------------------------*/
        if (phase !== this.PHASE_I)
        {
            // Stein loeschen
            // tslint:disable-next-line: no-bitwise
            neueStellung.getSpielpositionen()[eigene] &= ~Util.bit[posVon];
            // Fuer Stellungsbewertung
            this.steinBewegungAendertMuehlen(neueStellung,  posVon, eigene, -1);
        }
        /*---------------------------------------------------------------------------------
         * In Phase I wandert ein Stein von aussen nach innen.
         *-------------------------------------------------------------------------------*/
        else
        {
            neueStellung.getAnzahlSteineAussen()[eigene]--;
        }

        /*------------------------------------------------------------*/
        /* Wurde Muehle geschlossen ? */
        /*------------------------------------------------------------*/
        if ((neueStellung.muehle[eigene][this.feldZuMuehle[posBis][0]] === 3 ||
                neueStellung.muehle[eigene][this.feldZuMuehle[posBis][1]] === 3))
        {
            /*------------------------------------------------------------*/
            /* Ermittle Steine des Gegners, die geschlagen werden koennen */
            /*------------------------------------------------------------*/
            for (let posSteinWeg = 1; posSteinWeg < 25; posSteinWeg++)
            {
                // tslint:disable-next-line: no-bitwise
                if ((neueStellung.getSpielpositionen()[fremde] & Util.bit[posSteinWeg]) !== 0)
                {
                    /*-----------------------------------------------------------------------
                     * Stein darf nur entfernt werden, wenn er nicht Teil einer geschlossenen
                     * Muehle ist oder wenn alle steine des Gegners Teil einer Muehle sind
                     *----------------------------------------------------------------------*/
                    if ((((neueStellung.muehle[fremde][this.feldZuMuehle[posSteinWeg][0]]) < 3) &&
                            ((neueStellung.muehle[fremde][this.feldZuMuehle[posSteinWeg][1]]) < 3))
                            || (neueStellung.getAnzahlSteine()[fremde] - neueStellung.getAnzahlSteineAussen()[fremde]) ===
                             neueStellung.anzahlMuehlen[fremde] * 3)
                    {
                        // erzeuge Kopie von Stellung --> mit jedem geschlagenem Stein soll
                        // eine neue Stellung abgespeichert werden
                        const weitereNeueStellung = neueStellung.kopiereStellung();

                        // entferne Stein vom Gegner
                        // tslint:disable-next-line: no-bitwise
                        weitereNeueStellung.getSpielpositionen()[fremde] &= ~Util.bit[posSteinWeg];
                        weitereNeueStellung.getAnzahlSteine()[fremde]--;

                        // Fuer Stellungsbewertung
                        this.steinBewegungAendertMuehlen(weitereNeueStellung,  posSteinWeg, fremde, -1);

                        // Fuege neue Stellung in Liste
                        this.fuegeStellungZurListe(posVon, posBis, posSteinWeg, stellung,
                                weitereNeueStellung, alleStellungen, laengeStellungsfolge,
                                eigene, fremde, pruefeSymmetrisch);
                    }
                }
            }
        }
        else
        {
            // Wenn kein Stein geschlagen wurde, muss die zuerst erstellte Neue Stellung noch in die Liste
            this.fuegeStellungZurListe(posVon, posBis, 0, stellung, neueStellung,
                    alleStellungen, laengeStellungsfolge, eigene, fremde, pruefeSymmetrisch);
        }


    }



    private fuegeStellungZurListe(posVon: number, posBis: number, posSteinWeg: number,
                                  alteStellung: IStellung, stellung: Stellung, alleStellungen: Array<Stellung>,
                                  laengeStellungsfolge: number, eigene: number, fremde: number,
                                  pruefeSymmetrisch: boolean): void
    {

        /*
        let weissSchwarz = stellung.getAnzahlSteineAussen()[0];
        // tslint:disable-next-line: no-bitwise
        weissSchwarz <<= 4;
        
        weissSchwarz += stellung.getAnzahlSteineAussen()[1];
        // tslint:disable-next-line: no-bitwise
        weissSchwarz <<= 4;
        */

        /*
        // weissSchwarz <<= 24;
        let weissSchwarz = stellung.getSpielpositionen()[0];
        // tslint:disable-next-line: no-bitwise
        weissSchwarz <<= 24;
        weissSchwarz += stellung.getSpielpositionen()[1];

        stellung.weissSchwarz = weissSchwarz;
        */

        // Wenn es zu dieser Stellung bereits eine symmetrische Stellung in der Liste gibt, wird sie nicht in die Liste mitaufgenommen.
        if (pruefeSymmetrisch)
        {
            if (stellung.isSymmetrisch(alleStellungen))
            {
                this.anzSymmetrieStellungen++;
                return;
            }
        }
        // tslint:disable-next-line: no-bitwise
        stellung.zobristHashWert = alteStellung.getZobristHashWert()
                ^ this.ZOBRIST_ZUFALLSWERTE[eigene][posVon];
        // tslint:disable-next-line: no-bitwise
        stellung.zobristHashWert ^= this.ZOBRIST_ZUFALLSWERTE[eigene][posBis];
        // tslint:disable-next-line: no-bitwise
        stellung.zobristHashWert ^= this.ZOBRIST_ZUFALLSWERTE[fremde][posSteinWeg];
        
        stellung.zobristHashWert ^= this.ZOBRIST_ZUFALLSWERTE_FUER_AUSSEN[eigene][stellung.getAnzahlSteineAussen()[eigene]];
        stellung.zobristHashWert ^= this.ZOBRIST_ZUFALLSWERTE_FUER_AUSSEN[fremde][stellung.getAnzahlSteineAussen()[fremde]];

        //        long weissSchwarzHash = weissSchwarz;
        //        weissSchwarzHash <<= 5;
        //        weissSchwarzHash += laengeStellungsfolge + 1;  // aktuelle Zugtiefe muss unbedingt in Hash-Tabelle beruecksichtigt werden

        // stellung.weissSchwarzHash = new Long(weissSchwarzHash);
        // letzten Zug speichern
        stellung.getLetzterZug().setPosVon(posVon);
        stellung.getLetzterZug().setPosBis(posBis);
        stellung.getLetzterZug().setPosSteinWeg(posSteinWeg);
        // Bewertung
        // stellung.bewerteStellung();
//        stellung.bewerteStellung(gewichte.getGewichtAnzSteine().intValue(), gewichte.getGewichtAnzMuehlen().intValue(),
//        		gewichte.getGewichtAnzOffeneMuehlen().intValue(), gewichte.getGewichtAnzFreieNachbarn().intValue());


        // Wenn vorher Weiss am Zug war, dann jetzt schwarz, und umgekehrt
        stellung.setAmZug(-stellung.getAmZug());
        alleStellungen.push(stellung);
    }


    // tslint:disable-next-line: align
    private generiereZufallszahlen(): void {

        this.ZOBRIST_ZUFALLSWERTE[0][0] = 0;
        this.ZOBRIST_ZUFALLSWERTE[1][0] = 0;
        for (let i = 1; i < 25; i++)
        {
            for (let j = 0; j <= 1; j++)
            {
                this.ZOBRIST_ZUFALLSWERTE[j][i] =  (Math.random() * Util.HASHFELDGROESSE);
            }
        }
        for (let i = 1; i < 9; i++)
        {
            for (let j = 0; j <= 1; j++)
            {
                this.ZOBRIST_ZUFALLSWERTE_FUER_AUSSEN[j][i] =  (Math.random() * Util.HASHFELDGROESSE); 
            }
        }      

      
    }
    /**
     * Die Anzahl der Muehlen, sowie die Anzahl der offenen Muehlen aendert sich, wenn ein Stein bewegt wird.
     * --> wird fuer stellungsbewertung benoetigt
     *
     * @param neueStellung   die Stellung, die veraendert werden soll.
     * @param position Position [1..24] des Steines, der bewegt wird.
     * @param eigenFremd  [0, 1] 0 = ein eigener Stein wird bewegt, 1 = ein fremder Stein wird bewegt
     * @param addiereSubtrahiere  [1, -1]  Wird ein Stein von der uebergenenen Position weggezogen,
     *                              wird hier -1 uebergeben, wird der Stein zur Position hingezogen, dann wird +1 uebergeben
     */
    private steinBewegungAendertMuehlen(neueStellung: Stellung,  position: number, eigenFremd: number, addiereSubtrahiere: number): void
    {
        /*---------------------------------------------------------------------------------
         * geschlossene Muehlen
         *-------------------------------------------------------------------------------*/
        if (addiereSubtrahiere === 1)
        {
            neueStellung.muehle[eigenFremd][this.feldZuMuehle[position][0]] += addiereSubtrahiere;
            neueStellung.muehle[eigenFremd][this.feldZuMuehle[position][1]] += addiereSubtrahiere;
        }
        if (neueStellung.muehle[eigenFremd][this.feldZuMuehle[position][0]] === 3)
        {
            neueStellung.anzahlMuehlen[eigenFremd] += addiereSubtrahiere;
        }
        if (neueStellung.muehle[eigenFremd][this.feldZuMuehle[position][1]] === 3)
        {
            neueStellung.anzahlMuehlen[eigenFremd] += addiereSubtrahiere;
        }
        if (addiereSubtrahiere === -1)
        {
            neueStellung.muehle[eigenFremd][this.feldZuMuehle[position][0]] += addiereSubtrahiere;
            neueStellung.muehle[eigenFremd][this.feldZuMuehle[position][1]] += addiereSubtrahiere;
        }
        /*---------------------------------------------------------------------------------
         * offene Muehlen
         *-------------------------------------------------------------------------------*/
        for (let i = 0; i < (this.feldZuOffenerMuehle[position]).length; i++)
        {
            neueStellung.offeneMuehle[eigenFremd][this.feldZuOffenerMuehle[position][i]] += addiereSubtrahiere;
        }
        /*---------------------------------------------------------------------------------
         * Anzahl freier Nachbarfelder bei position neu berechnen
         * --> wird ebenfalls fuer Stellungsbewertung benoetigt
         *-------------------------------------------------------------------------------*/
        this.berechneNachbarFelderNeu(position, eigenFremd, neueStellung, addiereSubtrahiere);

    }
    /**
     * Anzahl freier Nachbarfelder des Steines an der uebergebenen Position wird neu berechnet.
     * --> wird fuer Stellungsbewertung benoetigt
     *
     * @param posStein  Position des Steines
     * @param eigenFremd  wird ein eigener, oder ein fremder Stein betrachtet. 0 = eigener, 1 = fremder
     * @param neueStellung   die Stellung, die veraendert werden soll.
     * @param addiereSubtrahiere  [1, -1]  Wird ein Stein von der uebergenenen Position weggezogen, wird hier 1 uebergeben, sonst -1
     */
    private berechneNachbarFelderNeu(posStein: number, eigenFremd: number, neueStellung: Stellung, addiereSubtrahiere: number): void
{
        for (let i = 1; i <= this.nachbar[posStein][0]; i++)
        {
            const posAktuell = this.nachbar[posStein][i];

            // tslint:disable-next-line: no-bitwise
            if ((neueStellung.getSpielpositionen()[0] & Util.bit[posAktuell]) !== 0)
            {
                neueStellung.anzahlFreierNachbarfelder[0] -= addiereSubtrahiere;
            }
            // tslint:disable-next-line: no-bitwise
            else if ((neueStellung.getSpielpositionen()[1] & Util.bit[posAktuell]) !== 0)
            {
                neueStellung.anzahlFreierNachbarfelder[1] -= addiereSubtrahiere;
            }
            else // Nachbarfeld ist leer
            {
                neueStellung.anzahlFreierNachbarfelder[eigenFremd] += addiereSubtrahiere;
            }
        }

    }



}
