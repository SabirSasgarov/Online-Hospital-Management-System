namespace HMS.Persistence.Context
{
	public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUserService)
	: IdentityDbContext<AppUser, AppRole, Guid,
		IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>,
		IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options), IAppDbContext
	{
		public new DbSet<AppUser> Users => Set<AppUser>();
		public DbSet<Patient> Patients => Set<Patient>();
		public DbSet<Doctor> Doctors => Set<Doctor>();
		public DbSet<Appointment> Appointments => Set<Appointment>();
		public DbSet<Ward> Wards => Set<Ward>();
		public DbSet<Room> Rooms => Set<Room>();
		public DbSet<Bed> Beds => Set<Bed>();
		public DbSet<Visit> Visits => Set<Visit>();
		public DbSet<Prescription> Prescriptions => Set<Prescription>();
		public DbSet<PrescriptionMedication> PrescriptionMedications => Set<PrescriptionMedication>();
		public DbSet<LabResult> LabResults => Set<LabResult>();
		public DbSet<DischargeSummary> DischargeSummaries => Set<DischargeSummary>();
		public DbSet<Message> Messages => Set<Message>();
		public DbSet<Notification> Notifications => Set<Notification>();
		public DbSet<AuditLog> AuditLogs => Set<AuditLog>();



		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
		}
		public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			var now = DateTime.UtcNow;
			var user = currentUserService.UserName ?? "system";

			var auditableEntries = ChangeTracker.Entries<Domain.Common.AuditableEntity>().ToList();

			foreach (var entry in auditableEntries)
			{
				switch (entry.State)
				{
					case EntityState.Added:
						entry.Entity.CreatedAt = now;
						entry.Entity.CreatedBy = user;
						break;
					case EntityState.Modified:
						entry.Entity.ModifiedAt = now;
						entry.Entity.ModifiedBy = user;
						break;
				}
			}

			// Record a CREATE/UPDATE/DELETE row for every tracked domain-entity change so the
			// admin Audit Log page has real data to show (previously nothing ever wrote here).
			if (currentUserService.IsAuthenticated)
			{
				foreach (var entry in auditableEntries)
				{
					if (entry.Entity is AuditLog) continue; // never audit the audit table itself

					var action = entry.State switch
					{
						EntityState.Added => "CREATE",
						EntityState.Deleted => "DELETE",
						EntityState.Modified when entry.Property(nameof(Domain.Common.AuditableEntity.IsDeleted)).IsModified
							&& entry.Entity.IsDeleted => "DELETE",
						EntityState.Modified => "UPDATE",
						_ => null
					};
					if (action is null) continue;

					AuditLogs.Add(new AuditLog
					{
						UserId = currentUserService.UserId ?? string.Empty,
						UserName = currentUserService.UserName ?? "system",
						UserRole = currentUserService.Role ?? string.Empty,
						Action = action,
						Resource = entry.Entity.GetType().Name,
						ResourceId = entry.Entity.Id.ToString(),
						IpAddress = currentUserService.IpAddress ?? string.Empty,
						Timestamp = now,
					});
				}
			}

			return base.SaveChangesAsync(cancellationToken);
		}
	}
}
