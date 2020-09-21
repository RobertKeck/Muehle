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
export class Gewichte {

  gewichtAnzSteine: number;
  gewichtAnzMuehlen: number;
  gewichtAnzOffeneMuehlen: number;
  gewichtAnzFreieNachbarn: number;
  /*
  private readonly GEWICHTE_PROPERTIES_DATEI = 'Gewichte.properties';
  private readonly GEWICHT_ANZ_STEINE =  'GewichtAnzSteine';
  private readonly GEWICHT_ANZ_MUEHLEN =  'GewichtAnzMuehlen';
  private readonly GEWICHT_ANZ_OFFENE_MUEHLEN = 'GewichtAnzOffeneMuehlen';
  private readonly GEWICHT_ANZ_FREIE_NACHBARN = 'GewichtAnzFreieNachbarn';
  */




  constructor(){
    this.ladeGewichte();
  }

  /**
   * Die Werte der Gewichte werden aus der Properties Datei GEWICHTE_PROPERTIES_DATEI gelesen.
   */
  public ladeGewichte(): void
  {
    /*
    const propertiesReader = require('properties-reader');
    const properties = propertiesReader('gewichte.properties');


    this.gewichtAnzSteine = properties.get('GEWICHT_ANZ_STEINE');
    this.gewichtAnzMuehlen = properties.get('GEWICHT_ANZ_MUEHLEN');
    this.gewichtAnzOffeneMuehlen = properties.get('GEWICHT_ANZ_OFFENE_MUEHLEN');
    this.gewichtAnzFreieNachbarn = properties.get('GEWICHT_ANZ_FREIE_NACHBARN');
   */
  this.gewichtAnzSteine = 16;
  this.gewichtAnzMuehlen = 4;
  this.gewichtAnzOffeneMuehlen = 5;
  this.gewichtAnzFreieNachbarn = 3;



  }
  /**
   * Die uebergebenen Gewichte werden uebernommen und anschliessend sofort in die Properties Datei gespeichert.
   */
  aendereGewichte(gewichtAnzSteine: number, gewichtAnzMuehlen: number,
                  gewichtAnzOffeneMuehlen: number, gewichtAnzFreieNachbarn: number): void
  {
     this.gewichtAnzSteine = gewichtAnzSteine;
     this.gewichtAnzMuehlen = gewichtAnzMuehlen;
     this.gewichtAnzOffeneMuehlen = gewichtAnzOffeneMuehlen;
     this.gewichtAnzFreieNachbarn = gewichtAnzFreieNachbarn;


     this.speichereGewichte();
  }

  /**
   * Die Werte der Gewichte werden in die Properties Datei GEWICHTE_PROPERTIES_DATEI geschrieben.
   */
  public speichereGewichte(): void
  {
    /*
    const propertiesReader = require('properties-reader');
    const properties = propertiesReader('gewichte.properties');

    properties.set('GEWICHT_ANZ_STEINE', this.gewichtAnzSteine);
    properties.set('GEWICHT_ANZ_MUEHLEN', this.gewichtAnzMuehlen);
    properties.set('GEWICHT_ANZ_OFFENE_MUEHLEN', this.gewichtAnzOffeneMuehlen);
    properties.set('GEWICHT_ANZ_FREIE_NACHBARN', this.gewichtAnzFreieNachbarn);
    */

  }

  getGewichtAnzSteine(): number {
    return this.gewichtAnzSteine;
  }
  getGewichtAnzMuehlen(): number {
    return this.gewichtAnzMuehlen;
  }
  getGewichtAnzOffeneMuehlen(): number {
    return this.gewichtAnzOffeneMuehlen;
  }
  getGewichtAnzFreieNachbarn(): number {
    return this.gewichtAnzFreieNachbarn;
  }
  setGewichtAnzSteine(gewichtAnzSteine: number): void {
    this.gewichtAnzSteine = gewichtAnzSteine;
  }

  setGewichtAnzMuehlen(gewichtAnzMuehlen: number): void {
    this.gewichtAnzMuehlen = gewichtAnzMuehlen;
  }

  setGewichtAnzOffeneMuehlen(gewichtAnzOffeneMuehlen: number): void {
    this.gewichtAnzOffeneMuehlen = gewichtAnzOffeneMuehlen;
  }

  setGewichtAnzFreieNachbarn(gewichtAnzFreieNachbarn: number): void {
    this.gewichtAnzFreieNachbarn = gewichtAnzFreieNachbarn;
  }

}
