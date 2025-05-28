"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
// import { login } from "@/redux/features/authSlice"
import { useAppDispatch } from "@/redux/hooks";
import type { LoginRequestDto } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { loginUserAPI } from "@/redux/features/authSlice";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const LoginSchema = useMemo(() => {
    Yup.object<LoginRequestDto>().shape({
      userName: Yup.string().required("user name is required"),
      password: Yup.string()
        .min(2, "password is must be at least 2 characters")
        .required("password is required"),
    });
  }, []);

  const handleSubmit = useCallback(
    async (values: LoginRequestDto) => {
      const result = await dispatch(loginUserAPI(values)).unwrap();
      if (result.user && result.token) {
        router.push("/dashboard");
      }
    },
    [dispatch]
  );

  const formik = useFormik<LoginRequestDto>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                required
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
