
import {ZugGenerator} from './ZugGenerator';
import {Stellung} from './Stellung';
import {IZug} from './IZug';
import {IEngine} from './IEngine';


export class ZufallsEngine implements IEngine{

  berechneNeuenZug(stellungsFolge: Stellung[], zugtiefeMax: number): IZug{
    const stellung: Stellung = stellungsFolge[stellungsFolge.length - 1];
    const zugGen: ZugGenerator = new ZugGenerator();

    let alleStellungen: Stellung[] = zugGen.ermittleAlleZuege(stellung, 0, false);
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

    return alleStellungen[0].getLetzterZug();
  }


  getEngineName(): string{
    return 'ZufallsEngine';
  }

}
