using Microsoft.EntityFrameworkCore;

namespace Ecoture.Services
{
    public class DbKeepaliveService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DbKeepaliveService> _logger;

        public DbKeepaliveService(IServiceScopeFactory scopeFactory, ILogger<DbKeepaliveService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromMinutes(4), stoppingToken);
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
                    await db.Database.ExecuteSqlRawAsync("SELECT 1", stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "DB keepalive ping failed");
                }
            }
        }
    }
}
