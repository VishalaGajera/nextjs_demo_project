"use client";

import { Button, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, MailOutlineOutlined } from "@mui/icons-material";
import { InputAdornment, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { ForgotPasswordSuccess } from "../../../components/auth/forgot-password/ForgotPasswordSuccess";
import { AuthUiCard } from "../../../components/auth/Layouts/AuthUiCard";
import { AuthUiContainer } from "../../../components/auth/Layouts/AuthUiContainer";
import { onError } from "../../../utils/errors";
import { emailRegex } from "../../../utils/regex";
import { useForgotPassword } from "./hook/useForgotPassword";

const FormValuesSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type FormValuesTypes = z.infer<typeof FormValuesSchema>;

export default function Page() {
  const router = useRouter();

  const { t } = useTranslation();

  const [isForgotPasswordSuccessPage, setIsForgotPasswordSuccessPage] =
    useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormValuesTypes>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(FormValuesSchema),
    mode: "all",
  });

  const { mutate, isPending } = useForgotPassword({
    options: {
      onSuccess: () => {
        setIsForgotPasswordSuccessPage(true);
      },
      onError: (error) => onError(error, setError),
    },
  });

  const onSubmit = (formValues: FormValuesTypes) => {
    mutate(formValues);
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <AuthUiContainer>
      {isForgotPasswordSuccessPage ? (
        <ForgotPasswordSuccess />
      ) : (
        <AuthUiCard>
          <Stack gap="70px" width="100%">
            <Stack gap="32px">
              <ArrowBack onClick={() => router.push("/auth/sign-in")} />

              <Stack gap="8px">
                <Typography fontWeight={600} variant="h5">
                  Forgot Password?
                </Typography>

                <Typography fontWeight={500} variant="body1">
                  Reset instructions will be sent to your registered email.
                </Typography>
              </Stack>

              <TextField
                control={control}
                label="Email address"
                placeholder="Email address"
                name="email"
                required
                error={!!errors.email}
                helperText={errorMessages(errors.email?.message)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Button
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
              loading={isPending}
            >
              Reset Password
            </Button>
          </Stack>
        </AuthUiCard>
      )}
    </AuthUiContainer>
  );
}
