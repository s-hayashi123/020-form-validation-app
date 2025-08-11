# 【React & TypeScript】react-hook-formとzodで作る！高機能フォーム開発チュートリアル (020)

## 🚀 はじめに (The "Why")

こんにちは！今回のチュートリアルでは、Reactアプリケーションで堅牢かつユーザーフレンドリーなフォームを構築する方法を学びます。

**完成形デモ:**

(ここに、リアルタイムでバリデーションエラーが表示され、全て成功すると送信ボタンが押せるようになるフォームのGIFアニメーションを挿入)

フォームは、ユーザーから情報を収集するためのWebアプリケーションの心臓部です。しかし、その実装は意外と複雑になりがちです。

- どうやって入力値を管理する？
- どうやってリアルタイムにエラーをチェックする？
- どうやってパフォーマンスの低下を防ぐ？
- どうやってコードの保守性を高める？

このチュートリアルでは、これらの課題を解決するための現代的なベストプラクティス、`react-hook-form` と `zod` を組み合わせた開発手法をマスターします。この技術を学ぶことで、**UX（ユーザー体験）とDX（開発者体験）の両方を劇的に向上させる**ことができます。

---

## 🛠 環境構築

このセクションでは、具体的な手順は記載しません。
以下の各技術の公式サイトを参照し、最新の手順に従って環境をセットアップしてください。

