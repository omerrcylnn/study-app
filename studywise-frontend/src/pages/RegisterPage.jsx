import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-200 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Başlık */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">
            StudyWise
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kayıt ol ve planlamaya başla
          </p>
        </div>

        {/* Login Form */}
        <RegisterForm />
      </div>
    </div>
  );
}
