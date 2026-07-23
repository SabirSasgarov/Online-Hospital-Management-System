using HMS.Application.Notifications.Commands;

namespace HMS.API.Services
{
    /// <summary>
    /// Runs hourly for the lifetime of the API process and emails a reminder to every patient
    /// whose appointment is roughly 1 day away and hasn't been reminded about yet (see
    /// <see cref="SendAppointmentRemindersCommand"/> for the exact window/dedupe logic).
    /// Nurses/admins can also trigger the same sweep on demand via
    /// POST /api/notification/run-appointment-reminders.
    /// </summary>
    public class AppointmentReminderBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<AppointmentReminderBackgroundService> logger) : BackgroundService
    {
        private static readonly TimeSpan Interval = TimeSpan.FromHours(1);

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Small initial delay so this doesn't compete with app startup/migrations/seeding.
            try
            {
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
            catch (TaskCanceledException)
            {
                return;
            }

            using var timer = new PeriodicTimer(Interval);
            do
            {
                await RunOnceAsync(stoppingToken);
            } while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken));
        }

        private async Task RunOnceAsync(CancellationToken ct)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var sender = scope.ServiceProvider.GetRequiredService<ISender>();
                var sentCount = await sender.Send(new SendAppointmentRemindersCommand(), ct);

                if (sentCount > 0)
                    logger.LogInformation("Appointment reminder sweep sent {Count} reminder email(s).", sentCount);
            }
            catch (OperationCanceledException)
            {
                // Expected during shutdown.
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Appointment reminder sweep failed.");
            }
        }
    }
}
