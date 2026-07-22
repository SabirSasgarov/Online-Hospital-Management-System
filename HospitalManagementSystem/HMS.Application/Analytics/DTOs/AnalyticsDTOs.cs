namespace HMS.Application.Analytics.DTOs
{
    public class AdmissionsAnalyticsDto
    {
        public int TotalAdmissions { get; set; }
        public int TotalDischarges { get; set; }
        public int CurrentlyAdmitted { get; set; }
        public double AverageLengthOfStayDays { get; set; }
        public List<DailyCountDto> AdmissionsByDay { get; set; } = [];
    }

    public class BedOccupancyAnalyticsDto
    {
        public int TotalBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public int AvailableBeds { get; set; }
        public int MaintenanceBeds { get; set; }
        public double OccupancyRate { get; set; }
        public List<WardOccupancyDto> ByWard { get; set; } = [];
    }

    public class AppointmentsAnalyticsDto
    {
        public int TotalAppointments { get; set; }
        public int Scheduled { get; set; }
        public int Completed { get; set; }
        public int Cancelled { get; set; }
        public int NoShow { get; set; }
        public double CompletionRate { get; set; }
        public List<DailyCountDto> AppointmentsByDay { get; set; } = [];
        public List<SpecializationCountDto> BySpecialization { get; set; } = [];
    }

    public class PatientConditionsAnalyticsDto
    {
        public List<ConditionCountDto> TopDiagnoses { get; set; } = [];
        public List<ConditionCountDto> LabResultStatuses { get; set; } = [];
        public List<ConditionCountDto> PrescriptionStatuses { get; set; } = [];
    }

    public class DailyCountDto
    {
        public DateOnly Date { get; set; }
        public int Count { get; set; }
    }

    public class WardOccupancyDto
    {
        public string WardName { get; set; } = string.Empty;
        public int TotalBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public double OccupancyRate { get; set; }
    }

    public class SpecializationCountDto
    {
        public string Specialization { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class ConditionCountDto
    {
        public string Label { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
