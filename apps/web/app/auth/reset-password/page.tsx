"use client";

import { Button, PasswordField, toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { AuthUiCard } from "../../../components/auth/Layouts/AuthUiCard";
import { AuthUiContainer } from "../../../components/auth/Layouts/AuthUiContainer";
import { onError } from "../../../utils/errors";
import { passwordRegex } from "../../../utils/regex";
import { useResetPassword } from "./hook/useResetPassword";

const FormValuesSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, { message: "common.required" })
      .max(128, { message: "Password can`t be more than 128 characters" })
      .regex(
        passwordRegex,
        "Password must be alphanumeric and contain at-least 8 characters"
      )
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    confirm_password: z
      .string()
      .trim()
      .min(1, { message: "common.required" })
      .max(128, { message: "Password can`t be more than 128 characters" })
      .regex(
        passwordRegex,
        "Password must be alphanumeric and contain at-least 8 characters"
      )
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "Confirm password is not matched",
    path: ["confirm_password"],
  });

export type FormValuesTypes = z.infer<typeof FormValuesSchema>;

export type ResetPasswordPayload = Omit<FormValuesTypes, "confirm_password">;

export default function Page() {
  const router = useRouter();

  const { t } = useTranslation();

  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValuesTypes>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(FormValuesSchema),
    mode: "all",
  });

  const { mutate, isPending } = useResetPassword({
    token,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/auth/sign-in");
      },
      onError: (error) => onError(error),
    },
  });

  const onSubmit = (formValues: FormValuesTypes) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...updatedFormValues } = formValues;

    mutate(updatedFormValues as ResetPasswordPayload);
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  if (!token) {
    return <Typography>You are not authorized...</Typography>;
  }

  return (
    <AuthUiContainer>
      <AuthUiCard>
        <Stack gap="70px" width="100%">
          <Stack gap="32px">
            <Typography fontWeight={600} variant="h5">
              Reset Password
            </Typography>

            <PasswordField
              name="password"
              placeholder="Enter new password"
              label="Password"
              control={control}
              error={!!errors.password}
              helperText={errorMessages(errors.password?.message)}
              required
            />

            <PasswordField
              name="confirm_password"
              placeholder="Enter confirm password"
              label="Confirm Password"
              control={control}
              error={!!errors.confirm_password}
              helperText={errorMessages(errors.confirm_password?.message)}
              required
            />
          </Stack>

          <Button
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            loading={isPending}
            disabled={!watch("password") || !watch("confirm_password")}
          >
            Update Password
          </Button>
        </Stack>
      </AuthUiCard>
    </AuthUiContainer>
  );
}
