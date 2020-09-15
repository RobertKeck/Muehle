package muehle.gui;


import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Vector;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import muehle.ISpiel;
import muehle.IStellungAllgemein;
import muehle.Stellung;

public class MuehleFrame extends JFrame implements IMuehleFrame
{
    /**
	 * 
	 */
	private static final long serialVersionUID = -8953689115590983898L;

	SpielbrettGrafik          spielbrett         = new SpielbrettGrafik(this);
    
    private JLabelMuehle      brettLabel         = new JLabelMuehle(this);
    private JPanel            jPanelRechts       = new JPanel();
    private JButton           bSpielStart        = new JButton("Start");
    private JButton           bSpielStop         = new JButton("Stop");
    private JButton           bLoescheSpielfeld  = new JButton("Spielfeld l�schen");
    private JButton           bZugZurueck        = new JButton("Zug zur�ck");
    private JTextField        tfMeldung          = new JTextField();
    private JLabel            lbWeiss            = new JLabel("Weiß");
    private JLabel            lbSchwarz          = new JLabel("Schwarz");
    private JLabel            lbZugtiefe         = new JLabel("Zugtiefe");
    private JComboBox         cbWeiss;
    private JComboBox         cbSchwarz;
    private JComboBox         cbZugtiefe;
    
    protected Vector<String>  vCompMensch        = new Vector<String>();
    protected Vector<Integer> vZugtiefe          = new Vector<Integer>();
    
    
    private ISpiel          spiel              = null;




	protected boolean         menschKannSchlagen = false;
    
    

    /**
     * Konstruktor
     */
    public MuehleFrame(ISpiel p_ISpiel)
    {
        super("Mühle");
        this.setSpiel(p_ISpiel);
        

        this.zeichneStellung(this.spiel.getAktuelleStellung());
        
        this.vCompMensch.add("Computer");
        this.vCompMensch.add("Mensch");
        this.vZugtiefe.add(new Integer(1));
        this.vZugtiefe.add(new Integer(2));
        this.vZugtiefe.add(new Integer(3));
        this.vZugtiefe.add(new Integer(4));
        this.vZugtiefe.add(new Integer(5));
        this.vZugtiefe.add(new Integer(6));
        this.vZugtiefe.add(new Integer(7));
        this.vZugtiefe.add(new Integer(8));
        this.vZugtiefe.add(new Integer(9));
        

        this.cbWeiss = new JComboBox(this.vCompMensch);
        this.cbWeiss.setSelectedItem("Mensch");
        this.cbSchwarz = new JComboBox(this.vCompMensch);
        this.cbSchwarz.setSelectedItem("Computer");
        this.cbZugtiefe = new JComboBox(this.vZugtiefe);
        this.cbZugtiefe.setSelectedItem(new Integer(7));
        
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(1000, 600);
        

        this.jPanelRechts.setLayout(new GridBagLayout());
        
        this.jPanelRechts.add(this.bSpielStart, new GridBagConstraints(1, 1, 2, 1, 0.0, 0.0,
                GridBagConstraints.NORTH, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.bSpielStop, new GridBagConstraints(1, 2, 2, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.bLoescheSpielfeld, new GridBagConstraints(1, 3, 2, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.bZugZurueck, new GridBagConstraints(1, 4, 2, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.lbWeiss, new GridBagConstraints(1, 5, 1, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.cbWeiss, new GridBagConstraints(2, 5, 1, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.lbSchwarz, new GridBagConstraints(1, 6, 1, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.cbSchwarz, new GridBagConstraints(2, 6, 1, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.lbZugtiefe, new GridBagConstraints(1, 7, 1, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 3), 0, 0));
        this.jPanelRechts.add(this.cbZugtiefe, new GridBagConstraints(2, 7, 1, 1, 0.0, 0.0,
                GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(3, 3, 3, 60), 0, 0));
        
        this.bSpielStart.setPreferredSize(new Dimension(150, 30));
        this.bSpielStop.setPreferredSize(new Dimension(150, 30));
        this.bLoescheSpielfeld.setPreferredSize(new Dimension(150, 30));
        this.tfMeldung.setPreferredSize(new Dimension(this.getWidth(), 30));
        this.lbWeiss.setPreferredSize(new Dimension(50, 30));
        this.cbWeiss.setPreferredSize(new Dimension(100, 30));
        this.lbSchwarz.setPreferredSize(new Dimension(50, 30));
        this.cbSchwarz.setPreferredSize(new Dimension(100, 30));
        this.lbZugtiefe.setPreferredSize(new Dimension(50, 30));
        this.cbZugtiefe.setPreferredSize(new Dimension(40, 30));
        

        this.getContentPane().add(this.brettLabel, BorderLayout.CENTER);
        this.getContentPane().add(this.jPanelRechts, BorderLayout.EAST);
        this.getContentPane().add(this.tfMeldung, BorderLayout.SOUTH);
        this.tfMeldung.setEditable(false);
        
        this.bSpielStart.addActionListener(new ActionListener()
        {
            public void actionPerformed(ActionEvent ev)
            {
                MuehleFrame.this.starteSpiel();
            }
        });
        
        this.bSpielStop.addActionListener(new ActionListener()
        {
            public void actionPerformed(ActionEvent ev)
            {
                if (MuehleFrame.this.spiel != null)
                {
                    MuehleFrame.this.spiel.stoppeSpiel();
                }
            }
        });
        
        this.bLoescheSpielfeld.addActionListener(new ActionListener()
        {
            public void actionPerformed(ActionEvent ev)
            {
                
                MuehleFrame.this.loescheSpielfeld();
            }
        });
        this.bZugZurueck.addActionListener(new ActionListener()
        {
            public void actionPerformed(ActionEvent ev)
            {
                MuehleFrame.this.zugZurueck();
            }
        });
        
        this.pack();
        this.setVisible(true);
    }
    


    /**
     * 
     * @param p_stellung
     */
    public void zeichneStellung(IStellungAllgemein p_stellung)
    {
        this.spielbrett.setStellung((Stellung) p_stellung);
        this.brettLabel.repaint();
    }
    


    private void starteSpiel()
    {
        
        this.spiel.start();
    }
    


    private void loescheSpielfeld()
    {
        this.spiel.loescheSpielfeld();
    }
    


    private void zugZurueck()
    {
        this.spiel.zugZurueck();
    }
    


    public void log(String p_Meldung)
    {
        this.tfMeldung.setText(p_Meldung);
    }
    


    public String getCBWeiss()
    {
        return (String) this.cbWeiss.getSelectedItem();
    }
    


    public String getCBSchwarz()
    {
        return (String) this.cbSchwarz.getSelectedItem();
    }
    


    public int getCBZugtiefe()
    {
        return ((Integer) this.cbZugtiefe.getSelectedItem()).intValue();
    }
    public ISpiel getSpiel() {
		return spiel;
	}



	public void setSpiel(ISpiel spiel) {
		this.spiel = spiel;
	}
    
}
