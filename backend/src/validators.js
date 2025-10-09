import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup.string().trim().min(2).max(100).required(),
  description: yup.string().trim().nullable()
});

export const companySchema = yup.object({
  name: yup.string().trim().min(2).max(150).required(),
  category_id: yup.number().integer().positive().required(),
  ticker_symbol: yup.string().trim().max(20).required(),
  description: yup.string().trim().nullable()
});
