import {IZug} from './IZug';

export class Zug implements IZug
{
    private posVon: number;
    private posBis: number;
    private posSteinWeg: number;


    getPosVon(): number
    {
        return this.posVon;
    }

    setPosVon(posVon: number): void
    {
        this.posVon = posVon;
    }


    getPosBis(): number
    {
        return this.posBis;
    }


    setPosBis(posBis: number): void
    {
        this.posBis = posBis;
    }


    getPosSteinWeg(): number
    {
        return this.posSteinWeg;
    }


    setPosSteinWeg(posSteinWeg: number): void
    {
        this.posSteinWeg = posSteinWeg;
    }
}
