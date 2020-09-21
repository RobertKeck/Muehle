
import {ZugGenerator} from './ZugGenerator';
import {Util} from './Util';
import {Zug} from './Zug';

import {IStellung} from './IStellung';

export class Stellung implements IStellung
{
    private bewertung = 0;
    /**
     * In spielpositionen[0] sind alle weissen Steine, in spielpositionen[1] alle schwarzen Steine
     * gespeichert
     * Jedes Bit repraesentiert eine Spielposition auf dem Spielbrett
     *
     * Ein Muehle - SpielBrett hat 24 verschiedene Spielpositionen. Wenn Bit i von
     * spielpositionen[0]
     * den Wert 1 hat, dann bedeutet das, dass sich an Spielposition i ein weisser Stein befindet.
     *
     * Wenn Bit i von spielpositionen[1] den Wert 1 hat, dann bedeutet das,
     * dass sich an Spielposition i ein schwarzer Stein befindet.
     *
     *
     * Hintergrund:
     * Anstatt ein Feld von 24 Integer zu verwenden, werden nur 2 Integer verwendet, zum einen, um
     * Zeit zu sparen,
     * da die Stellung sehr oft kopiert wird, und zum anderen um Platz zu sparen, wenn die
     * spielpositionen in eine grosse Hashtabelle gespeichert werden
     *
     */
    spielpositionen: number[] = new Array();
    private anzahlSteineAussen: number[] = new Array();
    private anzahlSteine: number[] = new Array();
    private amZug: number;         // 1 = Weiss, -1 = Schwarz
    anzahlMuehlen: number[] = new Array();
    anzahlFreierNachbarfelder: number[] = new Array();
    weissSchwarz: number;          // spielpositionen[0] und spielpositionen[1] und anzahlSteineAussen in einem long
    zobristHashWert: number;
    private letzterZug: Zug = new Zug();

    /**
     * es gibt 16 verschiedene Moeglichkeiten fuer eine weisse Muehle, und 16
     * Moeglichkeiten fuer eine schwarze Muehle. Jede Muehle kann die
     * Werte von 0 bis 3 annehmen. Bei 3 ist sie vollstaendig, also geschlossen.
     */
    muehle: number[][] = [[], []]; // new Array([2][17]);

    /**
     * es gibt 64 verschiedene Moeglichkeiten (1..65) fuer eine offene Muehle fuer Weiss und ebenso viele fuer Schwarz.
     * Nur wenn offeneMuehle[i] = 3, dann ist dies eine offene Muehle.
     */
    offeneMuehle: number[][] = [[], []]; // new Array([2][65]);


    getAnzahlSteine(): number[] {
        return this.anzahlSteine;
    }

  setAnzahlSteine(anzahlSteine: number[]): void {
    this.anzahlSteine = anzahlSteine;
  }

  getAnzahlSteineAussen(): number[] {
    return this.anzahlSteineAussen;
  }

  setAnzahlSteineAussen(anzahlSteineAussen: number[]): void {
    this.anzahlSteineAussen = anzahlSteineAussen;
  }

  setLetzterZug(letzterZug: Zug): void {
    this.letzterZug = letzterZug;
  }


