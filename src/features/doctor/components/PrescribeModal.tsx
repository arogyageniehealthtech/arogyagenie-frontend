import { useCreatePrescription, useExtractOcr, getGetDoctorDashboardQueryKey, getListPrescriptionsQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/features/patient/hooks/use-toast";
import { Pill, Scan } from "lucide-react";

const prescriptionSchema = z.object({
  patientId: z.coerce.number().min(1, "Patient ID is required"),
  appointmentId: z.coerce.number().optional(),
  diagnosis: z.string().min(2, "Diagnosis is required"),
  medicines: z.string().min(5, "Medicines and dosages are required (min 5 chars)"),
  instructions: z.string().optional(),
  prescribedDate: z.string().min(1, "Prescribed date is required"),
});

interface PrescribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPatientId?: number;
  defaultAppointmentId?: number;
  patientName?: string | null;
}

export function PrescribeModal({
  isOpen,
  onClose,
  defaultPatientId,
  defaultAppointmentId,
  patientName,
}: PrescribeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPrescription = useCreatePrescription();
  const extractOcr = useExtractOcr();

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema) as any,
    defaultValues: {
      patientId: defaultPatientId ?? 0,
      appointmentId: defaultAppointmentId,
      diagnosis: "",
      medicines: "",
      instructions: "",
      prescribedDate: new Date().toISOString().split("T")[0],
    },
  });

  const handleRunOcr = () => {
    const currentMedicines = form.getValues("medicines");

    extractOcr.mutate(
      {
        data: {
          rawText: currentMedicines || undefined,
          imageBase64: !currentMedicines ? "sample_base64_prescription_scan" : undefined,
        },
      },
      {
        onSuccess: (data) => {
          toast({
            title: "OCR Scan Completed",
            description: `Extracted ${data.extractedMedicines?.length ?? 0} prescription lines with ${data.confidenceScore}% confidence.`,
          });

          if (data.rawExtractedText) {
            form.setValue("medicines", data.rawExtractedText);
          }
        },
        onError: (err: unknown) => {
          toast({
            title: "OCR Failed",
            description: err instanceof Error ? err.message : "Error parsing prescription.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const onSubmit = (data: z.infer<typeof prescriptionSchema>) => {
    createPrescription.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Prescription Created",
            description: `Digital prescription issued successfully${patientName ? ` for ${patientName}` : ""}.`,
          });
          queryClient.invalidateQueries({ queryKey: getGetDoctorDashboardQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListPrescriptionsQueryKey() });
          form.reset();
          onClose();
        },
        onError: (err: unknown) => {
          toast({
            title: "Failed to Issue Prescription",
            description: err instanceof Error ? err.message : "An error occurred.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
            <Pill className="h-5 w-5 text-violet-600 shrink-0" />
            <span>Issue Digital Prescription</span>
          </DialogTitle>
          {patientName && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">
              Patient: <strong className="text-slate-800">{patientName}</strong>
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4 pt-2 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">Patient ID *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter Patient ID" className="rounded-xl text-xs sm:text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700">Appointment ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        className="rounded-xl text-xs sm:text-sm"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">Diagnosis *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acute Bronchitis / Viral Fever" className="rounded-xl text-xs sm:text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicines"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <FormLabel className="text-xs font-bold text-slate-700">Medicines & Dosage Schedule *</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px] text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-bold gap-1 px-1.5 rounded-lg"
                      onClick={handleRunOcr}
                      disabled={extractOcr.isPending}
                    >
                      <Scan className="h-3 w-3 shrink-0" />
                      {extractOcr.isPending ? "Scanning..." : "Auto-Scan with OCR"}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Amoxicillin 500mg - 1 capsule thrice daily after meals (5 days)&#10;Paracetamol 650mg - 1 tablet twice daily as needed"
                      className="min-h-[100px] text-xs font-mono rounded-xl leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Drink plenty of warm water. Rest for 3 days. Follow up if fever persists."
                      className="min-h-[70px] text-xs sm:text-sm rounded-xl leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prescribedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700">Prescribed Date *</FormLabel>
                  <FormControl>
                    <Input type="date" className="rounded-xl text-xs sm:text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3 gap-2 flex-col-reverse sm:flex-row">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto rounded-xl text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={createPrescription.isPending} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs">
                {createPrescription.isPending ? "Issuing..." : "Issue Prescription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PrescribeModal;
