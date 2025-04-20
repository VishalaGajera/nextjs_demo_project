import {
  Button,
  CheckBox,
  LogoIcon,
  PasswordField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import {
  Alert,
  InputAdornment,
  InputLabel,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { emailRegex, passwordRegex } from "../../utils/regex";
import { AuthUiCard } from "../auth/Layouts/AuthUiCard";

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
  rememberMe: z.boolean(),
});

export type FormValuesTypes = z.infer<typeof FormValuesSchema>;

export const SignInForm = () => {
  const searchParams = useSearchParams();

  const callBackUrl = searchParams.get("callbackUrl") ?? "/";

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();

  const {
    palette: {
      app: { color },
    },
  } = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValuesTypes>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    resolver: zodResolver(FormValuesSchema),
    mode: "all",
  });

  const onSubmit = async (formValues: FormValuesTypes) => {
    setLoading(true);

    const result = await signIn("credentials", {
      email: formValues.email,
      password: formValues.password,
      redirect: false,
      callbackUrl: callBackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect credentials");
    } else if (result?.ok && result?.url) {
      window.location.href = result?.url;
    }
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Form control={control}>
      <AuthUiCard>
        <LogoIcon />

        <Stack gap="70px" width="100%">
          <Stack gap="25px" alignItems="center">
            <Typography variant="h4" fontWeight={600}>
              Login
            </Typography>

            <Stack direction="row" gap="5px">
              <Typography variant="body1" sx={{ color: color.iron[900] }}>
                Welcome Back! Please Sign In to access
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: color.butterflyBlue[900] }}
              >
                HRMS.
              </Typography>
            </Stack>
          </Stack>

          <Stack gap="18px">
            {error && <Alert severity="error">Incorrect credentials</Alert>}

            <Stack gap="24px">
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
                      <MailOutlineOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <PasswordField
                control={control}
                label="Password"
                name="password"
                placeholder="Password"
                required
                error={!!errors.password}
                helperText={errorMessages(errors.password?.message)}
              />
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" gap="10px">
                <CheckBox name="rememberMe" control={control} size="small" />

                <InputLabel sx={{ color: color.iron[800] }}>
                  Remember me
                </InputLabel>
              </Stack>

              <Link
                href="#"
                underline="none"
                onClick={() => {
                  router.push("/auth/forgot-password");
                }}
              >
                Forgot Password?
              </Link>
            </Stack>
          </Stack>
        </Stack>

        <Button
          type="submit"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          fullWidth
          loading={loading}
        >
          Sign In
        </Button>
      </AuthUiCard>
    </Form>
  );
};
