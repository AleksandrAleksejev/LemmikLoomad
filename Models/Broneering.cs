namespace Lemmikloomad.Models
{
    public class Broneering
    {
        public int Id { get; set; }

        // Seosed teiste tabelitega
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int LemmikloomId { get; set; }
        public Lemmikloom Lemmikloom { get; set; } = null!;

        public int ProtseduurId { get; set; }
        public Protseduur Protseduur { get; set; } = null!;

        public int KliinikId { get; set; }
        public Kliinik Kliinik { get; set; } = null!;

        public DateTime KuupAev { get; set; }

        // Lubatud väärtused: Ootel, Kinnitatud, Lükatud, Üle kantud
        public string Staatus { get; set; } = "Ootel";

        public string? Markused { get; set; }
        public DateTime LoodudAeg { get; set; } = DateTime.UtcNow;

        // Märgib, kas 1-tunnine meeldetuletus on juba saadetud
        public bool ReminderSent { get; set; } = false;
    }
}
