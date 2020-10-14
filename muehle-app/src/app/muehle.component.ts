import { Component, OnInit } from '@angular/core';
import { SpielThread } from './SpielThread';
import {ZugGenerator} from './ZugGenerator';
import {Stellung} from './Stellung';
import {Util} from './Util';
import {Zug} from './Zug';
import {KeckEngine} from './KeckEngine';
import {IStellungAllgemein} from './IStellungAllgemein';
import {IZug} from './IZug';
import {IEngine} from './IEngine';
import {ISpiel} from './ISpiel';
import {IStellung} from './IStellung';
// import { FormGroup, FormControl, Validators} from '@angular/forms';
// import { MyWorker } from './worker';
// import * as workerPath from 'file-loader?name=[name].js!./worker';






@Component({
  selector: 'app-root',
  templateUrl: './muehle.component.html',
  styleUrls: ['./muehle.component.css']
})

export class MuehleComponent implements OnInit
{

    worker;
    zugtiefeList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    moeglicheSpieler: any = ['Mensch', 'Computer'];

    formGroupZugtiefe = new FormGroup({
      formControlZugtiefe: new FormControl(5, Validators.required)
    });

    formGroupWeiss = new FormGroup({
        formControlWeiss: new FormControl('Computer', Validators.required)
    });
    formGroupSchwarz = new FormGroup({
        formControlSchwarz: new FormControl('Computer', Validators.required)
    });

    title = 'muehle-app';
    logTextField = '';
    grafikTextField = '';


    computerEngineWeiss: IEngine = null;
    computerEngineSchwarz: IEngine = null;
    // iMuehleFrame: IMuehleFrame;
    stellungsFolgeZobristKeys: number[] = new Array<number>();
    stellungsFolge: IStellungAllgemein[] = new Array<IStellungAllgemein>();
    aktuelleStellungKopie: Stellung;
    stellungsFolgeZobristKeysKopie: number[];
    stellungsFolgeKopie: Array<IStellungAllgemein>;
    private aktuelleStellung: Stellung  =  null;
    spielThread: SpielThread;
    alleAktuellGueltigenStellungen: Stellung[];
    alleAktuellGueltigenStellungenKopie: Stellung[];
    // private neueStellungMensch: Stellung = null;
    private neuerZugMensch: Zug = null;
    /**
     * computerMensch[0] = COMPUTER -- Weiss wird vom Computer gespielt
     * computerMensch[0] = MENSCH -- Weiss wird vom Menschen gespielt
     * computerMensch[1] = COMPUTER -- Schwarz wird vom Computer gespielt
     * computerMensch[1] = MENSCH -- Schwarz wird vom Menschen gespielt
     */
    computerMensch: number[] = new Array<number>();




   ngOnInit(): void {
       this.formGroupZugtiefe.controls.formControlZugtiefe.setValue(5, {onlySelf: true});
       this.erstelleStartStellung();
       this.zeichneSpielfeld();
   }

    getCBZugtiefe(): number{
      return this.formGroupZugtiefe.value.formControlZugtiefe;
    }
    getCBWeiss(): string{
        // return this.comboboxWeiss;
        return this.formGroupWeiss.value.formControlWeiss;
    }
    getCBSchwarz(): string{
        return this.formGroupSchwarz.value.formControlSchwarz;
    }
    /**
     * Spiele-Thread wird gestoppt
     */
    stoppeSpiel(): void
    {
      this.computerEngineWeiss = null;
      this.computerEngineSchwarz = null;
      this.worker.terminate();

      if (this.spielThread != null && this.spielThread.isAlive())
      {
            this.spielThread.stop();

            this.aktuelleStellung = this.aktuelleStellungKopie.kopiereStellung();

            this.stellungsFolgeZobristKeys = this.stellungsFolgeZobristKeysKopie.slice();
            this.stellungsFolge = this.stellungsFolgeKopie.slice();

            // ermittle die aktuell gueltigen Zuege
            const zugGen = new ZugGenerator();
            this.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege(this.aktuelleStellung,
                    this.stellungsFolge.length, false);

            this.log('Das Spiel wurde unterbrochen  -  mit \'Start\' kann es fortgesetzt werden.');
            //// this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
        }

    }
    zugZurueck(): void
    {

        this.stoppeSpiel();

        if (this.stellungsFolge.length > 1)
        {

            this.stellungsFolge.pop();
            this.stellungsFolgeZobristKeys.pop();
            this.aktuelleStellung = (this.stellungsFolge[(this.stellungsFolge.length - 1)] as Stellung).kopiereStellung();
            const zugGen = new ZugGenerator();
            this.aktuelleStellungKopie = this.aktuelleStellung.kopiereStellung();

            this.stellungsFolgeZobristKeysKopie = this.stellungsFolgeZobristKeys.slice();
            this.stellungsFolgeKopie = this.stellungsFolge.slice();

            // ermittle die aktuell gueltigen Zuege
            this.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege(this.aktuelleStellung,
                    this.stellungsFolge.length, false);

            this.alleAktuellGueltigenStellungenKopie = this.alleAktuellGueltigenStellungen.slice();


            this.log('Der letzte Zug wurde rueckgaengig gemacht. Das Spiel wurde unterbrochen und kann mit \'Start\' fortgesetzt werden.');
            // Stellung zeichnen
            this.zeichneSpielfeld();

        }
    }

