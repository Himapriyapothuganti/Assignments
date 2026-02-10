using System;

namespace Requirement_2
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Ask user to enter parking lot name
            Console.WriteLine("Enter the name of the Parking Lot: ");
            string name = Console.ReadLine();

            int choice;

            // Create ParkingLot object
            ParkingLot lot = new ParkingLot(name);

            // Menu loop (runs until user exits)
            do
            {
                // Display menu options
                Console.WriteLine("1.Add Vehicle \n2.Delete Vehicle \n3.Display Vehicles \n4.Exit ");
                Console.WriteLine("Enter your choice:");

                try
                {
                    // Convert user input to integer
                    choice = Convert.ToInt32(Console.ReadLine());
                }
                catch (FormatException)
                {
                    // If user enters non-numeric value
                    Console.WriteLine("Invalid input. Please enter a number.");
                    continue; // Restart loop
                }

                try
                {
                    switch (choice)
                    {
                        case 1:
                            // Add Vehicle
                            Console.WriteLine("Give Input - Registration no,name,type,weight,ticket no,parked time ,cost");
                            Console.WriteLine("Enter : ");

                            string input = Console.ReadLine();

                            // Create Vehicle object using static factory method
                            Vehicle v = Vehicle.CreateVehicle(input);

                            // Add vehicle to parking lot
                            lot.AddVehcile(v);

                            Console.WriteLine("Vehicle successfully added");
                            break;

                        case 2:
                            // Delete Vehicle
                            Console.WriteLine("Enter the registration number of the vehicle to be deleted:");
                            string regNo = Console.ReadLine();

                            // Remove vehicle from list
                            bool res = lot.RemoveVehicleFromParkingLot(regNo);

                            if (res)
                                Console.WriteLine("Vehicle successfully deleted");
                            else
                                Console.WriteLine("Vehicle not found");

                            break;

                        case 3:
                            // Display all vehicles
                            lot.DisplayVehicles();
                            break;

                        case 4:
                            // Exit application
                            Console.WriteLine("Exiting");
                            return;

                        default:
                            // If user enters invalid menu option
                            Console.WriteLine("Invalid choice. Please try again.");
                            break;
                    }
                }
                catch (Exception ex)
                {
                    // Handles unexpected errors
                    // Example: wrong date format, missing fields, parse errors
                    Console.WriteLine("Error: " + ex.Message);
                }

            } while (true); // Infinite loop until exit
        }
    }
}
