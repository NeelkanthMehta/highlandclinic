"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reviewSchema,
  type ReviewFormValues,
  type Appointment,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, Stethoscope, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

/**
 * Interactive 5-star custom input component with hover states.
 */
function StarRatingInput({ value = 0, onChange, disabled = false }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  return (
    <div
      className="flex items-center gap-1 py-1"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || value);
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            className={cn(
              "p-1 rounded-md transition-transform focus:outline-hidden focus:ring-2 focus:ring-amber-400",
              disabled ? "cursor-not-allowed opacity-60" : "hover:scale-110 cursor-pointer"
            )}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            <Star
              className={cn(
                "w-7 h-7 transition-colors",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-slate-300 dark:text-slate-600"
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-300 min-w-[60px]">
        {(hoverRating || value) > 0 ? `${hoverRating || value} / 5` : "Select"}
      </span>
    </div>
  );
}

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSubmit: (data: ReviewFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function ReviewDialog({
  isOpen,
  onClose,
  appointment,
  onSubmit,
  isSubmitting = false,
}: ReviewDialogProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      appointmentId: appointment?.id || "",
      doctorName: appointment?.doctorName || "",
      rating: 5,
      reviewText: "",
    },
  });

  // Reset form when modal opens or appointment changes
  useEffect(() => {
    if (isOpen && appointment) {
      form.reset({
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        rating: 5,
        reviewText: "",
      });
    }
  }, [isOpen, appointment, form]);

  const handleFormSubmit = async (data: ReviewFormValues) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Leave a Review
          </DialogTitle>
          {appointment && (
            <DialogDescription className="pt-1">
              Share your experience with{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {appointment.doctorName}
              </span>{" "}
              ({appointment.doctorSpecialty}) on {appointment.dateTime}.
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-2"
          >
            {/* Hidden field for appointment ID */}
            <input type="hidden" {...form.register("appointmentId")} />

            {/* Doctor Info summary card */}
            {appointment && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {appointment.doctorName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {appointment.doctorSpecialty} &bull; {appointment.dateTime}
                  </p>
                </div>
              </div>
            )}

            {/* Rating Field using React Hook Form Controller */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-900 dark:text-white">
                    Overall Rating
                  </FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="rating"
                      render={({ field: controllerField }) => (
                        <StarRatingInput
                          value={controllerField.value}
                          onChange={(val) => controllerField.onChange(val)}
                          disabled={isSubmitting || form.formState.isSubmitting}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review Comment / Feedback Textarea */}
            <FormField
              control={form.control}
              name="reviewText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-900 dark:text-white">
                    Your Feedback
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your consultation, appointment timeliness, or doctor care quality..."
                      rows={4}
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
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewDialog;

