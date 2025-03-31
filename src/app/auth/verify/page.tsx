"use client";

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Almost there!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Please check your inbox and confirm your email to complete your
          signup.
        </p>
        <p className="text-gray-500">Thank you for joining GoodAction.</p>
      </div>
    </div>
  );
}
