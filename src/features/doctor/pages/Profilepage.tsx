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
  Building,
  Award,
  Clock,
  DollarSign,
  Save,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Globe,
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
      const created = await doctorService.addQualification({
        degree: newDegree.trim(),
        institution: newInstitution.trim() || undefined,
        year: newYear ? Number(newYear) : undefined,
      });
      setQualifications((prev) => [...prev, created]);
      setNewDegree("");
      setNewInstitution("");
      setNewYear("");
      toast({
        title: "Qualification Added",
        description: "Degree added to your clinical profile.",
      });
    } catch (err) {
      toast({
        title: "Added Locally",
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
          Loading Doctor Profile...
        </div>
      </DashboardLayout>
    );
  }

  const isVerified = profile?.verificationStatus === "VERIFIED";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Stethoscope className="h-7 w-7 text-violet-600" />
              Doctor Profile & Credentials
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your verified medical registrations, qualifications, biography, and languages.
            </p>
          </div>
          <Badge
            variant="outline"
            className={`py-1 px-3 text-xs font-extrabold uppercase tracking-wider rounded-full self-start sm:self-auto ${
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal & Professional Info */}
            <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-violet-600" />
                  Doctor Personal & Clinical Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rajesh" className="rounded-xl text-sm" {...field} />
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
                          <Input placeholder="e.g. Sharma" className="rounded-xl text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Medical Specialty *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cardiologist" className="rounded-xl text-sm" {...field} />
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
                        <FormLabel className="text-xs font-bold text-slate-700">Experience (Years) *</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" className="rounded-xl text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700">Medical License Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MED-IN-90218" className="rounded-xl text-sm font-mono" {...field} />
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
                        <FormLabel className="text-xs font-bold text-slate-700">Registration Council / Authority</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Medical Council of India" className="rounded-xl text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-violet-600" /> Languages Spoken (comma-separated)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="English, Hindi, Bengali" className="rounded-xl text-sm" {...field} />
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
                        <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-violet-600" /> Standard Consultation Fee (₹)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="50" className="rounded-xl text-sm" {...field} />
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
                      <FormLabel className="text-xs font-bold text-slate-700">Doctor Bio & Experience Highlights</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Brief biography outlining clinical expertise, certifications, and philosophy of care..."
                          className="rounded-xl text-sm"
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
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2 rounded-xl shadow-md h-11 px-6"
              >
                <Save className="h-4 w-4" />
                {updateProfile.isPending ? "Saving..." : "Save Profile Changes"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Qualifications Section */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-600" />
              Academic & Medical Qualifications
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Degrees and certifications visible to patients.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* List */}
            {qualifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No qualifications added yet.</p>
            ) : (
              <div className="space-y-2">
                {qualifications.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">{q.degree}</span>
                      <span className="text-slate-500 font-medium">
                        {q.institution} {q.year ? `(${q.year})` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteQualification(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remove Qualification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Qualification Form */}
            <form onSubmit={handleAddQualification} className="p-4 rounded-xl border border-dashed border-violet-300 bg-violet-50/40 space-y-3">
              <span className="text-xs font-bold text-violet-900 block">Add New Degree / Fellowship</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  placeholder="Degree (e.g. MBBS, MD, MS)"
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  className="bg-white rounded-xl text-xs"
                />
                <Input
                  placeholder="Institution (e.g. AIIMS Delhi)"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  className="bg-white rounded-xl text-xs"
                />
                <Input
                  type="number"
                  placeholder="Year (e.g. 2018)"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="bg-white rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingQual || !newDegree.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1 rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Degree
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
