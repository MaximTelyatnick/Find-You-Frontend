const validatePassword = (password: string): string => {
   if (password.length < 8) return "Пароль должен быть не менее 8 символов.";
   if (!/[A-Z]/.test(password)) return "Пароль должен содержать хотя бы одну заглавную букву.";
   if (!/[a-z]/.test(password)) return "Пароль должен содержать хотя бы одну строчную букву.";
   if (!/\d/.test(password)) return "Пароль должен содержать хотя бы одну цифру.";

   return "";
};

export default validatePassword