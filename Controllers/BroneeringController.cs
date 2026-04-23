using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lemmikloomad.Data;
using Lemmikloomad.Models;
using Lemmikloomad.Models.DTO;
using Lemmikloomad.Services;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BroneeringController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EmailService _emailService;
    private readonly ILogger<BroneeringController> _logger;

    // Lubatud staatused – muu väärtuse saatmine tagastab 400
    private static readonly HashSet<string> LubatudStaatused =
        new() { "Ootel", "Kinnitatud", "Lükatud", "Üle kantud" };

    public BroneeringController(
        AppDbContext context,
        EmailService emailService,
        ILogger<BroneeringController> logger)
    {
        _context      = context;
        _emailService = emailService;
        _logger       = logger;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("slots")]
    public async Task<IActionResult> GetAvailableSlots(int kliinikId, int protseduurId, DateTime date)
    {
        var protseduur = await _context.Protseduurid.FindAsync(protseduurId);
        if (protseduur == null) return NotFound();

        // Kestus peab olema positiivne, muidu läheb tsükkel valesti
        if (protseduur.Kestus <= 0)
            return BadRequest(new { message = "Protseduuri kestus on vigane." });

        var dayStart = date.Date;
        var dayEnd   = dayStart.AddDays(1);

        var booked = await _context.Broneeringud
            .Where(b => b.KliinikId == kliinikId &&
                        b.ProtseduurId == protseduurId &&
                        b.KuupAev >= dayStart &&
                        b.KuupAev < dayEnd &&
                        b.Staatus != "Lükatud")
            .Select(b => b.KuupAev)
            .ToListAsync();

        var slots    = new List<object>();
        var duration = TimeSpan.FromMinutes(protseduur.Kestus);

        for (var t = dayStart.AddHours(8);
             t + duration <= dayStart.AddHours(18);
             t = t.AddMinutes(30))
        {
            var conflict = booked.Any(b => b < t + duration && b + duration > t);
            slots.Add(new { time = t, available = !conflict });
        }

        return Ok(slots);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BroneeringCreateDto dto)
    {
        var userId = GetUserId();

        // Lemmikloom peab kuuluma sellele kasutajale
        var pet = await _context.Lemmikloomad
            .FirstOrDefaultAsync(p => p.Id == dto.LemmikloomId && p.UserId == userId);
        if (pet == null)
            return BadRequest(new { message = "Lemmikloom ei kuulu teile." });

        var protseduur = await _context.Protseduurid.FindAsync(dto.ProtseduurId);
        if (protseduur == null)
            return BadRequest(new { message = "Protseduur ei leitud." });

        // Kontrollime, kas valitud aeg on juba hõivatud
        var newStart = dto.KuupAev;
        var newEnd   = newStart.AddMinutes(protseduur.Kestus);

        var conflict = await _context.Broneeringud
            .Where(b => b.KliinikId == dto.KliinikId &&
                        b.ProtseduurId == dto.ProtseduurId &&
                        b.Staatus != "Lükatud")
            .AnyAsync(b => b.KuupAev < newEnd && b.KuupAev.AddMinutes(protseduur.Kestus) > newStart);

        if (conflict)
            return Conflict(new { message = "See aeg on juba broneeritud. Palun valige teine aeg." });

        var broneering = new Broneering
        {
            UserId       = userId,
            LemmikloomId = dto.LemmikloomId,
            ProtseduurId = dto.ProtseduurId,
            KliinikId    = dto.KliinikId,
            KuupAev      = dto.KuupAev,
            Markused     = dto.Markused,
            Staatus      = "Ootel"
        };

        _context.Broneeringud.Add(broneering);
        await _context.SaveChangesAsync();

        // Laeme seosed uuesti, et meilis oleks täielik info
        var full = await _context.Broneeringud
            .Include(b => b.User)
            .Include(b => b.Lemmikloom)
            .Include(b => b.Protseduur)
            .Include(b => b.Kliinik)
            .FirstAsync(b => b.Id == broneering.Id);

        try { await _emailService.SendBookingConfirmationAsync(full.User, full); }
        catch (Exception ex) { _logger.LogWarning("Kinnitusmeil ebaõnnestus: {Message}", ex.Message); }

        return Ok(BuildDto(full));
    }

    [HttpGet("my")]
    public async Task<IActionResult> MyBookings()
    {
        var userId = GetUserId();
        var data = await _context.Broneeringud
            .Where(b => b.UserId == userId)
            .Include(b => b.Lemmikloom)
            .Include(b => b.Protseduur)
            .Include(b => b.Kliinik)
            .OrderByDescending(b => b.LoodudAeg)
            .ToListAsync();
        return Ok(data.Select(BuildDto));
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> All()
    {
        var data = await _context.Broneeringud
            .Include(b => b.User)
            .Include(b => b.Lemmikloom)
            .Include(b => b.Protseduur)
            .Include(b => b.Kliinik)
            .OrderByDescending(b => b.LoodudAeg)
            .ToListAsync();
        return Ok(data.Select(BuildAdminDto));
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        if (!LubatudStaatused.Contains(dto.Staatus))
            return BadRequest(new { message = "Lubamatu staatus." });

        var broneering = await _context.Broneeringud
            .Include(b => b.User)
            .Include(b => b.Lemmikloom)
            .Include(b => b.Protseduur)
            .Include(b => b.Kliinik)
            .FirstOrDefaultAsync(b => b.Id == id);
        if (broneering == null) return NotFound();

        var eelmine = broneering.Staatus;
        broneering.Staatus = dto.Staatus;
        if (dto.KliinikId.HasValue)
            broneering.KliinikId = dto.KliinikId.Value;

        await _context.SaveChangesAsync();

        if (dto.KliinikId.HasValue)
            await _context.Entry(broneering).Reference(b => b.Kliinik).LoadAsync();

        // Saadame meili ainult siis, kui staatus muutus
        if (eelmine != dto.Staatus)
        {
            try
            {
                if (dto.Staatus == "Lükatud")
                    await _emailService.SendCancellationEmailAsync(broneering.User, broneering);
                else if (dto.Staatus == "Kinnitatud")
                    await _emailService.SendApprovalEmailAsync(broneering.User, broneering);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Staatuse meil ebaõnnestus broneeringu {Id} jaoks: {Msg}", id, ex.Message);
            }
        }

        return Ok(new { broneering.Id, broneering.Staatus, broneering.KliinikId });
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> CancelOwn(int id)
    {
        var userId = GetUserId();
        var b = await _context.Broneeringud
            .Include(x => x.User)
            .Include(x => x.Lemmikloom)
            .Include(x => x.Protseduur)
            .Include(x => x.Kliinik)
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (b == null) return NotFound();
        if (b.Staatus == "Lükatud")
            return BadRequest(new { message = "Broneering on juba tühistatud." });

        b.Staatus = "Lükatud";
        await _context.SaveChangesAsync();

        try { await _emailService.SendCancellationEmailAsync(b.User, b); }
        catch (Exception ex) { _logger.LogWarning("Tühistamismeil ebaõnnestus: {Msg}", ex.Message); }

        return Ok(new { b.Id, b.Staatus });
    }

    // Statistika admini töölauaks
    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Stats()
    {
        var total      = await _context.Broneeringud.CountAsync();
        var ootel      = await _context.Broneeringud.CountAsync(b => b.Staatus == "Ootel");
        var kinnitatud = await _context.Broneeringud.CountAsync(b => b.Staatus == "Kinnitatud");
        var lukatud    = await _context.Broneeringud.CountAsync(b => b.Staatus == "Lükatud");
        var users      = await _context.Users.CountAsync(u => u.Role == "User");
        var pets       = await _context.Lemmikloomad.CountAsync();

        return Ok(new { total, ootel, kinnitatud, lukatud, users, pets });
    }

    private static object BuildDto(Broneering b) => new
    {
        b.Id, b.KuupAev, b.Staatus, b.Markused, b.LoodudAeg,
        Lemmikloom = b.Lemmikloom == null ? null : new { b.Lemmikloom.Id, b.Lemmikloom.Nimi, b.Lemmikloom.Liik },
        Protseduur = b.Protseduur == null ? null : new { b.Protseduur.Id, b.Protseduur.Nimi, b.Protseduur.Hind, b.Protseduur.Kestus, b.Protseduur.Ikoon },
        Kliinik    = b.Kliinik == null ? null : new { b.Kliinik.Id, b.Kliinik.Nimi, b.Kliinik.Aadress, b.Kliinik.Telefon }
    };

    private static object BuildAdminDto(Broneering b) => new
    {
        b.Id, b.KuupAev, b.Staatus, b.Markused, b.LoodudAeg,
        User       = b.User == null ? null : new { b.User.Id, b.User.Name, b.User.Email, b.User.Phone },
        Lemmikloom = b.Lemmikloom == null ? null : new { b.Lemmikloom.Id, b.Lemmikloom.Nimi, b.Lemmikloom.Liik },
        Protseduur = b.Protseduur == null ? null : new { b.Protseduur.Id, b.Protseduur.Nimi, b.Protseduur.Hind, b.Protseduur.Kestus, b.Protseduur.Ikoon },
        Kliinik    = b.Kliinik == null ? null : new { b.Kliinik.Id, b.Kliinik.Nimi, b.Kliinik.Aadress, b.Kliinik.Telefon }
    };
}
