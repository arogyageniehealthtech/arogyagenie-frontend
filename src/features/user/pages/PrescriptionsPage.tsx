import React, { useState } from 'react';
import { 
  FileText, Search, Calendar, User, Stethoscope, 
  Download, Eye, Filter, ArrowLeft, Pill, Clock, Hospital,X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// Types
// ==========================================
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  specialization: string;
  hospitalName: string;
  date: string;
  diagnosis: string;
  medicines: Medication[];
  notes?: string;
  prescriptionUrl?: string;
}

// ==========================================
// Mock Prescriptions Data
// ==========================================
const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-84920',
    doctorName: 'Dr. Arup Kumar',
    specialization: 'Cardiology',
    hospitalName: 'City Care Multispecialty Hospital',
    date: 'August 18, 2026',
    diagnosis: 'Hypertension & Mild Tachycardia',
    medicines: [
      { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily (Morning)', duration: '30 Days' },
      { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '15 Days' },
    ],
    notes: 'Reduce salt intake and monitor blood pressure twice daily.',
  },
  {
    id: 'RX-73619',
    doctorName: 'Dr. Sunita Sen',
    specialization: 'Pediatrics',
    hospitalName: 'LifeSpring Maternity Center',
    date: 'July 12, 2026',
    diagnosis: 'Viral Upper Respiratory Infection',
    medicines: [
      { name: 'Paracetamol Syrup', dosage: '250mg', frequency: 'Every 6 hours as needed', duration: '5 Days' },
      { name: 'Cetirizine Drops', dosage: '5ml', frequency: 'Once at bedtime', duration: '7 Days' },
    ],
    notes: 'Ensure adequate hydration and warm water gargles.',
  },
  {
    id: 'RX-52910',
    doctorName: 'Dr. Rajesh Das',
    specialization: 'Orthopedics',
    hospitalName: 'Apex Ortho Clinic',
    date: 'June 04, 2026',
    diagnosis: 'Lower Back Strain',
    medicines: [
      { name: 'Aceclofenac + Paracetamol', dosage: '100mg/325mg', frequency: 'Twice daily after meals', duration: '5 Days' },
      { name: 'Thiocolchicoside Gel', dosage: 'Topical', frequency: 'Apply gently 3 times a day', duration: '7 Days' },
    ],
    notes: 'Avoid heavy lifting and practice recommended lower back stretches.',
  },
];

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Filter prescriptions based on search query
  const filteredPrescriptions = MOCK_PRESCRIPTIONS.filter(rx => 
    rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 px-4 sm:px-6">
      
      {/* --- HEADER BAR --- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Prescriptions</h2>
              <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-100">
                {MOCK_PRESCRIPTIONS.length} Total
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Access and download digital prescriptions issued by your doctors.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search doctor, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* --- PRESCRIPTIONS LIST --- */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">No prescriptions found</h3>
            <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">We couldn't find any prescriptions matching your search query.</p>
          </div>
        ) : (
          filteredPrescriptions.map(rx => (
            <div 
              key={rx.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all flex flex-col gap-5 group"
            >
              {/* Card Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{rx.doctorName}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{rx.specialization} • <span className="text-slate-500 font-medium">{rx.hospitalName}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {rx.date}
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl">
                    {rx.id}
                  </span>
                </div>
              </div>

              {/* Diagnosis & Medicines */}
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Diagnosis</span>
                  <p className="text-sm font-bold text-slate-800 bg-slate-50 px-3.5 py-2 rounded-xl inline-block border border-slate-100">
                    {rx.diagnosis}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Prescribed Medicines</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {rx.medicines.map((med, idx) => (
                      <div key={idx} className="bg-slate-50/70 border border-slate-100 p-3 rounded-2xl flex items-start gap-3">
                        <div className="p-2 bg-white text-indigo-600 rounded-xl shadow-sm border border-slate-100 shrink-0 mt-0.5">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{med.name} <span className="text-indigo-600 font-semibold">({med.dosage})</span></p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{med.frequency} • {med.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {rx.notes && (
                  <p className="text-xs font-medium text-slate-500 italic bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                    <strong className="text-amber-800 font-semibold">Doctor's Note:</strong> {rx.notes}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedPrescription(rx)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  <Eye className="w-4 h-4" /> View Full Preview
                </button>
                <button 
                  onClick={() => alert(`Downloading prescription ${rx.id}...`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- VIEW FULL PREVIEW MODAL --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Prescription Details</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedPrescription.id}</p>
              </div>
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full border border-slate-200 shadow-sm transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                  Rx
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{selectedPrescription.doctorName}</h4>
                  <p className="text-xs text-indigo-700 font-semibold">{selectedPrescription.specialization}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedPrescription.hospitalName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
                  <span>Date Issued: <strong className="text-slate-800">{selectedPrescription.date}</strong></span>
                  <span>Diagnosis: <strong className="text-slate-800">{selectedPrescription.diagnosis}</strong></span>
                </div>

                <h5 className="font-bold text-slate-900 text-sm">Medicines List</h5>
                <ul className="space-y-2">
                  {selectedPrescription.medicines.map((m, i) => (
                    <li key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-slate-900 block">{m.name} ({m.dosage})</span>
                        <span className="text-xs text-slate-500">{m.frequency}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{m.duration}</span>
                    </li>
                  ))}
                </ul>

                {selectedPrescription.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Instructions</span>
                    <p className="text-sm font-medium text-slate-700">{selectedPrescription.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 text-sm transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => alert(`Downloading prescription ${selectedPrescription.id}...`)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 text-sm transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}