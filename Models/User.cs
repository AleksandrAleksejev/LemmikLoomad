namespace Lemmikloomad.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        // Lubatud rollid: User, Admin
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Kasutatakse parooli lähtestamiseks – null kui linki pole saadetud
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

        public List<Lemmikloom> Lemmikloomad { get; set; } = new();
        public List<Broneering> Broneeringud { get; set; } = new();
    }
}
