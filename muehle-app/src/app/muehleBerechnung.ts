import {ZugGenerator} from './ZugGenerator';
import {Stellung} from './Stellung';
import {Util} from './Util';
import {KeckEngine} from './KeckEngine';


export class MuehleBerechnung
{
    anzStellungenBlaetter = 0;
    anzStellungenInHashGefunden = 0;
    zugtiefeMax: number;
    ergebnisStellung: Stellung  = new Stellung();
    zugGen: ZugGenerator = new ZugGenerator();
    // Vector<Long> stellungsFolgeZobristKeys = new Vector<Long>();
    // Vector<Stellung> stellungsFolge = new Vector<Stellung>();
    keckEngine: KeckEngine;
    wertneu: number;

    constructor(keckEngine: KeckEngine)
    {
        this.keckEngine = keckEngine;
        this.zugGen = new ZugGenerator();
    }

    /**
     * Ermittelt ausgehend von der uebergeben Stellung den Besten Zug, fuehrt diesen aus, und
     * schreibt das Ergebnis in ergebnisStellung
     */
    ermittleBestenZug(stellung: Stellung, zugtiefe: number, alpha: number, beta: number): number
    {
        let eigene = 0;
        //          if (spiel.threadGestoppt){
        //        	  return 0;
        //          }
        if (stellung.getAmZug() === Util.SCHWARZ)
        {
            eigene = 1;
        }

        /*--------------------------------------------------------------------------*/
        /* Spieler hat weniger als 3 Steine --> verloren --> Abbruch */
        /*--------------------------------------------------------------------------*/
        if (stellung.getAnzahlSteine()[eigene] < 3)
        {
           const wertneu = -Util.MAXIMUM + zugtiefe;

           return wertneu;
        }
        /*--------------------------------------------------------------------------*/
        /* Wurde maximale Zugtiefe erreicht ? */
        /*--------------------------------------------------------------------------*/
        if (zugtiefe >= this.zugtiefeMax)
        {
            this.anzStellungenBlaetter++;
            const wertneu = -stellung.bewerteStellung(this.keckEngine.getGewichte().getGewichtAnzSteine(),
                                                    this.keckEngine.getGewichte().getGewichtAnzMuehlen(),
                                                    this.keckEngine.getGewichte().getGewichtAnzOffeneMuehlen(),
                                                    this.keckEngine.getGewichte().getGewichtAnzFreieNachbarn());
            return wertneu;
        }
        /*--------------------------------------------------------------------------*/
        /* Kam eine Stellung bereits vor, dann ist unentschieden. */
        /* Das bedeutet Abbruch an dieser Stelle mit einer Bewertung von 0. */
        /* Kann nur in Phase II oder III passieren */
        /*--------------------------------------------------------------------------*/
        // Wenn das erste Vorkommen der Stellung nicht am Vektorende ist,
        // dann liegt Stellungswiederholung vor
        if (this.keckEngine.stellungsFolgeZobristKeys.indexOf(stellung.getZobristHashWert()) !==
                                this.keckEngine.stellungsFolgeZobristKeys.length - 1)
        {
               return 0; // Remi
        }


        /*--------------------------------------------------------------------------*/
        /* Ermittle (phasenabhaengig) alle moeglichen Zuege */
        /*--------------------------------------------------------------------------*/
        let alleStellungen = this.zugGen.ermittleAlleZuege(stellung,
                this.keckEngine.stellungsFolgeZobristKeys.length, true);
        /*--------------------------------------------------------------------------*/
        /* Wurde Spieler eingeschlossen ? (Kann nur in Schiebphase passieren) */
        /*--------------------------------------------------------------------------*/
        if (alleStellungen.length === 0)
        {
            const wertneu = -Util.MAXIMUM + zugtiefe;


            return wertneu;
        }

        /*--------------------------------------------------------------------------*/
        /* Extrem wichtig fuer ein moeglichst haeufiges Abschneiden beim Alpha/ */
        /* beta -Algorithmus ist eine moeglichst gute Vorsortierung. */
        /* Die Vorsortierung ist ab der vorletzten Ebene nicht mehr noetig. */
        /*--------------------------------------------------------------------------*/
        if (zugtiefe < this.zugtiefeMax - 1)
        {
            for (const stellungAktuell of alleStellungen)
            {
              stellungAktuell.bewerteStellung(this.keckEngine.getGewichte().getGewichtAnzSteine(),
              this.keckEngine.getGewichte().getGewichtAnzMuehlen(),
              this.keckEngine.getGewichte().getGewichtAnzOffeneMuehlen(),
              this.keckEngine.getGewichte().getGewichtAnzFreieNachbarn());

            }
            // Sortiere die Stellungen anhand ihrer Bewertung absteigend
            alleStellungen = alleStellungen.sort((n1, n2) => n2.getBewertung() - n1.getBewertung());
            /*
            alleStellungen = alleStellungen.sort((n1, n2) => {
              if (n1.getBewertung() > n2.getBewertung()) {
                 return 1;
              }
              else if (n1.getBewertung() < n2.getBewertung()) {
                 return -1;
              }
              else {
                return 0;
              }
            });
            */
        }
        /*---------------------------------------------------------------------------------------------------*/
        /* Schleife ueber alle moeglichen Zuege, der Zug mit der hoechsten Bewertung wird zuerst durchlaufen */
        /*---------------------------------------------------------------------------------------------------*/
        for (const stellungNeu of alleStellungen)
        {

            // ---------------------------------
            // rekursiver Aufruf
            // ---------------------------------
            // Neuen Zug in Stellungsfolge speichern
            /////////////// this.keckEngine.stellungsFolgeZobristKeys.push(stellungNeu.getWeissSchwarz());
            this.keckEngine.stellungsFolgeZobristKeys.push(stellungNeu.getZobristHashWert());

            const wertneu = -this.ermittleBestenZug(stellungNeu, (zugtiefe + 1), -beta, -alpha);

            // neuen Zug aus Stellungsfolge wieder loeschen
            this.keckEngine.stellungsFolgeZobristKeys.splice(this.keckEngine.stellungsFolgeZobristKeys.length - 1, 1);

            /*------------------------------------------------------------------------*/
            /* Wenn alpha >= beta --> sofort abschneiden */
            /*------------------------------------------------------------------------*/
            if (wertneu >= beta)
            {
                if (zugtiefe === 0)
                {
                    this.ergebnisStellung = stellungNeu.kopiereStellung();
                    this.ergebnisStellung.setBewertung(beta);
                }

                // console.log('>>>Zugtiefe: ' + zugtiefe);
                // console.log('>>>>>>>>>beta: ' + beta);
                return beta;
            }

            /*------------------------------------------------------------------------*/
            /* Wenn neuer Wert > alpha --> veraendere alpha */
            /*------------------------------------------------------------------------*/
            if (wertneu > alpha)
            {
                alpha = wertneu;
                if (zugtiefe === 0)
                {
                    this.ergebnisStellung = stellungNeu.kopiereStellung();
                    this.ergebnisStellung.setBewertung(wertneu);
                }

            }
        } /* end of Schleife ueber moegliche Zuege */
        return alpha;
    } /* end of ErmittleBestenZug */


    getZugtiefeMax(): number
    {
        return this.zugtiefeMax;
    }

    setZugtiefeMax(zugtiefeMax: number): void
    {
        this.zugtiefeMax = zugtiefeMax;
    }

}
