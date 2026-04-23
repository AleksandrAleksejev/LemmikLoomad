using Microsoft.EntityFrameworkCore;
using Lemmikloomad.Models;

namespace Lemmikloomad.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Kliinik> Kliinikud { get; set; }
        public DbSet<Lemmikloom> Lemmikloomad { get; set; }
        public DbSet<Protseduur> Protseduurid { get; set; }
        public DbSet<Broneering> Broneeringud { get; set; }
        public DbSet<MedRecord> MedRecords { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Vaccine> Vaccines { get; set; }
    }
}
