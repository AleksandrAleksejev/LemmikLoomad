namespace Lemmikloomad.Models
{
    public class Lemmikloom
    {
        public int Id { get; set; }
        public string Nimi { get; set; } = string.Empty;
        public string Liik { get; set; } = "Koer";
        public int Kaal { get; set; }
        public int? Vanus { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Lemmik võib olla seotud konkreetse kliinikuga
        public int? KliinikId { get; set; }
        public Kliinik? Kliinik { get; set; }

        // Salvestatakse uploads/pets/ kausta, väärtus on suhteline URL
        public string? PhotoUrl { get; set; }

        public List<Broneering> Broneeringud { get; set; } = new();
        public List<MedRecord> MedRecords { get; set; } = new();
        public List<Vaccine> Vaccines { get; set; } = new();
    }
}
