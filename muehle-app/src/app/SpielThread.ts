package muehle;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.TimeZone;
import java.util.Vector;

public class SpielThread extends Thread
{
    
    Spiel spiel;
    
    

    public SpielThread(Spiel p_spiel)
    {
        this.spiel = p_spiel;
    }
    


    // Spielschleife
    public void run()
    {
        
        boolean spielZuEnde = false;
        ZugGenerator zugGen = new ZugGenerator();
        int zugNr = 0;
        int l_zugtiefeMax = this.spiel.getMuehleFrame().getCBZugtiefe();

        
        while (!spielZuEnde)
        { // && spiel.threadGestoppt == false){
            
            this.spiel.aktuelleStellungKopie = (Stellung)this.spiel.getAktuelleStellung().kopiereStellung();
            this.spiel.stellungsFolgeSchwarzWeissKopie = new Vector<Long>(
                    this.spiel.stellungsFolgeSchwarzWeiss);
            this.spiel.stellungsFolgeKopie = new Vector<IStellungAllgemein>(this.spiel.stellungsFolge);

        	// ermittle die aktuell gueltigen Zuege
            this.spiel.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege(
                    (Stellung) this.spiel.getAktuelleStellung(),
                    this.spiel.stellungsFolge.size(), false);
            this.spiel.alleAktuellGueltigenStellungenKopie = new ArrayList<Stellung>(this.spiel.alleAktuellGueltigenStellungen);

            
            l_zugtiefeMax = this.spiel.getMuehleFrame().getCBZugtiefe();
            int eigen = 0;
            if (this.spiel.getAktuelleStellung().getAmZug() == -1)
            {
                eigen = 1;
            }
            

            if (this.spiel.getMuehleFrame().getCBWeiss().equals("Mensch"))
            {
                this.spiel.computerMensch[0] = Util.MENSCH;
            }
            else
            {
                this.spiel.computerMensch[0] = Util.COMPUTER;
            }
            if (this.spiel.getMuehleFrame().getCBSchwarz().equals("Mensch"))
            {
                this.spiel.computerMensch[1] = Util.MENSCH;
            }
            else
            {
                this.spiel.computerMensch[1] = Util.COMPUTER;
            }
            

            if (this.spiel.computerMensch[eigen] == Util.MENSCH)
            {
                // Mensch ist am Zug
                
                if (this.spiel.getAktuelleStellung().getAmZug() == Util.WEISS)
                {
                    this.spiel.log("Weiss ist am Zug");
                }
                else
                {
                    this.spiel.log("Schwarz ist am Zug");
                }
                //spiel.setAlleAktuellGueltigenStellungen(zugGen.ermittleAlleZuege((Stellung)spiel.getAktuelleStellung(), spiel.stellungsFolge.size(), false));
                this.spiel.setNeuerZugMensch(null);
                while (this.spiel.getNeuerZugMensch() == null)
                {
                    //do nothing  -- warte auf Benutzereingabe
                }
                this.spiel.setAktuelleStellung(this.spiel.ermittleStellungZumGueltigenZug(
                        (Zug) this.spiel.getNeuerZugMensch()).kopiereStellung());
                
            }
            else
            {
            	IZug l_computerZug = null;
                // Computer ueberlegt den naechsten Zug
                if (this.spiel.getAktuelleStellung().getAmZug() == Util.WEISS)
                {
                    this.spiel.log(this.spiel.computerEngineWeiss.getEngineName() + " ist mit Weiss am Zug. Bitte warten...");
                    // Computerzug wird von computerEngineWeiss durchgefuehrt
                    l_computerZug = this.spiel.computerEngineWeiss.berechneNeuenZug((Vector<IStellungAllgemein>)this.spiel.stellungsFolge, l_zugtiefeMax);
                }
                else
                {
                    this.spiel.log(this.spiel.computerEngineSchwarz.getEngineName() + " ist mit Schwarz am Zug. Bitte warten...");
                    // Computerzug wird von computerEngineWeiss durchgefuehrt
                    l_computerZug = this.spiel.computerEngineSchwarz.berechneNeuenZug((Vector<IStellungAllgemein>)this.spiel.stellungsFolge, l_zugtiefeMax);
                }
                if (l_computerZug == null){
                	String l_ausgabe = "Es wurde kein Zug von der Engine zurückgegeben !! Das Spiel wurde abgebrochen.";
                	this.spiel.computerEngineWeiss = null;
                	this.spiel.computerEngineSchwarz = null;
                	
                	this.spiel.log(l_ausgabe);
                	break;
                }

                Stellung l_stellung = this.spiel.ermittleStellungZumGueltigenZug((Zug) l_computerZug);
                // Ungueltiger Zug --> Spielabbruch
                if (l_stellung == null){
                	String l_ausgabe = "Ungueltiger Zug (PosVon: " + l_computerZug.getPosVon() + "  , PosBis: " 
        			+ l_computerZug.getPosBis() + "  , PosGeschlagen: " + l_computerZug.getPosSteinWeg() 
					+ ")  !! Das Spiel wurde abgebrochen.";
                	
                	this.spiel.computerEngineWeiss = null;
                	this.spiel.computerEngineSchwarz = null;
                	
                	this.spiel.log(l_ausgabe);
                	break;
                }
                else
                {
                	this.spiel.setAktuelleStellung(l_stellung.kopiereStellung());
                }

                //System.out.println("anzSymmetrieStellungen: " + zugGen.anzSymmetrieStellungen);
//            try
//            {
//                Thread.sleep(1);
//                //Thread.sleep(1000);
//            }
//            catch (InterruptedException ie)
//            {
//                System.out.println(ie.toString());
//            }
               /// this.spiel.setAktuelleStellung(this.spiel.muehleBerechnung.ergebnisStellung.kopiereStellung());
            }
            
            this.spiel.zeichneSpielfeld();
            System.out.println(this.spiel.getAktuelleStellung().toString());
            zugNr++;
            System.out.println("ZugNr: " + zugNr);
            
            this.spiel.stellungsFolgeSchwarzWeiss.add(this.spiel.getAktuelleStellung().getWeissSchwarz());
            this.spiel.stellungsFolge.add((Stellung) this.spiel.getAktuelleStellung());
            
            if (this.spiel.getAktuelleStellung().getAnzahlSteine()[0] < 3)
            {
                spielZuEnde = true;
                this.spiel.log("Schwarz hat gewonnen!");
            }
            else if (this.spiel.getAktuelleStellung().getAnzahlSteine()[1] < 3)
            {
                spielZuEnde = true;
                this.spiel.log("Weiss hat gewonnen!");
            }
            else if (this.spiel.getAktuelleStellung().getAnzahlFreierNachbarfelder()[0] == 0
                    && this.spiel.getAktuelleStellung().getAnzahlSteineAussen()[0] == 0
                    && this.spiel.getAktuelleStellung().getAnzahlSteine()[0] > 3)
            {
                spielZuEnde = true; // Weiss wurde eingesperrt
                this.spiel.log("Weiss wurde eingesperrt ==> Schwarz hat gewonnen!");
            }
            else if (this.spiel.getAktuelleStellung().getAnzahlFreierNachbarfelder()[1] == 0
                    && this.spiel.getAktuelleStellung().getAnzahlSteineAussen()[1] == 0
                    && this.spiel.getAktuelleStellung().getAnzahlSteine()[1] > 3)
            {
                spielZuEnde = true; // Schwarz wurde eingesperrt
                this.spiel.log("Schwarz wurde eingesperrt ==> Weiss hat gewonnen!");
            }
            else if (this.spiel.stellungsFolgeSchwarzWeiss.indexOf(this.spiel.getAktuelleStellung().getWeissSchwarz()) != this.spiel.stellungsFolgeSchwarzWeiss.size() - 1)
            {
                spielZuEnde = true; // Remi
                this.spiel.log(">>> Remie wegen Stellungswiederholung <<<");
            }
            
        }
    }
}
