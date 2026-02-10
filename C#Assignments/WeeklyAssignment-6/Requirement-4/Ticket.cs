using System;

namespace Requirement_4
{
    public class Ticket
    {
        // Private field to store ticket number
        private string _ticketNo;

        // Public property to get and set Ticket Number
        public string TicketNo
        {
            get { return _ticketNo; }
            set { _ticketNo = value; }
        }

        // Private field to store parked time
        private DateTime _parkedTime;

        // Public property to get and set Parked Time
        public DateTime ParkedTime
        {
            get { return _parkedTime; }
            set { _parkedTime = value; }
        }

        // Private field to store parking cost
        private double _cost;

        // Public property to get and set Cost
        public double Cost
        {
            get { return _cost; }
            set { _cost = value; }
        }

        // Default constructor
        public Ticket()
        {
        }

        // Parameterized constructor to initialize all ticket details
        public Ticket(string _ticketNo, DateTime _parkedTime, double _cost)
        {
            this._ticketNo = _ticketNo;
            this._parkedTime = _parkedTime;
            this._cost = _cost;
        }
    }
}
