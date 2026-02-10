using System;
using System.Collections.Generic;

namespace Requirement_4
{
    public class VehicleBO
    {
        // Method to search vehicles by type (case-insensitive)
        public List<Vehicle> FindVehicle(List<Vehicle> vehicleList, string type)
        {
            // Create a new list to store matching vehicles
            List<Vehicle> filteredVehicles = new List<Vehicle>();

            // Loop through each vehicle in the list
            foreach (Vehicle vehicle in vehicleList)
            {
                // Compare vehicle type ignoring case differences
                if (vehicle.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
                {
                    filteredVehicles.Add(vehicle);
                }
            }

            // Return matching vehicles
            return filteredVehicles;
        }

        // Overloaded method to search vehicles by parked time
        public List<Vehicle> FindVehicle(List<Vehicle> vehicleList, DateTime parkedTime)
        {
            // Create list to store matching vehicles
            List<Vehicle> filteredVehicles = new List<Vehicle>();

            // Loop through each vehicle
            foreach (Vehicle vehicle in vehicleList)
            {
                // Check if Ticket is not null and parked time matches
                if (vehicle.Ticket != null && vehicle.Ticket.ParkedTime == parkedTime)
                {
                    filteredVehicles.Add(vehicle);
                }
            }

            // Return matching vehicles
            return filteredVehicles;
        }
    }
}
