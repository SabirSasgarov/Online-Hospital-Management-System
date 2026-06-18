import type { Patient, Doctor, Appointment, Ward, Room, Prescription, LabResult, AuditLog, Message } from '@/types'

export const mockPatients: Patient[] = [
  { id: 'P001', name: 'Emily Johnson', dateOfBirth: '1985-04-12', gender: 'female', bloodType: 'A+', phone: '+1-555-0101', email: 'emily.j@email.com', address: '123 Oak St, Springfield', emergencyContact: 'James Johnson +1-555-0102', conditions: ['Hypertension', 'Diabetes Type 2'], allergies: ['Penicillin'], registeredAt: '2023-01-15', status: 'active' },
  { id: 'P002', name: 'Michael Chen', dateOfBirth: '1990-08-23', gender: 'male', bloodType: 'O-', phone: '+1-555-0103', email: 'michael.c@email.com', address: '456 Maple Ave, Lincoln', emergencyContact: 'Lisa Chen +1-555-0104', conditions: ['Asthma'], allergies: [], registeredAt: '2023-03-20', status: 'admitted' },
  { id: 'P003', name: 'Sarah Williams', dateOfBirth: '1978-11-05', gender: 'female', bloodType: 'B+', phone: '+1-555-0105', email: 'sarah.w@email.com', address: '789 Pine Rd, Riverside', emergencyContact: 'Tom Williams +1-555-0106', conditions: ['Arthritis', 'Hypothyroidism'], allergies: ['Sulfa drugs', 'Aspirin'], registeredAt: '2022-11-30', status: 'active' },
  { id: 'P004', name: 'Robert Garcia', dateOfBirth: '1965-02-18', gender: 'male', bloodType: 'AB+', phone: '+1-555-0107', email: 'robert.g@email.com', address: '321 Cedar Ln, Lakewood', emergencyContact: 'Maria Garcia +1-555-0108', conditions: ['Coronary Artery Disease', 'Hypertension'], allergies: ['Latex'], registeredAt: '2021-07-10', status: 'admitted' },
  { id: 'P005', name: 'Jennifer Martinez', dateOfBirth: '1995-06-30', gender: 'female', bloodType: 'A-', phone: '+1-555-0109', email: 'jennifer.m@email.com', address: '654 Birch Blvd, Millbrook', emergencyContact: 'Carlos Martinez +1-555-0110', conditions: [], allergies: ['NSAIDs'], registeredAt: '2024-01-05', status: 'active' },
  { id: 'P006', name: 'David Thompson', dateOfBirth: '1958-09-14', gender: 'male', bloodType: 'O+', phone: '+1-555-0111', email: 'david.t@email.com', address: '987 Elm St, Greenfield', emergencyContact: 'Susan Thompson +1-555-0112', conditions: ['COPD', 'Diabetes Type 2', 'Hypertension'], allergies: ['Codeine'], registeredAt: '2020-05-22', status: 'discharged' },
]

export const mockDoctors: Doctor[] = [
  { id: 'D001', name: 'Dr. James Anderson', specialization: 'Cardiology', email: 'j.anderson@hospital.com', phone: '+1-555-0201', available: true, rating: 4.8, schedule: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }, { day: 'Wednesday', startTime: '09:00', endTime: '17:00' }, { day: 'Friday', startTime: '09:00', endTime: '13:00' }] },
  { id: 'D002', name: 'Dr. Maria Santos', specialization: 'Neurology', email: 'm.santos@hospital.com', phone: '+1-555-0202', available: true, rating: 4.9, schedule: [{ day: 'Tuesday', startTime: '08:00', endTime: '16:00' }, { day: 'Thursday', startTime: '08:00', endTime: '16:00' }] },
  { id: 'D003', name: 'Dr. Kevin Park', specialization: 'Orthopedics', email: 'k.park@hospital.com', phone: '+1-555-0203', available: false, rating: 4.7, schedule: [{ day: 'Monday', startTime: '10:00', endTime: '18:00' }, { day: 'Wednesday', startTime: '10:00', endTime: '18:00' }, { day: 'Friday', startTime: '10:00', endTime: '14:00' }] },
  { id: 'D004', name: 'Dr. Lisa Brown', specialization: 'Pediatrics', email: 'l.brown@hospital.com', phone: '+1-555-0204', available: true, rating: 4.6, schedule: [{ day: 'Monday', startTime: '08:00', endTime: '16:00' }, { day: 'Tuesday', startTime: '08:00', endTime: '16:00' }, { day: 'Thursday', startTime: '08:00', endTime: '16:00' }] },
  { id: 'D005', name: 'Dr. Ahmed Hassan', specialization: 'General Surgery', email: 'a.hassan@hospital.com', phone: '+1-555-0205', available: true, rating: 4.5, schedule: [{ day: 'Tuesday', startTime: '07:00', endTime: '15:00' }, { day: 'Wednesday', startTime: '07:00', endTime: '15:00' }, { day: 'Friday', startTime: '07:00', endTime: '15:00' }] },
]