    /**
     * Aufruf der Methode bewerteStellung(int p_gewichtAnzSteine, int p_gewichtAnzMuehlen, int p_gewichtAnzOffeneMuehlen,
     * int p_gewichtAnzFreieNachbarn)
     * mit vordefinierten Gewichten.
     *
     * @return int
     */
//    public int bewerteStellung()
//    {
//    	return bewerteStellung(Util.GEWICHT_ANZ_STEINE, Util.GEWICHT_ANZ_MUEHLEN, Util.GEWICHT_ANZ_OFFENE_MUEHLEN,
// Util.GEWICHT_ANZ_FREIE_NACHBARN);
//    }
    /**
     * Die Stellungsbewertung wird berechnet aus der Anzahl der weissen und schwarzen Steine,
     * aus der Anzahl der weissen und schwarzen Muehlen, sowie aus der Anzahl der weisssen
     * und schwarzen Zugmoeglichkeiten.
     *
     * Die Klassenvariable bewertung wird mit dem neu berechnetem Wert belegt. Zusaetzlich wird
     * dieser neue Wert zurueckgeliefert.
     *
     * @return int
     */
    bewerteStellung(gewichtAnzSteine: number, gewichtAnzMuehlen: number, gewichtAnzOffeneMuehlen: number,
                    gewichtAnzFreieNachbarn: number): number
    {
        let stellungsWert = 0;

        // (Anzahl der weissen Steine minus Anzahl der schwarzen Steine) * Util.GEWICHT_ANZ_STEINE
        stellungsWert += (this.anzahlSteine[0] - this.anzahlSteine[1]) * gewichtAnzSteine;

        // plus Anzahl der weissen Muehlen minus Anzahl der schwarzen Muehlen
        stellungsWert += (this.anzahlMuehlen[0] - this.anzahlMuehlen[1]) * gewichtAnzMuehlen;

        // plus Anzahl der offenen weissen Muehlen minus Anzahl der offenen schwarzen Muehlen
        const anzOffenerMuehlen: number[] = this.getAnzahlOffenerMuehlen();
        stellungsWert += (anzOffenerMuehlen[0] - anzOffenerMuehlen[1]) * gewichtAnzOffeneMuehlen;

        // plus Anzahl der freien Nachbarfelder von Weiss minus Anzahl der freien Nachbarfelder von Schwarz
        // Die Nachbarn zu bewerten, wenn ein Spieler springen kann, macht keinen Sinn
        stellungsWert += (this.anzahlFreierNachbarfelder[0] - this.anzahlFreierNachbarfelder[1]) * gewichtAnzFreieNachbarn;

        // Wenn Schwarz am Zug ist, dann ist es fuer Schwarz besser, wenn die Schwarzen Steine mehr sind, als die Weissen
        // Deshalb muss fuer den Fall das Vorzeichen umgedreht werden:
        stellungsWert *= -this.amZug;

        this.bewertung = stellungsWert;
        return this.bewertung;

    }

