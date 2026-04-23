namespace Lemmikloomad.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? KliinikId { get; set; }
        public Kliinik? Kliinik { get; set; }

        public int Hinnang { get; set; } = 5;
        public string Kommentaar { get; set; } = string.Empty;
        public DateTime LoodudAeg { get; set; } = DateTime.UtcNow;
    }
}