export const mockAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'Emily Johnson', doctorId: 'D001', doctorName: 'Dr. James Anderson', date: '2026-06-20', time: '10:00', type: 'consultation', status: 'scheduled', notes: 'Regular cardiac check' },
  { id: 'A002', patientId: 'P002', patientName: 'Michael Chen', doctorId: 'D002', doctorName: 'Dr. Maria Santos', date: '2026-06-20', time: '11:30', type: 'follow-up', status: 'scheduled' },
  { id: 'A003', patientId: 'P003', patientName: 'Sarah Williams', doctorId: 'D003', doctorName: 'Dr. Kevin Park', date: '2026-06-18', time: '14:00', type: 'consultation', status: 'completed' },
  { id: 'A004', patientId: 'P004', patientName: 'Robert Garcia', doctorId: 'D001', doctorName: 'Dr. James Anderson', date: '2026-06-19', time: '09:30', type: 'emergency', status: 'completed' },
  { id: 'A005', patientId: 'P005', patientName: 'Jennifer Martinez', doctorId: 'D004', doctorName: 'Dr. Lisa Brown', date: '2026-06-22', time: '15:00', type: 'checkup', status: 'scheduled' },
  { id: 'A006', patientId: 'P006', patientName: 'David Thompson', doctorId: 'D005', doctorName: 'Dr. Ahmed Hassan', date: '2026-06-17', time: '08:30', type: 'consultation', status: 'cancelled' },
]

export const mockWards: Ward[] = [
  { id: 'W001', name: 'Cardiology Ward', type: 'Cardiology', totalBeds: 20, occupiedBeds: 14, floor: 3 },
  { id: 'W002', name: 'General Ward A', type: 'General', totalBeds: 30, occupiedBeds: 22, floor: 1 },
  { id: 'W003', name: 'ICU', type: 'Intensive Care', totalBeds: 10, occupiedBeds: 8, floor: 2 },
  { id: 'W004', name: 'Pediatrics Ward', type: 'Pediatrics', totalBeds: 15, occupiedBeds: 9, floor: 4 },
  { id: 'W005', name: 'Orthopedics Ward', type: 'Orthopedics', totalBeds: 18, occupiedBeds: 11, floor: 3 },
  { id: 'W006', name: 'Neurology Ward', type: 'Neurology', totalBeds: 12, occupiedBeds: 7, floor: 5 },
]

export const mockRooms: Room[] = [
  { id: 'R001', wardId: 'W001', wardName: 'Cardiology Ward', roomNumber: '301', type: 'double', beds: [{ id: 'B001', number: '301A', status: 'occupied', patientId: 'P004', patientName: 'Robert Garcia' }, { id: 'B002', number: '301B', status: 'available' }] },
  { id: 'R002', wardId: 'W001', wardName: 'Cardiology Ward', roomNumber: '302', type: 'single', beds: [{ id: 'B003', number: '302A', status: 'occupied', patientId: 'P001', patientName: 'Emily Johnson' }] },
  { id: 'R003', wardId: 'W003', wardName: 'ICU', roomNumber: '201', type: 'icu', beds: [{ id: 'B004', number: '201A', status: 'occupied', patientId: 'P002', patientName: 'Michael Chen' }, { id: 'B005', number: '201B', status: 'available' }] },
]

