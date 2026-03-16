namespace TaskManagement.Domain.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AssignedToUserId { get; set; } = string.Empty;
        public string AssignedByUserId { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium"; 
        // Low / Medium / High
        public string Status { get; set; } = "Todo";    
        // Todo / InProgress / Completed
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int ProjectId { get; set; }
        public bool IsDeleted { get; set; } = false;

        // Navigation
        public Project? Project { get; set; }
    }
}
