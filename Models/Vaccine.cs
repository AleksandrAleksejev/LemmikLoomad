namespace Lemmikloomad.Models
{
    public class Vaccine
    {
        public int Id { get; set; }

        public int LemmikloomId { get; set; }
        public Lemmikloom Lemmikloom { get; set; } = null!;

        public string Nimetus { get; set; } = string.Empty;
        public DateTime ManustamisKuupAev { get; set; }

        // Järgmine vaktsiiniaeg – null kui pole teada või pole vaja korrata
        public DateTime? JargmineKuupAev { get; set; }

        public string? Arst { get; set; }
        public string? Partii { get; set; }     // vaktsiini partiinumber
        public string? Markused { get; set; }
        public DateTime LoodudAeg { get; set; } = DateTime.UtcNow;
    }
}