    loescheSpielfeld(): void
    {
        let ausgabe = '';
        if (this.spielThread != null && this.spielThread.isAlive())
        {
          this.spielThread.stop();
          this.computerEngineWeiss = null;
          this.computerEngineSchwarz = null;

          ausgabe += 'Das Spiel wurde beendet und ';
        }
        this.erstelleStartStellung();
        ausgabe += 'das Spielfeld wurde geloescht.';
        this.log(ausgabe);
        this.zeichneSpielfeld();

    }



    /**
     * Ausgabe der meldung in JTextfield und in Console
     *
     */
    log(meldung: string): void
    {
        // this.iMuehleFrame.log(meldung);
        this.logTextField += meldung;
        //// console.log(meldung);
    }

    /**
     * Ausgabe der meldung in JTextfield und in Console
     *
     */
    zeichneStellung(meldung: string): void
    {

        this.grafikTextField = meldung;

    }

    erstelleStartStellung(): void
    {
        this.aktuelleStellung = new Stellung();
        this.aktuelleStellung.setAmZug(Util.WEISS);
        const initialAnzahlSteine = [9, 9];

        this.aktuelleStellung.setAnzahlSteine(initialAnzahlSteine);
        this.aktuelleStellung.setAnzahlSteineAussen(initialAnzahlSteine);
        this.aktuelleStellung.anzahlMuehlen[0] = 0;
        this.aktuelleStellung.anzahlMuehlen[1] = 0;
        // this.aktuelleStellung.anzahlOffenerMuehlen[0] = 0;
        // this.aktuelleStellung.anzahlOffenerMuehlen[1] = 0;
        this.aktuelleStellung.anzahlFreierNachbarfelder[0] = 0;
        this.aktuelleStellung.anzahlFreierNachbarfelder[1] = 0;
        for (let i = 0; i < 17; i++)
        {
            this.aktuelleStellung.muehle[0][i] = 0;
            this.aktuelleStellung.muehle[1][i] = 0;
            this.aktuelleStellung.offeneMuehle[0][i] = 0;
            this.aktuelleStellung.offeneMuehle[1][i] = 0;
        }
        const leeresSpielfeld = [0, 0];
        this.aktuelleStellung.setSpielpositionen(leeresSpielfeld);
        this.aktuelleStellung.setBewertung(0);
        this.aktuelleStellung.weissSchwarz = 0;

        this.computerMensch[0] = Util.COMPUTER; // Weiss
        this.computerMensch[1] = Util.COMPUTER; // Schwarz
        this.stellungsFolgeZobristKeys = new Array<number>();
        this.stellungsFolge =  new Array<IStellungAllgemein>();
        this.stellungsFolgeZobristKeys.push(this.aktuelleStellung.weissSchwarz);
        this.stellungsFolge.push(this.aktuelleStellung);
    }


    zeichneSpielfeld(): void
    {
        // TODO
        // this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
        this.zeichneStellung(this.aktuelleStellung.toString());
    }

