export interface IZug
{
    /**
     * Liefert die Position, von der ein Zug aus durchgefuehrt worden ist. Moegliche Werte auf dem Muehlespielfeld sind 1..24
     * Der Wert 0 bedeutet, dass sich der Stein ausserhalb des Muehlespielfeldes befindet, also noch nicht eingesetzt wurde.<br><br>
     *
     *
     * Verteilung der Positionen im Muehlefeld :<br><br>
     *
     *  1-----------------2-----------------3<br>
     *  |.................|.................|<br>
     *  |.................|.................|<br>
     *  |.....4-----------5-----------6.....|<br>
     *  |.....|...........|...........|.....|<br>
     *  |.....|...........|...........|.....|<br>
     *  |.....|.....7-----8-----9.....|.....|<br>
     *  |.....|.....|           |.....|.....|<br>
     *  |.....|.....|           |.....|.....|<br>
     *  10----11----12          13----14----15<br>
     *  |.....|.....|           |.....|.....|<br>
     *  |.....|.....|           |.....|.....|<br>
     *  |.....|.....16----17----18....|.....|<br>
     *  |.....|...........|...........|.....|<br>
     *  |.....|...........|...........|.....|<br>
     *  |.....19----------20----------21....|<br>
     *  |.................|.................|<br>
     *  |.................|.................|<br>
     *  22----------------23----------------24<br>
     *
     *
     */
    getPosVon(): number;


    /**
     * Setzt die Position, von der ein Zug aus durchgefuehrt worden ist. Moegliche Werte auf dem Muehlespielfeld sind 1..24
     * Der Wert 0 bedeutet, dass sich der Stein ausserhalb des Muehlespielfeldes befindet, also noch nicht eingesetzt wurde.
     *
     * @see #getPosVon() Verteilung der Positionen im Muehlefeld
     *
     */
    setPosVon(posVon: number): void;


    /**
     * Liefert die Position, zu dem ein Spielstein hingezogen wurde. Moegliche Werte sind 1..24
     *
     * @see #getPosVon() Verteilung der Positionen im Muehlefeld
     * @return int
     */
    getPosBis(): number;


    /**
     * Setzt die Position, zu dem ein Spielstein hingezogen werden soll. Moegliche Werte sind 1..24
     *
     * @see #getPosVon() Verteilung der Positionen im Muehlefeld
     */
    setPosBis(posBis: number): void;


    /**
     * Liefert die Position des Spielsteines, der geschlagen wurde. Moegliche Werte auf dem Muehlespielfeld sind 1..24
     * Der Wert 0 bedeutet, dass kein Stein geschlagen wurde.
     *
     *
     * @see #getPosVon() Verteilung der Positionen im Muehlefeld
     *
     */
    getPosSteinWeg(): number;

    /**
     * Setzt die Position des Spielsteines, der geschlagen wurde. Moegliche Werte auf dem Muehlespielfeld sind 1..24
     * Der Wert 0 bedeutet, dass kein Stein geschlagen wurde.
     *
     *
     * @see #getPosVon() Verteilung der Positionen im Muehlefeld
     */
    setPosSteinWeg(posSteinWeg: number): void;

}
