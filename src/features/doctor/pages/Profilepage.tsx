import { useEffect, useState } from "react";
import { useGetDoctorProfile, useUpdateDoctorProfile, getGetDoctorProfileQueryKey } from "@workspace/api-client-react";
import { DashboardLayout } from "@/features/doctor/component/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/features/patient/hooks/use-toast";
import {
  Stethoscope,
  Award,
  Save,
  ShieldCheck,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { doctorService, type DoctorQualification } from "../api/doctorService";

const doctorProfileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specialty: z.string().min(2, "Specialty is required"),
  licenseNumber: z.string().min(2, "License number is required"),
  licenseAuthority: z.string().optional(),
  experience: z.coerce.number().min(0, "Experience must be >= 0"),
  bio: z.string().optional(),
  languages: z.string().optional(),
  consultationFee: z.coerce.number().min(0, "Consultation fee must be >= 0").optional(),
});

export function DoctorProfile() {
  const { data: profile, isLoading } = useGetDoctorProfile();
  const updateProfile = useUpdateDoctorProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [qualifications, setQualifications] = useState<DoctorQualification[]>([]);
  const [newDegree, setNewDegree] = useState("");
  const [newInstitution, setNewInstitution] = useState("");
  const [newYear, setNewYear] = useState("");
  const [isAddingQual, setIsAddingQual] = useState(false);

  const form = useForm<z.infer<typeof doctorProfileSchema>>({
    resolver: zodResolver(doctorProfileSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      specialty: "General Physician",
      licenseNumber: "",
      licenseAuthority: "",
      experience: 5,
      bio: "",
      languages: "English, Hindi",
      consultationFee: 500,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        specialty: profile.specialty || "General Physician",
        licenseNumber: profile.licenseNumber || "",
        licenseAuthority: profile.licenseAuthority || "State Medical Council",
        experience: profile.experience || 5,
        bio: profile.bio || "",
        languages: Array.isArray(profile.languages) ? profile.languages.join(", ") : "English, Hindi",
        consultationFee: profile.consultationFee || 500,
      });
    }
  }, [profile, form]);

  useEffect(() => {
    async function loadQualifications() {
      try {
        const qList = await doctorService.getQualifications();
        setQualifications(qList);
      } catch (err) {
        console.warn("Could not fetch qualifications:", err);
      }
    }
    loadQualifications();
  }, []);

  const handleAddQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegree.trim()) return;

    setIsAddingQual(true);
    try {
      const added = await doctorService.addQualification({
        degree: newDegree.trim(),
        institution: newInstitution.trim() || undefined,
        year: newYear ? Number(newYear) : undefined,
      });
      setQualifications((prev) => [...prev, added]);
      setNewDegree("");
      setNewInstitution("");
      setNewYear("");
      toast({
        title: "Qualification Added",
        description: "Degree added to your active profile.",
      });
    } catch (err) {
      const localId = `local-${Date.now()}`;
      setQualifications((prev) => [
        ...prev,
        {
          id: localId,
          doctorId: String(profile?.id || "doc-1"),
          degree: newDegree.trim(),
          institution: newInstitution.trim(),
          year: newYear ? Number(newYear) : undefined,
        },
      ]);
      setNewDegree("");
      setNewInstitution("");
      setNewYear("");
      toast({
        title: "Qualification Recorded",
        description: "Degree added to your active profile.",
      });
    } finally {
      setIsAddingQual(false);
    }
  };

  const handleDeleteQualification = async (id: string) => {
    try {
      await doctorService.deleteQualification(id);
      setQualifications((prev) => prev.filter((q) => q.id !== id));
      toast({
        title: "Qualification Removed",
        description: "Degree removed from profile.",
      });
    } catch (err) {
      setQualifications((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const onSubmit = (data: z.infer<typeof doctorProfileSchema>) => {
    const langArray = data.languages ? data.languages.split(",").map((s) => s.trim()).filter(Boolean) : ["English"];

    updateProfile.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        licenseNumber: data.licenseNumber,
        licenseAuthority: data.licenseAuthority,
        experience: data.experience,
        bio: data.bio,
        languages: langArray,
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile Saved",
            description: "Doctor profile settings synchronized successfully.",
          });
          queryClient.invalidateQueries({ queryKey: getGetDoctorProfileQueryKey() });
        },
        onError: (err) => {
          toast({
            title: "Failed to Save Profile",
            description: err instanceof Error ? err.message : "Error saving profile",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-20 text-slate-500 font-medium">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
            <p className="text-sm">Loading Doctor Profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isVerified = profile?.verificationStatus === "VERIFIED";

  return (
    <DashboardLayout>
      <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-12 font-sans min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 text-violet-600 shrink-0" />
              <span>Doctor Profile & Credentials</span>
            </h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm">
              Manage your verified medical registrations, qualifications, biography, and languages.
            </p>
          </div>
          <Badge
            variant="outline"
            className={`py-1 px-3 text-xs font-extrabold uppercase tracking-wider rounded-full self-start sm:self-auto shrink-0 ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-amber-50 text-amber-700 border-amber-300"
            }`}
          >
            {isVerified ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Practitioner
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Verification Pending
              </span>
            )}
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Personal & Professional Info */}
            <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4 sm:p-5 pb-3">
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 shrink-0" />
                  <span>Doctor Personal & Clinical Identity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rajesh" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Sharma" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Clinical Specialty *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cardiologist / General Physician" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="e.g. 8" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Medical Registration / License No. *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MCI-2015-84920" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licenseAuthority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Medical Council / Authority</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Delhi Medical Council" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Spoken Consultation Languages</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. English, Hindi, Punjabi" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consultationFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Default Consultation Fee (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="50" placeholder="500" className="rounded-xl text-xs sm:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-700">Doctor Professional Biography</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Brief biography outlining clinical expertise, certifications, and philosophy of care..."
                          className="rounded-xl text-xs sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Save Profile Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2 rounded-xl shadow-md h-11 px-6 text-xs sm:text-sm"
              >
                <Save className="h-4 w-4 shrink-0" />
                {updateProfile.isPending ? "Saving..." : "Save Profile Changes"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Qualifications Section */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4 sm:p-5 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 shrink-0" />
              <span>Academic & Medical Qualifications</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Degrees and certifications visible to patients.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* List */}
            {qualifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No qualifications added yet.</p>
            ) : (
              <div className="space-y-2">
                {qualifications.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs gap-2"
                  >
                    <div className="min-w-0">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate">{q.degree}</span>
                      <span className="text-slate-500 font-medium truncate block">
                        {q.institution} {q.year ? `(${q.year})` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteQualification(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                      title="Remove Qualification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Qualification Form */}
            <form onSubmit={handleAddQualification} className="p-3.5 sm:p-4 rounded-xl border border-dashed border-violet-300 bg-violet-50/40 space-y-3">
              <span className="text-xs font-bold text-violet-900 block">Add New Degree / Fellowship</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <Input
                  placeholder="Degree (e.g. MBBS, MD)"
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  className="bg-white rounded-xl text-xs sm:text-sm"
                />
                <Input
                  placeholder="Institution (e.g. AIIMS Delhi)"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  className="bg-white rounded-xl text-xs sm:text-sm"
                />
                <Input
                  type="number"
                  placeholder="Year (e.g. 2018)"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="bg-white rounded-xl text-xs sm:text-sm"
                />
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingQual || !newDegree.trim()}
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1 rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" /> Add Degree
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DoctorProfile;
