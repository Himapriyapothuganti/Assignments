using System;

namespace Requirement_1
{
    public class Ticket
    {
        // Private field to store ticket number
        private string _ticketNo;

        // Public property for TicketNo
        public string TicketNo
        {
            get { return _ticketNo; }
            set { _ticketNo = value; }
        }

        // Private field to store parked time
        private DateTime _parkedTime;

        // Public property for ParkedTime
        public DateTime ParkedTime
        {
            get { return _parkedTime; }
            set { _parkedTime = value; }
        }

        // Private field to store parking cost
        private double _cost;

        // Public property for Cost
        public double Cost
        {
            get { return _cost; }
            set { _cost = value; }
        }

        // Default constructor
        public Ticket()
        {
        }

        // Parameterized constructor to initialize all fields
        public Ticket(string _ticketNo, DateTime _parkedTime, double _cost)
        {
            TicketNo = _ticketNo;
            ParkedTime = _parkedTime;
            Cost = _cost;
        }

        // Override ToString() to display ticket details in formatted way
        public override string ToString()
        {
            return $"TicketNo:\"{_ticketNo}\"\n" +
                   $"ParkedTime:\"{_parkedTime}\"\n" +
                   $"Cost:\"{_cost.ToString("0.0")}\"\n";
        }
    }
}
