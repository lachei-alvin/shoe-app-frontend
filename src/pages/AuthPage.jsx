import React from "react";

const AuthPage = ({ handleRegister, handleLogin, loading }) => (
  <div className="max-w-md mx-auto space-y-8 p-8 bg-white rounded-xl shadow-2xl mt-10">
    <h2 className="text-3xl font-bold text-center text-indigo-700">
      Access Account
    </h2>

    <div className="border-b pb-4">
      <h3 className="text-xl font-semibold mb-3 text-green-600">Register</h3>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition duration-150"
          disabled={loading}
        >
          {loading ? "Processing..." : "Sign Up"}
        </button>
      </form>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Login</h3>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-150"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  </div>
);

export default AuthPage;
