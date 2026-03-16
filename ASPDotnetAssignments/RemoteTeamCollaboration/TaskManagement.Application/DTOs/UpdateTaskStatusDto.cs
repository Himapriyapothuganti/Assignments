namespace TaskManagement.Application.DTOs
{
    public class UpdateTaskStatusDto
    {
        public string Status { get; set; } = string.Empty;
        // Todo / InProgress / Completed
    }
}
