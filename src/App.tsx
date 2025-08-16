import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema, type FormSchema } from "./schema";
import "./App.css";

function App() {
  // TODO: useFormフックをセットアップしましょう
  // genericに型<FormSchema>を渡します
  // resolverにzodResolver(formSchema)を設定します
  // modeを 'onChange' に設定して、リアルタイムバリデーションを有効にします
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = (data: FormSchema) => {
    console.log("送信成功", data);
    alert("送信成功");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {" "}
      <div className="max-w-md mx-auto">
        {" "}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {" "}
          <div className="text-center mb-8">
            {" "}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              高機能フォーム
            </h1>{" "}
            <p className="text-gray-600">必要な情報を入力してください</p>{" "}
          </div>{" "}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            {" "}
            <div className="form-group">
              {" "}
              <label htmlFor="name" className="form-label">
                名前
              </label>{" "}
              <input
                id="name"
                type="text"
                {...register("name")}
                className="form-input"
                placeholder="山田太郎"
              />{" "}
              {errors.name && (
                <p className="form-error"> {errors.name.message}</p>
              )}
            </div>{" "}
            <div className="form-group">
              {" "}
              <label htmlFor="email" className="form-label">
                メールアドレス
              </label>{" "}
              <input
                id="email"
                type="email"
                {...register("email")}
                className="form-input"
                placeholder="example@email.com"
              />{" "}
              {errors.email && (
                <p className="form-error"> {errors.email.message}</p>
              )}
            </div>{" "}
            <div className="form-group">
              {" "}
              <label htmlFor="password" className="form-label">
                パスワード
              </label>{" "}
              <input
                id="password"
                type="password"
                {...register("password")}
                className="form-input"
                placeholder="8文字以上で入力"
              />{" "}
              {errors.password && (
                <p className="form-error"> {errors.password.message}</p>
              )}{" "}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                パスワード確認
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="form-input"
                placeholder="パスワードを再入力"
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>
            <button type="submit" disabled={!isValid} className="submit-button">
              送信
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
