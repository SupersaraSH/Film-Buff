const {z} = require("zod");

const editUserSchema = z.object({
  user_name: z.string()
              .min(3, {message: "The name must be longer than 3 characters"})
              .max(40, {message: "The name must be less than 40 characters"}),
  
  last_name: z.string()
              .min(3, {message: "The last name must be longer than 3 characters"})
              .max(60, {message: "The last name must be less than 60 characters"}),


  description: z.string()
              .max(300, {message: "The name must be less than 300 characters"}),

  
  file: z.object({
            mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png'],
            {message: "File not allowed"}),
            size: z.number().max(1*1024*1024, 
            {message: "Image too large"})
            })
           .optional()

})

module.exports = editUserSchema;

//Tipos básicos
//z.string()
//z.number()
//z.boolean()
//z.bigint()
//z.date()
//z.undefined()
//z.null()
//z.void()
//z.any()
//z.unknown()
//z.never()

//Strings (los más usados)
//z.string()
//  .min(3)
//  .max(50)
//  .length(10)
//  .email()
//  .url()
//  .uuid()
//  .regex(/^[0-9]+$/)
//  .startsWith("A")
//  .endsWith(".com")
//  .trim()
//  .toLowerCase()
//  .toUpperCase()

//Números
//z.number()
//  .min(0)
//  .max(100)
//  .int()
//  .positive()
//  .negative()
//  .nonnegative()
//  .nonpositive()
//  .multipleOf(5)

//String → número
//z.coerce.number()