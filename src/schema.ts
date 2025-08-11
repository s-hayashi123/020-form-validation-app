import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(1, { message: "名前は必須です" }),
    email: z.string().email({ message: "無効なメールアドレスです" }),

    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type FormSchema = z.infer<typeof formSchema>;
