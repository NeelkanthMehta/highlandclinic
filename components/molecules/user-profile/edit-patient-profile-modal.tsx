"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientProfileUpdateSchema,
  type PatientProfileUpdateValues,
} from "@/schemas/user-profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Phone, Calendar, Mail, MapPin, Loader2 } from "lucide-react";

interface EditPatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: PatientProfileUpdateValues;
  onSubmit: (data: PatientProfileUpdateValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function EditPatientProfileModal({
  isOpen,
  onClose,
  patientData,
  onSubmit,
  isSubmitting = false,
}: EditPatientProfileModalProps) {
  const form = useForm<PatientProfileUpdateValues>({
    resolver: zodResolver(patientProfileUpdateSchema),
    defaultValues: {
      fullName: patientData.fullName || "",
      email: patientData.email || "",
      phoneNumber: patientData.phoneNumber || "",
      dateOfBirth: patientData.dateOfBirth || "",
      address: patientData.address || "",
    },
  });

  // Pre-populate input fields whenever the modal shifts into an open state
  useEffect(() => {
    if (isOpen && patientData) {
      form.reset({
        fullName: patientData.fullName || "",
        email: patientData.email || "",
        phoneNumber: patientData.phoneNumber || "",
        dateOfBirth: patientData.dateOfBirth || "",
        address: patientData.address || "",
      });
    }
  }, [isOpen, patientData, form]);

  const handleFormSubmit = async (data: PatientProfileUpdateValues) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <User className="w-5 h-5 text-blue-600" />
            Edit Personal Information
          </DialogTitle>
          <DialogDescription>
            Update your personal details below. Changes will be reflected across your medical records.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-2"
          >
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-semibold">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth Field */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="March 15, 1985 or YYYY-MM-DD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Residential Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Residential Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Healthcare Ave, Medical City, MC 12345"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || form.formState.isSubmitting}
              >
                {(isSubmitting || form.formState.isSubmitting) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPatientProfileModal;
