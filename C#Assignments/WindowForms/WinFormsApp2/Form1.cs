using System.Windows.Forms;

namespace WinFormsApp2
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {


        }

        //public void dtpDOB_valuechanged(object sender, EventArgs e)

        //DateTime dob = dtpDOB.Value.Date;
        //DateTime today = DateTime.Today;

        //int years = today.Year - dob.Year;
        //int months = today.Month - dob.Month;
        //int days = today.Day - dob.Day;

        //if (days < 0)
        //{
        //    months--;
        //    days += DateTime.DaysInMonth(today.Year, today.Month == 1 ? 12 : today.Month - 1);
        //}

        //if (months < 0)
        //{
        //    years--;
        //    months += 12;
        //}

        //lblAge.Text = $"Your Age: {years} Years {months} Months {days} Days";

       

        private void lblAge_Click(object sender, EventArgs e)
        {
            DateTime dob = dtpDOB.Value;
            TimeSpan tm = (DateTime.Now - dob);
            int age = (tm.Days / 365);
            lblAge.Text = age.ToString() + " Yrs.";
        }
    }
}

