namespace Domain.Enums;

public static class Roles
{
    public const string Admin = "Admin";
    public const string Manager = "Manager";
    public const string Employee = "Employee";

    public static readonly string[] AllRoles = { Admin, Manager, Employee };
}
