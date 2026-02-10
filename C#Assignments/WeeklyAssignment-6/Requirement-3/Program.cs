using System.Text.RegularExpressions;

namespace Requirement_3
{
    internal class Program
    {
        // This method validates the registration number format
        public static bool ValidateRegistrationNo(string registrationNo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registrationNo))
                    return false;
                string pattern = @"^[A-Z]{2}\s[0-9]{1,2}\s([A-Z]{0,2}\s)?[0-9]{1,4}$";
                // Regex.IsMatch returns true if input matches the pattern
                return Regex.IsMatch(registrationNo, pattern);
            }
            catch(Exception ex) {
                // If any unexpected error occurs, print error (optional)
                Console.WriteLine("Error occurred: " + ex.Message);

                // Return false since validation failed
                return false;
            }
        }
        static void Main(string[] args)
        {
            // Prompt user to enter registration number
            Console.WriteLine("Enter the registration no. to be validated:");
            // Read input from console
            string registrationNo = Console.ReadLine();
            // Call validation method and print result accordingly
            if (ValidateRegistrationNo(registrationNo))
            {
                Console.WriteLine("Registration No. is valid");
            }
            else
            {
                Console.WriteLine("Registration No. is invalid");
            }

        }
    }
}
