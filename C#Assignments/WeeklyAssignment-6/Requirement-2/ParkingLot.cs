using System;
using System.Collections.Generic;

namespace Requirement_2
{
    public class ParkingLot
    {
        // Private field to store list of vehicles
        private List<Vehicle> _vehicleList;

        // Public property for vehicle list
        public List<Vehicle> VehicleList
        {
            get { return _vehicleList; }
            set { _vehicleList = value; }
        }

        // Private field to store parking lot name
        private string _name;

        // Public property for parking lot name
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        // Default constructor (initializes empty vehicle list)
        private ParkingLot()
        {
            _vehicleList = new List<Vehicle>();
        }

        // Parameterized constructor to initialize parking lot name
        public ParkingLot(string _name)
        {
            Name = _name;
            VehicleList = new List<Vehicle>();
        }

        // Method to add a vehicle into parking lot
        public void AddVehcile(Vehicle vehicle)
        {
            _vehicleList.Add(vehicle);
        }

        // Method to remove vehicle using registration number
        // Returns true if vehicle is removed successfully
        // Returns false if vehicle not found
        public bool RemoveVehicleFromParkingLot(string registrationNo)
        {
            foreach (Vehicle v in _vehicleList)
            {
                if (v.RegistrationNo.Equals(registrationNo))
                {
                    _vehicleList.Remove(v);
                    return true;
                }
            }
            return false;
        }

        // Method to display all vehicles in parking lot
        public void DisplayVehicles()
        {
            // Check if list is empty
            if (_vehicleList.Count == 0)
            {
                Console.WriteLine("No vehicles to show");
            }
            else
            {
                Console.WriteLine("Vehicles in " + _name);

                // Display table header
                Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7} {4}",
                    "Registration No", "Name", "Type", "Weight", "Ticket No");

                // Display each vehicle details
                foreach (Vehicle v in _vehicleList)
                {
                    Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7} {4}",
                        v.RegistrationNo,
                        v.Name,
                        v.Type,
                        v.Weight,
                        v.Ticket.TicketNo);   // corrected here
                }
            }
        }
    }
}
