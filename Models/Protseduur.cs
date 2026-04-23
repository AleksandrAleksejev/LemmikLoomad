namespace Lemmikloomad.Models
{
    public class Protseduur
    {
        public int Id { get; set; }

        // Nimi ja kirjeldus kolmes keeles – RU/EN võivad puududa, siis kuvatakse eestikeelne
        public string Nimi { get; set; } = string.Empty;
        public string? NimiRu { get; set; }
        public string? NimiEn { get; set; }

        public string Kirjeldus { get; set; } = string.Empty;
        public string? KirjeldusRu { get; set; }
        public string? KirjeldusEn { get; set; }

        public decimal Hind { get; set; }
        public int Kestus { get; set; }         // minutites
        public string Kategooria { get; set; } = string.Empty;
        public string Ikoon { get; set; } = "🏥";

        public List<Broneering> Broneeringud { get; set; } = new();
    }
}
