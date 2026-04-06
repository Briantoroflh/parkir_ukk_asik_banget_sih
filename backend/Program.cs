using System.Data;
using backend;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using backend.Helpers;

var builder = WebApplication.CreateBuilder(args);
string jwtKey = builder.Configuration["Jwt:Key"];
string jwtIssuer = builder.Configuration["Jwt:Issuer"];
string jwtAudience = builder.Configuration["Jwt:Audience"];
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT Key tidak ditemukan di appsettings.json! Pastikan struktur JSON-nya benar.");
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddTransient<DBHelper>();
builder.Services.AddTransient<JwtHelper>();
builder.Services.AddTransient<backend.Services.logging.UserLoginLog>();
builder.Services.AddTransient<backend.Services.sessions.UserSessions>();
builder.Services.AddTransient<IDbConnection>((sp) => new SqlConnection(connectionString));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.MapControllers();

// app.UseHttpsRedirection();

app.Run();