export const mockPrescriptions: Prescription[] = [
  { id: 'PR001', patientId: 'P001', patientName: 'Emily Johnson', doctorId: 'D001', doctorName: 'Dr. James Anderson', visitId: 'V001', date: '2026-06-15', status: 'active', medications: [{ name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with water in the morning' }, { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with meals' }] },
  { id: 'PR002', patientId: 'P002', patientName: 'Michael Chen', doctorId: 'D002', doctorName: 'Dr. Maria Santos', visitId: 'V002', date: '2026-06-14', status: 'active', medications: [{ name: 'Salbutamol', dosage: '100mcg', frequency: 'As needed', duration: '60 days', instructions: 'Use inhaler when needed' }] },
  { id: 'PR003', patientId: 'P004', patientName: 'Robert Garcia', doctorId: 'D001', doctorName: 'Dr. James Anderson', visitId: 'V003', date: '2026-06-10', status: 'active', medications: [{ name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '90 days' }, { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily at bedtime', duration: '90 days' }] },
]

export const mockLabResults: LabResult[] = [
  { id: 'L001', patientId: 'P001', patientName: 'Emily Johnson', visitId: 'V001', testName: 'HbA1c', date: '2026-06-15', result: '7.2%', normalRange: '<5.7%', status: 'abnormal', notes: 'Diabetes management required' },
  { id: 'L002', patientId: 'P001', patientName: 'Emily Johnson', visitId: 'V001', testName: 'Blood Pressure', date: '2026-06-15', result: '138/88 mmHg', normalRange: '<120/80 mmHg', status: 'abnormal' },
  { id: 'L003', patientId: 'P002', patientName: 'Michael Chen', visitId: 'V002', testName: 'Spirometry FEV1', date: '2026-06-14', result: '72%', normalRange: '>80%', status: 'abnormal', notes: 'Moderate airflow limitation' },
  { id: 'L004', patientId: 'P004', patientName: 'Robert Garcia', visitId: 'V003', testName: 'Troponin I', date: '2026-06-10', result: '0.04 ng/mL', normalRange: '<0.04 ng/mL', status: 'critical', notes: 'Borderline elevation' },
  { id: 'L005', patientId: 'P003', patientName: 'Sarah Williams', visitId: 'V004', testName: 'TSH', date: '2026-06-12', result: '3.2 mIU/L', normalRange: '0.4-4.0 mIU/L', status: 'normal' },
]

export const mockAuditLogs: AuditLog[] = [
  { id: 'AL001', userId: 'admin1', userName: 'Admin User', userRole: 'admin', action: 'CREATE', resource: 'Patient', resourceId: 'P006', timestamp: '2026-06-18T08:30:00', ipAddress: '192.168.1.1' },
  { id: 'AL002', userId: 'D001', userName: 'Dr. James Anderson', userRole: 'doctor', action: 'UPDATE', resource: 'Prescription', resourceId: 'PR001', timestamp: '2026-06-18T09:15:00', ipAddress: '192.168.1.2' },
  { id: 'AL003', userId: 'N001', userName: 'Nurse Mary', userRole: 'nurse', action: 'READ', resource: 'Patient', resourceId: 'P002', timestamp: '2026-06-18T10:00:00', ipAddress: '192.168.1.3' },
  { id: 'AL004', userId: 'P001', userName: 'Emily Johnson', userRole: 'patient', action: 'READ', resource: 'Prescription', resourceId: 'PR001', timestamp: '2026-06-18T10:30:00', ipAddress: '192.168.1.4' },
  { id: 'AL005', userId: 'admin1', userName: 'Admin User', userRole: 'admin', action: 'DELETE', resource: 'Appointment', resourceId: 'A006', timestamp: '2026-06-18T11:00:00', ipAddress: '192.168.1.1' },
]

export const mockMessages: Message[] = [
  { id: 'M001', senderId: 'P001', senderName: 'Emily Johnson', receiverId: 'D001', receiverName: 'Dr. James Anderson', content: 'Doctor, I have been experiencing some chest discomfort lately. Should I come in for a check-up?', timestamp: '2026-06-17T14:30:00', read: true },
  { id: 'M002', senderId: 'D001', senderName: 'Dr. James Anderson', receiverId: 'P001', receiverName: 'Emily Johnson', content: 'Hello Emily, yes please schedule an appointment as soon as possible. We should run some tests.', timestamp: '2026-06-17T15:00:00', read: true },
  { id: 'M003', senderId: 'P001', senderName: 'Emily Johnson', receiverId: 'D001', receiverName: 'Dr. James Anderson', content: 'Thank you doctor. I have scheduled for June 20th at 10:00 AM.', timestamp: '2026-06-17T15:30:00', read: false },
  { id: 'M004', senderId: 'P002', senderName: 'Michael Chen', receiverId: 'D002', receiverName: 'Dr. Maria Santos', content: 'Dr. Santos, my headaches have been more frequent this week.', timestamp: '2026-06-18T09:00:00', read: false },
]

export const analyticsData = {
  admissionsByMonth: [
    { month: 'Jan', admissions: 45, discharges: 40 },
    { month: 'Feb', admissions: 52, discharges: 48 },
    { month: 'Mar', admissions: 48, discharges: 51 },
    { month: 'Apr', admissions: 61, discharges: 55 },
    { month: 'May', admissions: 55, discharges: 60 },
    { month: 'Jun', admissions: 67, discharges: 58 },
  ],
  bedOccupancyByWard: [
    { ward: 'Cardiology', occupancy: 70 },
    { ward: 'General A', occupancy: 73 },
    { ward: 'ICU', occupancy: 80 },
    { ward: 'Pediatrics', occupancy: 60 },
    { ward: 'Orthopedics', occupancy: 61 },
    { ward: 'Neurology', occupancy: 58 },
  ],
  appointmentsByType: [
    { type: 'Consultation', count: 120 },
    { type: 'Follow-up', count: 85 },
    { type: 'Emergency', count: 30 },
    { type: 'Checkup', count: 65 },
  ],
  patientsByCondition: [
    { condition: 'Hypertension', count: 45 },
    { condition: 'Diabetes', count: 38 },
    { condition: 'Cardiac', count: 27 },
    { condition: 'Respiratory', count: 22 },
    { condition: 'Orthopedic', count: 19 },
    { condition: 'Other', count: 51 },
  ],
}
