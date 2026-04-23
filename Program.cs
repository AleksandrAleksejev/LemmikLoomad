using Lemmikloomad.Data;
using Lemmikloomad.Models;
using Lemmikloomad.Services;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=app.db"));

var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<EmailService>();

builder.Services.AddHostedService<ReminderBackgroundService>();

builder.Services.AddCors(opt =>
    opt.AddPolicy("cors", p =>
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "VetClinic API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("cors");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Schema migrations – ignore if column/table already exists
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Broneeringud ADD COLUMN ReminderSent INTEGER NOT NULL DEFAULT 0"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Lemmikloomad ADD COLUMN PhotoUrl TEXT"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN ResetToken TEXT"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN ResetTokenExpiry TEXT"); } catch { }

    // Multilingual procedure columns
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Protseduurid ADD COLUMN NimiRu TEXT"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Protseduurid ADD COLUMN NimiEn TEXT"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Protseduurid ADD COLUMN KirjeldusRu TEXT"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Protseduurid ADD COLUMN KirjeldusEn TEXT"); } catch { }

    // Seed translations for existing procedures (only where not yet set)
    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Общий осмотр', NimiEn='General health check',
        KirjeldusRu='Комплексный осмотр: температура, вес, сердце, дыхание, рефлексы.',
        KirjeldusEn='Comprehensive check-up: temperature, weight, heart, breathing, reflexes.'
        WHERE Nimi='Üldine tervisekontroll' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Вакцинация', NimiEn='Vaccination',
        KirjeldusRu='Прививки от распространённых болезней — бешенство, парвовироз, чума и др.',
        KirjeldusEn='Shots against common diseases – rabies, parvo, distemper, etc.'
        WHERE Nimi='Vaktsineerimine' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Чистка зубов', NimiEn='Dental cleaning',
        KirjeldusRu='Профессиональное удаление зубного камня и ультразвуковая чистка зубов.',
        KirjeldusEn='Professional tartar removal and ultrasonic dental cleaning.'
        WHERE Nimi='Hammaste puhastus' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Микрочипирование', NimiEn='Microchipping',
        KirjeldusRu='Микрочип обеспечивает безопасность питомца и помогает найти его при потере.',
        KirjeldusEn='A microchip ensures your pet''s safety and helps find them if lost.'
        WHERE Nimi='Kiipimismine' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Хирургическое вмешательство', NimiEn='Surgical procedure',
        KirjeldusRu='Малые и средние хирургические операции под общим наркозом.',
        KirjeldusEn='Minor and medium surgical procedures under general anaesthesia.'
        WHERE Nimi='Kirurgiline sekkumine' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='УЗИ', NimiEn='Ultrasound scan',
        KirjeldusRu='Диагностика внутренних органов современным ультразвуковым аппаратом.',
        KirjeldusEn='Diagnostic imaging of internal organs with a modern ultrasound device.'
        WHERE Nimi='Ultraheliuuring' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Рентген', NimiEn='X-ray',
        KirjeldusRu='Цифровая рентгенография костей и внутренних органов.',
        KirjeldusEn='Digital X-ray imaging of bones and internal organs.'
        WHERE Nimi='Röntgenuuring' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try { db.Database.ExecuteSqlRaw(@"UPDATE Protseduurid SET
        NimiRu='Груминг', NimiEn='Grooming',
        KirjeldusRu='Профессиональная стрижка, мытьё, сушка и расчёсывание.',
        KirjeldusEn='Professional trimming, washing, blow-drying and brushing.'
        WHERE Nimi='Karvastuse hooldus' AND (NimiRu IS NULL OR NimiRu='')"); } catch { }

    try
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS Vaccines (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                LemmikloomId INTEGER NOT NULL,
                Nimetus TEXT NOT NULL DEFAULT '',
                ManustamisKuupAev TEXT NOT NULL,
                JargmineKuupAev TEXT,
                Arst TEXT,
                Partii TEXT,
                Markused TEXT,
                LoodudAeg TEXT NOT NULL,
                FOREIGN KEY (LemmikloomId) REFERENCES Lemmikloomad(Id)
            )");
    } catch { }

    try
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS MedRecords (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                LemmikloomId INTEGER NOT NULL,
                KuupAev TEXT NOT NULL,
                Diagnoos TEXT NOT NULL DEFAULT '',
                Ravi TEXT NOT NULL DEFAULT '',
                ArstNimi TEXT,
                Markused TEXT,
                Kaal REAL,
                Ravimid TEXT,
                LoodudAeg TEXT NOT NULL,
                FOREIGN KEY (LemmikloomId) REFERENCES Lemmikloomad(Id)
            )");
    } catch { }

    try
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS Reviews (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                UserId INTEGER NOT NULL,
                KliinikId INTEGER,
                Hinnang INTEGER NOT NULL DEFAULT 5,
                Kommentaar TEXT NOT NULL DEFAULT '',
                LoodudAeg TEXT NOT NULL,
                FOREIGN KEY (UserId) REFERENCES Users(Id),
                FOREIGN KEY (KliinikId) REFERENCES Kliinikud(Id)
            )");
    } catch { }

    if (!db.Kliinikud.Any())
    {
        db.Kliinikud.AddRange(
            new Kliinik
            {
                Nimi = "VetClinic Tallinn Kesklinn",
                Aadress = "Viru väljak 4, 10111 Tallinn",
                Telefon = "+372 600 1234",
                Email = "tallinn@vetclinic.ee",
                Kirjeldus = "Meie peakontor Tallinna südames kogenud spetsialistidega."
            },
            new Kliinik
            {
                Nimi = "VetClinic Ülemiste",
                Aadress = "Suur-Sõjamäe 4, 11415 Tallinn",
                Telefon = "+372 600 5678",
                Email = "ulemiste@vetclinic.ee",
                Kirjeldus = "Kaasaegse varustusega kliinik Ülemiste City lähedal."
            },
            new Kliinik
            {
                Nimi = "VetClinic Tartu",
                Aadress = "Riia 12, 51013 Tartu",
                Telefon = "+372 734 1234",
                Email = "tartu@vetclinic.ee",
                Kirjeldus = "Lõuna-Eesti suurim ja parim veterinaarkliinik."
            }
        );
    }

    if (!db.Protseduurid.Any())
    {
        db.Protseduurid.AddRange(
            new Protseduur { Nimi = "Üldine tervisekontroll", Kirjeldus = "Põhjalik tervisekontroll: temperatuur, kaal, südamelöögid, hingamine, refleksid.", Hind = 35, Kestus = 30, Kategooria = "Ennetus", Ikoon = "🩺" },
            new Protseduur { Nimi = "Vaktsineerimine", Kirjeldus = "Kaitsesüstid levinumate haiguste vastu – marutaud, parvo, distemper jt.", Hind = 45, Kestus = 20, Kategooria = "Ennetus", Ikoon = "💉" },
            new Protseduur { Nimi = "Hammaste puhastus", Kirjeldus = "Professionaalne hambakivi eemaldamine ja hammaste puhastus ultraheli abil.", Hind = 80, Kestus = 60, Kategooria = "Hambaravi", Ikoon = "🦷" },
            new Protseduur { Nimi = "Kiipimismine", Kirjeldus = "Mikrokiip tagab lemmiku turvalisuse ja aitab teda kadumise korral leida.", Hind = 25, Kestus = 15, Kategooria = "Identifitseerimine", Ikoon = "📡" },
            new Protseduur { Nimi = "Kirurgiline sekkumine", Kirjeldus = "Väikesed ja keskmised kirurgilised protseduurid üldanesteeesia all.", Hind = 200, Kestus = 120, Kategooria = "Kirurgia", Ikoon = "🔬" },
            new Protseduur { Nimi = "Ultraheliuuring", Kirjeldus = "Siseorganite diagnostiline uuring tänapäevase ultraheli aparaadiga.", Hind = 65, Kestus = 40, Kategooria = "Diagnostika", Ikoon = "📊" },
            new Protseduur { Nimi = "Röntgenuuring", Kirjeldus = "Luustiku ja siseorganite röntgenpildistamine digitaalse seadmega.", Hind = 55, Kestus = 30, Kategooria = "Diagnostika", Ikoon = "🔭" },
            new Protseduur { Nimi = "Karvastuse hooldus", Kirjeldus = "Professionaalne lõikamine, pesemine, kuivatamine ja kammimismine.", Hind = 40, Kestus = 90, Kategooria = "Grooming", Ikoon = "✂️" }
        );
    }

    if (!db.Users.Any())
    {
        db.Users.Add(new User
        {
            Email = "admin@vetclinic.ee",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Name = "Administrator",
            Phone = "+372 600 0000",
            Role = "Admin"
        });
    }

    db.SaveChanges();
}

app.MapFallbackToFile("index.html");

app.Run();
// complete