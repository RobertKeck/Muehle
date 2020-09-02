package muehle;

import java.util.List;

public interface ISpiel
{
    

	/**
	 * Das aktuell laufende Spiel wird, wenn noch nicht geschehen, gestoppt. Die beim Start initialisierten Engines werden auf null gesetzt. 
	 */
    public void stoppeSpiel();
    


    /**
     * Das aktuell laufende Spiel wird, wenn noch nicht geschehen, gestoppt, anschlieﬂend wird die Startstellung aufgebaut.
     */
    public void loescheSpielfeld();
    


    /**
     * Das aktuell laufende Spiel wird, wenn noch nicht geschehen, gestoppt, und der letzte Zug wird rueckgaengig gemacht.
     */
    public void zugZurueck();
    


    /** 
     * Das Spiel wird mit der aktuell vorhanden Stellung gestartet. Das kann die Initialstellung sein, oder auch die Stellung, 
     * die nach dem letzen stoppen stehen blieb.
     * Fuer Weiss und fuer Schwarz wird eine ComputerEngine initialisiert.
     */
    public void start();
    


    /**
     * @return Liefert eine Liste von allen gueltigen Zuegen, die in der aktuellen Stellung moeglich sind.
     */
    public List<IZug> getAlleAktuellGueltigenZuege();
    


    /**
     * Liefert true zurueck, wenn aktuell ein Muehlespiel am laufen ist, sonst false.
     * @return boolean
     */
    public boolean spielIstGestartet();
    


    /**
     * Liefert true zureuck, wenn aktuell ein Muehlespiel am laufen ist, und ein Mensch am Zug ist.
     * Ansonsten liefert es false zureuck.
     * @return boolean
     */
    public boolean istMenschAmZug();
    


    /**
     * @return Gibt die aktuelle Muehlestellung zurueck.
     */
    public IStellungAllgemein getAktuelleStellung();
    


    /**
     * Setzt die aktuelle Muehlestellung mit der uebergebenen Stellung.
     * @param aktuelleStellung
     */
    public void setAktuelleStellung(IStellungAllgemein aktuelleStellung);
    


    /**
     * @return Liest den neuesten Zug des Menschen zureuck. Wenn null zurueckgegeben wird, dann hat der Mensch noch nicht gezogen.
     */
    public IZug getNeuerZugMensch();
    


    /**
     * Setzt den neuesten Zug des Menschen
     * @param p_neuerZug
     */
    public void setNeuerZugMensch(IZug p_neuerZug);
    


    /**
     * Gibt zurueck, wer (Computer oder Mensch) im laufenden Spiel Schwarz und Weiss spielt.
     * 
     * @return <br>
     * computerMensch[0] = COMPUTER --> Weiss wird vom Computer gespielt <br>
     * computerMensch[0] = MENSCH --> Weiss wird vom Menschen gespielt <br>
     * computerMensch[1] = COMPUTER --> Schwarz wird vom Computer gespielt <br>
     * computerMensch[1] = MENSCH --> Schwarz wird vom Menschen gespielt
     */
    public int[] getComputerMensch();
    
}
