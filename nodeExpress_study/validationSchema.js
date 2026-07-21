export const createValidationSchema = {
  user_name: {
    notEmpty: {
      errorMessage: "user_name is required",
    },
    isString: {
      errorMessage: "user_name must be a string",
    },
    isLength: {
      options: { min: 3, max: 30 },
      errorMessage: "user_name must be between 3 and 30 characters",
    },
  },
};
