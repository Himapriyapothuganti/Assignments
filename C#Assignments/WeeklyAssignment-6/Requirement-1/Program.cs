using System;

namespace Requirement_1
{
    public class Program
    {
        static void Main(string[] args)
        {
            // Ask user to enter first vehicle details
            Console.WriteLine("Enter vehicle 1 details");

            // Read input and split using comma
            // Expected format:
            // registrationNo,name,type,weight,ticketNo,parkedTime,cost
            string[] vehicledetail1 = Console.ReadLine().Split(',');

            // Create Ticket object for vehicle 1
            // ParseExact is used to strictly follow the given date format
            Ticket t1 = new Ticket(
                vehicledetail1[4],   // ticketNo
                DateTime.ParseExact(vehicledetail1[5], "dd-MM-yyyy HH:mm:ss", null), // parkedTime
                double.Parse(vehicledetail1[6])  // cost
            );

            // Create Vehicle object for vehicle 1
            Vehicle v1 = new Vehicle(
                vehicledetail1[0],  // registrationNo
                vehicledetail1[1],  // name
                vehicledetail1[2],  // type
                double.Parse(vehicledetail1[3]),  // weight
                t1  // Ticket object
            );

            // Ask user to enter second vehicle details
            Console.WriteLine("Enter vehicle 2 details");

            string[] vehicledetail2 = Console.ReadLine().Split(',');

            // Create Ticket object for vehicle 2
            Ticket t2 = new Ticket(
                vehicledetail2[4],
                DateTime.ParseExact(vehicledetail2[5], "dd-MM-yyyy HH:mm:ss", null),
                double.Parse(vehicledetail2[6])
            );

            // Create Vehicle object for vehicle 2
            Vehicle v2 = new Vehicle(
                vehicledetail2[0],
                vehicledetail2[1],
                vehicledetail2[2],
                double.Parse(vehicledetail2[3]),
                t2
            );

            // Display both vehicle details using overridden ToString() method
            Console.WriteLine(v1);
            Console.WriteLine(v2);

            // Compare both vehicles using overridden Equals() method
            if (v1.Equals(v2))
            {
                Console.WriteLine("Both are equal");
            }
            else
            {
                Console.WriteLine("Both are not Equal");
            }
        }
    }
}
