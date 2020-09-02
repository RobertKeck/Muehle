package muehle;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

/**
 * Fuer die Stellungsbewertung werden unterschiedliche Stellungsmerkmale verschieden gewichtet
 * Fuer die Muehlebewertung gibt es folgende Merkmale:
 * - Anzahl Steine
 * - Anzahl Muehlen
 * - Anzahl offener Muehlen
 * - Anzahl freier Nachbarfelder
 * 
 * @author Robert Keck
 *
 */
public class Gewichte {



	Integer gewichtAnzSteine;
	Integer gewichtAnzMuehlen;
	Integer gewichtAnzOffeneMuehlen;
	Integer gewichtAnzFreieNachbarn;
	
	private final String GEWICHTE_PROPERTIES_DATEI = "Gewichte.properties";
	
	private final String GEWICHT_ANZ_STEINE = "GewichtAnzSteine";
	private final String GEWICHT_ANZ_MUEHLEN = "GewichtAnzMuehlen";
	private final String GEWICHT_ANZ_OFFENE_MUEHLEN = "GewichtAnzOffeneMuehlen";
	private final String GEWICHT_ANZ_FREIE_NACHBARN = "GewichtAnzFreieNachbarn";
	
	public Gewichte(){
		ladeGewichte();
	}
	
	/**
	 * Die Werte der Gewichte werden aus der Properties Datei GEWICHTE_PROPERTIES_DATEI gelesen.
	 */
	public void ladeGewichte()
	{
			Properties prop = new Properties();
			try {
				prop.load(getClass().getResourceAsStream(GEWICHTE_PROPERTIES_DATEI));
				
				gewichtAnzSteine = new Integer(prop.getProperty(GEWICHT_ANZ_STEINE, (new Integer(Util.GEWICHT_ANZ_STEINE)).toString()));
				gewichtAnzMuehlen = new Integer(prop.getProperty(GEWICHT_ANZ_MUEHLEN, (new Integer(Util.GEWICHT_ANZ_MUEHLEN)).toString()));
				gewichtAnzOffeneMuehlen = new Integer(prop.getProperty(GEWICHT_ANZ_OFFENE_MUEHLEN, (new Integer(Util.GEWICHT_ANZ_OFFENE_MUEHLEN)).toString()));
				gewichtAnzFreieNachbarn = new Integer(prop.getProperty(GEWICHT_ANZ_FREIE_NACHBARN, (new Integer(Util.GEWICHT_ANZ_FREIE_NACHBARN)).toString()));
				
			}
			catch (IOException e) {
				e.printStackTrace();
			}
	}
//	/**
//	 * Die uebergebenen Gewichte werden uebernommen und anschliessend sofort in die Properties Datei gespeichert.
//	 */
//	public void aendereGewichte(	Integer p_gewichtAnzSteine,	Integer p_gewichtAnzMuehlen,
//			Integer p_gewichtAnzOffeneMuehlen, Integer p_gewichtAnzFreieNachbarn)
//	{
//		 gewichtAnzSteine = p_gewichtAnzSteine;
//		 gewichtAnzMuehlen = p_gewichtAnzMuehlen;
//		 gewichtAnzOffeneMuehlen = p_gewichtAnzOffeneMuehlen;
//		 gewichtAnzFreieNachbarn = p_gewichtAnzFreieNachbarn;
//		 
//		 
//		speichereGewichte();
//	}
	
	/**
	 * Die Werte der Gewichte werden in die Properties Datei GEWICHTE_PROPERTIES_DATEI geschrieben.
	 */
	public void speichereGewichte()
	{
		Properties prop = new Properties();
		try {
			InputStream in = getClass().getResourceAsStream(GEWICHTE_PROPERTIES_DATEI);
	
	
			prop.load(in);
			prop.setProperty(GEWICHT_ANZ_STEINE, gewichtAnzSteine.toString());
			prop.setProperty(GEWICHT_ANZ_MUEHLEN, gewichtAnzMuehlen.toString());
			prop.setProperty(GEWICHT_ANZ_OFFENE_MUEHLEN, gewichtAnzOffeneMuehlen.toString());
			prop.setProperty(GEWICHT_ANZ_FREIE_NACHBARN, gewichtAnzFreieNachbarn.toString());
			URL url = getClass().getResource(GEWICHTE_PROPERTIES_DATEI);
			File file = new File(url.getFile());
			BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
			prop.store(bos, "Gewichte");
		}

		catch (IOException e) {
			e.printStackTrace();

		}
	}

	public Integer getGewichtAnzSteine() {
		return gewichtAnzSteine;
	}
	public Integer getGewichtAnzMuehlen() {
		return gewichtAnzMuehlen;
	}
	public Integer getGewichtAnzOffeneMuehlen() {
		return gewichtAnzOffeneMuehlen;
	}
	public Integer getGewichtAnzFreieNachbarn() {
		return gewichtAnzFreieNachbarn;
	}
	public void setGewichtAnzSteine(Integer gewichtAnzSteine) {
		this.gewichtAnzSteine = gewichtAnzSteine;
	}

	public void setGewichtAnzMuehlen(Integer gewichtAnzMuehlen) {
		this.gewichtAnzMuehlen = gewichtAnzMuehlen;
	}

	public void setGewichtAnzOffeneMuehlen(Integer gewichtAnzOffeneMuehlen) {
		this.gewichtAnzOffeneMuehlen = gewichtAnzOffeneMuehlen;
	}

	public void setGewichtAnzFreieNachbarn(Integer gewichtAnzFreieNachbarn) {
		this.gewichtAnzFreieNachbarn = gewichtAnzFreieNachbarn;
	}

}
