using Microsoft.EntityFrameworkCore;
using Lemmikloomad.Data;

namespace Lemmikloomad.Services
{
    // Taustateenus, mis kontrollib iga 5 minuti järel, kas mõni broneering
    // algab umbes 1 tunni pärast ja saadab vajaduse korral meeldetuletuse.
    public class ReminderBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ReminderBackgroundService> _logger;

        // Kui kaugel tulevikus broneering peab olema, et meeldetuletus saata (55–65 min)
        private static readonly TimeSpan Interval    = TimeSpan.FromMinutes(5);
        private static readonly TimeSpan WindowStart = TimeSpan.FromMinutes(55);
        private static readonly TimeSpan WindowEnd   = TimeSpan.FromMinutes(65);

        public ReminderBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<ReminderBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger       = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Meeldetuletusteenus käivitatud.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try { await CheckAndSendReminders(); }
                catch (Exception ex) { _logger.LogError(ex, "Viga meeldetuletuste kontrollimisel."); }

                await Task.Delay(Interval, stoppingToken);
            }
        }

        private async Task CheckAndSendReminders()
        {
            using var scope  = _scopeFactory.CreateScope();
            var db           = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

            var now        = DateTime.UtcNow;
            var rangeStart = now + WindowStart;
            var rangeEnd   = now + WindowEnd;

            // Leiame kinnitatud broneeringud, millele pole veel meeldetuletust saadetud
            var upcoming = await db.Broneeringud
                .Include(b => b.User)
                .Include(b => b.Lemmikloom)
                .Include(b => b.Protseduur)
                .Include(b => b.Kliinik)
                .Where(b => b.KuupAev >= rangeStart &&
                            b.KuupAev <= rangeEnd   &&
                            !b.ReminderSent          &&
                            b.Staatus == "Kinnitatud")
                .ToListAsync();

            if (!upcoming.Any()) return;

            _logger.LogInformation("Saadame meeldetuletuse {Count} broneeringu kohta.", upcoming.Count);

            foreach (var b in upcoming)
            {
                try
                {
                    await emailService.SendReminderEmailAsync(b.User, b);
                    b.ReminderSent = true;
                    _logger.LogInformation("Meeldetuletus saadetud broneeringu {Id} kohta aadressile {Email}.", b.Id, b.User.Email);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("Meeldetuletus ebaõnnestus broneeringu {Id} jaoks: {Msg}", b.Id, ex.Message);
                }
            }

            await db.SaveChangesAsync();
        }
    }
}
