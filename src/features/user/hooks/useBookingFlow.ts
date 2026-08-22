import { useState } from 'react';
import type{ PatientInfo } from '../types/common';

export function useBookingFlow(initialStep: number = 1) {
  const [step, setStep] = useState(initialStep);
  
  // Shared Patient State
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '', age: '', gender: '', mobile: '', address: '', bloodGroup: '', emergencyContact: ''
  });

  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const jumpToStep = (target: number) => setStep(target);

  const handleAutoFill = () => {
    setPatientInfo({
      name: 'Justin Mason', 
      age: '34', 
      gender: 'Male', 
      mobile: '+91 9876543210', 
      address: 'Khardaha, West Bengal', 
      bloodGroup: 'O+', 
      emergencyContact: '+91 9123456789'
    });
  };

  return {
    step,
    nextStep,
    prevStep,
    jumpToStep,
    patientInfo,
    setPatientInfo,
    handleAutoFill,
    calendarState: {
      monthOffset, setMonthOffset,
      selectedDate, setSelectedDate,
      selectedTime, setSelectedTime
    }
  };
}