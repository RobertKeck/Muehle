
class MuehleBerechnung
{
    

    anzStellungenBlaetter: BigInteger;
    anzStellungenInHashGefunden: BigInteger;
    

    zugtiefeMax : BigInteger;
    
    ergebnisStellung: Stellung;
    zugGen: ZugGenerator;
    //	Vector<Long> stellungsFolgeSchwarzWeiss = new Vector<Long>(); 
    //	Vector<Stellung> stellungsFolge = new Vector<Stellung>();
    keckEngine: KeckEngine;
    wertneu: BigInteger;
    
    

    constructor (p_KeckEngine: KeckEngine)
    {
        this.keckEngine = p_KeckEngine;
        let anzStellungenBlaetter       = 0;
        let anzStellungenInHashGefunden = 0;
        let ergebnisStellung = new Stellung();
        zugGen = new ZugGenerator();
    }
    


    /**
     * Ermittelt ausgehend von der uebergeben Stellung den Besten Zug, fuehrt diesen aus, und
     * schreibt das Ergebnis in ergebnisStellung
     * 
     * @param p_stellung
     * @param zugtiefe
     * @param alpha
     * @param beta
     * 
     * 
     */
    ermittleBestenZug(p_stellung: Stellung, zugtiefe:BigInteger, alpha:BigInteger, beta:BigInteger):BigInteger
    {
        
        
        let eigene = 0;
        
        
        //          if (spiel.threadGestoppt){
        //        	  return 0;
        //          }
        if (p_stellung.getAmZug() == Util.SCHWARZ)
        {
            eigene = 1;
        }
        
       
        /*--------------------------------------------------------------------------*/
        /* Spieler hat weniger als 3 Steine --> verloren --> Abbruch */
        /*--------------------------------------------------------------------------*/
        if (p_stellung.getAnzahlSteine()[eigene] < 3)
        {
            let wertneu = -Util.MAXIMUM + zugtiefe;

            return wertneu;
        }
        /*--------------------------------------------------------------------------*/
        /* Wurde maximale Zugtiefe erreicht ? */
        /*--------------------------------------------------------------------------*/
        if (zugtiefe >= this.zugtiefeMax)
        {
            this.anzStellungenBlaetter++;
            let wertneu = -p_stellung.bewerteStellung(keckEngine.getGewichte().getGewichtAnzSteine().intValue(),
            		keckEngine.getGewichte().getGewichtAnzMuehlen().intValue(),
            		keckEngine.getGewichte().getGewichtAnzOffeneMuehlen().intValue(),
            		keckEngine.getGewichte().getGewichtAnzFreieNachbarn().intValue());

            return wertneu;
        }
        /*--------------------------------------------------------------------------*/
        /* Kam eine Stellung bereits vor, dann ist unentschieden. */
        /* Das bedeutet Abbruch an dieser Stelle mit einer Bewertung von 0. */
        /* Kann nur in Phase II oder III passieren */
        /*--------------------------------------------------------------------------*/
        // Wenn das erste Vorkommen der Stellung nicht am Vektorende ist,
        // dann liegt Stellungswiederholung vor
        if (this.keckEngine.stellungsFolgeSchwarzWeiss.indexOf(p_stellung.getWeissSchwarz()) != this.keckEngine.stellungsFolgeSchwarzWeiss.size() - 1)
        {
            return 0; // Remi
        }
        

        /*--------------------------------------------------------------------------*/
        /* Ermittle (phasenabhaengig) alle moeglichen Zuege */
        /*--------------------------------------------------------------------------*/
        List<Stellung> alleStellungen = this.zugGen.ermittleAlleZuege(p_stellung,
                this.keckEngine.stellungsFolgeSchwarzWeiss.size(), true);
        /*--------------------------------------------------------------------------*/
        /* Wurde Spieler eingeschlossen ? (Kann nur in Schiebphase passieren) */
        /*--------------------------------------------------------------------------*/
        if (alleStellungen.size() == 0)
        {
            let wertneu = -Util.MAXIMUM + zugtiefe;

            return wertneu;
        }
        
        /*--------------------------------------------------------------------------*/
        /* Extrem wichtig fuer ein moeglichst haeufiges Abschneiden beim Alpha/ */
        /* beta -Algorithmus ist eine moeglichst gute Vorsortierung. */
        /* Die Vorsortierung ist ab der vorletzten Ebene nicht mehr noetig. */
        /*--------------------------------------------------------------------------*/
        if (zugtiefe < this.zugtiefeMax - 1)
        {
            ListIterator<Stellung> it = alleStellungen.listIterator();
            while (it.hasNext())   
            {
            	Stellung l_stellungAktuell = it.next();
            	l_stellungAktuell.bewerteStellung(keckEngine.getGewichte().getGewichtAnzSteine().intValue(),
                		keckEngine.getGewichte().getGewichtAnzMuehlen().intValue(),
                		keckEngine.getGewichte().getGewichtAnzOffeneMuehlen().intValue(),
                		keckEngine.getGewichte().getGewichtAnzFreieNachbarn().intValue());
            	
            }
        	// Sortiere die Stellungen
            Collections.sort(alleStellungen);
        }
        /*---------------------------------------------------------------------------------------------------*/
        /* Schleife ueber alle moeglichen Zuege, der Zug mit der hoechsten Bewertung wird zuerst durchlaufen */
        /*---------------------------------------------------------------------------------------------------*/
        ListIterator<Stellung> it = alleStellungen.listIterator();
        while (it.hasNext())
        {
            Stellung l_stellungNeu = it.next();
            
            //---------------------------------
            // rekursiver Aufruf  
            //---------------------------------
            // Neuen Zug in Stellungsfolge speichern
            this.keckEngine.stellungsFolgeSchwarzWeiss.add(l_stellungNeu.getWeissSchwarz());
            
            wertneu = -this.ermittleBestenZug(l_stellungNeu, (short) (zugtiefe + 1), -beta, -alpha);
            
            // neuen Zug aus Stellungsfolge wieder loeschen
            this.keckEngine.stellungsFolgeSchwarzWeiss.remove(this.keckEngine.stellungsFolgeSchwarzWeiss.size() - 1);
            
            /*------------------------------------------------------------------------*/
            /* Wenn alpha >= beta --> sofort abschneiden */
            /*------------------------------------------------------------------------*/
            if (wertneu >= beta)
            {
                if (zugtiefe == 0)
                {
                    this.ergebnisStellung = l_stellungNeu.kopiereStellung();
                    this.ergebnisStellung.setBewertung(beta);
                }
                
                //				System.out.println(">>>Zugtiefe: " + zugtiefe);
                //		      System.out.println(">>>>>>>>>beta: " + beta);
                return beta;
            }
            
            /*------------------------------------------------------------------------*/
            /* Wenn neuer Wert > alpha --> veraendere alpha */
            /*------------------------------------------------------------------------*/
            if (wertneu > alpha)
            {
                alpha = wertneu;
                if (zugtiefe == 0)
                {
                    this.ergebnisStellung = l_stellungNeu.kopiereStellung();
                    this.ergebnisStellung.setBewertung(wertneu);
                }

            }
        } /* end of Schleife ueber moegliche Zuege */
        return alpha;
    } /* end of ErmittleBestenZug */
    


    function getZugtiefeMax():BigInteger
    {
        return this.zugtiefeMax;
    }

    function setZugtiefeMax(p_zugtiefeMax:BigInteger)
    {
        this.zugtiefeMax = p_zugtiefeMax;
    }
    
}
