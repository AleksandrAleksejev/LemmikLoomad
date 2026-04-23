using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lemmikloomad.Data;
using Lemmikloomad.Models;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewController(AppDbContext context) => _context = context;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews([FromQuery] int? kliinikId)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .AsQueryable();

        if (kliinikId.HasValue)
            query = query.Where(r => r.KliinikId == kliinikId);

        var reviews = await query
            .OrderByDescending(r => r.LoodudAeg)
            .Select(r => new
            {
                r.Id, r.Hinnang, r.Kommentaar, r.LoodudAeg, r.KliinikId,
                // Kasutaja võib olla kustutatud – kaitseme nullviite vastu
                User = new { Name = r.User != null ? r.User.Name : "Tundmatu" }
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ReviewDto dto)
    {
        var userId = GetUserId();

        var existing = await _context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.KliinikId == dto.KliinikId);
        if (existing != null)
            return Conflict(new { message = "Olete juba selle kliiniku arvustuse kirjutanud." });

        if (dto.Hinnang < 1 || dto.Hinnang > 5)
            return BadRequest(new { message = "Hinnang peab olema 1–5." });

        if (dto.Kommentaar.Length > 1000)
            return BadRequest(new { message = "Kommentaar ei tohi ületada 1000 tähemärki." });

        var review = new Review
        {
            UserId    = userId,
            KliinikId = dto.KliinikId,
            Hinnang   = dto.Hinnang,
            Kommentaar = dto.Kommentaar.Trim(),
            LoodudAeg  = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
        return Ok(new { review.Id, review.Hinnang, review.Kommentaar, review.LoodudAeg });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var isAdmin = User.IsInRole("Admin");

        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();
        if (!isAdmin && review.UserId != userId) return Forbid();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class ReviewDto
{
    public int? KliinikId { get; set; }
    public int Hinnang { get; set; } = 5;
    public string Kommentaar { get; set; } = string.Empty;
}
