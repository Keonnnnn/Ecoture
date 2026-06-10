using AutoMapper;
using Ecoture;
using Ecoture.Hubs;
using Ecoture.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//  Add Services to the Container
builder.Services.AddControllers();
builder.Services.AddSignalR(options =>
{
    options.KeepAliveInterval = TimeSpan.FromSeconds(10); 
});

//  Configure Database Context with PostgreSQL
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MyConnection"))
);
builder.Services.AddDistributedMemoryCache();

// Ensure Connection String Exists
var connectionString = builder.Configuration.GetConnectionString("MyConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Database connection string is missing in appsettings.json.");
}

//  Add Authentication & Authorization
var secret = builder.Configuration.GetValue<string>("Authentication:Secret");
if (string.IsNullOrEmpty(secret))
{
    throw new Exception("Secret is required for JWT authentication.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secret)
            ),
        };
        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                var origin = context.HttpContext.Request.Headers["Origin"].ToString();
                if (!string.IsNullOrEmpty(origin))
                {
                    context.HttpContext.Response.Headers["Access-Control-Allow-Origin"] = origin;
                    context.HttpContext.Response.Headers["Access-Control-Allow-Credentials"] = "true";
                    Console.WriteLine($"[CORS-JWT] OnChallenge fired, set ACAO for {context.HttpContext.Request.Path} origin={origin}");
                }
                return Task.CompletedTask;
            }
        };
    });

//  Add this line to enable authorization services
builder.Services.AddAuthorization(); // Adds authorization services

//  AutoMapper Configuration
var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new MappingProfile());
});
IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

//  Add CORS policy
const string corsPolicyName = "AppCors";
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        if (allowedOrigins.Length == 0)
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
        else
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    });
});

//  Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var securityScheme = new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    options.AddSecurityDefinition("Bearer", securityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, new List<string>() }
    });
});

// Services
builder.Services.AddTransient<IUserManager, UserManager>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddSingleton<ISmsService, SmsService>();
builder.Services.AddHostedService<DbKeepaliveService>();

var app = builder.Build();

// Seed database with admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<MyDbContext>();
        var configuration = services.GetRequiredService<IConfiguration>();

        // Apply migrations and seed admin user
        await SeedData.InitializeAsync(context, configuration);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred during database seeding: {ex.Message}");
        // Consider whether you want to rethrow the exception to prevent the application from starting
        // throw;
    }
}

//  Configure Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(errApp => errApp.Run(async context =>
{
    var origin = context.Request.Headers["Origin"].ToString();
    if (!string.IsNullOrEmpty(origin))
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = origin;
        context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
    }
    context.Response.StatusCode = 500;
    await context.Response.WriteAsync("Internal Server Error");
}));

// Debug: log CORS state (remove after fix is confirmed)
app.Use(async (context, next) =>
{
    var origin = context.Request.Headers["Origin"].ToString();
    Console.WriteLine($"[CORS-DBG] {context.Request.Method} {context.Request.Path} origin={origin} allowed=[{string.Join(",", allowedOrigins)}]");
    context.Response.OnStarting(() =>
    {
        Console.WriteLine($"[CORS-FINAL] {context.Request.Method} {context.Request.Path} status={context.Response.StatusCode} ACAO={context.Response.Headers["Access-Control-Allow-Origin"]}");
        return Task.CompletedTask;
    });
    await next();
});

// Railway handles SSL termination - no need for HTTPS redirection
// app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers().RequireCors(corsPolicyName);
app.MapHub<ChatHub>("/chatHub").RequireCors(corsPolicyName);


app.Run();
