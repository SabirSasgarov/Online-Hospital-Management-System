namespace HMS.Infrastructure.Services
{
    public class EmailService(IOptions<SmtpSettings> smtpOptions) : IEmailService
    {
        private readonly SmtpSettings _settings = smtpOptions.Value;

        // ── Core send ────────────────────────────────────────────────────────
        public async Task SendEmailAsync(string toEmail, string toName, string subject,
            string htmlBody, CancellationToken cancellationToken = default)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.Host, _settings.Port,
                _settings.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None,
                cancellationToken);
            await client.AuthenticateAsync(_settings.UserName, _settings.Password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }

        // ── Auth ─────────────────────────────────────────────────────────────
        public Task SendWelcomeEmailAsync(string toEmail, string toName,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Welcome to CareFlow!",
                EmailTemplates.Welcome(toName), cancellationToken);

        public Task SendPasswordResetCodeEmailAsync(string toEmail, string toName, string code,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Your CareFlow Password Reset Code",
                EmailTemplates.PasswordResetCode(toName, code), cancellationToken);

        public Task SendAccountCreatedEmailAsync(string toEmail, string toName, string tempPassword,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Your CareFlow Account Has Been Created",
                EmailTemplates.AccountCreated(toName, tempPassword), cancellationToken);

        // ── Appointments ─────────────────────────────────────────────────────
        public Task SendAppointmentConfirmationAsync(string toEmail, string toName,
            string doctorName, DateTime scheduledAt, string appointmentType,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Appointment Confirmed — CareFlow",
                EmailTemplates.AppointmentConfirmation(toName, doctorName, scheduledAt, appointmentType),
                cancellationToken);

        public Task SendAppointmentCancellationAsync(string toEmail, string toName,
            string doctorName, DateTime scheduledAt,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Appointment Cancelled — CareFlow",
                EmailTemplates.AppointmentCancellation(toName, doctorName, scheduledAt),
                cancellationToken);

        public Task SendAppointmentReminderAsync(string toEmail, string toName,
            string doctorName, DateTime scheduledAt,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Appointment Reminder — CareFlow",
                EmailTemplates.AppointmentReminder(toName, doctorName, scheduledAt),
                cancellationToken);

        // ── Clinical ─────────────────────────────────────────────────────────
        public Task SendPrescriptionIssuedAsync(string toEmail, string toName,
            string doctorName, IEnumerable<string> medicationNames,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "New Prescription Issued — CareFlow",
                EmailTemplates.PrescriptionIssued(toName, doctorName, medicationNames),
                cancellationToken);

        public Task SendLabResultReadyAsync(string toEmail, string toName,
            string testName, string status,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Lab Result Available — CareFlow",
                EmailTemplates.LabResultReady(toName, testName, status),
                cancellationToken);

        public Task SendDischargeSummaryReadyAsync(string toEmail, string toName,
            string doctorName, DateOnly? followUpDate,
            CancellationToken cancellationToken = default)
            => SendEmailAsync(toEmail, toName, "Discharge Summary Ready — CareFlow",
                EmailTemplates.DischargeSummaryReady(toName, doctorName, followUpDate),
                cancellationToken);
    }
}
