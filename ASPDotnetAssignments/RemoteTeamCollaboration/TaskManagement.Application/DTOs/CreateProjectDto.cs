namespace TaskManagement.Application.DTOs
{
    public class CreateProjectDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TeamId { get; set; } = string.Empty;
        public string CreatedByUserId { get; set; } = string.Empty;
    }
}