    /**
     * Farbe kann die Werte 0 = WEISS und 1 = SCHWARZ annehmen
     * posNR kann die Werte 1..24 annehmen
     * @return boolean
     */
    istSteinNummerVonFarbeBesetzt(farbe: number, posNr: number): boolean
    {
        // tslint:disable-next-line: no-bitwise
        if (((this.spielpositionen[farbe]) & Util.bit[posNr]) === Util.bit[posNr])
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Fuer absteigende Sortierreihenfolge.
     * Stellung mit hoechster Bewertung soll bei Sortierung einer Liste von Stellungen als erstes
     * Element auftauchen.
     */
    compareTo(compareObject: Stellung): number
    {
        return (compareObject).getBewertung() - this.getBewertung();
    }

    getBewertung(): number
    {
        return this.bewertung;
    }

    setBewertung(bewertung: number): void
    {
        this.bewertung = bewertung;
    }

    kopiereStellung(): Stellung
    {
        const neueStellung: Stellung = new Stellung();

        neueStellung.spielpositionen[0] = this.spielpositionen[0];
        neueStellung.spielpositionen[1] = this.spielpositionen[1];
        neueStellung.anzahlSteine[0] = this.anzahlSteine[0];
        neueStellung.anzahlSteine[1] = this.anzahlSteine[1];
        neueStellung.anzahlSteineAussen[0] = this.anzahlSteineAussen[0];
        neueStellung.anzahlSteineAussen[1] = this.anzahlSteineAussen[1];
        neueStellung.anzahlMuehlen[0] = this.anzahlMuehlen[0];
        neueStellung.anzahlMuehlen[1] = this.anzahlMuehlen[1];
        // neueStellung.anzahlOffenerMuehlen[0] = this.anzahlOffenerMuehlen[0];
        // neueStellung.anzahlOffenerMuehlen[1] = this.anzahlOffenerMuehlen[1];
        neueStellung.anzahlFreierNachbarfelder[0] = this.anzahlFreierNachbarfelder[0];
        neueStellung.anzahlFreierNachbarfelder[1] = this.anzahlFreierNachbarfelder[1];
        neueStellung.amZug = this.amZug;
        neueStellung.muehle[0] = this.muehle[0].slice();
        neueStellung.muehle[1] = this.muehle[1].slice();
        neueStellung.offeneMuehle[0] = this.offeneMuehle[0].slice();
        neueStellung.offeneMuehle[1] = this.offeneMuehle[1].slice();
        // neueStellung.weissSchwarz = new Long(this.weissSchwarz.longValue());
        neueStellung.weissSchwarz = this.weissSchwarz;
        neueStellung.zobristHashWert = this.zobristHashWert;
        // neueStellung.weissSchwarzHash = new Long(this.weissSchwarzHash.longValue());
        neueStellung.bewertung = this.bewertung;
        neueStellung.letzterZug.setPosVon(this.letzterZug.getPosVon());
        neueStellung.letzterZug.setPosBis(this.letzterZug.getPosBis());
        neueStellung.letzterZug.setPosSteinWeg(this.letzterZug.getPosSteinWeg());


        return neueStellung;
    }



    /**
     * Ausgabe der aktuellen Stellung in einen String
     *
     * 1-----------------2-----------------3
     * |                 |                 |
     * |                 |                 |
     * |     4-----------5-----------6     |
     * |     |                       |     |
     * |     |                       |     |
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
     */
    toString(): string
    {
        let ausgabeString = '\n';

        ausgabeString += this.feld(1) + '----------------' + this.feld(2) + '----------------'
                + this.feld(3) + '\n';
        ausgabeString += ' |                 |                 |' + '\n';
        ausgabeString += ' |                 |                 |' + '\n';
        ausgabeString += ' |    ' + this.feld(4) + '----------' + this.feld(5) + '----------'
                + this.feld(6) + '     |' + '\n';
        ausgabeString += ' |     |           |           |     |' + '\n';
        ausgabeString += ' |     |           |           |     |' + '\n';
        ausgabeString += ' |     |    ' + this.feld(7) + '----' + this.feld(8) + '----'
                + this.feld(9) + '     |     |' + '\n';
        ausgabeString += ' |     |     |           |     |     |' + '\n';
        ausgabeString += ' |     |     |           |     |     |' + '\n';
        ausgabeString += this.feld(10) + '----' + this.feld(11) + '----' + this.feld(12)
                + '          ' + this.feld(13) + '----' + this.feld(14) + '----' + this.feld(15)
                + '\n';
        ausgabeString += ' |     |     |           |     |     |' + '\n';
        ausgabeString += ' |     |     |           |     |     |' + '\n';
        ausgabeString += ' |     |    ' + this.feld(16) + '----' + this.feld(17) + '----'
                + this.feld(18) + '     |     |' + '\n';
        ausgabeString += ' |     |           |           |     |' + '\n';
        ausgabeString += ' |     |           |           |     |' + '\n';
        ausgabeString += ' |    ' + this.feld(19) + '----------' + this.feld(20) + '----------'
                + this.feld(21) + '     |' + '\n';
        ausgabeString += ' |                 |                 |' + '\n';
        ausgabeString += ' |                 |                 |' + '\n';
        ausgabeString += this.feld(22) + '----------------' + this.feld(23)
                + '----------------' + this.feld(24) + '\n';
        ausgabeString += '\n';
        ausgabeString += 'Bewertung: ' + this.bewertung + '\n';
        ausgabeString += 'anzahlSteineAussen Weiss: ' + this.anzahlSteineAussen[0] + '\n';
        ausgabeString += 'anzahlSteineAussen Schwarz: ' + this.anzahlSteineAussen[1] + '\n';
        ausgabeString += 'anzahlSteine Weiss: ' + this.anzahlSteine[0] + '\n';
        ausgabeString += 'anzahlSteine Schwarz: ' + this.anzahlSteine[1] + '\n';
        ausgabeString += 'anzahlMuehlen Weiss: ' + this.anzahlMuehlen[0] + '\n';
        ausgabeString += 'anzahlMuehlen Schwarz: ' + this.anzahlMuehlen[1] + '\n';
        ausgabeString += 'anzahlOffenerMuehlen Weiss: ' + this.getAnzahlOffenerMuehlen()[0] + '\n';
        ausgabeString += 'anzahlOffenerMuehlen Schwarz: ' + this.getAnzahlOffenerMuehlen()[1] + '\n';
        ausgabeString += 'anzahlFreierNachbarfelder Weiss: '
                + this.anzahlFreierNachbarfelder[0] + '\n';
        ausgabeString += 'anzahlFreierNachbarfelder Schwarz: '
                + this.anzahlFreierNachbarfelder[1] + '\n';
        ausgabeString += 'am Zug: ';
        if (this.amZug === Util.WEISS)
        {
            ausgabeString += 'Weiss';
        }
        else
        {
            ausgabeString += 'Schwarz';
        }
        ausgabeString += '\n';
        ausgabeString += 'ZobristKey: ' + this.zobristHashWert + '\n';
        ausgabeString += 'posVon: ' + this.letzterZug.getPosVon() + '\n';
        ausgabeString += 'posBis: ' + this.letzterZug.getPosBis() + '\n';
        ausgabeString += 'posSteinWeg: ' + this.letzterZug.getPosSteinWeg() + '\n';
        return ausgabeString;
    }



    /**
     * Wenn sich an Position posNr ein weisser Stein befindet, gebe ' W' zurueck.
     * Wenn sich an Position posNr ein schwarzer Stein befindet, gebe ' S' zurueck.
     *
     * Sonst gebe '  ' zurueck.
     *
     */
    private feld(posNr: number): string
    {
        // tslint:disable-next-line: no-bitwise
        if ((this.spielpositionen[0] & Util.bit[posNr]) === Util.bit[posNr])
        {
            return ' W';
        }
        // tslint:disable-next-line: no-bitwise
        else if ((this.spielpositionen[1] & Util.bit[posNr]) === Util.bit[posNr])
        {
            return ' S';
        }
        else
        {
            return '  ';
        }
    }



    /**
     * Es wird geprueft, ob es in der Liste von Stellungen eine Stellung gibt, die zur
     * aktuellen Stellung symmetrisch ist. Wenn das der Fall ist, wird true zurueckgeliefert.
     *
     * Zwei Stellungen sind symmetrisch, wenn sie spiegelsymetrisch zu mindestens einer ihrer 4
     * Achsen sind.
     * Auf der jeweiligen Spiegelachse muessen die Steine identisch sein.
     * Die 4 Spiegelachsen sind folgende:
     * 1) die Vertikale durch die Felder 2, 5, 8, 17, 20, 23
     * 2) die Horizontale durch die Felder 10, 11, 12, 13, 14, 15
     * 3) die Diagonale durch die Felder 1, 4, 7, 18, 21, 24
     * 4) die Diagonale durch die Felder 3, 6, 9, 16, 19, 22
     *
     * @return boolean
     */
    isSymmetrisch(alleStellungen: Array<Stellung>): boolean
    {

        for (const stellung of alleStellungen)
        {

            // Pruefe Vertikale
            // tslint:disable-next-line: no-bitwise
            if ((this.spielpositionen[0] & Util.VERTIKALE) === (stellung.getSpielpositionen()[0] & Util.VERTIKALE)
                    // tslint:disable-next-line: no-bitwise
                    && (this.spielpositionen[1] & Util.VERTIKALE) === (stellung.getSpielpositionen()[1] & Util.VERTIKALE))
            {
                if (Util.linksGleichRechts(this.spielpositionen[0],
                        stellung.getSpielpositionen()[0]))
                {
                    if (Util.linksGleichRechts(this.spielpositionen[1],
                            stellung.getSpielpositionen()[1]))
                    {
                        if (Util.linksGleichRechts(stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.linksGleichRechts(stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }

                    }

                }
            }
            // Pruefe Horizontale
            // tslint:disable-next-line: no-bitwise
            if ((this.spielpositionen[0] & Util.HORIZONTALE) === (stellung.getSpielpositionen()[0] & Util.HORIZONTALE)
                    // tslint:disable-next-line: no-bitwise
                    && (this.spielpositionen[1] & Util.HORIZONTALE) === (stellung.getSpielpositionen()[1] & Util.HORIZONTALE))
            {
                if (Util.obenGleichUnten(this.spielpositionen[0], stellung.getSpielpositionen()[0] ))
                {
                    if (Util.obenGleichUnten(this.spielpositionen[1], stellung.getSpielpositionen()[1] ))
                    {
                        if (Util.obenGleichUnten(stellung.getSpielpositionen()[0], this.spielpositionen[0] ))
                        {
                            if (Util.obenGleichUnten(stellung.getSpielpositionen()[1], this.spielpositionen[1] ))
                            {
                                return true;
                            }
                        }

                    }

                }
            }
            // Pruefe Diagonale I
            // tslint:disable-next-line: no-bitwise
            if ((this.spielpositionen[0] & Util.DIAGONALE_I) === (stellung.getSpielpositionen()[0] & Util.DIAGONALE_I)
                    // tslint:disable-next-line: no-bitwise
                    && (this.spielpositionen[1] & Util.DIAGONALE_I) === (stellung.getSpielpositionen()[1] & Util.DIAGONALE_I))
            {
                if (Util.linksUntenGleichRechtsOben(this.spielpositionen[0],
                        stellung.getSpielpositionen()[0]))
                {
                    if (Util.linksUntenGleichRechtsOben(this.spielpositionen[1],
                            stellung.getSpielpositionen()[1]))
                    {
                        if (Util.linksUntenGleichRechtsOben(stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.linksUntenGleichRechtsOben(stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }

                    }

                }
            }
            // Pruefe Diagonale II
            // tslint:disable-next-line: no-bitwise
            if ((this.spielpositionen[0] & Util.DIAGONALE_II) === (stellung.getSpielpositionen()[0] & Util.DIAGONALE_II)
                    // tslint:disable-next-line: no-bitwise
                    && (this.spielpositionen[1] & Util.DIAGONALE_II) === (stellung.getSpielpositionen()[1] & Util.DIAGONALE_II))
            {
                if (Util.linksObenGleichRechtsUnten(this.spielpositionen[0],
                        stellung.getSpielpositionen()[0]))
                {
                    if (Util.linksObenGleichRechtsUnten(this.spielpositionen[1],
                            stellung.getSpielpositionen()[1]))
                    {
                        if (Util.linksObenGleichRechtsUnten(stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.linksObenGleichRechtsUnten(stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }

                    }

                }
            }
        }
        return false;
    }



    getSpielpositionen(): number[]
    {
        return this.spielpositionen;
    }



    setSpielpositionen(spielpositionen: number[]): void
    {
        this.spielpositionen = spielpositionen;
    }


//    public int getAnzahlSteineWeiss(){
//    	return this.anzahlSteine[0];
//    }
//    public void setAnzahlSteineWeiss(int p_anzSteineWeiss){
//    	this.anzahlSteine[0] = p_anzSteineWeiss;
//    }
//    public int getAnzahlSteineSchwarz(){
//    	return this.anzahlSteine[1];
//    }
//    public void setAnzahlSteineSchwarz(int p_anzSteineSchwarz){
//    	this.anzahlSteine[1] = p_anzSteineSchwarz;
//    }
//    public int getAnzahlSteineAussenWeiss(){
//    	return this.anzahlSteineAussen[0];
//    }
//    public void setAnzahlSteineAussenWeiss(int p_anzSteineAussenWeiss){
//    	this.anzahlSteineAussen[0] = p_anzSteineAussenWeiss;
//    }
//    public int getAnzahlSteineAussenSchwarz(){
//    	return this.anzahlSteineAussen[1];
//    }
//    public void setAnzahlSteineAussenSchwarz(int p_anzSteineAussenSchwarz){
//    	this.anzahlSteineAussen[1] = p_anzSteineAussenSchwarz;
//
//    }


//
//    public int[] getAnzahlSteine(){
//    	return this.anzahlSteine;
//    }
//    public void setAnzahlSteine(int[]);
//    public int getAnzahlSteineSchwarz();
//    public void setAnzahlSteineSchwarz(int p_anzSteineSchwarz);
//    public int getAnzahlSteineAussenWeiss();
//    public void setAnzahlSteineAussenWeiss(int p_anzSteineWeiss);
//    public int getAnzahlSteineAussenSchwarz();
//    public void setAnzahlSteineAussenSchwarz(int p_anzSteineSchwarz);
//


    getAnzahlMuehlen(): number[]
    {
        return this.anzahlMuehlen;
    }



    setAnzahlMuehlen(anzahlMuehlen: number[]): void
    {
        this.anzahlMuehlen = anzahlMuehlen;
    }



    getAnzahlFreierNachbarfelder(): number[]
    {
        return this.anzahlFreierNachbarfelder;
    }



    setAnzahlFreierNachbarfelder(anzahlFreierNachbarfelder: number[]): void
    {
        this.anzahlFreierNachbarfelder = anzahlFreierNachbarfelder;
    }



    getAmZug(): number
    {
        return this.amZug;
    }



    setAmZug(amZug: number): void
    {
        this.amZug = amZug;
    }



    getWeissSchwarz(): number
    {
        return this.weissSchwarz;
    }



    setWeissSchwarz(weissSchwarz: number): void
    {
        this.weissSchwarz = weissSchwarz;
    }



    getZobristHashWert(): number
    {
        return this.zobristHashWert;
    }



    setZobristHashWert(zobristHashWert: number): void{
        this.zobristHashWert = zobristHashWert;
    }



    getMuehle(): number[][]
    {
        return this.muehle;
    }



    setMuehle(muehle: number[][]): void
    {
        this.muehle = muehle;
    }



    getLetzterZug(): Zug
    {
        return this.letzterZug;
    }





    // public int[] getAnzahlOffenerMuehlen() {
    // return anzahlOffenerMuehlen;
    // }
    //
    //
    //
    // public void setAnzahlOffenerMuehlen(int[] anzahlOffenerMuehlen) {
    //   this.anzahlOffenerMuehlen = anzahlOffenerMuehlen;
    // }


    getAnzahlOffenerMuehlen(): number[]
    {
        const anzahlOffenerMuehlen: number[] = [0, 0];
        for (let i = 1; i < 65; i++)
        {
          if (this.offeneMuehle[0][i] === 3)
          {
             // tslint:disable-next-line: no-bitwise
             if ((this.getSpielpositionen()[0] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) === 0
                &&
                // tslint:disable-next-line: no-bitwise
                (this.getSpielpositionen()[1] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) === 0)
             {
                anzahlOffenerMuehlen[0]++;
             }
          }
          if (this.offeneMuehle[1][i] === 3)
          {
            // tslint:disable-next-line: no-bitwise
            if ((this.getSpielpositionen()[0] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) === 0
                &&
                // tslint:disable-next-line: no-bitwise
                (this.getSpielpositionen()[1] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) === 0)
            {
               anzahlOffenerMuehlen[1]++;
            }
          }
        }
        return anzahlOffenerMuehlen;
    }


}