    start(): void
    {


        this.logTextField += 'Spiel wurde gestartet..';
        if (this.spielThread != null)
        {
            this.spielThread.stop();
        }

        /*
        const workerFunction = 'startWorker';
        const dataObj = '(' + workerFunction + ')();'; // here is the trick to convert the above fucntion to string
        // firefox adds "use strict"; to any function which might block worker execution so knock it off
        const blob = new Blob([dataObj.replace('"use strict";', '')]);
        */
        /*
        const blobURL = (window.URL ? URL : webkitURL).createObjectURL({blob,
            type: 'application/javascript; charset=utf-8'
        });
        */
       /*
        const blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob);


        this.worker = new Worker(blobURL); // spawn new worker


        // tslint:disable-next-line: only-arrow-functions
        this.worker.onmessage = function(e): void {
            console.log('Worker said: ', e.data); // message received from worker
        };
        this.worker.postMessage('some input to worker'); // Send data to our worker.
*/

/*

        // URL.createObjectURL
        window.URL = window.URL || window.webkitURL;

        // "Server response", used in all examples
        const response = 'self.onmessage=function(e){postMessage(\'Worker: \'+e.data);}';

        let blob;
        try {
            blob = new Blob([response], {type: 'application/javascript'});
        } catch (e) { // Backwards-compatibility
            // window.MSBlobBuilder = window.MSBlobBuilder || window.MSWebKitBlobBuilder || window.MozBlobBuilder;
            blob = new MSBlobBuilder();
            blob.append(response);
            blob = blob.getBlob();
        }
        this.worker = new Worker(URL.createObjectURL(blob));

        // Test, used in all examples:
        this.worker.onmessage = function(e): void {
            if (e.data === 'Start'){
              let i = 0;
              while (1 === 1){
                  i++;
                  console.log('>>>>' + i);
              }
            }
        };
        this.worker.postMessage('Start');

*/
        if (typeof Worker !== 'undefined') {
            // Create a new
            this.worker = new Worker('./app.worker', { type: 'module' });
            this.worker.onmessage = ({ data }) => {
            console.log(`page got message: ${data}`);
            };
            this.worker.postMessage('hello');
        } else {
            // Web workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
        }

        this.spielThread = new SpielThread(this);




        this.computerEngineWeiss = new KeckEngine();
        this.computerEngineSchwarz = new KeckEngine();
        // computerEngineSchwarz = new ZufallsEngine();

        this.spielThread.start();
    }



    getAlleAktuellGueltigenZuege(): IZug[]
    {
        const alleZuege = new Array<IZug>();


        for (const it of this.alleAktuellGueltigenStellungen)
        {
            alleZuege.push(it.getLetzterZug());
        }
        return alleZuege;
    }



    istSpielGestartet(): boolean
    {
        if (this.spielThread == null)
        {
            return false;
        }
        return this.spielThread.isAlive();
    }



    istMenschAmZug(): boolean
    {
        if (this.istSpielGestartet())
        {
            let eigen = 0;
            if (this.aktuelleStellung.getAmZug() === -1)
            {
                eigen = 1;
            }
            if (this.computerMensch[eigen] === Util.MENSCH)
            {
                return true;
            }
        }
        return false;
    }


    /*
    getMuehleFrame(): IMuehleFrame
    {
        return this.iMuehleFrame;
    }
    */


    getAktuelleStellung(): IStellung
    {
        return this.aktuelleStellung;
    }



    setAktuelleStellung(aktuelleStellung: IStellungAllgemein): void
    {
        this.aktuelleStellung = aktuelleStellung as Stellung;
    }



    getNeuerZugMensch(): IZug
    {
        return this.neuerZugMensch;
    }



    setNeuerZugMensch(neuerZug: IZug): void
    {
        this.neuerZugMensch = neuerZug as Zug;
    }

    getComputerMensch(): number[]
    {
        return this.computerMensch;
    }

    setComputerMensch(computerMensch: number[]): void
    {
        this.computerMensch = computerMensch;
    }

    /**
     * Ermittelt zum uebergeben Zug die Stellung, die entsteht, wenn der Zug ausgefuehrt wird.
     * Wenn null zurueckgegeben wird, ist der Zug nicht gueltig
     */
     ermittleStellungZumGueltigenZug(gueltigerZug: Zug): Stellung
    {
       if (gueltigerZug == null){
         return null;
       }
       for (const stellung of this.alleAktuellGueltigenStellungen){
            if (stellung.getLetzterZug().getPosVon() === gueltigerZug.getPosVon()
               &&
               stellung.getLetzterZug().getPosBis() === gueltigerZug.getPosBis()
               &&
               stellung.getLetzterZug().getPosSteinWeg() === gueltigerZug.getPosSteinWeg() )
            {
                return stellung;
            }
       }
       return null;
    }


}
