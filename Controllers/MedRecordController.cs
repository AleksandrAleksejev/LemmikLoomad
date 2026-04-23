using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lemmikloomad.Data;
using Lemmikloomad.Models;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MedRecordController : ControllerBase
{
    private readonly AppDbContext _context;

    public MedRecordController(AppDbContext context) => _context = context;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsAdmin() => User.IsInRole("Admin");

    [HttpGet("pet/{petId}")]
    public async Task<IActionResult> GetForPet(int petId)
    {
        var userId = GetUserId();
        var pet = await _context.Lemmikloomad.FindAsync(petId);
        if (pet == null) return NotFound();
        if (!IsAdmin() && pet.UserId != userId) return Forbid();

        var records = await _context.MedRecords
            .Where(r => r.LemmikloomId == petId)
            .OrderByDescending(r => r.KuupAev)
            .Select(r => new
            {
                r.Id, r.LemmikloomId, r.KuupAev, r.Diagnoos,
                r.Ravi, r.ArstNimi, r.Markused, r.Kaal, r.Ravimid, r.LoodudAeg
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] MedRecordDto dto)
    {
        var pet = await _context.Lemmikloomad.FindAsync(dto.LemmikloomId);
        if (pet == null) return NotFound(new { message = "Lemmikloom ei leitud." });

        var record = new MedRecord
        {
            LemmikloomId = dto.LemmikloomId,
            KuupAev      = dto.KuupAev,
            Diagnoos     = dto.Diagnoos,
            Ravi         = dto.Ravi,
            ArstNimi     = dto.ArstNimi,
            Markused     = dto.Markused,
            Kaal         = dto.Kaal,
            Ravimid      = dto.Ravimid,
            LoodudAeg    = DateTime.UtcNow
        };

        _context.MedRecords.Add(record);
        await _context.SaveChangesAsync();
        return Ok(record);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] MedRecordDto dto)
    {
        var record = await _context.MedRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.KuupAev  = dto.KuupAev;
        record.Diagnoos = dto.Diagnoos;
        record.Ravi     = dto.Ravi;
        record.ArstNimi = dto.ArstNimi;
        record.Markused = dto.Markused;
        record.Kaal     = dto.Kaal;
        record.Ravimid  = dto.Ravimid;

        await _context.SaveChangesAsync();
        return Ok(record);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await _context.MedRecords.FindAsync(id);
        if (record == null) return NotFound();
        _context.MedRecords.Remove(record);
        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class MedRecordDto
{
    public int LemmikloomId { get; set; }
    public DateTime KuupAev { get; set; }
    public string Diagnoos { get; set; } = string.Empty;
    public string Ravi { get; set; } = string.Empty;
    public string? ArstNimi { get; set; }
    public string? Markused { get; set; }
    public decimal? Kaal { get; set; }
    public string? Ravimid { get; set; }
}
