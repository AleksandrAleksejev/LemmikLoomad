namespace Lemmikloomad.Models
{
    public class Kliinik
    {
        public int Id { get; set; }
        public string Nimi { get; set; } = string.Empty;
        public string Aadress { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Kirjeldus { get; set; } = string.Empty;

        public List<Lemmikloom> Lemmikloomad { get; set; } = new();
        public List<Broneering> Broneeringud { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
    }
}