- **開発サーバー:** [Vite](https://vitejs.dev/guide/)
- **フレームワーク:** [React](https://react.dev/)
- **言語:** [TypeScript](https://www.typescriptlang.org/)
- **フォーム管理:** [react-hook-form](https://react-hook-form.com/)
- **スキーマ検証:** [zod](https://zod.dev/)
- **連携ライブラリ:** [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

**ヒント:** `npm create vite@latest my-form-app -- --template react-ts` でプロジェクトを始め、必要なライブラリ (`react-hook-form zod @hookform/resolvers`) を追加しましょう。

---

## 🧠 思考を促す開発ステップ

完全なコードをコピー＆ペーストするのではなく、ヒントを元に「どうすれば実装できるか？」を考えながら進めていきましょう。

### Step 1: バリデーションスキーマを定義する

まず、フォームの「設計図」となるバリデーションスキーマを`zod`で作成します。これにより、どこでどのようなデータが使われるのか、どのようなルールであるべきかが一目でわかるようになります。

**`src/schema.ts` を作成:**

```typescript
import { z } from 'zod';

// TODO: zodのオブジェクトスキーマを定義してみましょう
export const formSchema = z.object({
  // name: 文字列型で、1文字以上であること。エラーメッセージは「名前は必須です」
  name: z.string().min(1, { message: '名前は必須です' }),
  
  // email: 文字列型で、有効なメールアドレス形式であること。エラーメッセージを指定
  email: z.string().email({ message: '無効なメールアドレスです' }),

  // password: 文字列型で、8文字以上であること。
  password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),

  // confirmPassword: 文字列型
  confirmPassword: z.string(),
})
// TODO: .refine() を使って、パスワードと確認用パスワードが一致するかどうかのカスタムバリデーションを追加しましょう
// ヒント: (data) => data.password === data.confirmPassword
// エラーメッセージは「パスワードが一致しません」とし、'confirmPassword' フィールドに関連付けます (path: ['confirmPassword'])
.refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
});


// スキーマからTypeScriptの型を自動生成します。これで型の二重管理を防げます。
export type FormSchema = z.infer<typeof formSchema>;
```

### Step 2: `useForm` フックでフォームの魂を吹き込む

次に、Reactコンポーネント内で `react-hook-form` の `useForm` フックをセットアップします。

**`src/App.tsx` を編集:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormSchema } from './schema';

function App() {
  // TODO: useFormフックをセットアップしましょう
  // genericに型<FormSchema>を渡します
  // resolverにzodResolver(formSchema)を設定します
  // modeを 'onChange' に設定して、リアルタイムバリデーションを有効にします
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: FormSchema) => {
    console.log('送信成功!', data);
    alert('送信成功！');
  };

  return (
    // ... JSXは次のステップで ...
  );
}

export default App;
```

### Step 3: フォームの骨格(JSX)を作成する

`handleSubmit` を使ってフォームの送信をハンドリングし、`register` を使って各入力フィールドをフォームの状態に登録します。

**`src/App.tsx` の `return` 文を編集:**

```tsx
// ... (useFormのセットアップは省略) ...
return (
  <div className="app-container">
    <h1>高機能フォーム</h1>
    {/* TODO: handleSubmit(onSubmit) をformのonSubmitに渡しましょう */}
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      
      {/* 名前フィールド */}
      <div className="form-group">
        <label htmlFor="name">名前</label>
        {/* TODO: register('name') をinputにスプレッド構文で渡しましょう */}
        <input id="name" type="text" {...register('name')} />
        {/* TODO: errors.name が存在すれば、エラーメッセージを表示しましょう */}
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      {/* メールアドレスフィールド (同様に作成) */}
      <div className="form-group">
        <label htmlFor="email">メールアドレス</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      {/* パスワードフィールド (同様に作成) */}
      <div className="form-group">
        <label htmlFor="password">パスワード</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="error-message">{errors.password.message}</p>}
      </div>

      {/* パスワード確認フィールド (同様に作成) */}
      <div className="form-group">
        <label htmlFor="confirmPassword">パスワード確認</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
      </div>

      {/* TODO: isValidがfalseの場合、ボタンを非活性(disabled)にしましょう */}
      <button type="submit" disabled={!isValid}>送信</button>
    </form>
  </div>
);
```

---

## 📚 深掘りコラム (Deep Dive)

### なぜ `react-hook-form` はパフォーマンスが良いのか？

従来の`useState`によるフォーム管理では、キーを1文字入力するたびに`setState`が呼ばれ、コンポーネント全体が再レンダリングされます。小さなフォームでは問題ありませんが、複雑なフォームではパフォーマンスのボトルネックになります。

`react-hook-form`は**非制御コンポーネント**というアプローチを採用しています。これは、フォームの値をReactの`state`で管理するのではなく、DOMから直接読み取る方法です。これにより、入力中の不要な再レンダリングを極限まで減らし、非常に高いパフォーマンスを実現しています。

### なぜ `zod` を使うと型安全なのか？

`zod`の最大の利点は、**バリデーションスキーマを一度定義するだけで、TypeScriptの型も自動的に生成できる**点です（`z.infer`）。

これにより、
1.  バリデーションのルール
2.  フォームデータのTypeScriptの型

この2つが常に同期され、食い違いがなくなります。例えば、スキーマに新しいフィールドを追加し忘れたままコードを書くと、TypeScriptがコンパイル時にエラーを教えてくれます。これにより、実行時エラーを未然に防ぎ、開発の信頼性を大幅に向上させます。

---

## 🎯 挑戦課題 (Challenges)

チュートリアルの内容をマスターしたら、以下の課題に挑戦してみましょう！

-   **Easy:** `age`（年齢）フィールドを追加してみましょう。バリデーションルールは「必須入力」「数値」「18歳以上」とします。(`z.number().min(18)`)
-   **Medium:** フォームをリセットする「リセット」ボタンを追加してみましょう。`react-hook-form`の`reset()`関数を調べてみてください。
-   **Hard:** フォーム送信時にローディング状態を管理してみましょう。`onSubmit`を`async`関数にし、`isSubmitting`のような`state`を`useState`で管理して、送信中はボタンを非活性化し、「送信中...」のようなテキストを表示します。
-   **エラー修正課題:** 以下のコードには意図的なバグが1つ含まれています。見つけて修正してください。
    ```tsx
    // ...
    <input id="email" type="email" {...register('mail')} /> 
    {/* ヒント: エラーは表示されるのに、なぜかフォームが送信できてしまう...？ */}
    {errors.email && <p>{errors.email.message}</p>}
    // ...
    ```

---

## 📝 メモ (Memo)

このセクションは自由に活用してください。
- なぜこの技術（例: Next.jsのSSR）を使うのか
- なぜこのライブラリ（例: react-hook-form）を選んだのか
- 開発で詰まった点をどう解決したのか

(ここにあなたの学びや気づきを書き留めましょう)

---

## ✅ 結論

お疲れ様でした！このチュートリアルを通して、あなたは以下の強力なスキルを身につけました。

-   `zod`を使った宣言的なバリデーションスキーマの定義
-   `react-hook-form`によるパフォーマンス指向のフォーム状態管理
-   `zodResolver`を使ったスキーマとフォームの連携
-   リアルタイムバリデーションとエラーハンドリングの実装

これらの技術は、あらゆるReactプロジェクトで役立つ、非常に実践的なスキルです。ぜひ、あなたの次のプロジェクトで活用してみてください！
