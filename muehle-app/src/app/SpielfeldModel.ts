import {Stellung} from './Stellung';

export class SpielfeldModel
{

    aktuelleStellung: Stellung;
    stellungsFolge: Array<Stellung>;


    getAktuelleStellung(): Stellung
    {
        return this.aktuelleStellung;
    }



    setAktuelleStellung(stellung: Stellung): void
    {
        this.aktuelleStellung = stellung;
    }



    getStellungsFolge(): Stellung[]
    {
        return this.stellungsFolge;
    }



    setStellungsFolge(StellungsFolge: Stellung[]): void
    {
        this.stellungsFolge = StellungsFolge;
    }
}
